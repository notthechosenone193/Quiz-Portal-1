import React from 'react';

const STYLES = {
  1: { bg:'linear-gradient(180deg,#0a0400 0%,#2d1200 60%,#6b2d00 100%)', accent:'#ff9900', accent2:'#ff4400', glow:'rgba(255,150,0,0.15)' },
  2: { bg:'linear-gradient(180deg,#0d0020 0%,#2d0060 60%,#6a00cc 100%)', accent:'#cc88ff', accent2:'#aa00ff', glow:'rgba(150,0,255,0.15)' },
  3: { bg:'linear-gradient(180deg,#200000 0%,#6b0000 60%,#cc2200 100%)', accent:'#ff4400', accent2:'#ff0000', glow:'rgba(200,0,0,0.15)' },
  4: { bg:'linear-gradient(180deg,#000a1a 0%,#002244 60%,#003d80 100%)', accent:'#ffdd00', accent2:'#ffaa00', glow:'rgba(255,200,0,0.12)' },
  5: { bg:'linear-gradient(180deg,#1a0a00 0%,#7a4500 60%,#cc8800 100%)', accent:'#ffd700', accent2:'#ffaa00', glow:'rgba(255,200,0,0.2)' },
} as const;

const fw = Array.from({length:18},(_,i)=>({
  left:`${5+(i*9.7)%90}%`, top:`${5+(i*11.3)%58}%`,
  delay:`${(i*.35)%5}s`, dur:`${1.8+(i*.25)%2}s`,
  size:45+(i*21)%90, hue:(i*47)%360,
}));
const diyas = Array.from({length:11},(_,i)=>({delay:`${i*.28}s`}));

export const DiwaliBackground: React.FC<{variant?:number}> = ({variant=1}) => {
  const s = STYLES[variant as keyof typeof STYLES] ?? STYLES[1];
  return (
    <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',overflow:'hidden',background:s.bg}}>
      <style>{`
        @keyframes dfw-ring{0%{transform:scale(0);opacity:1}50%{opacity:.85}100%{transform:scale(1);opacity:0}}
        @keyframes dfw-spark{0%{transform:translate(0,0);opacity:1}100%{transform:translate(var(--tx),var(--ty));opacity:0}}
        @keyframes dglow{0%,100%{filter:drop-shadow(0 0 5px ${s.accent}) drop-shadow(0 0 15px ${s.accent2})}50%{filter:drop-shadow(0 0 12px ${s.accent}) drop-shadow(0 0 30px ${s.accent2})}}
        @keyframes dflame{0%,100%{transform:scaleY(1) rotate(-3deg)}25%{transform:scaleY(.8) rotate(2deg)}75%{transform:scaleY(1.1) rotate(-2deg)}}
        @keyframes dsky{0%,100%{opacity:.25}50%{opacity:.55}}
      `}</style>
      <div style={{position:'absolute',top:'-20%',left:'50%',transform:'translateX(-50%)',width:'70%',height:'55%',background:`radial-gradient(ellipse,${s.glow} 0%,transparent 70%)`,animation:'dsky 4s ease-in-out infinite'}} />
      {fw.map((f,i)=>(
        <div key={i} style={{position:'absolute',left:f.left,top:f.top}}>
          <div style={{width:f.size,height:f.size,borderRadius:'50%',border:`2px solid hsl(${f.hue},100%,65%)`,animation:`dfw-ring ${f.dur} ease-out ${f.delay} infinite`,boxShadow:`0 0 8px hsl(${f.hue},100%,60%)`}} />
          {Array.from({length:10},(_,j)=>{const a=(j/10)*360,d=f.size*.8,tx=Math.cos(a*Math.PI/180)*d,ty=Math.sin(a*Math.PI/180)*d;return(
            <div key={j} style={{position:'absolute',top:'50%',left:'50%',width:4,height:4,borderRadius:'50%',background:`hsl(${f.hue+j*36},100%,68%)`,['--tx' as any]:`${tx}px`,['--ty' as any]:`${ty}px`,animation:`dfw-spark ${f.dur} ease-out ${f.delay} infinite`,boxShadow:`0 0 3px hsl(${f.hue},100%,65%)`}} />
          );})}
        </div>
      ))}
      <div style={{position:'absolute',bottom:0,left:0,right:0,display:'flex',justifyContent:'space-around',padding:'0 4px 6px'}}>
        {diyas.map((d,i)=>(
          <div key={i} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:0}}>
            <div style={{fontSize:9,animation:`dflame .6s ease-in-out ${d.delay} infinite`,color:s.accent,lineHeight:1}}>🔥</div>
            <span style={{fontSize:22,animation:`dglow 1.8s ease-in-out ${d.delay} infinite`,display:'block'}}>🪔</span>
          </div>
        ))}
      </div>
    </div>
  );
};
