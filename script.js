// ===== CURSOR (desktop only) =====
const cursorEl=document.getElementById('cursor');
const ringEl=document.getElementById('cursorRing');
let mx=0,my=0,rx=0,ry=0;
if(window.matchMedia('(pointer:fine)').matches){
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cursorEl.style.left=mx-5+'px';cursorEl.style.top=my-5+'px';});
  (function animRing(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;ringEl.style.left=rx-18+'px';ringEl.style.top=ry-18+'px';requestAnimationFrame(animRing);})();
  document.addEventListener('mouseover',e=>{
    if(e.target.closest('button,a,input,textarea,.toggle-switch,.plan-card,.g-account,.user-avatar-btn')){cursorEl.style.transform='scale(2)';ringEl.style.transform='scale(1.5)';}
    else{cursorEl.style.transform='scale(1)';ringEl.style.transform='scale(1)';}
  });
}

// ===== GOOGLE ACCOUNTS DATA =====
const googleAccounts=[
  {name:'Arjun Patel',email:'arjun.patel@gmail.com',color:'#4285F4'},
  {name:'Priya Sharma',email:'priya.sharma@gmail.com',color:'#34A853'},
  {name:'Rahul Mehta',email:'rahul.mehta@gmail.com',color:'#EA4335'},
  {name:'Neha Gupta',email:'neha.gupta@gmail.com',color:'#FBBC05'},
  {name:'Dev Kumar',email:'dev.kumar@gmail.com',color:'#7b5cf0'},
];
function getInitials(name){return name.split(' ').map(n=>n[0]).join('').toUpperCase();}

function openGPicker(){
  const list=document.getElementById('gAccountList');
  list.innerHTML=googleAccounts.map((acc,i)=>`
    <div class="g-account" onclick="selectGoogleAccount(${i})">
      <div class="g-avatar" style="background:${acc.color}">${getInitials(acc.name)}</div>
      <div class="g-info">
        <div class="g-name">${acc.name}</div>
        <div class="g-email">${acc.email}</div>
      </div>
      <span class="g-check">✓</span>
    </div>
  `).join('');
  document.getElementById('gPicker').classList.add('open');
}
function closeGPicker(){document.getElementById('gPicker').classList.remove('open');}
function selectGoogleAccount(idx){
  const acc=googleAccounts[idx];
  closeGPicker();
  currentUser={name:acc.name,email:acc.email,color:acc.color};
  enterMain();
  showToast('✅ Signed in as '+acc.name+'!');
}
function addGoogleAccount(){
  closeGPicker();
  showToast('🔗 Opening Google sign-in...');
  setTimeout(()=>{
    const name='New User';
    const email='newuser@gmail.com';
    currentUser={name,email,color:'#ff6b35'};
    enterMain();
    showToast('✅ New account connected!');
  },800);
}

// ===== AUTH =====
let currentUser=null;

function handleLogin(){
  const email=document.getElementById('loginEmail').value.trim();
  const pass=document.getElementById('loginPassword').value;
  let ok=true;
  document.getElementById('emailError').style.display='none';
  document.getElementById('passError').style.display='none';
  if(!email||!email.includes('@')){document.getElementById('emailError').style.display='block';ok=false;}
  if(pass.length<6){document.getElementById('passError').style.display='block';ok=false;}
  if(!ok)return;
  const name=email.split('@')[0].replace(/[._]/g,' ').replace(/\b\w/g,l=>l.toUpperCase());
  currentUser={name,email,color:randomColor()};
  enterMain();
}

function handleSignup(){
  const name=document.getElementById('signupName').value.trim();
  const email=document.getElementById('signupEmail').value.trim();
  const pass=document.getElementById('signupPassword').value;
  document.getElementById('signupError').style.display='none';
  if(!name||!email.includes('@')||pass.length<6){document.getElementById('signupError').style.display='block';return;}
  currentUser={name,email,color:randomColor()};
  enterMain();
  showToast('🎉 Account created! Welcome to DataStream.');
}

function randomColor(){
  const colors=['#7b5cf0','#00b894','#e17055','#0984e3','#fd79a8','#00cec9'];
  return colors[Math.floor(Math.random()*colors.length)];
}

