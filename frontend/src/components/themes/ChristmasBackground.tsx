import React from 'react';

const STYLES = {
  1: { bg:'linear-gradient(180deg,#0a1628 0%,#0d2137 40%,#0d5c1a 100%)', flakeColor:'rgba(255,255,255,.9)', treeOpacity:.65 },
  2: { bg:'linear-gradient(180deg,#020b14 0%,#04192d 50%,#061e3b 100%)', flakeColor:'rgba(200,230,255,.95)', treeOpacity:.3 },
  3: { bg:'linear-gradient(180deg,#4d0000 0%,#8b0000 50%,#2d0000 100%)', flakeColor:'rgba(255,220,150,.8)', treeOpacity:.2 },
  4: { bg:'linear-gradient(180deg,#1a0500 0%,#5c1a00 50%,#0d0200 100%)', flakeColor:'rgba(255,180,80,.7)', treeOpacity:.2 },
  5: { bg:'linear-gradient(180deg,#c8e6f5 0%,#e0f4ff 50%,#ffffff 100%)', flakeColor:'rgba(150,210,255,.9)', treeOpacity:.4 },
} as const;

const sf = Array.from({length:28},(_,i)=>({left:`${(i*13+2)%98}%`,size:6+(i*7)%16,delay:`${(i*.4)%6}s`,dur:`${6+(i*.8)%6}s`}));
const stars = Array.from({length:35},(_,i)=>({left:`${(i*11+5)%95}%`,top:`${(i*17+3)%70}%`,delay:`${(i*.3)%4}s`,dur:`${1.5+(i*.3)%2}s`}));

export const ChristmasBackground: React.FC<{variant?:number}> = ({variant=1}) => {
  const s = STYLES[variant as keyof typeof STYLES] ?? STYLES[1];
  const light = variant === 5;
  return (
    <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',overflow:'hidden',background:s.bg}}>
      <style>{`
        @keyframes csnow{0%{transform:translateY(-5vh) rotate(0);opacity:0}5%{opacity:.7}95%{opacity:.7}100%{transform:translateY(105vh) rotate(360deg);opacity:0}}
        @keyframes csway{0%,100%{margin-left:0}33%{margin-left:22px}66%{margin-left:-18px}}
        @keyframes ctwinkle{0%,100%{opacity:.2;transform:scale(.8)}50%{opacity:1;transform:scale(1.3)}}
      `}</style>
      {!light && stars.map((st,i)=>(<div key={i} style={{position:'absolute',left:st.left,top:st.top,width:2,height:2,borderRadius:'50%',background:'#fff',animation:`ctwinkle ${st.dur} ease-in-out ${st.delay} infinite`}} />))}
      {sf.map((f,i)=>(<div key={i} style={{position:'absolute',top:'-2%',left:f.left,width:f.size,height:f.size,borderRadius:'50%',background:s.flakeColor,animation:`csnow ${f.dur} linear ${f.delay} infinite,csway ${f.dur} ease-in-out ${f.delay} infinite`}} />))}
      <div style={{position:'absolute',bottom:0,left:0,right:0,display:'flex',justifyContent:'space-around',padding:'0 6px'}}>
        {['🎄','🎄','🎄','🎄','🎄'].map((t,i)=>(<span key={i} style={{fontSize:38,display:'block',opacity:s.treeOpacity}}>{t}</span>))}
      </div>
    </div>
  );
};
