// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
if(navbar){
  window.addEventListener('scroll',()=>{
    navbar.classList.toggle('scrolled',window.scrollY>50);
  });
}

// ===== MOBILE MENU =====
function openMobile(){document.getElementById('mobileMenu').classList.add('open');}
function closeMobile(){document.getElementById('mobileMenu').classList.remove('open');}

// ===== PARTICLES =====
const canvas = document.getElementById('particles-canvas');
if(canvas){
  const ctx = canvas.getContext('2d');
  let W,H,particles=[];
  function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;}
  resize();window.addEventListener('resize',resize);
  class Particle{
    constructor(){this.reset();}
    reset(){
      this.x=Math.random()*W;this.y=Math.random()*H;
      this.vx=(Math.random()-.5)*.4;this.vy=(Math.random()-.5)*.4;
      this.r=Math.random()*2+.5;
      this.alpha=Math.random()*.5+.1;
      this.color=Math.random()>.5?'0,212,255':'123,47,247';
    }
    update(){
      this.x+=this.vx;this.y+=this.vy;
      if(this.x<0||this.x>W||this.y<0||this.y>H)this.reset();
    }
    draw(){
      ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(${this.color},${this.alpha})`;ctx.fill();
    }
  }
  for(let i=0;i<120;i++)particles.push(new Particle());
  // Draw connections
  function drawLines(){
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const dx=particles[i].x-particles[j].x,dy=particles[i].y-particles[j].y;
        const d=Math.sqrt(dx*dx+dy*dy);
        if(d<120){
          ctx.beginPath();ctx.moveTo(particles[i].x,particles[i].y);
          ctx.lineTo(particles[j].x,particles[j].y);
          ctx.strokeStyle=`rgba(0,212,255,${.15*(1-d/120)})`;
          ctx.lineWidth=.5;ctx.stroke();
        }
      }
    }
  }
  function animate(){
    ctx.clearRect(0,0,W,H);
    particles.forEach(p=>{p.update();p.draw();});
    drawLines();requestAnimationFrame(animate);
  }
  animate();
}

// ===== SCROLL REVEAL =====
const reveals=document.querySelectorAll('.reveal');
const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});
},{threshold:.1});
reveals.forEach(r=>observer.observe(r));

// ===== COUNTER ANIMATION =====
function animateCount(el){
  const target=+el.dataset.target;
  const dur=2000;const step=target/dur*16;
  let cur=0;
  const timer=setInterval(()=>{
    cur+=step;
    if(cur>=target){cur=target;clearInterval(timer);}
    el.textContent=Math.floor(cur)+(el.dataset.suffix||'');
  },16);
}
const statsObserver=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const nums=e.target.querySelectorAll('[data-target]');
      nums.forEach(n=>animateCount(n));
      statsObserver.unobserve(e.target);
    }
  });
},{threshold:.3});
const statsSection=document.getElementById('stats');
if(statsSection)statsObserver.observe(statsSection);

// ===== 3D TILT ABOUT CARD =====
const card=document.getElementById('aboutCard');
if(card){
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(800px) rotateX(${-y*12}deg) rotateY(${x*12}deg)`;
  });
  card.addEventListener('mouseleave',()=>{
    card.style.transform='perspective(800px) rotateX(0deg) rotateY(0deg)';
  });
}

// ===== QUICK CERT VERIFY =====
function passToVerify(){
  const val=document.getElementById('quickCertInput');
  if(val&&val.value.trim()){
    sessionStorage.setItem('certId',val.value.trim());
  }
}

// ===== CONTACT MESSAGE =====
function sendMsg(){
  alert('Thank you for your message! We will contact you soon.\n\nOr call us directly: 094245 34563');
}

// ===== ADMISSION FORM STEPS (used in admission.html) =====
let currentStep=1;
function goStep(step){
  document.querySelectorAll('.form-step').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.step-dot').forEach((d,i)=>{
    d.classList.toggle('active',i<step);
  });
  const el=document.getElementById('step'+step);
  if(el){el.classList.add('active');currentStep=step;}
  const bar=document.getElementById('progressBar');
  if(bar)bar.style.width=((step-1)/2*100)+'%';
}
function nextStep(){
  if(currentStep<3)goStep(currentStep+1);
}
function prevStep(){
  if(currentStep>1)goStep(currentStep-1);
}
function submitForm(){
  const name=document.getElementById('fname');
  if(name&&!name.value.trim()){alert('Please fill in required fields.');return;}
  document.querySelector('.form-steps-wrap').style.display='none';
  document.getElementById('successMsg').style.display='flex';
}

// ===== CERT VERIFY =====
const certData={
  'ISP2025001':{name:'Rahul Sharma',course:'DCA',date:'March 2025',grade:'A'},
  'ISP2025002':{name:'Priya Patel',course:'Tally with GST',date:'April 2025',grade:'A+'},
  'ISP2025003':{name:'Amit Kumar',course:'Web Designing',date:'February 2025',grade:'B+'},
  'ISP2024010':{name:'Neha Singh',course:'PGDCA',date:'November 2024',grade:'A'},
  'ISP2024015':{name:'Ravi Verma',course:'Basic Computer',date:'December 2024',grade:'A+'},
};
function verifyCert(){
  const input=document.getElementById('certInput');
  if(!input)return;
  const id=input.value.trim().toUpperCase();
  const result=document.getElementById('certResult');
  if(!id){alert('Please enter a certificate ID or roll number.');return;}
  if(certData[id]){
    const d=certData[id];
    result.innerHTML=`
      <div class="cert-found">
        <div class="cert-check">✅</div>
        <h3>Certificate Verified!</h3>
        <div class="cert-details">
          <div class="cert-row"><span>Student Name</span><strong>${d.name}</strong></div>
          <div class="cert-row"><span>Course</span><strong>${d.course}</strong></div>
          <div class="cert-row"><span>Completion Date</span><strong>${d.date}</strong></div>
          <div class="cert-row"><span>Grade</span><strong>${d.grade}</strong></div>
          <div class="cert-row"><span>Certificate ID</span><strong>${id}</strong></div>
          <div class="cert-row"><span>Status</span><strong style="color:var(--cyan)">✅ Valid & Authentic</strong></div>
        </div>
        <p class="cert-issued">Issued by ISP Computer Institute, Katni M.P.</p>
      </div>`;
    result.style.display='block';
  } else {
    result.innerHTML=`<div class="cert-notfound"><div style="font-size:3rem">❌</div><h3>Certificate Not Found</h3><p>No record found for ID: <strong>${id}</strong><br/>Please check the ID and try again, or contact ISP Institute at 094245 34563.</p></div>`;
    result.style.display='block';
  }
}

// ===== PRELOAD CERT FROM HOME PAGE =====
window.addEventListener('load',()=>{
  const saved=sessionStorage.getItem('certId');
  const inp=document.getElementById('certInput');
  if(saved&&inp){inp.value=saved;sessionStorage.removeItem('certId');}
});