function enterMain(){
  document.getElementById('loginPage').classList.remove('active');
  document.getElementById('mainPage').classList.add('active');
  // Update avatar + name
  const initials=getInitials(currentUser.name);
  document.getElementById('navAvatar').style.background=currentUser.color;
  document.getElementById('navAvatarInitial').textContent=initials;
  document.getElementById('navUsername').textContent=currentUser.name.split(' ')[0];
  document.getElementById('dropdownAvatar').style.background=currentUser.color;
  document.getElementById('dropdownAvatar').textContent=initials;
  document.getElementById('dropdownName').textContent=currentUser.name;
  document.getElementById('dropdownEmail').textContent=currentUser.email;
  window.scrollTo(0,0);
  initCounters();
}

function handleLogout(){
  closeDropdown();
  document.getElementById('mainPage').classList.remove('active');
  document.getElementById('loginPage').classList.add('active');
  document.getElementById('loginEmail').value='';
  document.getElementById('loginPassword').value='';
  showLogin();
  window.scrollTo(0,0);
  showToast('👋 Logged out successfully.');
}

function showSignup(){document.getElementById('loginForm').style.display='none';document.getElementById('signupForm').style.display='block';}
function showLogin(){document.getElementById('loginForm').style.display='block';document.getElementById('signupForm').style.display='none';}

// Enter key
document.addEventListener('keydown',e=>{
  if(e.key!=='Enter')return;
  if(!document.getElementById('loginPage').classList.contains('active'))return;
  if(document.getElementById('loginForm').style.display!=='none')handleLogin();
  else handleSignup();
});

// ===== HAMBURGER =====
function toggleMenu(){
  const nl=document.getElementById('navLinks');
  nl.classList.toggle('open');
}
// Close menu on outside click
document.addEventListener('click',e=>{
  const nl=document.getElementById('navLinks');
  const hb=document.getElementById('hamburger');
  if(nl.classList.contains('open')&&!nl.contains(e.target)&&!hb.contains(e.target)){nl.classList.remove('open');}
});

// ===== AVATAR DROPDOWN =====
function toggleDropdown(){
  const dd=document.getElementById('avatarDropdown');
  const btn=document.getElementById('avatarBtn');
  const isOpen=dd.classList.contains('open');
  dd.classList.toggle('open',!isOpen);
  btn.classList.toggle('open',!isOpen);
}
function closeDropdown(){
  document.getElementById('avatarDropdown').classList.remove('open');
  document.getElementById('avatarBtn').classList.remove('open');
}
document.addEventListener('click',e=>{
  if(!e.target.closest('#avatarBtn')&&!e.target.closest('#avatarDropdown'))closeDropdown();
});

// ===== NAV SCROLL =====
function navTo(id){
  document.getElementById('navLinks').classList.remove('open');
  const el=document.getElementById(id);
  if(el){
    const offset=el.getBoundingClientRect().top+window.scrollY-70;
    window.scrollTo({top:offset,behavior:'smooth'});
  }
}

// ===== COUNTERS =====
function initCounters(){
  const counters=document.querySelectorAll('[data-count]');
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      const el=entry.target;
      const target=parseFloat(el.dataset.count);
      const isD=target%1!==0;
      const dur=1500,start=performance.now();
      (function upd(now){const p=Math.min((now-start)/dur,1),e2=1-Math.pow(1-p,3);el.textContent=isD?(target*e2).toFixed(1):Math.round(target*e2);if(p<1)requestAnimationFrame(upd);})(performance.now());
      obs.unobserve(el);
    });
  });
  counters.forEach(c=>obs.observe(c));
}

// ===== BILLING TOGGLE =====
let isAnnual=false;
function toggleBilling(){
  isAnnual=!isAnnual;
  document.getElementById('billingToggle').classList.toggle('active',isAnnual);
  document.querySelectorAll('.plan-price-val').forEach(el=>{el.textContent='$'+(isAnnual?el.dataset.annual:el.dataset.monthly);});
  showToast(isAnnual?'✅ Annual billing — saving 20%!':'↩ Switched to monthly billing.');
}

