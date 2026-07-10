import React from 'react';

const STYLES = {
  1:{bg:'linear-gradient(180deg,#0a0020 0%,#2d0066 50%,#0a0020 100%)',cc:['#7c44f0','#ffd700','#fff','#a78bfa','#fbbf24']},
  2:{bg:'linear-gradient(180deg,#000d1a 0%,#001f4d 50%,#1a1000 100%)',cc:['#ffd700','#003399','#6699ff','#ffcc00','#002266']},
  3:{bg:'linear-gradient(180deg,#0d0000 0%,#4d0011 50%,#0d0000 100%)',cc:['#ff6666','#880000','#ffaaaa','#cc0033','#ff3333']},
  4:{bg:'linear-gradient(180deg,#0d0d0d 0%,#1a1a1a 50%,#0d0d0d 100%)',cc:['#ffd700','#dddd00','#ffaa00','#ffcc33','#ccaa00']},
  5:{bg:'linear-gradient(180deg,#000d1a 0%,#003366 50%,#000d1a 100%)',cc:['#4d96ff','#99ccff','#2266dd','#aaccff','#0055aa']},
} as const;

const caps=Array.from({length:10},(_,i)=>({left:`${(i*18+5)%92}%`,delay:`${(i*.6)%5}s`,dur:`${3+(i*.4)%3}s`,size:26+(i*4)%18}));
const conf=Array.from({length:24},(_,i)=>({left:`${(i*13+3)%95}%`,delay:`${(i*.3)%5}s`,dur:`${4+(i*.5)%3}s`}));

export const GraduationBackground: React.FC<{variant?:number}> = ({variant=1}) => {
  const s=STYLES[variant as keyof typeof STYLES]??STYLES[1];
  return (
    <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',overflow:'hidden',background:s.bg}}>
      <style>{`@keyframes gcap{0%{transform:translateY(0) rotate(0);opacity:1}50%{transform:translateY(-40vh) rotate(180deg);opacity:1}100%{transform:translateY(10vh) rotate(360deg);opacity:0}}@keyframes gfall{0%{transform:translateY(-5%) rotate(0);opacity:1}100%{transform:translateY(108%) rotate(540deg);opacity:.3}}`}</style>
      {conf.map((c,i)=>(<div key={`c${i}`} style={{position:'absolute',top:'-2%',left:c.left,width:7,height:11,borderRadius:2,background:s.cc[i%s.cc.length],animation:`gfall ${c.dur} linear ${c.delay} infinite`}} />))}
      {caps.map((cap,i)=>(<div key={`cap${i}`} style={{position:'absolute',bottom:'20%',left:cap.left,fontSize:cap.size,animation:`gcap ${cap.dur} ease-in-out ${cap.delay} infinite`}}>🎓</div>))}
    </div>
  );
};
