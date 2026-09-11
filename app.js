const cfg = window.MILEMITRA_CONFIG || {};
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

const rides = [
  {name:'Ananya K.', initials:'AK', rating:'4.9', rides:126, score:94, depart:'7:55', arrive:'8:34', from:'Sector 56 Metro Gate', to:'Cyber City Gate 3', walk:'2 min walk', detour:'4 min detour', price:72, tags:['Work verified','Quiet','AC','On-time'], seats:2},
  {name:'Rohit M.', initials:'RM', rating:'4.8', rides:88, score:91, depart:'8:05', arrive:'8:41', from:'Golf Course Road', to:'DLF Phase 2', walk:'5 min walk', detour:'2 min detour', price:64, tags:['ID verified','Music okay','No smoking'], seats:1},
  {name:'Neha S.', initials:'NS', rating:'5.0', rides:52, score:89, depart:'7:50', arrive:'8:37', from:'Sector 57 Market', to:'Cyber Hub', walk:'4 min walk', detour:'7 min detour', price:78, tags:['Work verified','Women preferred','Quiet'], seats:2},
  {name:'Arjun P.', initials:'AP', rating:'4.7', rides:203, score:86, depart:'8:10', arrive:'8:48', from:'Hong Kong Bazaar', to:'Udyog Vihar Phase 3', walk:'6 min walk', detour:'3 min detour', price:61, tags:['Vehicle verified','Chat welcome','AC'], seats:3},
  {name:'Meera R.', initials:'MR', rating:'4.9', rides:71, score:84, depart:'8:00', arrive:'8:45', from:'Sector 55-56 Metro', to:'Ambience Island', walk:'3 min walk', detour:'8 min detour', price:75, tags:['Work verified','Women preferred','No smoking'], seats:1},
  {name:'Vikram D.', initials:'VD', rating:'4.8', rides:141, score:81, depart:'8:15', arrive:'8:52', from:'Sector 54 Chowk', to:'Cyber City', walk:'7 min walk', detour:'5 min detour', price:59, tags:['ID verified','Music okay','Luggage okay'], seats:2}
];

function showToast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2600)}
function setDefaults(){const d=new Date(); const iso=d.toISOString().slice(0,10); ['heroDate','findDate'].forEach(id=>{const el=$('#'+id); if(el&&!el.value) el.value=iso}); if(!$('#heroTime').value){d.setMinutes(d.getMinutes()+30); $('#heroTime').value=d.toTimeString().slice(0,5)}}
function route(){const hash=(location.hash||'#home').slice(1); const id=['home','find','offer','safety','business','help'].includes(hash)?hash:'home'; $$('.page').forEach(p=>p.classList.toggle('active',p.id===id)); window.scrollTo({top:0,behavior:'instant'}); if(id==='find') setTimeout(initMap,50)}
window.addEventListener('hashchange',route);

function renderRides(){const wrap=$('#rideResults'); wrap.innerHTML=rides.map((r,i)=>`<article class="ride-card"><div class="ride-main"><div class="ride-time"><strong>${r.depart}</strong><small>${r.score}% match</small><div class="avatar" style="margin-top:18px">${r.initials}</div></div><div><div class="route-compact"><p><strong>${r.from}</strong><small>${r.walk}</small></p><p><strong>${r.to}</strong><small>ETA ${r.arrive} · ${r.detour}</small></p></div><div class="person-row" style="border:0;padding-bottom:0"><div><strong>${r.name}</strong><small>⭐ ${r.rating} · ${r.rides} rides · ${r.seats} seat${r.seats>1?'s':''} left</small></div><span class="verified">✓</span></div><div class="ride-meta">${r.tags.map(t=>`<span>${t}</span>`).join('')}</div></div></div><div class="ride-price"><div><strong>₹${r.price}</strong><small>estimated share</small></div><button class="btn primary book-btn" data-index="${i}">Choose ride</button></div></article>`).join('');
  $$('.book-btn').forEach(btn=>btn.addEventListener('click',()=>checkout(rides[+btn.dataset.index])));
}

