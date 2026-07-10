import React from 'react';

const STYLES = {
  1:{bg:'linear-gradient(180deg,#1a1400 0%,#7a6000 50%,#f5e6cc 100%)',petals:['🌹','🌸','🌺','💐','🌷'],base:'#f5e6cc'},
  2:{bg:'linear-gradient(180deg,#1a0a08 0%,#7a3322 50%,#e8a090 100%)',petals:['🌹','🌸','💕','🌺','💝'],base:'#e8a090'},
  3:{bg:'linear-gradient(180deg,#1a1408 0%,#5c4c22 50%,#d4bc88 100%)',petals:['💐','🌸','🌷','🌺','🌹'],base:'#d4bc88'},
  4:{bg:'linear-gradient(180deg,#1a000d 0%,#994466 50%,#ddaacc 100%)',petals:['🌸','💖','🌷','💕','💐'],base:'#ddaacc'},
  5:{bg:'linear-gradient(180deg,#e8e8e8 0%,#f5f0ff 50%,#ffffff 100%)',petals:['🕊️','💍','🌸','💒','🌷'],base:'#f5f5f5'},
} as const;

const petals=Array.from({length:20},(_,i)=>({left:`${(i*17+3)%93}%`,delay:`${(i*.4)%6}s`,dur:`${5+(i*.6)%4}s`,size:18+(i*4)%16}));

export const WeddingBackground: React.FC<{variant?:number}> = ({variant=1}) => {
  const s=STYLES[variant as keyof typeof STYLES]??STYLES[1];
  return (
    <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',overflow:'hidden',background:s.bg}}>
      <style>{`@keyframes wpfall{0%{transform:translateY(-5%) rotate(0);opacity:1}100%{transform:translateY(108%) rotate(360deg);opacity:.4}}@keyframes wpsway{0%,100%{margin-left:0}50%{margin-left:20px}}`}</style>
      {petals.map((p,i)=>(<div key={i} style={{position:'absolute',top:'-2%',left:p.left,fontSize:p.size,animation:`wpfall ${p.dur} linear ${p.delay} infinite,wpsway ${p.dur} ease-in-out ${p.delay} infinite`}}>{s.petals[i%s.petals.length]}</div>))}
      <div style={{position:'absolute',bottom:10,left:'50%',transform:'translateX(-50%)',display:'flex',gap:12,fontSize:36}}><span>💍</span><span>💒</span><span>💍</span></div>
    </div>
  );
};
