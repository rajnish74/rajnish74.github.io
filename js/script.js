
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── PRELOADER BOOT SEQUENCE ── */
const bootMsgs=[
  {t:'$ rk --init', ok:false},
  {t:'loading payment_gateway.jar', ok:true},
  {t:'loading llm_platform.jar', ok:true},
  {t:'connecting to rk.dev', ok:true},
  {t:'ready.', ok:true},
];
const bootLinesEl=document.getElementById('bootLines');
const bootBar=document.getElementById('bootBar');
const preloader=document.getElementById('preloader');

function runBoot(){
  if(reduceMotion){ finishBoot(); return; }
  let i=0;
  function next(){
    if(i>=bootMsgs.length){ setTimeout(finishBoot,300); return; }
    const m=bootMsgs[i];
    const line=document.createElement('div');
    line.className='boot-line';
    line.innerHTML = m.ok ? `<span class="ok">✓</span><span>${m.t}</span>` : `<span class="lbl">›</span><span>${m.t}</span>`;
    bootLinesEl.appendChild(line);
    bootBar.style.width = ((i+1)/bootMsgs.length*100)+'%';
    i++;
    setTimeout(next, 220);
  }
  next();
}
function finishBoot(){
  preloader.classList.add('hide');
  document.getElementById('heroInner').classList.add('hero-anim-in');
  setTimeout(type, 900); // start typing title after hero settles
  setTimeout(addLog, 1400);
}
window.addEventListener('load',()=>setTimeout(runBoot,250));
// fallback in case load event already fired / slow assets
setTimeout(()=>{ if(!preloader.classList.contains('hide')) runBoot(); }, 2200);

/* ── CUSTOM CURSOR ── */
if(!reduceMotion){
  const cur=document.getElementById('cursor'),ring=document.getElementById('cursor-ring');
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove',e=>{
    mx=e.clientX;my=e.clientY;
    cur.style.left=mx+'px';cur.style.top=my+'px';
  });
  (function animRing(){
    rx+=(mx-rx)*.15;ry+=(my-ry)*.15;
    ring.style.left=rx+'px';ring.style.top=ry+'px';
    requestAnimationFrame(animRing);
  })();
  document.querySelectorAll('a,button,.btn').forEach(el=>{
    el.addEventListener('mouseenter',()=>{cur.style.transform='translate(-50%,-50%) scale(2.5)';ring.style.width='58px';ring.style.height='58px';ring.style.opacity='.5'});
    el.addEventListener('mouseleave',()=>{cur.style.transform='translate(-50%,-50%) scale(1)';ring.style.width='34px';ring.style.height='34px';ring.style.opacity='1'});
  });
}

/* ── MAGNETIC BUTTONS ── */
if(!reduceMotion){
  document.querySelectorAll('.magnet').forEach(btn=>{
    btn.addEventListener('mousemove',e=>{
      const r=btn.getBoundingClientRect();
      const relX=e.clientX-r.left-r.width/2, relY=e.clientY-r.top-r.height/2;
      btn.style.transform=`translate(${relX*0.18}px, ${relY*0.35}px)`;
    });
    btn.addEventListener('mouseleave',()=>{btn.style.transform='translate(0,0)'});
  });
}

