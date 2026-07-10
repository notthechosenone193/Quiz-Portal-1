import React from 'react';

const STYLES = {
  1: { bg:'linear-gradient(180deg,#1a0030 0%,#3d006a 50%,#1a0030 100%)', confettiColors:['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#f72585'], balloons:['🎈','🎉','🎊','🎈','🎉'] },
  2: { bg:'linear-gradient(180deg,#330011 0%,#cc0066 50%,#1a0008 100%)', confettiColors:['#ff99cc','#ff66aa','#ff3388','#cc0066','#ff0055'], balloons:['🎈','🎈','🎉','🎈','🎊'] },
  3: { bg:'linear-gradient(180deg,#0d001a 0%,#440066 50%,#0d001a 100%)', confettiColors:['#cc66ff','#aa33ff','#8800cc','#dd99ff','#9933ff'], balloons:['🎉','🎊','🎈','🎉','🎊'] },
  4: { bg:'linear-gradient(180deg,#000d1a 0%,#003366 50%,#1a1000 100%)', confettiColors:['#ffd700','#ffaa00','#4d96ff','#003399','#cc9900'], balloons:['🎁','🎊','🎉','🎁','🎈'] },
  5: { bg:'linear-gradient(180deg,#1a0000 0%,#660033 50%,#1a0000 100%)', confettiColors:['#ff99cc','#ff66bb','#ffccee','#ff33aa','#cc0077'], balloons:['🎊','🎉','🎈','🎊','🎉'] },
} as const;

const balloons = Array.from({length:12},(_,i)=>({left:`${(i*15+4)%92}%`,delay:`${(i*.5)%6}s`,dur:`${7+(i*.8)%5}s`,size:26+(i*5)%20}));
const conf = Array.from({length:28},(_,i)=>({left:`${(i*13+2)%96}%`,delay:`${(i*.3)%5}s`,dur:`${4+(i*.4)%3}s`}));

export const BirthdayBackground: React.FC<{variant?:number}> = ({variant=1}) => {
  const s = STYLES[variant as keyof typeof STYLES] ?? STYLES[1];
  return (
    <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',overflow:'hidden',background:s.bg}}>
      <style>{`@keyframes brise{0%{transform:translateY(110vh);opacity:0}10%{opacity:1}90%{opacity:.8}100%{transform:translateY(-15vh);opacity:0}}@keyframes bsway{0%,100%{margin-left:0}33%{margin-left:22px}66%{margin-left:-18px}}@keyframes bdrop{0%{transform:translateY(-3%) rotate(0);opacity:1}100%{transform:translateY(106%) rotate(540deg);opacity:.3}}`}</style>
      {conf.map((c,i)=>(<div key={`c${i}`} style={{position:'absolute',top:'-1%',left:c.left,width:8,height:8,borderRadius:'50%',background:s.confettiColors[i%s.confettiColors.length],animation:`bdrop ${c.dur} linear ${c.delay} infinite`}} />))}
      {balloons.map((b,i)=>(<div key={`b${i}`} style={{position:'absolute',bottom:'-5%',left:b.left,fontSize:b.size,animation:`brise ${b.dur} ease-in-out ${b.delay} infinite,bsway ${b.dur} ease-in-out ${b.delay} infinite`}}>{s.balloons[i%s.balloons.length]}</div>))}
    </div>
  );
};
