// Scroll Progress Bar
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    document.body.appendChild(scrollProgress);

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      scrollProgress.style.width = scrollPercent + '%';
    });

  // Scroll reveal animations
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced && 'IntersectionObserver' in window){
    const io = new IntersectionObserver((entries) => {
      for (const e of entries){
        if (e.isIntersecting){
          e.target.classList.add('in');
          io.unobserve(e.target);
        }

  // Sync portrait pop with service card hover/focus
  const portrait = document.querySelector('.hero-portrait');
  const serviceCards = document.querySelectorAll('#services .service');
  if (portrait && serviceCards.length){
    const add = () => portrait.classList.add('pop');
    const remove = () => portrait.classList.remove('pop');
    serviceCards.forEach(card => {
      card.addEventListener('mouseenter', add);
      card.addEventListener('mouseleave', remove);
      card.addEventListener('focusin', add);
      card.addEventListener('focusout', remove);
    });
  }
      }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });

    document.querySelectorAll('.reveal, .reveal-up').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.reveal, .reveal-up').forEach(el => el.classList.add('in'));
  }

    // Add background div
    const heroBg = document.createElement('div');
    heroBg.className = 'hero-bg';
    document.body.appendChild(heroBg);

    // Simple Particle Spreading Cursor Effect
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    // Theme-aware particle palettes
    const particleColorsDark = ['#4CBB17', '#5FD35F', '#7FDD7F', '#32CD32', '#00FF00'];
    const particleColorsLight = ['#FE7743', '#FF956F', '#FFB199', '#F86F3E', '#E85D2B'];
    let currentParticleColors = particleColorsDark;

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 10;
        this.vy = (Math.random() - 0.5) * 10;
        this.life = 1;
        this.decay = Math.random() * 0.025 + 0.015;
        this.size = Math.random() * 4 + 2;
        this.color = currentParticleColors[Math.floor(Math.random() * currentParticleColors.length)];
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.15;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
        this.rotation += this.rotationSpeed;
        this.vx *= 0.94;
        this.vy *= 0.94;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        const points = 5;
        const outer = this.size;
        const inner = this.size * 0.4;
        ctx.beginPath();
        for (let i = 0; i < points * 2; i++) {
          const radius = i % 2 === 0 ? outer : inner;
          const angle = (i / (points * 2)) * Math.PI * 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    function createWave(x, y) {
      for (let i = 0; i < 12; i++) {
        particles.push(new Particle(x, y));
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].life <= 0) {
          particles.splice(i, 1);
        }
      }

      requestAnimationFrame(animate);
    }

    document.addEventListener('mousemove', (e) => {
      if (Math.random() > 0.7) {
        createWave(e.clientX, e.clientY);
      }
    });

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    animate();

    // Removed cursor glow effect; keep particles only

    // Theme toggle: light/dark
    const rootEl = document.documentElement;
    const themeBtn = document.getElementById('themeToggle');
    const themeBtnMobile = document.getElementById('themeToggleMobile');
    let systemMql = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;

    function setButtonLabels(mode){
      const label = `Theme: ${mode[0].toUpperCase()+mode.slice(1)}`;
      if (themeBtn) themeBtn.textContent = label;
      if (themeBtnMobile) themeBtnMobile.textContent = label;
    }

    function applyThemeMode(mode){
      // Save mode
      localStorage.setItem('vv-theme', mode);
      // Clean previous listener
      if (systemMql) systemMql.removeEventListener && systemMql.removeEventListener('change', onSystemChange);

      if (mode === 'auto'){
        const isLight = systemMql ? systemMql.matches : false;
        if (isLight){
          rootEl.setAttribute('data-theme','light');
          currentParticleColors = particleColorsLight;
        } else {
          rootEl.removeAttribute('data-theme');
          currentParticleColors = particleColorsDark;
        }
        // Reapply when system changes
        if (systemMql) systemMql.addEventListener && systemMql.addEventListener('change', onSystemChange);
      } else if (mode === 'light'){
        rootEl.setAttribute('data-theme','light');
        currentParticleColors = particleColorsLight;
      } else { // dark
        rootEl.removeAttribute('data-theme');
        currentParticleColors = particleColorsDark;
      }
      setButtonLabels(mode);
    }

    function onSystemChange(){
      const mode = localStorage.getItem('vv-theme') || 'auto';
      if (mode === 'auto') applyThemeMode('auto');
    }

    // Initialize theme (default to auto if none)
    const storedTheme = localStorage.getItem('vv-theme');
    if (storedTheme){
      applyThemeMode(storedTheme);
    } else {
      applyThemeMode('auto');
    }

    // Cycle through Light -> Dark -> Auto
    const toggleThemeMode = () => {
      const mode = localStorage.getItem('vv-theme') || 'auto';
      const next = mode === 'light' ? 'dark' : (mode === 'dark' ? 'auto' : 'light');
      applyThemeMode(next);
    };
    if (themeBtn){ themeBtn.addEventListener('click', toggleThemeMode); }
    if (themeBtnMobile){ themeBtnMobile.addEventListener('click', toggleThemeMode); }

    // Toggle Switch Functionality
    const toggleService = document.getElementById('serviceToggle');
    const videoPricing = document.getElementById('videoPricing');
    const reelsPricing = document.getElementById('reelsPricing');
    let isReelsMode = false;
    if (toggleService){
      toggleService.addEventListener('click', () => {
        isReelsMode = !isReelsMode;
        if (isReelsMode){
          if (videoPricing) videoPricing.style.display = 'none';
          if (reelsPricing) reelsPricing.style.display = '';
        } else {
          if (videoPricing) videoPricing.style.display = '';
          if (reelsPricing) reelsPricing.style.display = 'none';
        }
        toggleService.classList.toggle('active');
      });
    }

    // Plan Selection
    const buyButtons = document.querySelectorAll('.buy');
    const selectedServiceDisplay = document.getElementById('selectedService');
    buyButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const plan = btn.getAttribute('data-plan');
        if (plan) {
          // Clear previous selected visuals
          document.querySelectorAll('.buy.selected').forEach(el => el.classList.remove('selected'));
          document.querySelectorAll('.price-card.selected').forEach(el => el.classList.remove('selected'));
          // Reset all button labels
          document.querySelectorAll('.buy[data-plan]').forEach(el => {
            el.textContent = 'Choose Plan';
            el.setAttribute('aria-pressed', 'false');
          });

          // Set selected visuals on current button and its card
          btn.classList.add('selected');
          const card = btn.closest('.price-card');
          if (card) card.classList.add('selected');
          btn.textContent = 'Chosen';
          btn.setAttribute('aria-pressed', 'true');

          const isReelsModeNow = document.getElementById('serviceToggle').classList.contains('active');
          const serviceTypeNow = isReelsModeNow ? 'Short Form' : 'Long Form';
          const formEl = document.getElementById('contactForm');
          const curCode = formEl ? (formEl.getAttribute('data-currency-code') || 'USD') : 'USD';
          selectedServiceDisplay.textContent = '✓ ' + serviceTypeNow + ': ' + plan + ' - Selected (' + curCode + ')';
          selectedServiceDisplay.style.color = 'var(--accent)';
          selectedServiceDisplay.style.background = 'rgba(76,187,23,0.15)';
          
          // Store selected plan
          document.getElementById('contactForm').setAttribute('data-selected-plan', plan);
          
          // Scroll to form
          document.getElementById('contactForm').scrollIntoView({ behavior: 'smooth' });

          // Remove any pricing highlight pulse once a plan is selected
          const pricingSection = document.getElementById('pricing');
          if (pricingSection){
            pricingSection.classList.remove('highlight-pulse');
          }

          // Add attention animation to the submit button to guide the next action
          const submitEl = document.querySelector('#contactForm button[type="submit"]');
          if (submitEl){
            const removeAttention = () => submitEl.classList.remove('attention');
            submitEl.classList.add('attention');
            // Remove on user interaction
            submitEl.addEventListener('click', removeAttention, { once: true });
            document.getElementById('contactForm').addEventListener('input', removeAttention, { once: true });
            // Auto-remove after 8 seconds as fallback
            setTimeout(removeAttention, 8000);
          }
        }
      });
    });

    // Form handler
  document.getElementById('contactForm').addEventListener('submit', async function(e){
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const project = document.getElementById('project').value.trim();
  const budget = document.getElementById('budget').value.trim();
  const currencyCode = this.getAttribute('data-currency-code') || 'USD';
  const currencyRate = Number(this.getAttribute('data-currency-rate') || '1');
  const currencyRegion = this.getAttribute('data-currency-region') || '';

  // ✅ Get selected plan and current mode
  const selectedPlan = this.getAttribute('data-selected-plan') || 'No plan selected';
  const isReelsMode = document.getElementById('serviceToggle').classList.contains('active');
  const serviceType = isReelsMode ? 'Short Form' : 'Long Form';

  const msg = document.getElementById('formMsg');
  const submitBtn = this.querySelector('button[type="submit"]');
  const originalBtnHtml = submitBtn.innerHTML;
  const selectedServiceDiv = document.getElementById('selectedService');
  // Clear any attention animation on submit
  submitBtn.classList.remove('attention');

  // Require plan selection before proceeding
  if(!this.getAttribute('data-selected-plan') || (this.getAttribute('data-selected-plan') || '').trim() === '' || (this.getAttribute('data-selected-plan') || '') === 'No plan selected'){
    msg.textContent = '⚠️ Please select a package before submitting your inquiry.';
    msg.style.color = '#ff6b6b';
    if (selectedServiceDiv){
      selectedServiceDiv.textContent = 'Please select a package first';
      selectedServiceDiv.style.color = '#ff6b6b';
      selectedServiceDiv.style.background = 'rgba(255,107,107,0.12)';
      selectedServiceDiv.style.borderColor = 'rgba(255,107,107,0.35)';
    }

    const pricingSection = document.getElementById('pricing');
    if (pricingSection){
      pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      pricingSection.classList.add('highlight-pulse');
    }
    return;
  }

  if(!name || !email || !project){
    msg.textContent = '❌ Please fill in all required fields.';
    msg.style.color = '#ff6b6b';
    return;
  }

  // Loading state
  msg.textContent = '⏳ Sending your inquiry...';
  msg.style.color = 'var(--muted)';
  submitBtn.disabled = true;
  submitBtn.style.opacity = '0.7';
  submitBtn.style.cursor = 'not-allowed';
  submitBtn.innerHTML = 'Sending...';
  // Disable all form fields to prevent duplicate submissions
  Array.from(this.elements).forEach(el => el.disabled = true);

  try {
    const res = await fetch('https://portfolio2025-lac-delta.vercel.app/api/contact', {
    // const res = await fetch('http://localhost:5000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        phone,
        project,
        budget,
        selectedPlan,
        serviceType,   // ✅ add this new field
        currencyCode,
        currencyRate,
        currencyRegion
      })
    });

    const data = await res.json();

    if (data.success) {
      msg.textContent = '✅ Inquiry sent successfully!';
      msg.style.color = 'var(--accent)';
      this.reset();
      this.removeAttribute('data-selected-plan');
      document.getElementById('selectedService').textContent = 'Select a plan to get started';
      document.getElementById('selectedService').style.color = 'var(--accent)';
    } else {
      msg.textContent = '❌ Something went wrong. Please try again.';
      msg.style.color = '#ff6b6b';
    }
  } catch (error) {
    console.error(error);
    msg.textContent = '❌ Server not reachable. Please try again later.';
    msg.style.color = '#ff6b6b';
  } finally {
    // Restore form state
    Array.from(this.elements).forEach(el => el.disabled = false);
    submitBtn.disabled = false;
    submitBtn.style.opacity = '';
    submitBtn.style.cursor = '';
    submitBtn.innerHTML = originalBtnHtml;
  }
});