/* ── TILT / SPOTLIGHT CARDS ── */
document.querySelectorAll('.tilt-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const px=((e.clientX-r.left)/r.width)*100;
    const py=((e.clientY-r.top)/r.height)*100;
    card.style.setProperty('--mx', px+'%');
    card.style.setProperty('--my', py+'%');
    if(!reduceMotion && card.classList.contains('project-card')){
      const rx=((py-50)/50)*-3, ry=((px-50)/50)*3;
      card.style.transform=`perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
    }
  });
  card.addEventListener('mouseleave',()=>{ card.style.transform=''; });
});

/* ── TYPING ANIMATION (title) ── */
const titles=['Java Spring Boot Developer','Backend Systems Engineer','Payment Infrastructure Builder','Distributed Systems Enthusiast'];
let ti=0,ci=0,deleting=false,typingStarted=false;
const titleEl=document.getElementById('heroTitle');
function type(){
  if(!typingStarted){ typingStarted=true; }
  const cur=titles[ti];
  if(!deleting){
    titleEl.innerHTML=cur.slice(0,ci+1)+'<span class="type-cursor"></span>';
    ci++;
    if(ci===cur.length){deleting=true;setTimeout(type,2000);return}
  }else{
    titleEl.innerHTML=cur.slice(0,ci-1)+'<span class="type-cursor"></span>';
    ci--;
    if(ci===0){deleting=false;ti=(ti+1)%titles.length;}
  }
  setTimeout(type,deleting?60:90);
}

/* ── SCROLL PROGRESS + NAV + BACK TO TOP ── */
const orb1=document.querySelector('.orb1'), orb2=document.querySelector('.orb2');
const sections=document.querySelectorAll('section[id]');
const navA=document.querySelectorAll('.nav-links a[data-section]');
const mobileA=document.querySelectorAll('.mobile-menu a');
const nav=document.getElementById('mainNav');
const backTop=document.getElementById('backTop');
const scrollProgress=document.getElementById('scrollProgress');

function onScroll(){
  const scrollY=window.scrollY;
  const docH=document.documentElement.scrollHeight-window.innerHeight;
  scrollProgress.style.width=(docH>0?(scrollY/docH*100):0)+'%';
  nav.classList.toggle('scrolled',scrollY>50);
  backTop.classList.toggle('show',scrollY>400);
  let current='';
  sections.forEach(s=>{
    if(scrollY>=s.offsetTop-120) current=s.getAttribute('id');
  });
  navA.forEach(a=>{ a.classList.toggle('active',a.dataset.section===current); });
  mobileA.forEach(a=>{
    const href=a.getAttribute('href').replace('#','');
    a.classList.toggle('active',href===current);
  });
  if(!reduceMotion && orb1 && orb2){
    orb1.style.transform=`translateY(${scrollY*0.12}px)`;
    orb2.style.transform=`translateY(${-scrollY*0.08}px)`;
  }
}
window.addEventListener('scroll',onScroll,{passive:true});
onScroll();

/* ── HAMBURGER ── */
const hb=document.getElementById('hamburger'),mm=document.getElementById('mobileMenu');
hb.addEventListener('click',()=>{hb.classList.toggle('open');mm.classList.toggle('open')});
function closeMobile(){hb.classList.remove('open');mm.classList.remove('open')}

/* ── SCROLL REVEAL ── */
const obs=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting)x.target.classList.add('in')}),{threshold:0.08});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

/* ── SKILL METER FILL ON SCROLL ── */
const meterObs=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const row=entry.target;
      const level=row.dataset.level;
      const fill=row.querySelector('.skill-meter-fill');
      fill.style.width=level+'%';
      meterObs.unobserve(row);
    }
  });
},{threshold:0.4});
document.querySelectorAll('.skill-row').forEach(row=>meterObs.observe(row));

/* ── COUNT-UP STATS ── */
const countObs=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const el=entry.target;
      const target=parseInt(el.dataset.target,10);
      const suffix=el.dataset.suffix||'';
      let cur=0;
      const dur=900, start=performance.now();
      function step(now){
        const p=Math.min((now-start)/dur,1);
        cur=Math.floor(p*target);
        el.textContent=cur+suffix;
        if(p<1) requestAnimationFrame(step); else el.textContent=target+suffix;
      }
      requestAnimationFrame(step);
      countObs.unobserve(el);
    }
  });
},{threshold:0.5});
document.querySelectorAll('.count-up').forEach(el=>countObs.observe(el));

/* ── TRANSACTION LOG ── */
const logs=[
  {time:'14:22:01.003',b:'b-info',l:'INFO',m:'POST /v1/orders ← {amount:₹4,999, currency:INR}'},
  {time:'14:22:01.041',b:'b-ok',l:'OK',m:'OrderRecord ORD_8d02 → CREATED'},
  {time:'14:22:01.890',b:'b-info',l:'INFO',m:'POST /v1/payments ← {method:UPI, vpa:user@axis}'},
  {time:'14:22:01.912',b:'b-warn',l:'STATE',m:'PAY_63e5: CREATED → AUTHORIZING'},
  {time:'14:22:01.940',b:'b-info',l:'INFO',m:'UPIAdapter → routing to PaymentProcessorRouter'},
  {time:'14:22:01.968',b:'b-ok',l:'OK',m:'UPIProcessor → Success, ref: UPI_PROC_xK9z'},
  {time:'14:22:04.100',b:'b-info',l:'INFO',m:'BankCallbackSimulator → dueAt reached (3s)'},
  {time:'14:22:04.141',b:'b-warn',l:'STATE',m:'PAY_63e5: AUTHORIZING → AUTHORIZED'},
  {time:'14:22:04.155',b:'b-warn',l:'STATE',m:'PAY_63e5: AUTHORIZED → CAPTURING'},
  {time:'14:22:04.178',b:'b-ok',l:'OK',m:'GatewayRouter.capture() → UPIAdapter → OK'},
  {time:'14:22:04.192',b:'b-warn',l:'STATE',m:'PAY_63e5: CAPTURING → CAPTURED'},
  {time:'14:22:04.201',b:'b-ok',l:'OK',m:'Order ORD_8d02 → PAID ✓  TransitionLog: 4 entries'},
];
const lc=document.getElementById('logLines');
let li=0,logStarted=false;
function addLog(){
  if(logStarted) return; // guard against double start
  logStarted=true;
  step();
  function step(){
    if(li>=logs.length){setTimeout(()=>{lc.innerHTML='';li=0;step();},3500);return}
    const l=logs[li++];
    const d=document.createElement('div');d.className='log-line';
    d.innerHTML=`<span class="log-time">${l.time}</span><span class="log-badge ${l.b}">${l.l}</span><span class="log-msg">${l.m}</span>`;
    lc.appendChild(d);lc.parentElement.scrollTop=9999;
    setTimeout(step,li<4?700:li<8?750:550);
  }
}

/* ── LIVE GITHUB STATS ── */
document.querySelectorAll('.gh-stats').forEach(async el=>{
  const repo=el.dataset.repo;
  try{
    const res=await fetch(`https://api.github.com/repos/${repo}`);
    if(!res.ok) throw new Error('fetch failed');
    const data=await res.json();
    const updated=new Date(data.pushed_at);
    const daysAgo=Math.max(0,Math.floor((Date.now()-updated)/86400000));
    const updatedLabel = daysAgo===0 ? 'today' : daysAgo===1 ? '1 day ago' : daysAgo+' days ago';
    el.innerHTML = `<span>★ ${data.stargazers_count}</span><span>⑂ ${data.forks_count}</span><span>updated ${updatedLabel}</span>`;
  }catch(e){
    el.innerHTML = '';
  }
});

