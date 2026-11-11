/* Soul Society chibi avatars: original SVG art, drawn from small parts */
(function(){
const SKIN=["#FFE0C7","#F6C9A4","#E7A87C","#C98A5B","#9A6240","#6B4228"];
const HAIR=["#2B2233","#5A3A2A","#B5722F","#E8C25A","#D9D9E8","#FF7FA8","#5AB7FF","#9B7BFF","#FF7A59","#4DD0C4"];
const EYE=["#3B2A6B","#2F6FD6","#2E9E6B","#B5651D","#C2264A","#6B6B7B","#E8B65C","#7A3FBF"];
const OUT=["#B9A6FF","#5AB7FF","#FF7FA8","#7BD88F","#F0C97A","#FF7A59","#2B2A4C","#E8E8F0"];
/* [key, name, default cost in Soul Points] (the database is the authority on cost) */
const CAT={
  hair:[["short","Short",0],["spiky","Spiky",0],["bob","Bob",0],["long","Long",30],["ponytail","Ponytail",40],["topknot","Top knot",50],["twintails","Twin tails",60]],
  eyes:[["round","Round",0],["sharp","Sharp",0],["happy","Happy",0],["sparkle","Sparkle",40],["star","Star",80]],
  mouth:[["smile","Smile",0],["open","Open",0],["cat","Cat",0],["neutral","Calm",0]],
  outfit:[["tee","T-shirt",0],["hoodie","Hoodie",0],["uniform","Uniform",40],["jacket","Jacket",50],["kimono","Kimono",60],["nightrobe","Night robe",90]],
  acc:[["none","None",0],["glasses","Glasses",30],["headband","Headband",30],["scarf","Scarf",40],["mask","Fox mask",40],["catears","Cat ears",50],["halo","Halo",70],["crown","Crown",120]],
  bg:[["lavender","Lavender",0],["dawn","Dawn",0],["teal","Teal",0],["rose","Rose",0],["sakura","Sakura",40],["night","Starry night",60],["spirits","Spirit lights",80]]
};
const DEF={skin:1,hair:"short",hairColor:0,eyes:"round",eyeColor:0,mouth:"smile",outfit:"tee",outfitColor:0,acc:"none",bg:"lavender"};
const BG={lavender:["#2A2250","#4B3A86"],dawn:["#3A2A5A","#C9805A"],teal:["#12303F","#2E7F86"],rose:["#3B1F45","#B04A7A"],sakura:["#3B1F45","#D17AA6"],night:["#0B0B2A","#2C2670"],spirits:["#120E2C","#3A2A7A"]};
const has=(slot,k)=>CAT[slot].some(x=>x[0]===k);
function norm(a){
  a=a&&typeof a==="object"?a:{};
  const o={};
  for(const k in DEF)o[k]=a[k]!==undefined&&a[k]!==null?a[k]:DEF[k];
  for(const s of ["hair","eyes","mouth","outfit","acc","bg"])if(!has(s,o[s]))o[s]=DEF[s];
  o.skin=((parseInt(o.skin,10)||0)%SKIN.length+SKIN.length)%SKIN.length;
  o.hairColor=((parseInt(o.hairColor,10)||0)%HAIR.length+HAIR.length)%HAIR.length;
  o.eyeColor=((parseInt(o.eyeColor,10)||0)%EYE.length+EYE.length)%EYE.length;
  o.outfitColor=((parseInt(o.outfitColor,10)||0)%OUT.length+OUT.length)%OUT.length;
  return o;
}
function shade(hex,amt){
  const n=parseInt(hex.slice(1),16);let r=(n>>16)&255,g=(n>>8)&255,b=n&255;
  const f=c=>Math.max(0,Math.min(255,Math.round(amt<0?c*(1+amt):c+(255-c)*amt)));
  return "#"+[f(r),f(g),f(b)].map(v=>v.toString(16).padStart(2,"0")).join("");
}
const star=(cx,cy,R,r)=>{let p="";for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,d=i%2?r:R;p+=(i?"L":"M")+(cx+Math.cos(a)*d).toFixed(1)+" "+(cy+Math.sin(a)*d).toFixed(1)}return p+"Z"};
const spark=(x,y,s,o)=>`<path d="M${x} ${y-s}Q${x} ${y} ${x+s} ${y}Q${x} ${y} ${x} ${y+s}Q${x} ${y} ${x-s} ${y}Q${x} ${y} ${x} ${y-s}Z" fill="#fff" opacity="${o}"/>`;
let uid=0;

function background(k,id){
  const g=BG[k]||BG.lavender;
  let s=`<defs><linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${g[0]}"/><stop offset="1" stop-color="${g[1]}"/></linearGradient></defs><rect width="120" height="150" rx="18" fill="url(#${id}g)"/>`;
  if(k==="sakura"){for(const [x,y,r] of [[14,20,3],[100,30,3.5],[20,70,2.5],[104,86,3],[12,118,3],[96,12,2.5],[108,126,2.5]])s+=`<ellipse cx="${x}" cy="${y}" rx="${r*1.4}" ry="${r}" fill="#FFD6E6" opacity=".8" transform="rotate(30 ${x} ${y})"/>`}
  if(k==="night"){for(const [x,y,r] of [[12,14,1.4],[28,8,1],[100,18,1.6],[110,48,1],[14,56,1.2],[106,110,1.2],[16,100,1],[90,8,1]])s+=`<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity=".9"/>`;s+=spark(102,34,5,.9)+spark(18,40,4,.8)}
  if(k==="spirits"){for(const [x,y,r,c] of [[16,24,3,"#CDBBFF"],[102,40,2.6,"#F6D98B"],[12,92,2.4,"#F6D98B"],[108,100,3,"#CDBBFF"],[24,128,2,"#CDBBFF"],[98,16,2,"#F6D98B"]])s+=`<circle cx="${x}" cy="${y}" r="${r*2.2}" fill="${c}" opacity=".18"/><circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`}
  return s+`<ellipse cx="60" cy="144" rx="26" ry="4" fill="#000" opacity=".25"/>`;
}
function hairBack(st,hc,hs){
  const f=`fill="${hc}" stroke="${hs}" stroke-width="1.2"`;
  if(st==="long")return `<path d="M20 50C6 96 10 132 34 134L40 100Z" ${f}/><path d="M100 50C114 96 110 132 86 134L80 100Z" ${f}/>`;
  if(st==="bob")return `<path d="M19 50C14 96 20 108 32 104L36 60Z" ${f}/><path d="M101 50C106 96 100 108 88 104L84 60Z" ${f}/>`;
  if(st==="twintails")return `<path d="M24 50C0 56 0 104 16 124C18 100 26 84 32 66Z" ${f}/><path d="M96 50C120 56 120 104 104 124C102 100 94 84 88 66Z" ${f}/>`;
  if(st==="ponytail")return `<path d="M96 38C124 34 126 90 106 112C108 84 100 66 90 54Z" ${f}/>`;
  if(st==="topknot")return `<circle cx="60" cy="14" r="10" ${f}/>`;
  return "";
}
function hairFront(st,hc,hs){
  const f=`fill="${hc}" stroke="${hs}" stroke-width="1.2" stroke-linejoin="round"`;
  if(st==="spiky")return `<path d="M21 64L18 38L30 44L34 20L46 36L60 12L74 36L86 20L90 44L102 38L99 64C94 50 88 42 80 40C74 46 66 48 60 46C54 48 46 46 40 40C32 42 26 50 21 64Z" ${f}/>`;
  return `<path d="M21 64C18 30 40 16 60 16C80 16 102 30 99 64C96 52 90 42 82 40C76 48 66 50 60 48C54 50 44 48 38 40C30 42 24 52 21 64Z" ${f}/>`;
}
function body(o,oc,os,skin){
  const pants=shade(oc,-.5);
  let s="";
  const legs=(c)=>`<rect x="47" y="124" width="11" height="16" rx="4" fill="${c}"/><rect x="62" y="124" width="11" height="16" rx="4" fill="${c}"/><ellipse cx="52.5" cy="141" rx="9" ry="4.5" fill="#2A2638"/><ellipse cx="67.5" cy="141" rx="9" ry="4.5" fill="#2A2638"/>`;
  const arms=(c)=>`<ellipse cx="37" cy="113" rx="7" ry="12" fill="${c}" transform="rotate(12 37 113)"/><ellipse cx="83" cy="113" rx="7" ry="12" fill="${c}" transform="rotate(-12 83 113)"/><circle cx="34" cy="124" r="5.5" fill="${skin}"/><circle cx="86" cy="124" r="5.5" fill="${skin}"/>`;
  const torso=(c)=>`<rect x="42" y="98" width="36" height="32" rx="12" fill="${c}"/>`;
  if(o==="uniform"){s+=legs("#2B2A4C")+arms("#F1EEFF")+torso("#F1EEFF")+`<path d="M52 98L60 109L68 98Z" fill="${oc}"/><path d="M58 107L62 107L63 121L60 124L57 121Z" fill="${oc}"/>`}
  else if(o==="jacket"){s+=legs(pants)+arms(oc)+torso("#EDEBFA")+`<path d="M42 100Q42 130 46 130L56 130L54 100Z" fill="${oc}"/><path d="M78 100Q78 130 74 130L64 130L66 100Z" fill="${oc}"/>`}
  else if(o==="kimono"){s+=legs(pants)+arms(oc)+torso(oc)+`<path d="M40 124L80 124L84 137L36 137Z" fill="${oc}"/><path d="M52 98L67 119M68 98L53 119" stroke="#fff" stroke-opacity=".85" stroke-width="3" fill="none"/><rect x="42" y="116" width="36" height="7" fill="${os}"/>`}
  else if(o==="nightrobe"){const rb="#1E1840";s+=legs("#14102E")+arms(rb)+torso(rb)+`<path d="M38 124L82 124L86 138L34 138Z" fill="${rb}"/><path d="M34 138L86 138" stroke="${oc}" stroke-width="2.5"/><path d="M60 98L60 130" stroke="${oc}" stroke-width="2.5"/><rect x="42" y="115" width="36" height="6" fill="${oc}"/><path d="M52 98L60 108L68 98" fill="none" stroke="${oc}" stroke-width="2.5"/><path d="M31 118L40 122M89 118L80 122" stroke="${oc}" stroke-width="3" stroke-linecap="round"/>`}
  else if(o==="hoodie"){s+=legs(pants)+arms(oc)+torso(oc)+`<path d="M44 100Q60 90 76 100L76 106Q60 100 44 106Z" fill="${os}"/><rect x="50" y="116" width="20" height="9" rx="4" fill="${os}" opacity=".65"/><path d="M56 104L56 112M64 104L64 112" stroke="#fff" stroke-opacity=".7" stroke-width="1.6" stroke-linecap="round"/>`}
  else{s+=legs(pants)+arms(oc)+torso(oc)}
  return s;
}
function eyes(st,ec,hs){
  const dark=shade(ec,-.5);let s="";
  for(const [x,side] of [[45,-1],[75,1]]){
    const y=68;
    if(st==="happy"){s+=`<path d="M${x-7} ${y+2}Q${x} ${y-8} ${x+7} ${y+2}" fill="none" stroke="#2A2233" stroke-width="3" stroke-linecap="round"/>`;continue}
    const ry=st==="sharp"?7.5:9.5,rx=st==="sharp"?7:7.5;
    s+=`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${ec}"/><ellipse cx="${x}" cy="${y+.5}" rx="4" ry="${ry-3.5}" fill="${dark}"/>`;
    if(st==="star")s+=`<path d="${star(x,y+.5,5.2,2.2)}" fill="#fff" opacity=".92"/>`;
    else if(st==="sparkle")s+=spark(x+2.5,y-3,4,1)+`<circle cx="${x-2}" cy="${y+3.5}" r="1.3" fill="#fff"/>`;
    else s+=`<circle cx="${x+2.5}" cy="${y-3}" r="2.6" fill="#fff"/><circle cx="${x-2}" cy="${y+3.5}" r="1.2" fill="#fff"/>`;
    s+=st==="sharp"?`<path d="M${x-8*side} ${y-3}L${x+8*side} ${y-9}" stroke="#2A2233" stroke-width="2.4" stroke-linecap="round"/>`:`<path d="M${x-8} ${y-8}Q${x} ${y-13} ${x+8} ${y-8}" fill="none" stroke="#2A2233" stroke-width="2.2" stroke-linecap="round"/>`;
  }
  return s;
}
function mouth(st){
  const c="#7A3340";
  if(st==="open")return `<path d="M53 82Q60 96 67 82Z" fill="#8F2F45"/><ellipse cx="60" cy="88" rx="3.5" ry="2" fill="#FF8AA0"/>`;
  if(st==="cat")return `<path d="M52 83Q56 88 60 83Q64 88 68 83" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/>`;
  if(st==="neutral")return `<path d="M55 85L65 85" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/>`;
  return `<path d="M53 83Q60 91 67 83" fill="none" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/>`;
}
function accessory(k,hc,hs,oc,os){
  if(k==="glasses")return `<g fill="#fff" fill-opacity=".1" stroke="#2A2233" stroke-width="2.2"><circle cx="45" cy="68" r="11"/><circle cx="75" cy="68" r="11"/><path d="M56 68L64 68" fill="none"/></g>`;
  if(k==="headband")return `<path d="M22 44Q60 30 98 44L98 52Q60 38 22 52Z" fill="${oc}" stroke="${os}" stroke-width="1"/>`;
  if(k==="scarf")return `<path d="M40 98Q60 108 80 98L82 108Q60 118 38 108Z" fill="${oc}"/><path d="M70 108L78 128L68 124Z" fill="${os}"/>`;
  if(k==="mask")return `<g transform="translate(88 38) rotate(20)"><path d="M-12 -8L-14 -20L-4 -12Z" fill="#F4F1FF" stroke="#2A2233" stroke-width="1.2"/><path d="M12 -8L14 -20L4 -12Z" fill="#F4F1FF" stroke="#2A2233" stroke-width="1.2"/><path d="M-14 0Q0 -16 14 0Q10 14 0 18Q-10 14 -14 0Z" fill="#F4F1FF" stroke="#2A2233" stroke-width="1.4"/><path d="M-10 -2L-3 4M10 -2L3 4" stroke="#D1425A" stroke-width="2.2" stroke-linecap="round"/></g>`;
  if(k==="catears")return `<path d="M28 34L30 8L50 24Z" fill="${hc}" stroke="${hs}" stroke-width="1.2" stroke-linejoin="round"/><path d="M32 30L33 16L44 24Z" fill="#FF9DB8"/><path d="M92 34L90 8L70 24Z" fill="${hc}" stroke="${hs}" stroke-width="1.2" stroke-linejoin="round"/><path d="M88 30L87 16L76 24Z" fill="#FF9DB8"/>`;
  if(k==="halo")return `<ellipse cx="60" cy="9" rx="24" ry="6" fill="none" stroke="#F0C97A" stroke-opacity=".3" stroke-width="8"/><ellipse cx="60" cy="9" rx="24" ry="6" fill="none" stroke="#F0C97A" stroke-width="3.2"/>`;
  if(k==="crown")return `<path d="M38 24L42 6L52 18L60 2L68 18L78 6L82 24Z" fill="#F0C97A" stroke="#B8862B" stroke-width="1.5" stroke-linejoin="round"/><circle cx="60" cy="14" r="2.2" fill="#C2264A"/><circle cx="46" cy="18" r="1.6" fill="#5AB7FF"/><circle cx="74" cy="18" r="1.6" fill="#5AB7FF"/>`;
  return "";
}
function svg(a,size,opts){
  a=norm(a);opts=opts||{};size=size||80;
  const id="cb"+(uid++);
  const skin=SKIN[a.skin],hc=HAIR[a.hairColor],hs=shade(hc,-.28),ec=EYE[a.eyeColor],oc=OUT[a.outfitColor],os=shade(oc,-.25);
  let s="";
  s+=background(a.bg,id);
  s+=hairBack(a.hair,hc,hs);
  s+=body(a.outfit,oc,os,skin);
  s+=`<circle cx="22" cy="66" r="6" fill="${skin}"/><circle cx="98" cy="66" r="6" fill="${skin}"/><circle cx="60" cy="62" r="38" fill="${skin}"/>`;
  s+=`<ellipse cx="34" cy="80" rx="6" ry="3.5" fill="#FF7FA8" opacity=".35"/><ellipse cx="86" cy="80" rx="6" ry="3.5" fill="#FF7FA8" opacity=".35"/>`;
  s+=eyes(a.eyes,ec,hs)+mouth(a.mouth);
  s+=hairFront(a.hair,hc,hs);
  s+=accessory(a.acc,hc,hs,oc,os);
  if(opts.crop){
    const vb="6 4 108 108";
    return `<span class="cav" style="width:${size}px;height:${size}px"><svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${size}" height="${size}" role="img" aria-label="Avatar">${s}</svg></span>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 150" width="${size}" height="${Math.round(size*1.25)}" role="img" aria-label="Avatar">${s}</svg>`;
}
function random(owned){
  const pick=(slot)=>{const ok=CAT[slot].filter(x=>x[2]===0||(owned&&owned.has(x[0])));return ok[Math.floor(Math.random()*ok.length)][0]};
  const r=n=>Math.floor(Math.random()*n);
  return {skin:r(SKIN.length),hair:pick("hair"),hairColor:r(HAIR.length),eyes:pick("eyes"),eyeColor:r(EYE.length),mouth:pick("mouth"),outfit:pick("outfit"),outfitColor:r(OUT.length),acc:pick("acc"),bg:pick("bg")};
}
const css=document.createElement("style");
css.textContent=".cav{display:inline-block;border-radius:50%;overflow:hidden;flex:none;vertical-align:middle;background:#2A2250;line-height:0}.cav svg{display:block}";
document.head.appendChild(css);
window.chibi={svg,norm,random,CAT,SKIN,HAIR,EYE,OUT,DEF};
})();
