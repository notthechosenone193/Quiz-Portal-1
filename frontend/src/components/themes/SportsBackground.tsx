import React from 'react';

const STYLES = {
  1:{bg:'linear-gradient(180deg,#0a1a00 0%,#1f5c00 50%,#0a1a00 100%)',items:['🏆','⭐','🎉','🎊','🥇'],accent:'#ffd700'},
  2:{bg:'linear-gradient(180deg,#00001a 0%,#00004d 50%,#00001a 100%)',items:['⚽','🏅','⭐','🎯','⚽'],accent:'#cc0000'},
  3:{bg:'linear-gradient(180deg,#000d1a 0%,#001f4d 50%,#000d1a 100%)',items:['🏅','🎖️','⭐','🏆','🎗️'],accent:'#4d96ff'},
  4:{bg:'linear-gradient(180deg,#0d0d0d 0%,#1a1a00 50%,#0d0d0d 100%)',items:['⭐','🥇','🏆','⭐','🎖️'],accent:'#ffd700'},
  5:{bg:'linear-gradient(180deg,#1a0a00 0%,#7a4400 50%,#1a0a00 100%)',items:['🥇','🏆','🎊','⭐','🎉'],accent:'#ff9900'},
} as const;

const items=Array.from({length:15},(_,i)=>({left:`${(i*19+4)%92}%`,delay:`${(i*.4)%5}s`,dur:`${4+(i*.6)%4}s`,size:20+(i*5)%20}));

export const SportsBackground: React.FC<{variant?:number}> = ({variant=1}) => {
  const s=STYLES[variant as keyof typeof STYLES]??STYLES[1];
  return (
    <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',overflow:'hidden',background:s.bg}}>
      <style>{`@keyframes sticker{0%{transform:translateY(110vh);opacity:0}10%{opacity:1}90%{opacity:.8}100%{transform:translateY(-10vh);opacity:0}}@keyframes sbounce{0%,100%{transform:scale(1) rotate(-5deg)}50%{transform:scale(1.2) rotate(5deg)}}`}</style>
      {items.map((item,i)=>(<div key={i} style={{position:'absolute',bottom:'-5%',left:item.left,fontSize:item.size,animation:`sticker ${item.dur} ease-in-out ${item.delay} infinite`}}>{s.items[i%s.items.length]}</div>))}
      <div style={{position:'absolute',top:'30%',left:'50%',transform:'translate(-50%,-50%)',fontSize:80,opacity:.12,color:s.accent,animation:'sbounce 2s ease-in-out infinite'}}>🏆</div>
    </div>
  );
};