/* ── CONTACT FORM (opens visitor's email client, addressed to Rajnish) ── */
const RAJNISH_EMAIL='rajnishk748193@gmail.com';
const contactForm=document.getElementById('contactForm');
const formMsg=document.getElementById('formMsg');
const formBtn=document.getElementById('formBtn');
if(contactForm){
  contactForm.addEventListener('submit', e=>{
    e.preventDefault();
    const data=new FormData(contactForm);
    if(data.get('_gotcha')){ return; } // honeypot tripped — silently drop
    const name=data.get('name')||'';
    const email=data.get('email')||'';
    const message=data.get('message')||'';
    const subject=`Portfolio inquiry from ${name}`;
    const body=`${message}\n\n— ${name} (${email})`;
    const mailto=`mailto:${RAJNISH_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href=mailto;
    formMsg.classList.add('show');
    setTimeout(()=>formMsg.classList.remove('show'),4000);
  });
}

/* ── PAYMENT STATE MACHINE DIAGRAM ── */
(function(){
  const nodes=document.querySelectorAll('.sm-node');
  const edges=document.querySelectorAll('.sm-edge');
  const info=document.getElementById('smInfo');
  if(!nodes.length) return;
  let activeState=null;

  function render(state){
    nodes.forEach(n=>n.classList.remove('active','connected'));
    edges.forEach(e=>e.classList.remove('spotlight','dim'));

    if(!state){
      info.innerHTML='<span class="sm-empty">Click any state above to inspect its incoming and outgoing transitions.</span>';
      return;
    }

    const outgoing=[],incoming=[];
    const connectedStates=new Set();
    edges.forEach(e=>{
      const from=e.dataset.from, to=e.dataset.to, event=e.dataset.event;
      if(from===state){ e.classList.add('spotlight'); outgoing.push({event,to}); connectedStates.add(to); }
      else if(to===state){ e.classList.add('spotlight'); incoming.push({event,from}); connectedStates.add(from); }
      else { e.classList.add('dim'); }
    });

    nodes.forEach(n=>{
      if(n.dataset.state===state) n.classList.add('active');
      else if(connectedStates.has(n.dataset.state)) n.classList.add('connected');
    });

    let html=`<div class="sm-info-title">${state}</div>`;
    if(outgoing.length){
      outgoing.forEach(o=>{
        html+=`<div class="sm-tr-row"><span class="sm-tr-dir">→</span><span class="sm-tr-event">${o.event}</span><span>leads to <strong style="color:var(--text)">${o.to}</strong></span></div>`;
      });
    }
    if(incoming.length){
      incoming.forEach(i=>{
        html+=`<div class="sm-tr-row"><span class="sm-tr-dir">←</span><span>reached from <strong style="color:var(--text)">${i.from}</strong> via</span><span class="sm-tr-event">${i.event}</span></div>`;
      });
    }
    if(!outgoing.length){
      html+=`<div class="sm-tr-row"><span class="sm-empty">No outgoing transitions — this is a terminal state.</span></div>`;
    }
    info.innerHTML=html;
  }

  nodes.forEach(n=>{
    n.addEventListener('click',()=>{
      const state=n.dataset.state;
      activeState = activeState===state ? null : state;
      render(activeState);
    });
  });
})();

/* ── CASE STUDY TOGGLE ── */
const caseToggle=document.getElementById('caseToggle');
const caseFull=document.getElementById('caseFull');
if(caseToggle && caseFull){
  caseToggle.addEventListener('click',()=>{
    const isOpen=caseFull.classList.toggle('open');
    caseToggle.classList.toggle('open',isOpen);
    caseToggle.setAttribute('aria-expanded',isOpen);
    caseToggle.querySelector('span').textContent=isOpen?'Show less':'Read the full case study';
    if(isOpen) setTimeout(()=>caseToggle.scrollIntoView({behavior:'smooth',block:'nearest'}),350);
  });
}

/* ── BUTTON RIPPLE ── */
document.querySelectorAll('.btn').forEach(btn=>{
  btn.addEventListener('click',function(e){
    const r=btn.getBoundingClientRect();
    const size=Math.max(r.width,r.height);
    const ripple=document.createElement('span');
    ripple.className='ripple';
    ripple.style.width=ripple.style.height=size+'px';
    ripple.style.left=(e.clientX-r.left-size/2)+'px';
    ripple.style.top=(e.clientY-r.top-size/2)+'px';
    btn.appendChild(ripple);
    setTimeout(()=>ripple.remove(),600);
  });
});

/* ── SCREENSHOT LIGHTBOX ── */
const lightbox=document.getElementById('lightbox');
const lightboxImg=document.getElementById('lightbox-img');
const lightboxCap=document.getElementById('lightbox-cap');
document.querySelectorAll('.api-shot').forEach(shot=>{
  shot.addEventListener('click',()=>{
    const img=shot.querySelector('img');
    lightboxImg.src=img.src;
    lightboxImg.alt=img.alt;
    lightboxCap.textContent=shot.dataset.caption||'';
    lightbox.classList.add('open');
  });
});
document.getElementById('lightbox-close').addEventListener('click',()=>lightbox.classList.remove('open'));
lightbox.addEventListener('click',e=>{ if(e.target===lightbox) lightbox.classList.remove('open'); });
document.addEventListener('keydown',e=>{ if(e.key==='Escape') lightbox.classList.remove('open'); });

/* ── CIRCUIT BACKGROUND (subtle animated trace lines) ── */
(function circuitBg(){
  const svg=document.getElementById('circuit');
  const w=window.innerWidth, h=window.innerHeight;
  svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
  const paths=[];
  const count = w<640 ? 3 : 6;
  for(let i=0;i<count;i++){
    const y = (h/count)*i + (Math.random()*60-30);
    const x1 = Math.random()*w*0.3;
    const x2 = w*0.4 + Math.random()*w*0.6;
    const midY = y + (Math.random()*80-40);
    const d = `M${x1},${y} L${x1+60},${y} L${x1+60},${midY} L${x2-60},${midY} L${x2-60},${y+20} L${x2},${y+20}`;
    const path=document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('d',d);
    svg.appendChild(path);
    paths.push(path);
  }
  if(!reduceMotion){
    paths.forEach((p,idx)=>{
      const dot=document.createElementNS('http://www.w3.org/2000/svg','circle');
      dot.setAttribute('r','2.5');
      dot.style.offsetPath = `path('${p.getAttribute('d')}')`;
      dot.style.animation = `circuitPulse ${5+idx}s ease-in-out ${idx*0.7}s infinite`;
      svg.appendChild(dot);
    });
  }
})();
