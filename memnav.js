/* Soul Society member navigation: a scrolling strip under the header, for signed-in members only */
(function(){
const SK="ss-member";
const signed=()=>{try{return !!(localStorage.getItem(SK)||sessionStorage.getItem(SK))}catch(e){return false}};
const ITEMS=[["index.html","Home"],["societies.html","Societies"],["mysocieties.html","My Societies"],["badges.html","Achievements"],["points.html","Soul Points"],["notifications.html","Notifications"],["avatar.html","Character"],["games.html","Games Arena"]];
function mount(){
  if(!signed()||document.querySelector(".memnav"))return;
  const hdr=document.querySelector("header.top");if(!hdr)return;
  const cur=(location.pathname.split("/").pop()||"index.html").toLowerCase();
  const nav=document.createElement("nav");
  nav.className="memnav";nav.setAttribute("aria-label","Member navigation");
  nav.innerHTML='<div class="mn-in">'+ITEMS.map(x=>'<a href="'+x[0]+'"'+(x[0]===cur?' aria-current="page"':"")+">"+x[1]+"</a>").join("")+"</div>";
  hdr.insertAdjacentElement("afterend",nav);
  const a=nav.querySelector('[aria-current="page"]');
  if(a&&a.scrollIntoView)try{a.scrollIntoView({inline:"center",block:"nearest"})}catch(e){}
}
const css=document.createElement("style");
css.textContent=`.memnav{background:rgba(14,11,34,.78);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border-bottom:1px solid rgba(185,166,255,.16);overflow-x:auto;white-space:nowrap;-webkit-overflow-scrolling:touch;scrollbar-width:none}
.memnav::-webkit-scrollbar{display:none}
.mn-in{display:flex;gap:6px;max-width:1040px;margin:0 auto;padding:0 18px}
.memnav a{display:inline-block;padding:12px 14px;color:#ADA7CC;text-decoration:none;font:500 .92rem system-ui,-apple-system,"Segoe UI",sans-serif;border-bottom:2px solid transparent;flex:none}
.memnav a:hover{color:#E8B65C}
.memnav a[aria-current="page"]{color:#F1EBFA;border-bottom-color:#E8B65C}`;
document.head.appendChild(css);
window.ssMemNav=mount;
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount);else mount();
})();