async function checkout(ride){
  const amount=ride.price*100;
  if(cfg.RAZORPAY_KEY_ID && window.Razorpay){
    let orderId=null;
    if(cfg.API_BASE_URL){try{const res=await fetch(cfg.API_BASE_URL+'/api/payments/order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({amount,currency:'INR',rideId:'demo-'+ride.initials})}); const data=await res.json(); orderId=data.id}catch(e){showToast('Could not create payment order. Running demo checkout.')}}
    const rzp=new Razorpay({key:cfg.RAZORPAY_KEY_ID,amount,currency:'INR',name:'MileMitra',description:`Ride with ${ride.name}`,order_id:orderId||undefined,handler:()=>showToast('Payment successful — ride confirmed!'),prefill:{name:'Demo Rider'},theme:{}}); rzp.open();
  } else {
    if(confirm(`Demo payment\n\nRide with ${ride.name}\nCost share: ₹${ride.price}\n\nPress OK to simulate successful payment.`)) showToast('Demo payment successful — ride confirmed!');
  }
}

let mapLoaded=false;
function initMap(){if(mapLoaded||!$('#map'))return; if(!cfg.GOOGLE_MAPS_API_KEY)return; const script=document.createElement('script');script.src=`https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(cfg.GOOGLE_MAPS_API_KEY)}&libraries=places&callback=__mileMapReady`;script.async=true;script.defer=true;document.head.appendChild(script);mapLoaded=true}
window.__mileMapReady=()=>{const el=$('#map'); if(!el)return; const center={lat:28.4595,lng:77.0266}; const map=new google.maps.Map(el,{center,zoom:12,mapTypeControl:false,streetViewControl:false,fullscreenControl:false}); new google.maps.Marker({map,position:center,title:'Sample pickup'}); ['heroFrom','heroTo','findFrom','findTo','offerFrom','offerTo'].forEach(id=>{const input=$('#'+id);if(input)new google.maps.places.Autocomplete(input,{fields:['formatted_address','geometry','name']})})};

function locate(){if(!navigator.geolocation){showToast('Location is not supported in this browser.');return}navigator.geolocation.getCurrentPosition(p=>{const val=`Current location (${p.coords.latitude.toFixed(5)}, ${p.coords.longitude.toFixed(5)})`;$('#heroFrom').value=val;showToast('Precise pickup location added.')},()=>showToast('Location permission was not granted.'),{enableHighAccuracy:true,timeout:8000})}

function openModal(id){const m=$('#'+id); if(m){m.classList.add('open');m.setAttribute('aria-hidden','false')}}
function closeModal(m){m.classList.remove('open');m.setAttribute('aria-hidden','true')}

window.addEventListener('DOMContentLoaded',()=>{
  setDefaults();renderRides();route();
  $$('.segment').forEach(btn=>btn.addEventListener('click',()=>{$$('.segment').forEach(b=>b.classList.remove('active'));btn.classList.add('active');$('#heroSubmitText').textContent=btn.dataset.tripmode==='find'?'Find smart matches':'Offer my seats'}));
  $('#heroSearchForm').addEventListener('submit',e=>{e.preventDefault(); const mode=$('.segment.active').dataset.tripmode; const from=$('#heroFrom').value,to=$('#heroTo').value; if(mode==='find'){location.hash='#find';setTimeout(()=>{$('#findFrom').value=from;$('#findTo').value=to},30)}else{location.hash='#offer';setTimeout(()=>{$('#offerFrom').value=from;$('#offerTo').value=to},30)}});
  $('#swapHero').addEventListener('click',()=>{const a=$('#heroFrom'),b=$('#heroTo');[a.value,b.value]=[b.value,a.value]});
  $('#useLocationBtn').addEventListener('click',locate);
  $('#refreshMatches').addEventListener('click',()=>{rides.sort(()=>Math.random()-.5);renderRides();showToast('Matches refreshed for your preferences.')});
  $('#offerForm').addEventListener('submit',e=>{e.preventDefault();showToast('Ride preview created — demo mode does not publish publicly.')});
  $$('#prefChips button').forEach(b=>b.addEventListener('click',()=>b.classList.toggle('selected')));
  $$('[data-open]').forEach(b=>b.addEventListener('click',()=>openModal(b.dataset.open)));
  $$('.modal-close').forEach(b=>b.addEventListener('click',()=>closeModal(b.closest('.modal'))));
  $$('.modal').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)closeModal(m)}));
  $$('.demo-login').forEach(b=>b.addEventListener('click',()=>{closeModal(b.closest('.modal'));showToast('Demo submitted successfully.')}));
  $('#menuBtn').addEventListener('click',()=>{location.hash='#find'});
});
