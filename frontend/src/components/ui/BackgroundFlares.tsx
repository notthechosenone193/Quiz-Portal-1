import React, { useMemo } from 'react';

export const BackgroundFlares: React.FC = () => {
  // Generate flares with strategic positions for continuous loop effect
  const flares = useMemo(() => {
    return [
      { id: 1, left: '12%', top: '15%', size: 450, color: 'flare-green', class: 'flare-1' },
      { id: 2, left: '78%', top: '65%', size: 400, color: 'flare-purple', class: 'flare-2' },
      { id: 3, left: '88%', top: '20%', size: 380, color: 'flare-cyan', class: 'flare-3' },
      { id: 4, left: '8%', top: '80%', size: 420, color: 'flare-blue', class: 'flare-4' },
      { id: 5, left: '55%', top: '45%', size: 390, color: 'flare-green', class: 'flare-5' },
    ];
  }, []);

  return (
    <div className="flare-background">
      {flares.map((flare) => (
        <div
          key={flare.id}
          className={`flare ${flare.color} ${flare.class}`}
          style={{
            width: `${flare.size}px`,
            height: `${flare.size}px`,
            left: flare.left,
            top: flare.top,
          }}
        />
      ))}
    </div>
  );
};
