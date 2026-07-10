import React from 'react';
const stars=Array.from({length:50},(_,i)=>({left:`${(i*11+3)%97}%`,top:`${(i*17+5)%93}%`,size:1+(i*2)%4,delay:`${(i*.2)%4}s`,dur:`${2+(i*.3)%3}s`}));
export const DefaultBackground: React.FC<{variant?:number}> = () => (
  <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',overflow:'hidden',background:'linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)'}}>
    <style>{`@keyframes dtwinkle{0%,100%{opacity:.2;transform:scale(.8)}50%{opacity:1;transform:scale(1.3)}}`}</style>
    {stars.map((s,i)=>(<div key={i} style={{position:'absolute',left:s.left,top:s.top,width:s.size,height:s.size,borderRadius:'50%',background:'#fff',animation:`dtwinkle ${s.dur} ease-in-out ${s.delay} infinite`}} />))}
  </div>
);
