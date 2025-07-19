// --- FIREBASE CONFIG ---
const firebaseConfig = {
  apiKey: "AIzaSyDsDLGEphX_fn3JSMoVCB5zJsf1EfpsPKQ",
  authDomain: "sourmarket-15308.firebaseapp.com",
  projectId: "sourmarket-15308",
  storageBucket: "sourmarket-15308.appspot.com",
  messagingSenderId: "764920258385",
  appId: "1:764920258385:web:61f6eb1031ef531788bd70",
  measurementId: "G-TV2K7XSM7E"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// --- PRODUCTS DATA ---
const products = [
  {name:"Necklaces",price:"$10",extra:"Charms are $2-$4 depending on what it is",desc:"Custom necklaces, add your favorite charms!",stock:"∞"},
  {name:"Iced Out Chain",price:"$15",desc:"Super shiny iced out chains to level up any outfit.",stock:"∞"},
  {name:"Skateboard",price:"$15",desc:"Fully customizable skateboard for cruising in style.",stock:"∞"},
  {name:"Mini Shoulder Pal",price:"$15",desc:"A mini plush pal that sits on your shoulder. So cute!",stock:"∞"},
  {name:"Mini Avatar Keychain",price:"$20",desc:"Take your mini avatar anywhere you go, on your keys or bag!",stock:"∞"},
  {name:"Custom pillows - Small",price:"$10",desc:"Small custom pillows for your room or as gifts.",stock:"∞"},
  {name:"Custom pillows - Big",price:"$15",desc:"Big custom pillows for extra comfort and fun.",stock:"∞"},
  {name:"Re-Textures",price:"$20-$50",desc:"Custom re-textures for your favorite items, prices vary.",stock:"∞"},
  {name:"Custom Orders",price:"$10-$100",desc:"Want something totally unique? Send your idea for a custom quote.",stock:"∞"}
];

const statsDoc = db.collection("stats").doc("main");
const reviewsCol = db.collection("reviews");

// --- PRODUCTS GRID ---
function renderProducts() {
  const grid = document.getElementById("products-grid");
  grid.innerHTML = "";
  products.forEach((prod, i) => {
    const div = document.createElement("div");
    div.className = "product-card";
    div.style.animationDelay = (0.06 * i + 0.15) + "s";
    div.innerHTML = `
      <img src="https://i.imgur.com/KcfZIqA.png" class="icon" alt="icon">
      <div class="product-title">${prod.name}</div>
      <div class="product-desc">${prod.desc || ""}</div>
      <div style="margin-top:0.47em;">
        <span class="product-price">${prod.price}</span>
      </div>
      ${prod.extra ? `<div style="font-size:0.98em;color:#c92d70;margin-top:0.2em;">${prod.extra}</div>` : ""}
      <div class="product-stock">In Stock: ${prod.stock}</div>
      <button class="btn product-view-btn">View Details</button>
    `;
    div.querySelector('.product-view-btn').onclick = (e) => {
      e.stopPropagation();
      openModal(i);
    };
    div.onclick = (e) => {
      if(!e.target.classList.contains('product-view-btn')) openModal(i);
    };
    grid.appendChild(div);
  });
}
renderProducts();

// --- MODAL LOGIC ---
let selectedProductIdx = 0;
function openModal(idx) {
  selectedProductIdx = idx;
  const prod = products[idx];
  document.getElementById("modal-title").innerText = prod.name;
  document.getElementById("modal-desc").innerText = prod.desc || "";
  document.getElementById("modal-price").innerText = prod.price + (prod.extra ? " | " + prod.extra : "");
  document.getElementById("modal-stock").innerText = "In Stock: " + prod.stock;
  document.getElementById("product-modal-bg").style.display = "flex";
  document.body.style.overflow = "hidden";
  document.getElementById("modal-pay-btn").onclick = function(e){
    e.stopPropagation();
    showPayPopup();
  };
}
function closeModal() {
  document.getElementById("product-modal-bg").style.display = "none";
  document.body.style.overflow = "";
}
document.getElementById("product-modal-bg").onclick = function(e) {
  if(e.target===this) closeModal();
};

// --- PAYMENT POPUP + EMAILJS + DISCORD WEBHOOK ---
function showPayPopup() {
  closeModal();
  document.getElementById("pay-popup-bg").style.display = "flex";
  document.getElementById("pay-popup-content").innerHTML = `
    <div class="pay-popup" style="background:#fff; border-radius:1.25em;box-shadow:0 5px 30px #ffb6e044;padding:2.2em 1.2em;text-align:center;">
      <h2 style="color:#b71b88;margin-bottom:.8em;font-size:1.2em;">Enter Your Details</h2>
      <input id="order-name" type="text" placeholder="Your name" style="margin-bottom:1em;width:90%;max-width:260px;padding:.7em .8em;font-size:1.06em;border-radius:0.6em;border:1.5px solid #ffb6e0;"><br>
      <input id="order-email" type="email" placeholder="Your email (for confirmation)" style="margin-bottom:1.3em;width:90%;max-width:260px;padding:.7em .8em;font-size:1.06em;border-radius:0.6em;border:1.5px solid #ffb6e0;"><br>
      <div id="order-email-err" style="color:#c92d70;font-size:.98em;margin-bottom:.7em;"></div>
      <button class="btn" id="order-continue-btn">Continue to PayPal</button>
    </div>
  `;
  document.getElementById("order-continue-btn").onclick = function() {
    const name = document.getElementById('order-name').value.trim();
    const email = document.getElementById('order-email').value.trim();
    const err = document.getElementById('order-email-err');
    err.innerText = "";
    if(!name || name.length < 2) { err.innerText = "Please enter your name."; return; }
    if(!email || !email.includes('@')) { err.innerText = "Please enter a valid email."; return; }

    // 1. Email to BUYER
    emailjs.send('service_8bo4gc9', 'template_ty0bmr7', {
      name: name,
      email: email,
      product: products[selectedProductIdx]?.name || ""
    }).then(function() {
      // 2. Email to OWNER
      emailjs.send('service_8bo4gc9', 'template_udf2du7', {
        name: name,
        email: email,
        product: products[selectedProductIdx]?.name || ""
      }).then(function() {
        // 3. Success! Continue to PayPal
        showPayPopupStep2();
        sendDiscordWebhook(products[selectedProductIdx]?.name || "");
      }, function(errr) {
        err.innerText = "Failed to notify owner. Try again!"; console.log(errr);
      });
    }, function(error) {
      err.innerText = "Failed to send confirmation email. Try again!"; console.log(error);
    });
  };
}
function showPayPopupStep2() {
  document.getElementById("pay-popup-content").innerHTML = `
    <div class="pay-popup" style="background:#fff; border-radius:1.25em;box-shadow:0 5px 30px #ffb6e044;padding:2.2em 1.2em;text-align:center;">
      <h2 style="color:#b71b88;margin-bottom:.8em;font-size:1.2em;">Payment Instructions</h2>
      <ol style="text-align:left;max-width:350px;margin:0 auto 1.1em auto;padding-left:1.2em;color:#803667;font-size:1.05em;">
        <li><b>Friends and Family Only</b></li>
        <li><b>No Notes</b></li>
        <li style="word-break:break-all;"><b>RealEKitten69</b> (PayPal.me)</li>
      </ol>
      <a href="https://www.paypal.me/RealEKitten69" class="btn" target="_blank" id="pay-with-paypal">Pay with PayPal</a>
    </div>
  `;
  document.getElementById("pay-with-paypal").onclick = function(){
    setTimeout(showPayPopupProcessing,1200);
  }
}
function showPayPopupProcessing() {
  document.getElementById("pay-popup-content").innerHTML = `
    <div class="pay-popup" style="background:#fff; border-radius:1.25em;box-shadow:0 5px 30px #ffb6e044;padding:2.2em 1.2em;text-align:center;">
      <h2 style="color:#b71b88;margin-bottom:1em;">Processing Your Payment...</h2>
      <div style="margin:1.2em auto;"><svg width="34" height="34" viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" stroke="#ff5ea7" stroke-width="5" fill="none" stroke-linecap="round" stroke-dasharray="80" stroke-dashoffset="60"><animate attributeName="stroke-dashoffset" values="60;10;60" dur="1.1s" repeatCount="indefinite"/></circle></svg></div>
      <p style="margin-top:1.4em;color:#b5678b;">Please wait while we verify your payment.</p>
    </div>
  `;
  setTimeout(()=>{
    showPayPopupSuccess();
    confetti();
  }, 1700);
}
function showPayPopupSuccess() {
  document.getElementById("pay-popup-content").innerHTML = `
    <div class="pay-popup" style="background:#fff; border-radius:1.25em;box-shadow:0 5px 30px #ffb6e044;padding:2.2em 1.2em;text-align:center;">
      <span class="bigcheck" style="font-size:3em;color:#2fc764;">&#10003;</span>
      <h2 style="color:#b71b88;margin:.7em 0 0.7em 0;">Payment Completed!</h2>
      <p style="margin-bottom:1.3em;">Thank you for your purchase.<br>Click below to receive your product and chat with support.</p>
      <a href="https://discord.gg/sourmarket" class="btn" target="_blank">Get your product</a>
    </div>
  `;
  afterBuy();
}
function afterBuy() {
  statsDoc.update({ sold: firebase.firestore.FieldValue.increment(1) });
  statsDoc.update({ customers: firebase.firestore.FieldValue.increment(1) });
}
function sendDiscordWebhook(productName) {
  fetch('https://discord.com/api/webhooks/1396113760036589609/PlOCj4od5mPIMwrMo59NNrZOzKh6YEVP-iXiNaMEVtcmtad9jhy79zsHE7FK6KTax3V0', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: `A user clicked 'Pay with PayPal' for: **${productName || "unknown"}**`
    })
  });
}
document.getElementById("pay-popup-bg").onclick = function(e) {
  if(e.target===this) {
    document.getElementById("pay-popup-bg").style.display = "none";
    document.getElementById("pay-popup-content").innerHTML = "";
    document.body.style.overflow = "";
  }
};

