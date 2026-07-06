import React from 'react';

const STYLES = {
  1: { bg:'linear-gradient(180deg,#0d0d0d 0%,#1a0050 50%,#0d0d0d 100%)', confettiColors:['#ffd700','#ff6b6b','#4ecdc4','#fff','#a8edea'], fwHues:[50,200,320,0,120,280] },
  2: { bg:'linear-gradient(180deg,#0d0020 0%,#2d0060 50%,#0d0020 100%)', confettiColors:['#cc99ff','#aa66ff','#8833cc','#9900cc','#dd88ff'], fwHues:[270,280,290,260,300,310] },
  3: { bg:'linear-gradient(180deg,#000d1a 0%,#002d66 50%,#000d1a 100%)', confettiColors:['#66aaff','#4488ff','#2266dd','#aaccff','#88bbff'], fwHues:[200,210,220,190,230,240] },
  4: { bg:'linear-gradient(180deg,#0d0a00 0%,#4d3300 50%,#0d0a00 100%)', confettiColors:['#ffd700','#ffaa00','#ff8800','#ffcc33','#ffdd66'], fwHues:[45,50,55,40,60,48] },
  5: { bg:'linear-gradient(180deg,#1a1a1a 0%,#555555 50%,#222222 100%)', confettiColors:['#ffffff','#dddddd','#bbbbbb','#cccccc','#eeeeee'], fwHues:[0,60,120,180,240,300] },
} as const;

const conf = Array.from({length:32},(_,i)=>({left:`${(i*11+3)%97}%`,delay:`${(i*.2)%5}s`,dur:`${4+(i*.5)%4}s`,w:6+(i*3)%10,h:10+(i*5)%16}));
const fws = Array.from({length:8},(_,i)=>({left:`${10+i*10}%`,top:`${8+(i*9)%40}%`,delay:`${i*.7}s`}));

export const NewYearBackground: React.FC<{variant?:number}> = ({variant=1}) => {
  const s = STYLES[variant as keyof typeof STYLES] ?? STYLES[1];
  return (
    <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',overflow:'hidden',background:s.bg}}>
      <style>{`@keyframes nyfall{0%{transform:translateY(-5%) rotate(0);opacity:1}100%{transform:translateY(110%) rotate(720deg);opacity:.3}}@keyframes nysway{0%,100%{margin-left:0}50%{margin-left:28px}}@keyframes nypop{0%{transform:scale(0);opacity:1}100%{transform:scale(1.6);opacity:0}}@keyframes nyst{0%,100%{opacity:.2}50%{opacity:1}}`}</style>
      {Array.from({length:40},(_,i)=>(<div key={i} style={{position:'absolute',left:`${(i*13+2)%98}%`,top:`${(i*17+3)%80}%`,width:2,height:2,borderRadius:'50%',background:'#fff',animation:`nyst ${1+(i*.2)%2}s ease-in-out ${(i*.15)%3}s infinite`}} />))}
      {fws.map((fw,i)=>(<div key={i} style={{position:'absolute',left:fw.left,top:fw.top}}><div style={{width:80,height:80,borderRadius:'50%',border:`2px solid hsl(${s.fwHues[i%s.fwHues.length]},100%,62%)`,boxShadow:`0 0 10px hsl(${s.fwHues[i%s.fwHues.length]},100%,62%)`,animation:`nypop 2s ease-out ${fw.delay} infinite`}} /></div>))}
      {conf.map((c,i)=>(<div key={i} style={{position:'absolute',top:'-2%',left:c.left,width:c.w,height:c.h,background:s.confettiColors[i%s.confettiColors.length],borderRadius:2,animation:`nyfall ${c.dur} linear ${c.delay} infinite,nysway ${c.dur} ease-in-out ${c.delay} infinite`}} />))}
    </div>
  );
};
