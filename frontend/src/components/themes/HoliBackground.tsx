import React from 'react';

const PALETTE = {
  1: ['#ff6b35','#f7c59f','#5bc0eb','#a23b72','#06d6a0','#ffd166','#ef476f','#118ab2'],
  2: ['#ff0066','#ff33aa','#cc0099','#ff66cc','#dd00bb','#aa0077','#ff99dd','#cc33aa'],
  3: ['#ff6600','#ff9900','#ffcc00','#ff8800','#ff5500','#ffaa33','#ffdd66','#ff7722'],
  4: ['#0033aa','#0055cc','#0077ff','#00aacc','#00ccdd','#0099bb','#33ccff','#0088ee'],
  5: ['#ffffff','#f0f0f0','#e8e8e8','#eeeeee','#fafafa','#dddddd','#f5f5f5','#cccccc'],
} as const;
const BG = {1:'#fff8f0',2:'#fff0f8',3:'#fff8e8',4:'#f0f8ff',5:'#f5f5f5'} as const;

const powders = Array.from({length:22},(_,i)=>({left:`${(i*22+5)%95}%`,size:35+(i*19)%85,delay:`${(i*.4)%5}s`,dur:`${4+(i*.7)%4}s`}));

export const HoliBackground: React.FC<{variant?:number}> = ({variant=1}) => {
  const pal = PALETTE[variant as keyof typeof PALETTE] ?? PALETTE[1];
  return (
    <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',overflow:'hidden',background:BG[variant as keyof typeof BG]??'#fff8f0'}}>
      <style>{`@keyframes hrise{0%{transform:translateY(110vh) scale(.3);opacity:0}15%{opacity:.8}85%{opacity:.6}100%{transform:translateY(-20vh) scale(1.2);opacity:0}}@keyframes hsway{0%,100%{margin-left:0}33%{margin-left:30px}66%{margin-left:-22px}}`}</style>
      {powders.map((p,i)=>(<div key={i} style={{position:'absolute',bottom:'-10%',left:p.left,width:p.size,height:p.size,borderRadius:'50% 60% 40% 55%',background:pal[i%pal.length],opacity:.78,filter:'blur(6px)',animation:`hrise ${p.dur} ease-in-out ${p.delay} infinite,hsway ${p.dur} ease-in-out ${p.delay} infinite`}} />))}
    </div>
  );
};
