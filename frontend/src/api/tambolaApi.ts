const API_BASE = import.meta.env.VITE_API_BASE_URL || window.location.origin;

export async function createTambolaGame(title: string, hostName: string, winConditions: string[]) {
  const res = await fetch(`${API_BASE}/api/tambola/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, host_name: hostName, win_conditions: winConditions }),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to create game');
  return res.json();
}

export async function getTambolaGame(gameId: number) {
  const res = await fetch(`${API_BASE}/api/tambola/${gameId}`);
  if (!res.ok) throw new Error('Failed to fetch game');
  return res.json();
}

export async function createTambolaSession(gameId: number) {
  const res = await fetch(`${API_BASE}/api/tambola/${gameId}/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to create session');
  return res.json();
}

export async function joinTambolaSession(sessionCode: string, name: string) {
  const res = await fetch(`${API_BASE}/api/tambola/session/${sessionCode}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to join session');
  return res.json();
}

export async function drawTambolaNumber(sessionCode: string) {
  const res = await fetch(`${API_BASE}/api/tambola/session/${sessionCode}/draw`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to draw number');
  return res.json();
}

export async function submitTambolaClaim(sessionCode: string, ticketId: number, claimType: string) {
  const res = await fetch(`${API_BASE}/api/tambola/session/${sessionCode}/claim`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ticketId, claimType }),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to submit claim');
  return res.json();
}

export async function verifyTambolaClaim(claimId: number, verified: boolean) {
  const res = await fetch(`${API_BASE}/api/tambola/claim/${claimId}/verify`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ verified }),
  });
  if (!res.ok) throw new Error('Failed to verify claim');
  return res.json();
}

export async function getTambolaState(sessionCode: string) {
  const res = await fetch(`${API_BASE}/api/tambola/session/${sessionCode}/state`);
  if (!res.ok) throw new Error('Failed to fetch game state');
  return res.json();
}

export async function getTambolaSessionForGame(gameId: number) {
  const res = await fetch(`${API_BASE}/api/tambola/${gameId}/session`);
  if (!res.ok) throw new Error('Failed to fetch session');
  return res.json();
}

export async function endTambolaGame(gameId: number) {
  const res = await fetch(`${API_BASE}/api/tambola/${gameId}/end`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to end session');
  return res.json();
}

export async function resolveTambolaCode(code: string) {
  const res = await fetch(`${API_BASE}/api/tambola/session/${code}/resolve`);
  if (!res.ok) throw new Error((await res.json()).error || 'Game not found');
  return res.json();
}
