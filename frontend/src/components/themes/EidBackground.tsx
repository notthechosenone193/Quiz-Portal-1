import React from 'react';

const BG={1:'linear-gradient(180deg,#030d1a 0%,#0a2137 40%,#0d3d2a 100%)',2:'linear-gradient(180deg,#000d1a 0%,#00264d 50%,#000d1a 100%)',3:'linear-gradient(180deg,#001a0d 0%,#004d26 50%,#001a0d 100%)',4:'linear-gradient(180deg,#0d0020 0%,#330066 50%,#4d4400 100%)',5:'linear-gradient(180deg,#000005 0%,#001133 50%,#000005 100%)'} as const;
const STAR_COLOR={1:'#ffd700',2:'#6699ff',3:'#66ff99',4:'#ffcc00',5:'#aaaaff'} as const;
const stars=Array.from({length:38},(_,i)=>({left:`${(i*11+3)%96}%`,top:`${(i*17+5)%75}%`,size:3+(i*2)%6,delay:`${(i*.3)%4}s`,dur:`${2+(i*.4)%3}s`}));
const lanterns=Array.from({length:8},(_,i)=>({delay:`${i*.4}s`,dur:`${4+(i*.5)%3}s`}));

export const EidBackground: React.FC<{variant?:number}> = ({variant=1}) => {
  const bg=BG[variant as keyof typeof BG]??BG[1];
  const sc=STAR_COLOR[variant as keyof typeof STAR_COLOR]??'#ffd700';
  return (
    <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',overflow:'hidden',background:bg}}>
      <style>{`@keyframes epulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1.3)}}@keyframes esway{0%,100%{transform:translateY(0) rotate(-5deg)}50%{transform:translateY(-10px) rotate(5deg)}}@keyframes emglow{0%,100%{filter:drop-shadow(0 0 10px rgba(255,220,100,.6))}50%{filter:drop-shadow(0 0 25px rgba(255,220,100,.9))}}`}</style>
      {stars.map((s,i)=>(<div key={i} style={{position:'absolute',left:s.left,top:s.top,width:s.size,height:s.size,borderRadius:'50%',background:sc,animation:`epulse ${s.dur} ease-in-out ${s.delay} infinite`}} />))}
      <div style={{position:'absolute',top:20,right:40,fontSize:70,animation:'emglow 3s ease-in-out infinite'}}>🌙</div>
      <div style={{position:'absolute',top:28,right:120,fontSize:28,animation:'epulse 2s ease-in-out .5s infinite'}}>⭐</div>
      <div style={{position:'absolute',top:0,left:0,right:0,display:'flex',justifyContent:'space-around'}}>
        {lanterns.map((l,i)=>(<div key={i} style={{fontSize:28,animation:`esway ${l.dur} ease-in-out ${l.delay} infinite`,filter:'drop-shadow(0 0 8px rgba(255,200,50,.8))'}}>🏮</div>))}
      </div>
    </div>
  );
};
