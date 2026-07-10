import { Router } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import {
  createTambolaGame,
  getTambolaGame,
  createTambolaSession,
  getTambolaSessionByCode,
  getTambolaSessionById,
  getLatestTambolaSession,
  getTambolaSessionState,
  endTambolaGame,
  createTambolaTicket,
  getTicketsBySession,
  getTicketById,
  drawNumber,
  getDrawnNumbers,
  saveClaim,
  verifyClaim,
  getClaim,
} from '../db.js';
import { generateTicket, validateClaim, ClaimType } from '../services/tambolaService.js';

function parseId(s: string): number | null {
  const n = parseInt(s, 10);
  return isNaN(n) || n <= 0 ? null : n;
}

export function createTambolaRouter(io: SocketIOServer) {
  const router = Router();

  // POST /api/tambola/create
  router.post('/create', async (req, res) => {
    try {
      const {
        title,
        host_name = '',
        win_conditions = ['early_five', 'top_line', 'middle_line', 'bottom_line', 'full_house'],
      } = req.body;
      if (!title) {
        res.status(400).json({ error: 'title is required' });
        return;
      }
      const gameId = await createTambolaGame(title, host_name, win_conditions);
      res.json({ gameId });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // GET /api/tambola/:gameId
  router.get('/:gameId', async (req, res) => {
    try {
      const gid = parseId(req.params.gameId);
      if (!gid) { res.status(400).json({ error: 'Invalid game ID' }); return; }
      const game = await getTambolaGame(gid);
      if (!game) {
        res.status(404).json({ error: 'Game not found' });
        return;
      }
      res.json(game);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // GET /api/tambola/:gameId/session — resume the current session for a game, if any
  router.get('/:gameId/session', async (req, res) => {
    try {
      const gameId = parseId(req.params.gameId);
      if (!gameId) { res.status(400).json({ error: 'Invalid game ID' }); return; }
      const game = await getTambolaGame(gameId);
      if (!game) {
        res.status(404).json({ error: 'Game not found' });
        return;
      }
      const session = await getLatestTambolaSession(gameId);
      if (!session) {
        res.json({ session: null });
        return;
      }
      const shareUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/tambola/${gameId}/${session.session_code}`;
      const state = await getTambolaSessionState(session.id);
      res.json({
        session: {
          sessionCode: session.session_code,
          shareUrl,
          isActive: game.is_active === 1,
          ...state,
        },
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // POST /api/tambola/:gameId/end — permanently end a game's session
  router.post('/:gameId/end', async (req, res) => {
    try {
      const gameId = parseId(req.params.gameId);
      if (!gameId) { res.status(400).json({ error: 'Invalid game ID' }); return; }
      const game = await getTambolaGame(gameId);
      if (!game) {
        res.status(404).json({ error: 'Game not found' });
        return;
      }
      if (game.is_active === 0) {
        res.status(400).json({ error: 'Game has already ended' });
        return;
      }
      await endTambolaGame(gameId);
      const session = await getLatestTambolaSession(gameId);
      if (session) {
        io.to('TAMBOLA_' + session.session_code).emit('tambola-session-ended', { gameId });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // GET /api/tambola/session/:code/resolve — side-effect-free code lookup for the join gate
  router.get('/session/:code/resolve', async (req, res) => {
    try {
      const sessionCode = req.params.code.toUpperCase();
      const session = await getTambolaSessionByCode(sessionCode);
      if (!session) {
        res.status(404).json({ error: 'Game not found' });
        return;
      }
      const game = await getTambolaGame(session.game_id);
      if (!game) {
        res.status(404).json({ error: 'Game not found' });
        return;
      }
      res.json({ gameId: game.id, title: game.title, isActive: game.is_active === 1 });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // POST /api/tambola/:gameId/session
  router.post('/:gameId/session', async (req, res) => {
    try {
      const gameId = parseId(req.params.gameId);
      if (!gameId) { res.status(400).json({ error: 'Invalid game ID' }); return; }
      const game = await getTambolaGame(gameId);
      if (!game) {
        res.status(404).json({ error: 'Game not found' });
        return;
      }
      const sessionCode = uuidv4().slice(0, 6).toUpperCase();
      await createTambolaSession(gameId, sessionCode);
      const shareUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/tambola/${gameId}/${sessionCode}`;
      res.json({ sessionCode, shareUrl });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // POST /api/tambola/session/:code/join
  router.post('/session/:code/join', async (req, res) => {
    try {
      const { name } = req.body;
      const sessionCode = req.params.code.toUpperCase();
      if (!name) {
        res.status(400).json({ error: 'name is required' });
        return;
      }
      const session = await getTambolaSessionByCode(sessionCode);
      if (!session) {
        res.status(404).json({ error: 'Session not found' });
        return;
      }
      const game = await getTambolaGame(session.game_id);
      if (!game || game.is_active === 0) {
        res.status(403).json({ error: 'This game has ended' });
        return;
      }
      const grid = generateTicket();
      const ticket = await createTambolaTicket(session.id, name, grid);
      const drawnNumbers = await getDrawnNumbers(session.id);
      const allTickets = await getTicketsBySession(session.id);
      io.to('TAMBOLA_' + sessionCode).emit('tambola-participant-joined', {
        participantName: name,
        ticketCount: allTickets.length,
      });
      res.json({ ticketId: ticket.id, ticket: ticket.grid, drawnNumbers });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // POST /api/tambola/session/:code/draw
  router.post('/session/:code/draw', async (req, res) => {
    try {
      const sessionCode = req.params.code.toUpperCase();
      const session = await getTambolaSessionByCode(sessionCode);
      if (!session) {
        res.status(404).json({ error: 'Session not found' });
        return;
      }
      const game = await getTambolaGame(session.game_id);
      if (!game || game.is_active === 0) {
        res.status(403).json({ error: 'This game has ended' });
        return;
      }
      const drawn = await getDrawnNumbers(session.id);
      const remaining = Array.from({ length: 99 }, (_, i) => i + 1).filter((n) => !drawn.includes(n));
      if (remaining.length === 0) {
        res.status(400).json({ error: 'All numbers drawn' });
        return;
      }
      const number = remaining[Math.floor(Math.random() * remaining.length)];
      await drawNumber(session.id, number);
      const updatedDrawn = [...drawn, number];
      const updatedRemaining = remaining.filter((n) => n !== number);
      io.to('TAMBOLA_' + sessionCode).emit('tambola-number-drawn', {
        number,
        remaining: updatedRemaining.length,
        drawnNumbers: updatedDrawn,
      });
      res.json({ number, remaining: updatedRemaining.length });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // POST /api/tambola/session/:code/claim
  router.post('/session/:code/claim', async (req, res) => {
    try {
      const { ticketId, claimType } = req.body;
      const sessionCode = req.params.code.toUpperCase();
      if (!ticketId || !claimType) {
        res.status(400).json({ error: 'ticketId and claimType required' });
        return;
      }
      const session = await getTambolaSessionByCode(sessionCode);
      if (!session) {
        res.status(404).json({ error: 'Session not found' });
        return;
      }
      const game = await getTambolaGame(session.game_id);
      if (!game || game.is_active === 0) {
        res.status(403).json({ error: 'This game has ended' });
        return;
      }
      const ticket = await getTicketById(ticketId);
      if (!ticket || ticket.session_id !== session.id) {
        res.status(403).json({ error: 'Invalid ticket' });
        return;
      }
      const drawnNumbers = await getDrawnNumbers(session.id);
      const valid = validateClaim(ticket.grid, drawnNumbers, claimType as ClaimType);
      const claimId = await saveClaim(ticketId, claimType);
      if (!claimId) {
        res.status(409).json({ error: 'Claim already submitted' });
        return;
      }
      if (valid) {
        await verifyClaim(claimId, 1);
      }
      io.to('TAMBOLA_' + sessionCode).emit('tambola-claim-submitted', {
        claimId,
        participantName: ticket.participant_name,
        claimType,
        valid,
      });
      res.json({ claimId, valid });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // PUT /api/tambola/claim/:claimId/verify
  router.put('/claim/:claimId/verify', async (req, res) => {
    try {
      const { verified } = req.body;
      const claimId = parseInt(req.params.claimId);
      if (verified === undefined) {
        res.status(400).json({ error: 'verified is required' });
        return;
      }
      const claim = await getClaim(claimId);
      if (!claim) {
        res.status(404).json({ error: 'Claim not found' });
        return;
      }
      const verifiedInt = verified ? 1 : 0;
      await verifyClaim(claimId, verifiedInt);
      const ticket = await getTicketById(claim.ticket_id);
      if (ticket) {
        const session = await getTambolaSessionById(ticket.session_id);
        if (session) {
          io.to('TAMBOLA_' + session.session_code).emit('tambola-claim-result', {
            claimId,
            claimType: claim.claim_type,
            participantName: ticket.participant_name,
            verified: verifiedInt,
          });
        }
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // GET /api/tambola/session/:code/state
  router.get('/session/:code/state', async (req, res) => {
    try {
      const sessionCode = req.params.code.toUpperCase();
      const session = await getTambolaSessionByCode(sessionCode);
      if (!session) {
        res.status(404).json({ error: 'Session not found' });
        return;
      }
      const state = await getTambolaSessionState(session.id);
      res.json(state);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  return router;
}
