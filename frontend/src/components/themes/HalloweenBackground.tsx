import React from 'react';

const BG = {
  1:'linear-gradient(180deg,#0a0300 0%,#3d1500 60%,#0a0300 100%)',
  2:'linear-gradient(180deg,#0d0020 0%,#330066 60%,#0d0020 100%)',
  3:'linear-gradient(180deg,#0d0000 0%,#4d0000 60%,#0d0000 100%)',
  4:'linear-gradient(180deg,#001a05 0%,#003311 60%,#001a05 100%)',
  5:'linear-gradient(180deg,#000000 0%,#0d0d0d 60%,#000000 100%)',
} as const;
const GHOSTS: string[] = ['👻','👹','💀','🕸️','🦇'];
const bats = Array.from({length:10},(_,i)=>({top:`${5+(i*13)%55}%`,delay:`${(i*.7)%5}s`,dur:`${7+(i*.9)%5}s`,size:18+(i*5)%16}));

export const HalloweenBackground: React.FC<{variant?:number}> = ({variant=1}) => {
  const bg = BG[variant as keyof typeof BG] ?? BG[1];
  const ghost = GHOSTS[Math.max(0, Math.min(4, variant - 1))] ?? '👻';
  return (
    <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',overflow:'hidden',background:bg}}>
      <style>{`@keyframes hbat{0%{transform:translateX(-10vw)}100%{transform:translateX(110vw)}}@keyframes hpump{0%,100%{filter:drop-shadow(0 0 8px #f60)}50%{filter:drop-shadow(0 0 22px #f90)}}@keyframes hghost{0%,100%{transform:translateY(0) rotate(-5deg);opacity:.6}50%{transform:translateY(-28px) rotate(5deg);opacity:.9}}`}</style>
      <div style={{position:'absolute',top:30,right:80,width:90,height:90,borderRadius:'50%',background:'radial-gradient(circle,#fff8e0 30%,#f0d080 100%)',boxShadow:'0 0 30px rgba(255,220,100,.5)'}} />
      {bats.map((b,i)=>(<div key={i} style={{position:'absolute',top:b.top,left:'-5%',fontSize:b.size,animation:`hbat ${b.dur} linear ${b.delay} infinite`}}>🦇</div>))}
      {[15,40,70].map((left,i)=>(<div key={i} style={{position:'absolute',top:`${18+i*22}%`,left:`${left}%`,fontSize:36,animation:`hghost ${3+i*.7}s ease-in-out ${i*1.2}s infinite`}}>{ghost}</div>))}
      <div style={{position:'absolute',bottom:10,left:0,right:0,display:'flex',justifyContent:'space-around'}}>
        {[1,2,3,4,5,6].map((_,i)=>(<span key={i} style={{fontSize:36,animation:`hpump 2s ease-in-out ${i*.4}s infinite`}}>🎃</span>))}
      </div>
    </div>
  );
};
