import { Server as SocketIOServer } from 'socket.io';

export function initSocket(io: SocketIOServer) {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join-session', (sessionCode: string) => {
      const room = sessionCode.toUpperCase();
      socket.join(room);
      console.log(`Socket ${socket.id} joined session ${room}`);
    });

    socket.on('start-quiz', (sessionCode: string) => {
      const room = sessionCode.toUpperCase();
      io.to(room).emit('quiz-started', { timestamp: Date.now() });
      console.log(`Quiz started in session ${room}`);
    });

    socket.on('join-tambola-session', (sessionCode: string) => {
      const room = 'TAMBOLA_' + sessionCode.toUpperCase();
      socket.join(room);
      console.log(`Socket ${socket.id} joined Tambola session ${room}`);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
}