// --- REVIEWS (FIRESTORE) ---
let reviews = [];
function renderReviews() {
  const list = document.getElementById("reviews-list");
  if (!reviews.length) {
    list.innerHTML = `<div style="text-align:center; color:#a971a1; font-size:1.13em;">No reviews yet. Be the first!</div>`;
  } else {
    list.innerHTML = "";
    reviews.slice().reverse().forEach((r, i) => {
      const div = document.createElement("div");
      div.className = "review-card";
      div.style.animationDelay = (0.06 * i + 0.12) + "s";
      div.innerHTML =
        `<span class="reviewer">
          <span class="review-rating">${starRating(r.rating)}</span>
          ${escapeHtml(r.name)}
        </span>
        <div class="review-text">${escapeHtml(r.text)}</div>
        <div class="review-date">${escapeHtml(r.date)}</div>
      `;
      list.appendChild(div);
    });
  }
  renderStats();
}
function starRating(n){
  let s="";
  for(let i=1;i<=5;i++)
    s+=i<=n?`<svg class="star-full" viewBox="0 0 20 20" style="width:1.15em;height:1.15em;fill:#FFD600;vertical-align:middle;"><polygon points="10,1 13,7 19,7.3 14.5,11.7 16,18 10,14.2 4,18 5.5,11.7 1,7.3 7,7"/></svg>`:
      `<svg class="star-empty" viewBox="0 0 20 20" style="width:1.15em;height:1.15em;fill:#ffe1e6;stroke:#ffb6e0;stroke-width:1.3;vertical-align:middle;"><polygon points="10,1 13,7 19,7.3 14.5,11.7 16,18 10,14.2 4,18 5.5,11.7 1,7.3 7,7"/></svg>`;
  return s;
}
function escapeHtml(t) { return t.replace(/[&<>"']/g, s => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[s])); }
function addReview(e) {
  e.preventDefault();
  const name = document.getElementById("review-name").value.trim();
  const rating = +document.getElementById("review-rating").value;
  const text = document.getElementById("review-text").value.trim();
  const err = document.getElementById("review-error");
  err.innerText = "";
  if(name.length < 2) {err.innerText="Name must be at least 2 characters.";return false;}
  if(text.length < 8) {err.innerText="Review must be at least 8 characters.";return false;}
  if(text.length > 300) {err.innerText="Keep your review under 300 characters.";return false;}
  const data = {
    name: name,
    rating: rating,
    text: text,
    date: (new Date()).toISOString().split("T")[0],
  };
  reviewsCol.add(data).then(()=> {
    document.getElementById("review-form").reset();
    err.innerText="Thank you for your review!";
    confetti();
    setTimeout(()=>{err.innerText="";},1700);
  });
  return false;
}
function fetchReviews() {
  reviewsCol.orderBy("date", "desc").limit(40).onSnapshot(qs=>{
    reviews = [];
    qs.forEach(doc => {
      reviews.push(doc.data());
    });
    renderReviews();
  });
}
fetchReviews();

// --- STATS (FIRESTORE) ---
let stats = {sold:32,customers:14};
function fetchStats() {
  statsDoc.onSnapshot(doc=>{
    const data = doc.data();
    if (data) {
      stats = data;
      renderStats();
    }
  });
}
function renderStats() {
  document.getElementById("stat-sold").innerText = stats.sold || 0;
  document.getElementById("stat-customers").innerText = stats.customers || 0;
  document.getElementById("stat-reviews").innerText = reviews.length || 0;
  if (!reviews.length) {
    document.getElementById("stat-rating").innerText = "0.00";
  } else {
    let avg = reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length;
    document.getElementById("stat-rating").innerText = avg.toFixed(2);
  }
}
fetchStats();

// --- NAVIGATION ---
let sectionOrder = ["home","products","reviews"];
function switchSection(name) {
  sectionOrder.forEach(id => {
    const sec = document.getElementById(id);
    if(id === name) {
      sec.style.display = "block";
      setTimeout(()=>sec.classList.add("visible"),20);
    } else {
      sec.classList.remove("visible");
      setTimeout(()=>sec.style.display = "none",420);
    }
    document.querySelectorAll('nav a').forEach(a => {
      a.classList.toggle("active", a.getAttribute('href') === "#" + name);
    });
  });
  document.getElementById(name).scrollIntoView({behavior:"smooth"});
}
window.onload = function() {
  sectionOrder.forEach(id => {
    const sec = document.getElementById(id);
    if (id === "home") {
      sec.style.display = "block";
      sec.classList.add("visible");
    } else {
      sec.style.display = "none";
      sec.classList.remove("visible");
    }
  });
  if(location.hash && ["#home","#products","#reviews"].includes(location.hash)){
    switchSection(location.hash.substring(1));
  } else {
    switchSection('home');
  }
  renderStats();
  window.addEventListener("scroll", handleTopBtn);
}
window.onhashchange = function() {
  if(location.hash && ["#home","#products","#reviews"].includes(location.hash)){
    switchSection(location.hash.substring(1));
  }
}
function scrollToSection(id){
  document.getElementById(id).scrollIntoView({behavior:"smooth"});
  switchSection(id);
}

// --- LINKS ---
const linksHTML = `
  <a class="section-link discord" href="https://discord.gg/sourmarket" target="_blank" rel="noopener">
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.369a19.791 19.791 0 0 0-4.885-1.515.07.07 0 0 0-.073.035c-.211.375-.445.864-.608 1.249a19.837 19.837 0 0 0-5.896 0c-.163-.385-.397-.874-.608-1.249a.07.07 0 0 0-.073-.035 19.736 19.736 0 0 0-4.885 1.515.064.064 0 0 0-.03.027C.533 7.157-.32 9.866.099 12.52c.003.021.019.045.038.058a19.936 19.936 0 0 0 5.993 3.058.07.07 0 0 0 .076-.027c.462-.635.875-1.306 1.226-2.01a.07.07 0 0 0-.038-.097 13.181 13.181 0 0 1-1.885-.915.07.07 0 0 1-.008-.116c.127-.096.253-.195.372-.291a.07.07 0 0 1 .073-.01c3.927 1.79 8.18 1.79 12.061 0a.07.07 0 0 1 .073.009c.12.097.245.195.372.291a.07.07 0 0 1-.008.116c-.597.348-1.236.663-1.885.915a.07.07 0 0 0-.038.097c.36.704.774 1.375 1.227 2.01a.07.07 0 0 0 .075.027 19.888 19.888 0 0 0 6.003-3.058.07.07 0 0 0 .037-.058c.5-3.202-.838-5.907-2.548-8.124a.061.061 0 0 0-.031-.027zM8.02 13.682c-1.183 0-2.157-1.085-2.157-2.419 0-1.334.955-2.418 2.157-2.418 1.213 0 2.177 1.094 2.157 2.418 0 1.334-.955 2.419-2.157 2.419zm7.974 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.334.955-2.418 2.157-2.418 1.213 0 2.177 1.094 2.157 2.418 0 1.334-.944 2.419-2.157 2.419z"/></svg>
    Discord
  </a>
  <a class="section-link paypal" href="https://www.paypal.me/RealEKitten69" target="_blank" rel="noopener">
    <svg viewBox="0 0 32 32" fill="currentColor"><path d="M26.422 6.808C25.33 4.601 23.011 3.053 20.059 3.053h-8.427c-.749 0-1.397.543-1.508 1.283L5.033 27.339c-.062.425.26.82.692.82h4.049l1.133-7.453v-.002c.023-.156.158-.272.316-.272h2.287c6.496 0 11.561-2.633 13.001-10.236.047-.254.031-.545-.088-.767zm-1.324 4.964c-1.104 5.942-6.011 8.058-12.172 8.058h-1.757c-.157 0-.293.116-.316.272l-1.106 7.271H6.463L9.929 5.337c.016-.106.107-.185.214-.185h8.42c2.222 0 4.242 1.15 5.259 3.078.111.223.134.493.08.748z"/></svg>
    PayPal
  </a>
`;
document.getElementById("links-home").innerHTML = linksHTML;
document.getElementById("links-products").innerHTML = linksHTML;
document.getElementById("links-reviews").innerHTML = linksHTML;

// --- FAQ ACCORDION ---
function toggleFaq(el){
  el.classList.toggle("active");
  let nxt = el.nextElementSibling;
  if(nxt && nxt.classList.contains("faq-a")) {
    if(nxt.style.display==="block"){nxt.style.display="none";}
    else {nxt.style.display="block";}
  }
  el.setAttribute('aria-expanded', el.classList.contains('active') ? 'true' : 'false');
}
document.querySelectorAll('.faq-q').forEach(el=>{
  el.onkeydown = e => {
    if(e.key === "Enter" || e.key === " "){ e.preventDefault(); toggleFaq(el);}
  }
});

// --- CONFETTI ---
function confetti() {
  const canvas = document.getElementById("confetti-canvas");
  canvas.style.display = "block";
  const ctx = canvas.getContext("2d");
  let W = window.innerWidth, H = window.innerHeight;
  canvas.width = W; canvas.height = H;
  let confs = [];
  for(let i=0;i<64;i++) confs.push({
    x:Math.random()*W, y:Math.random()*-H,
    r:8+Math.random()*12, d:4+Math.random()*4,
    color:`hsl(${Math.floor(330+Math.random()*80)},${80+Math.random()*18}%,${60+Math.random()*32}%)`,
    tilt:Math.random()*16, tiltAngle:Math.random()*360, tiltAngleInc:.09+Math.random()*.08
  });
  let frame = 0;
  function drawConfetti(){
    ctx.clearRect(0,0,W,H);
    confs.forEach(c=>{
      ctx.beginPath();
      ctx.lineWidth = c.d;
      ctx.strokeStyle = c.color;
      ctx.moveTo(c.x + c.tilt + Math.sin(frame/12)*4, c.y);
      ctx.lineTo(c.x + c.tilt, c.y + c.r);
      ctx.stroke();
    });
    updateConfetti();
    frame++;
    if(frame<85) requestAnimationFrame(drawConfetti);
    else canvas.style.display="none";
  }
  function updateConfetti(){
    for(let i=0;i<confs.length;i++){
      let c = confs[i];
      c.y += Math.cos(c.d) + 2 + c.d/2;
      c.tiltAngle += c.tiltAngleInc;
      c.tilt = Math.sin(c.tiltAngle-((i%3)*2))*10;
    }
  }
  drawConfetti();
}

// --- THEME TOGGLE ---
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
function setTheme(mode){
  if(mode==='dark'){document.body.classList.add('darkmode');themeIcon.textContent="☀️";}
  else{document.body.classList.remove('darkmode');themeIcon.textContent="🌙";}
  localStorage.setItem('sm_theme',mode);
}
themeToggle.onclick = function(){
  setTheme(document.body.classList.contains('darkmode')?'light':'dark');
};
if(localStorage.getItem('sm_theme')==='dark'){setTheme('dark');}

// --- TOP BUTTON ---
function handleTopBtn() {
  document.getElementById("top-btn").style.display = (window.scrollY > 240) ? "block" : "none";
}