// Load projects from backend
async function loadProjects() {
  const res = await fetch('/api/projects');
  const projects = await res.json();

  const container = document.getElementById('projects');
  container.innerHTML = '';

  projects.forEach(p => {
    const div = document.createElement('div');
    div.classList.add('project');
    div.innerHTML = `<h3>${p.title}</h3><p>${p.description}</p>`;
    container.appendChild(div);
  });
}

// Send contact form
async function submitContact(e) {
  e.preventDefault();
  const name = document.getElementById('contact-name').value;
  const email = document.getElementById('contact-email').value;
  const message = document.getElementById('contact-message').value;

  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message })
  });

  if (res.ok) {
    alert('Message sent successfully!');
    document.getElementById('contact-form').reset();
  } else {
    alert('Something went wrong.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Only load projects if container exists
  if (document.getElementById('projects')) {
    loadProjects();
  }
  // Attach legacy contact-form handler only if element exists
  const legacyForm = document.getElementById('contact-form');
  if (legacyForm) {
    legacyForm.addEventListener('submit', submitContact);
  }

  // Currency handling: update prices and form metadata when user selects a currency
  (function initCurrency(){
    const currencySelect = document.getElementById('currencySelect');
    const form = document.getElementById('contactForm');
    if (!form) return;
    const budgetInput = document.getElementById('budget');

    // Currency meta and fallback rates vs USD
    const currencyMeta = {
      USD: { symbol: '$',  locale: 'en-US', maxFrac: 2 },
      INR: { symbol: '₹',  locale: 'en-IN', maxFrac: 0 },
      EUR: { symbol: '€',  locale: 'de-DE', maxFrac: 2 },
      GBP: { symbol: '£',  locale: 'en-GB', maxFrac: 2 },
      AED: { symbol: 'د.إ', locale: 'ar-AE', maxFrac: 2 },
      KWD: { symbol: 'د.ك', locale: 'ar-KW', maxFrac: 3 }
    };
    const defaultRates = { USD: 1, INR: 87, EUR: 0.92, GBP: 0.78, AED: 3.67, KWD: 0.31 };

    const state = { code: 'USD', symbol: '$', locale: 'en-US', maxFrac: 2, rate: 1 };

    function parseUSD(v){
      const n = Number(String(v).replace(/[^0-9.]/g,'') || '0');
      return isFinite(n) ? n : 0;
    }
    function fmt(n){
      try{ return new Intl.NumberFormat(state.locale, { maximumFractionDigits: state.maxFrac }).format(n); }
      catch(e){ return Math.round(n).toString(); }
    }
    function renderPrices(){
      document.querySelectorAll('#pricing .price').forEach(el => {
        if (!el.dataset.usd){ el.dataset.usd = String(parseUSD(el.textContent)); }
        const usd = Number(el.dataset.usd || '0');
        const converted = usd * state.rate;
        el.textContent = state.symbol + fmt(converted);
      });
      if (budgetInput){
        budgetInput.placeholder = `e.g. ${state.symbol}${fmt(2000)} - ${state.symbol}${fmt(5000)}`;
      }
      // Expose to form for email backend
      form.setAttribute('data-currency-code', state.code);
      form.setAttribute('data-currency-rate', String(state.rate));
      if (currencySelect){
        const opt = currencySelect.options[currencySelect.selectedIndex];
        const region = opt ? (opt.getAttribute('data-region') || '') : '';
        form.setAttribute('data-currency-region', region);
      }
    }
    async function setCurrency(code){
      const meta = currencyMeta[code] || currencyMeta.USD;
      state.code = code; state.symbol = meta.symbol; state.locale = meta.locale; state.maxFrac = meta.maxFrac;
      // use fallback rate immediately
      state.rate = defaultRates[code] ?? 1;
      renderPrices();
      // refine using live rate; ignore errors
      if (code === 'USD') return;
      try{
        const r = await fetch(`https://api.exchangerate.host/latest?base=USD&symbols=${encodeURIComponent(code)}`, { mode: 'cors' });
        if (r.ok){
          const d = await r.json();
          const live = d && d.rates && d.rates[code];
          if (typeof live === 'number' && Math.abs(live - state.rate) > 1e-6){
            state.rate = live; renderPrices();
          }
        }
      }catch(e){ /* keep fallback */ }
    }

    if (currencySelect){
      setCurrency(currencySelect.value);
      currencySelect.addEventListener('change', () => setCurrency(currencySelect.value));
    } else {
      renderPrices();
    }
  })();

  // Generic carousel nav (reels, reviews)
  function attachCarousel(rootSelector, itemSelector, trackSelector, prevSel, nextSel){
    const root = document.querySelector(rootSelector);
    if (!root) return;
    const track = root.querySelector(trackSelector);
    const prev = root.querySelector(prevSel);
    const next = root.querySelector(nextSel);
    if (!track) return;
    const getStep = () => {
      const item = track.querySelector(itemSelector);
      return item ? item.getBoundingClientRect().width + 16 : 300; // include gap
    };
    const scrollByStep = (dir) => {
      track.scrollBy({ left: dir * getStep(), behavior: 'smooth' });
      showNav();
    };

    // Mobile-friendly fading of nav: show on interaction, hide after idle
    let fadeTimer;
    const showNav = () => {
      if (prev) prev.classList.add('active');
      if (next) next.classList.add('active');
      clearTimeout(fadeTimer);
      fadeTimer = setTimeout(() => {
        if (prev) prev.classList.remove('active');
        if (next) next.classList.remove('active');
      }, 900);
    };

    const onInteract = () => showNav();
    ['scroll','wheel','touchstart','pointerdown','mousemove'].forEach(ev => {
      track.addEventListener(ev, onInteract, { passive: true });
    });

    if (prev) prev.addEventListener('click', () => scrollByStep(-1));
    if (next) next.addEventListener('click', () => scrollByStep(1));
  }
  attachCarousel('.reels-carousel', '.reel', '.reels-track', '.reels-nav.prev', '.reels-nav.next');
  attachCarousel('.reviews-carousel', '.review', '.reviews-track', '.reels-nav.prev', '.reels-nav.next');

  // Sanitize YouTube embeds while keeping native playback
  // Portfolio: use nocookie for maximum privacy
  document.querySelectorAll('.proj iframe').forEach((ifr) => {
    try{
      const u = new URL(ifr.src, window.location.origin);
      if (u.hostname.includes('youtube.com')){
        u.hostname = 'www.youtube-nocookie.com';
      }
      u.searchParams.set('modestbranding','1');
      u.searchParams.set('rel','0');
      u.searchParams.set('iv_load_policy','3');
      u.searchParams.set('playsinline','1');
      u.searchParams.set('fs','0');
      u.searchParams.set('disablekb','1');
      u.searchParams.set('controls','1');
      u.searchParams.delete('si');
      ifr.src = u.toString();
      if (!ifr.allow) ifr.setAttribute('allow','accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
    }catch(e){ /* ignore invalid URL */ }
  });
  // Reels: keep regular youtube.com for best compatibility (Shorts sometimes block nocookie)
  document.querySelectorAll('.reel iframe').forEach((ifr) => {
    try{
      const u = new URL(ifr.src, window.location.origin);
      // force standard youtube host for compatibility
      if (u.hostname.includes('youtube-nocookie.com')){
        u.hostname = 'www.youtube.com';
      }
      // ensure path is /embed/VIDEO_ID (not /shorts)
      // If already /embed/..., leave it.
      // Branding/controls
      u.searchParams.set('modestbranding','1');
      u.searchParams.set('rel','0');
      u.searchParams.set('iv_load_policy','3');
      u.searchParams.set('playsinline','1');
      u.searchParams.set('fs','0');
      u.searchParams.set('disablekb','1');
      u.searchParams.set('controls','1');
      u.searchParams.delete('si');
      ifr.src = u.toString();
      if (!ifr.allow) ifr.setAttribute('allow','accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
    }catch(e){ /* ignore invalid URL */ }
  });

  // Thumbnail overlay fallback for reels (ensures a visible preview even if embed is restricted)
  document.querySelectorAll('.reel').forEach((card) => {
    const iframe = card.querySelector('iframe');
    if (!iframe) return;
    try{
      const u = new URL(iframe.src, window.location.origin);
      const match = u.pathname.match(/\/embed\/([\w-]+)/);
      if (!match) return;
      const vid = match[1];

      // Build overlay with thumbnail background
      const overlay = document.createElement('div');
      overlay.className = 'reel-thumb-overlay';
      overlay.style.cssText = 'position:absolute;inset:0;background:#000 center/cover no-repeat;cursor:pointer;z-index:2;';
      overlay.style.backgroundImage = `url(https://i.ytimg.com/vi/${vid}/hqdefault.jpg)`;

      // Minimal play badge
      const play = document.createElement('div');
      play.style.cssText = 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,0.92);box-shadow:0 8px 24px rgba(0,0,0,0.25);';
      // triangle
      const tri = document.createElement('div');
      tri.style.cssText = 'position:absolute;left:50%;top:50%;transform:translate(-35%,-50%);width:0;height:0;border-left:18px solid #000;border-top:12px solid transparent;border-bottom:12px solid transparent;';
      play.appendChild(tri);
      overlay.appendChild(play);

      // Hide iframe until user interacts
      iframe.style.visibility = 'hidden';
      card.appendChild(overlay);

      overlay.addEventListener('click', () => {
        // reveal iframe and autoplay
        overlay.remove();
        iframe.style.visibility = '';
        try{
          const iu = new URL(iframe.src, window.location.origin);
          iu.searchParams.set('autoplay','1');
          iframe.src = iu.toString();
        }catch(e){ /* ignore */ }
      });
    }catch(e){ /* ignore invalid URL */ }
  });

  // If there are 4 or fewer reels, switch layout to a full-width grid fit
  const reelsCarousel = document.querySelector('.reels-carousel');
  const reelsTrack = document.querySelector('.reels-track');
  if (reelsTrack){
    const items = reelsTrack.querySelectorAll('.reel');
    if (items.length <= 4){
      reelsTrack.classList.add('fit');
      if (reelsCarousel) reelsCarousel.classList.add('fit');
    }
  }

  // Count-up animation for stats when visible
  const counters = document.querySelectorAll('.stat h3[data-target]');
  if (counters.length){
    const animate = (el) => {
      const target = Number(el.getAttribute('data-target') || '0');
      const suffix = el.getAttribute('data-suffix') || '';
      const start = 0; const duration = 1200; let startTs;
      const tick = (ts) => {
        if (!startTs) startTs = ts;
        const p = Math.min((ts - startTs) / duration, 1);
        const val = Math.round(start + (target - start) * p);
        el.textContent = String(val) + (suffix || '');
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const io = ('IntersectionObserver' in window) ? new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting){
          const el = e.target; io.unobserve(el); animate(el);
        }
      });
    }, { threshold: 0.4 }) : null;
    counters.forEach(el => { if (io) io.observe(el); else animate(el); });
  }

  // Showcase Reel button: blink until user clicks
  const showcaseBtn = document.getElementById('showcaseBtn');
  if (showcaseBtn){
    showcaseBtn.classList.add('blink');
    const stopBlink = () => showcaseBtn.classList.remove('blink');
    showcaseBtn.addEventListener('click', stopBlink, { once: true });
    showcaseBtn.addEventListener('pointerdown', stopBlink, { once: true });
    showcaseBtn.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' ') stopBlink(); }, { once: true });
  }

  // Portrait pop only when hovering Cinematic/Advanced services
  (() => {
    const portrait = document.querySelector('.hero-portrait');
    if (!portrait) return;
    const titles = Array.from(document.querySelectorAll('#services .service h4'));
    const targetCards = titles
      .filter(h4 => /cinematic|advanced/i.test(h4.textContent || ''))
      .map(h4 => h4.closest('.service'))
      .filter(Boolean);
    if (!targetCards.length) return;
    const add = () => portrait.classList.add('pop');
    const remove = () => portrait.classList.remove('pop');
    targetCards.forEach(card => {
      card.addEventListener('mouseenter', add);
      card.addEventListener('mouseleave', remove);
      card.addEventListener('focusin', add);
      card.addEventListener('focusout', remove);
    });
  })();

  // Back-to-top FAB show/hide when near bottom/contact
  (() => {
    const fab = document.getElementById('backTopFab');
    if (!fab) return;
    const contact = document.getElementById('contact');
    const show = () => fab.classList.add('show');
    const hide = () => fab.classList.remove('show');
    const check = () => {
      const y = window.scrollY || window.pageYOffset;
      const h = window.innerHeight;
      if (contact){
        const top = contact.getBoundingClientRect().top + y;
        if (y + h * 0.5 >= top) show(); else hide();
      } else {
        // fallback: show after 600px scroll
        if (y > 600) show(); else hide();
      }
    };
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    check();
  })();
});
