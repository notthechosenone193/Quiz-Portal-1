import React from 'react';

const STYLES = {
  1: { bg:'linear-gradient(180deg,#1a0005 0%,#660011 50%,#1a0005 100%)', emojis:['❤️','💕','💗'] },
  2: { bg:'linear-gradient(180deg,#1a000d 0%,#8b002d 50%,#1a000d 100%)', emojis:['💝','❤️','💓'] },
  3: { bg:'linear-gradient(180deg,#1a000a 0%,#cc3366 50%,#ff99bb 100%)', emojis:['💖','💗','🌸'] },
  4: { bg:'linear-gradient(180deg,#0d0005 0%,#33001a 50%,#660033 100%)', emojis:['💌','💘','❤️'] },
  5: { bg:'linear-gradient(180deg,#1a0500 0%,#993322 50%,#1a0500 100%)', emojis:['🌹','❤️','💕'] },
} as const;
const hearts = Array.from({length:20},(_,i)=>({left:`${(i*17+4)%93}%`,size:18+(i*7)%28,delay:`${(i*.4)%6}s`,dur:`${5+(i*.6)%4}s`}));

export const ValentineBackground: React.FC<{variant?:number}> = ({variant=1}) => {
  const s = STYLES[variant as keyof typeof STYLES] ?? STYLES[1];
  return (
    <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',overflow:'hidden',background:s.bg}}>
      <style>{`@keyframes vrise{0%{transform:translateY(110vh) scale(.5) rotate(-10deg);opacity:0}10%{opacity:1}85%{opacity:.7}100%{transform:translateY(-10vh) scale(1) rotate(10deg);opacity:0}}@keyframes vsway{0%,100%{margin-left:0}33%{margin-left:22px}66%{margin-left:-18px}}`}</style>
      {hearts.map((h,i)=>(<div key={i} style={{position:'absolute',bottom:'-5%',left:h.left,fontSize:h.size,animation:`vrise ${h.dur} ease-in-out ${h.delay} infinite,vsway ${h.dur} ease-in-out ${h.delay} infinite`}}>{s.emojis[i%s.emojis.length]}</div>))}
    </div>
  );
};