// ===== PLAN MODAL =====
function openPlanModal(name,data,price,style){
  document.getElementById('planModalBody').innerHTML=`
    <div class="modal-tag">// Subscribe Now</div>
    <div class="modal-title">Get ${name}</div>
    <div class="modal-sub">You're one step away from blazing-fast data. Fill in your details to activate.</div>
    <div class="modal-plan-highlight">
      <span class="modal-plan-name-disp">${name} — ${data}</span>
      <span class="modal-plan-price-disp">$${price}/mo</span>
    </div>
    <input class="modal-input" type="text" id="pFullName" placeholder="Full Name" autocomplete="name">
    <input class="modal-input" type="tel" id="pPhone" placeholder="Phone Number" autocomplete="tel">
    <input class="modal-input" type="text" id="pAddress" placeholder="SIM Delivery Address" autocomplete="street-address">
    <button class="modal-submit ${style}" onclick="submitPlan('${name}','${data}')">Activate ${name} Plan →</button>
    <div class="modal-note">🔒 Secure checkout · Free SIM delivery · Cancel anytime</div>
  `;
  document.getElementById('planModal').classList.add('open');
}
function submitPlan(name,data){
  const n=document.getElementById('pFullName').value.trim();
  const ph=document.getElementById('pPhone').value.trim();
  const addr=document.getElementById('pAddress').value.trim();
  if(!n||!ph||!addr){showToast('⚠️ Please fill in all fields.');return;}
  document.getElementById('planModalBody').innerHTML=`
    <div class="modal-success">
      <div class="success-icon">🎉</div>
      <div class="success-title">Plan Activated!</div>
      <div class="success-sub">Your <strong style="color:var(--text)">${name} (${data})</strong> plan is live!<br><br>Your SIM will be delivered to <em>${addr}</em> within 2–3 business days.</div>
      <button class="modal-submit ms-accent" style="margin-top:1.5rem" onclick="closeModal('planModal')">← Back to Plans</button>
    </div>
  `;
  showToast('🚀 '+name+' plan activated!');
}

// ===== CONTACT MODAL =====
function openContactModal(){
  ['cName','cEmail','cCompany','cMessage'].forEach(id=>{if(document.getElementById(id))document.getElementById(id).value='';});
  document.getElementById('contactModalBody').innerHTML=`
    <div class="modal-tag">// Enterprise Sales</div>
    <div class="modal-title">Talk to Our Team</div>
    <div class="modal-sub">Get a custom plan for your business. We'll reach out within 24 hours.</div>
    <input class="modal-input" type="text" id="cName" placeholder="Your Name">
    <input class="modal-input" type="email" id="cEmail" placeholder="Work Email">
    <input class="modal-input" type="text" id="cCompany" placeholder="Company Name">
    <textarea class="modal-textarea" id="cMessage" placeholder="Tell us about your data needs..."></textarea>
    <button class="modal-submit ms-orange" onclick="submitContact()">Send Message →</button>
    <div class="modal-note">We respond within 24 hours · No spam ever</div>
  `;
  document.getElementById('contactModal').classList.add('open');
}
function submitContact(){
  const n=document.getElementById('cName').value.trim();
  const e=document.getElementById('cEmail').value.trim();
  const c=document.getElementById('cCompany').value.trim();
  if(!n||!e||!c){showToast('⚠️ Please fill Name, Email, and Company.');return;}
  document.getElementById('contactModalBody').innerHTML=`
    <div class="modal-success">
      <div class="success-icon">📬</div>
      <div class="success-title">Message Sent!</div>
      <div class="success-sub">Thanks <strong style="color:var(--text)">${n}</strong>! Our team will reach out to <em>${e}</em> within 24 hours.</div>
      <button class="modal-submit ms-orange" style="margin-top:1.5rem" onclick="closeModal('contactModal')">Close</button>
    </div>
  `;
  showToast('📨 Message sent to sales team!');
}

// ===== MODAL UTILS =====
function closeModal(id){document.getElementById(id).classList.remove('open');}
function bgClose(e,id){if(e.target.id===id)closeModal(id);}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal('planModal');closeModal('contactModal');closeGPicker();}});

// ===== TOAST =====
let toastTimer;
function showToast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg;t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>t.classList.remove('show'),3200);
}