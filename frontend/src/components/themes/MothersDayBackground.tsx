import React from 'react';

const STYLES = {
  1:{bg:'linear-gradient(180deg,#3d0020 0%,#cc3366 50%,#3d0020 100%)',flowers:['🌷','🌸','🌺','💐','🌹']},
  2:{bg:'linear-gradient(180deg,#1a0033 0%,#6633cc 50%,#1a0033 100%)',flowers:['🌸','💜','🌷','🦋','💐']},
  3:{bg:'linear-gradient(180deg,#3d1500 0%,#cc6633 50%,#3d1500 100%)',flowers:['💐','🌻','🌼','🌷','🌹']},
  4:{bg:'linear-gradient(180deg,#330022 0%,#990066 50%,#330022 100%)',flowers:['🌺','❤️','🌷','💖','🌸']},
  5:{bg:'linear-gradient(180deg,#001a10 0%,#336644 50%,#001a10 100%)',flowers:['🌿','🦋','🌸','🍃','🌷']},
} as const;

const flowers=Array.from({length:16},(_,i)=>({left:`${(i*17+3)%95}%`,delay:`${(i*.5)%6}s`,dur:`${5+(i*.6)%4}s`,size:22+(i*5)%22}));

export const MothersDayBackground: React.FC<{variant?:number}> = ({variant=1}) => {
  const s=STYLES[variant as keyof typeof STYLES]??STYLES[1];
  return (
    <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',overflow:'hidden',background:s.bg}}>
      <style>{`@keyframes mrise{0%{transform:translateY(110vh) scale(.5) rotate(-15deg);opacity:0}15%{opacity:1}85%{opacity:.7}100%{transform:translateY(-15vh) scale(1) rotate(15deg);opacity:0}}@keyframes msway{0%,100%{margin-left:0}50%{margin-left:24px}}`}</style>
      {flowers.map((f,i)=>(<div key={i} style={{position:'absolute',bottom:'-5%',left:f.left,fontSize:f.size,animation:`mrise ${f.dur} ease-in-out ${f.delay} infinite,msway ${f.dur} ease-in-out ${f.delay} infinite`}}>{s.flowers[i%s.flowers.length]}</div>))}
    </div>
  );
};
