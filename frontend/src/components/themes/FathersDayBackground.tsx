import React from 'react';

const STYLES = {
  1:{bg:'linear-gradient(180deg,#d4e9f7 0%,#a8d4f0 50%,#7abfe8 100%)',items:['✈️','👔','⚽','❤️','🏏','✈️','👔','❤️','⚽','🏅']},
  2:{bg:'linear-gradient(180deg,#0d1a33 0%,#1a3366 50%,#0d1a33 100%)',items:['🏅','⭐','🏆','🎖️','🏅','⭐','🏆','🎖️','⭐','🏅']},
  3:{bg:'linear-gradient(180deg,#1a0a00 0%,#5c3300 50%,#1a0a00 100%)',items:['⚽','🏈','🎾','⚽','🏈','⚽','🎾','🏈','⚽','🏈']},
  4:{bg:'linear-gradient(180deg,#1a0500 0%,#cc4400 50%,#1a0500 100%)',items:['✈️','🚀','✈️','🌅','✈️','🚀','✈️','🌅','✈️','🚀']},
  5:{bg:'linear-gradient(180deg,#001a00 0%,#1a5c1a 50%,#001a00 100%)',items:['🎣','🌲','🎣','🌿','🎣','🌲','🎣','🌿','🌲','🎣']},
} as const;

export const FathersDayBackground: React.FC<{variant?:number}> = ({variant=1}) => {
  const s=STYLES[variant as keyof typeof STYLES]??STYLES[1];
  return (
    <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',overflow:'hidden',background:s.bg}}>
      <style>{`@keyframes ffloat{0%{transform:translateY(110vh) rotate(-10deg);opacity:0}10%{opacity:1}50%{transform:translateY(50vh) rotate(10deg)}90%{opacity:.8}100%{transform:translateY(-10vh) rotate(-5deg);opacity:0}}@keyframes fsway{0%,100%{margin-left:0}50%{margin-left:25px}}`}</style>
      {s.items.map((e,i)=>(<div key={i} style={{position:'absolute',left:`${i*10+3}%`,bottom:'-5%',fontSize:32,animation:`ffloat ${7+(i*.8)%5}s ease-in-out ${(i*.5)%6}s infinite,fsway ${7+(i*.8)%5}s ease-in-out ${(i*.5)%6}s infinite`}}>{e}</div>))}
    </div>
  );
};
