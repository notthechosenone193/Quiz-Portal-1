import React from 'react';

const STYLES = {
  1:{bg:'linear-gradient(180deg,#ff9933 0%,#ffffff 45%,#138808 100%)',cc:['#ff9933','#ffffff','#138808','#ff9933','#ffffff','#138808','#000080']},
  2:{bg:'linear-gradient(180deg,#1a0500 0%,#7a3300 50%,#1a0500 100%)',cc:['#ff9933','#ffaa44','#ff8822','#ffbb55','#ff6600']},
  3:{bg:'linear-gradient(180deg,#000d1a 0%,#001f4d 50%,#000d1a 100%)',cc:['#6699ff','#4477dd','#3366cc','#8899ff','#2255bb']},
  4:{bg:'linear-gradient(180deg,#1a1000 0%,#996600 50%,#1a1000 100%)',cc:['#ffd700','#ffcc00','#ffaa00','#ffe033','#ffbb11']},
  5:{bg:'linear-gradient(180deg,#001a05 0%,#005c1a 50%,#001a05 100%)',cc:['#33cc66','#22aa55','#11883f','#55dd77','#009933']},
} as const;

const conf=Array.from({length:30},(_,i)=>({left:`${(i*11+2)%96}%`,delay:`${(i*.25)%5}s`,dur:`${4+(i*.5)%3}s`,shape:i%3===0?'50%':'2px'}));

export const IndependenceBackground: React.FC<{variant?:number}> = ({variant=1}) => {
  const s=STYLES[variant as keyof typeof STYLES]??STYLES[1];
  return (
    <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',overflow:'hidden',background:s.bg}}>
      <style>{`@keyframes ifall{0%{transform:translateY(-5%) rotate(0);opacity:1}100%{transform:translateY(108%) rotate(720deg);opacity:.3}}@keyframes isway{0%,100%{margin-left:0}50%{margin-left:25px}}@keyframes ispin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}`}</style>
      {conf.map((c,i)=>(<div key={i} style={{position:'absolute',top:'-2%',left:c.left,width:8,height:12,borderRadius:c.shape,background:s.cc[i%s.cc.length],opacity:.85,animation:`ifall ${c.dur} linear ${c.delay} infinite,isway ${c.dur} ease-in-out ${c.delay} infinite`}} />))}
      <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',fontSize:80,opacity:.1,animation:'ispin 12s linear infinite'}}>⚙️</div>
      <div style={{position:'absolute',bottom:10,left:0,right:0,display:'flex',justifyContent:'space-around'}}>
        {['🇮🇳','🇮🇳','🇮🇳','🇮🇳','🇮🇳'].map((f,i)=>(<span key={i} style={{fontSize:36,opacity:.7}}>{f}</span>))}
      </div>
    </div>
  );
};
