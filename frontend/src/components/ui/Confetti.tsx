import React, { useEffect, useState } from 'react';

export const Confetti: React.FC = () => {
  const [confettiPieces, setConfettiPieces] = useState<Array<{ id: number; left: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    // Create confetti pieces
    const pieces = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.3,
      duration: 0.8 + Math.random() * 0.4,
    }));
    setConfettiPieces(pieces);

    // Cleanup after animation completes
    const timeout = setTimeout(() => {
      setConfettiPieces([]);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className="animate-confetti"
          style={{
            left: `${piece.left}%`,
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: [
              '#2B8000', // Green
              '#4B286D', // Purple
              '#EF4444', // Red
              '#FFA500', // Yellow
            ][Math.floor(Math.random() * 4)],
            '--confetti-x': `${(Math.random() - 0.5) * 100}px`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
          } as React.CSSProperties}
        />
      ))}
    </>
  );
};
