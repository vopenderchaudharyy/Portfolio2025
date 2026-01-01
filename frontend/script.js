// Custom scroll for #contact to avoid scrolling past footer
document.addEventListener('DOMContentLoaded', function() {
  function scrollToContactSection(e) {
    const href = this.getAttribute('href');
    if (href === '#contact') {
      e.preventDefault();
      const contact = document.getElementById('contact');
      const footer = document.querySelector('footer');
      if (contact && footer) {
        const contactRect = contact.getBoundingClientRect();
        const footerRect = footer.getBoundingClientRect();
        const scrollY = window.scrollY || window.pageYOffset;
        const contactTop = contactRect.top + scrollY;
        const footerTop = footerRect.top + scrollY;
        const windowHeight = window.innerHeight;
        // If scrolling to contact would push footer above the viewport, adjust
        let targetScroll = contactTop;
        if (contactTop + windowHeight > footerTop) {
          targetScroll = Math.max(footerTop - windowHeight + 40, contactTop); // 40px padding
        }
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
      }
    }
  }
  document.querySelectorAll('a[href="#contact"]').forEach(a => {
    a.addEventListener('click', scrollToContactSection);
  });
});
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

    function setButtonLabels(mode){
      const label = `Theme: ${mode[0].toUpperCase()+mode.slice(1)}`;
      if (themeBtn) themeBtn.textContent = label;
      if (themeBtnMobile) themeBtnMobile.textContent = label;
    }

    function applyThemeMode(mode){
      const m = (mode === 'light') ? 'light' : 'dark';
      localStorage.setItem('vv-theme', m);
      if (m === 'light'){
        rootEl.setAttribute('data-theme','light');
        currentParticleColors = particleColorsLight;
      } else {
        rootEl.removeAttribute('data-theme');
        currentParticleColors = particleColorsDark;
      }
      setButtonLabels(m);
    }

    // Initialize theme (default to dark if none)
    const storedTheme = localStorage.getItem('vv-theme');
    if (storedTheme === 'light' || storedTheme === 'dark'){
      applyThemeMode(storedTheme);
    } else {
      applyThemeMode('dark');
    }

    // Cycle through Light <-> Dark only
    const toggleThemeMode = () => {
      const mode = localStorage.getItem('vv-theme') || 'dark';
      const next = mode === 'light' ? 'dark' : 'light';
      applyThemeMode(next);
    };
    if (themeBtn){ themeBtn.addEventListener('click', toggleThemeMode); }
    if (themeBtnMobile){ themeBtnMobile.addEventListener('click', toggleThemeMode); }

    // Pricing Modes + Toggle (Single / Bundle / Trailer)
    const modeBtns = {
      single: document.getElementById('modeSingle'),
      bundle: document.getElementById('modeBundle'),
      trailer: document.getElementById('modeTrailer'),
      graphics: document.getElementById('modeGraphics')
    };
    const formToggleContainer = document.getElementById('formToggleContainer');
    const pricingRoot = document.getElementById('pricing');
    const toggleService = document.getElementById('serviceToggle');
    const singleLong = document.getElementById('videoPricing');
    const singleShort = document.getElementById('reelsPricing');
    const bundleLong = document.getElementById('bundleLongPricing');
    const bundleShort = document.getElementById('bundleReelsPricing');
    const trailerSec = document.getElementById('trailerPricing');
    const graphicsSec = document.getElementById('graphicsPricing');
    let pricingMode = 'single'; // 'single' | 'bundle' | 'trailer'
    let isShortForm = false; // false => Long Form, true => Short Form

    function setActiveModeBtn(){
      Object.values(modeBtns).forEach(btn => { if(btn){ btn.classList.remove('active'); btn.setAttribute('aria-selected','false'); } });
      const active = modeBtns[pricingMode];
      if (active){ active.classList.add('active'); active.setAttribute('aria-selected','true'); }
    }

    function show(el, on){ if(el){ el.style.display = on ? '' : 'none'; } }

    function updatePricingView(){
      // Toggle visibility container based on mode
      if (formToggleContainer){ formToggleContainer.style.display = (pricingMode === 'trailer' || pricingMode === 'graphics') ? 'none' : ''; }
      // Sections
      const longOn = !isShortForm;
      // Single
      show(singleLong, pricingMode === 'single' && longOn);
      show(singleShort, pricingMode === 'single' && !longOn);
      // Bundle
      show(bundleLong, pricingMode === 'bundle' && longOn);
      show(bundleShort, pricingMode === 'bundle' && !longOn);
      // Trailer
      show(trailerSec, pricingMode === 'trailer');
      // Graphics
      show(graphicsSec, pricingMode === 'graphics');
      // Root class for spacing tweaks
      if (pricingRoot){ pricingRoot.classList.toggle('trailer-mode', pricingMode === 'trailer'); }
    }

    // Initialize view
    setActiveModeBtn();
    updatePricingView();

    // Toggle click: switch between Long/Short
    if (toggleService){
      toggleService.addEventListener('click', () => {
        isShortForm = !isShortForm;
        toggleService.classList.toggle('active', isShortForm);
        updatePricingView();
      });
    }

    // Mode buttons handlers
    if (modeBtns.single){ modeBtns.single.addEventListener('click', () => { pricingMode = 'single'; setActiveModeBtn(); updatePricingView(); clearPlanSelection(); }); }
    if (modeBtns.bundle){ modeBtns.bundle.addEventListener('click', () => { pricingMode = 'bundle'; setActiveModeBtn(); updatePricingView(); clearPlanSelection(); }); }
    if (modeBtns.trailer){ modeBtns.trailer.addEventListener('click', () => { pricingMode = 'trailer'; setActiveModeBtn(); updatePricingView(); clearPlanSelection(); }); }
    if (modeBtns.graphics){ modeBtns.graphics.addEventListener('click', () => { pricingMode = 'graphics'; setActiveModeBtn(); updatePricingView(); clearPlanSelection(); }); }

    // Plan Selection
    const buyButtons = document.querySelectorAll('.buy');
    const selectedServiceDisplay = document.getElementById('selectedService');

    function currentModeLabel(){
      if (pricingMode === 'trailer') return 'Trailer';
      if (pricingMode === 'graphics') return 'Graphics';
      return (pricingMode === 'bundle' ? 'Bundle' : 'Single') + ' • ' + (isShortForm ? 'Short Form' : 'Long Form');
    }

    function clearPlanSelection(){
      document.querySelectorAll('.buy.selected').forEach(el => el.classList.remove('selected'));
      document.querySelectorAll('.price-card.selected').forEach(el => el.classList.remove('selected'));
      const formEl = document.getElementById('contactForm');
      if (formEl) formEl.removeAttribute('data-selected-plan');
      if (selectedServiceDisplay){
        selectedServiceDisplay.textContent = 'Select a plan to get started';
        selectedServiceDisplay.style.color = 'var(--accent)';
        selectedServiceDisplay.style.background = '';
      }
    }
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

          const serviceTypeNow = currentModeLabel();
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
  let serviceType = 'Long Form';
  try{
    if (typeof pricingMode !== 'undefined'){
      if (pricingMode === 'trailer'){
        serviceType = 'Trailer';
      } else {
        const modeLabel = (pricingMode === 'bundle' ? 'Bundle' : 'Single');
        const formLabel = (typeof isShortForm !== 'undefined' && isShortForm) ? 'Short Form' : 'Long Form';
        serviceType = modeLabel + ' • ' + formLabel;
      }
    } else {
      // Fallback to toggle-only if variables missing
      const isReelsMode = document.getElementById('serviceToggle').classList.contains('active');
      serviceType = isReelsMode ? 'Short Form' : 'Long Form';
    }
  }catch(e){ /* keep default */ }

  const msg = document.getElementById('formMsg');
  const submitBtn = this.querySelector('button[type="submit"]');
  const originalBtnHtml = submitBtn.innerHTML;
  const selectedServiceDiv = document.getElementById('selectedService');
  // Clear any attention animation on submit
  submitBtn.classList.remove('attention');

  // Helper: inline SVG icons for statuses (no emojis)
  const iconSvg = (kind) => {
    const common = 'width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" style="vertical-align:-2px;margin-right:6px"';
    switch(kind){
      case 'success':
        return `<svg ${common} fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/><circle cx="12" cy="12" r="10"/></svg>`;
      case 'warn':
        return `<svg ${common} fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`;
      case 'error':
        return `<svg ${common} fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M15 9 9 15"/><path d="M9 9l6 6"/></svg>`;
      default: // info
        return `<svg ${common} fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`;
    }
  };
  const setMsg = (kind, text, color) => {
    if (!msg) return;
    msg.innerHTML = `${iconSvg(kind)}${text}`;
    if (color) msg.style.color = color;
  };

  // Require plan selection before proceeding
  if(!this.getAttribute('data-selected-plan') || (this.getAttribute('data-selected-plan') || '').trim() === '' || (this.getAttribute('data-selected-plan') || '') === 'No plan selected'){
    setMsg('warn', 'Please select a package before submitting your inquiry.', '#ff6b6b');
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
    setMsg('error', 'Please fill in all required fields.', '#ff6b6b');
    return;
  }

  // Loading state
  setMsg('info', 'Sending your inquiry...', 'var(--muted)');
  submitBtn.disabled = true;
  submitBtn.style.opacity = '0.7';
  submitBtn.style.cursor = 'not-allowed';
  submitBtn.innerHTML = 'Sending...';
  // Disable all form fields to prevent duplicate submissions
  Array.from(this.elements).forEach(el => el.disabled = true);

  try {
    // const res = await fetch('https://portfolio2025-lac-delta.vercel.app/api/contact', {
    const res = await fetch('http://localhost:5000/api/contact', {
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
      setMsg('success', 'Inquiry sent successfully!', 'var(--accent)');
      this.reset();
      this.removeAttribute('data-selected-plan');
      document.getElementById('selectedService').textContent = 'Select a plan to get started';
      document.getElementById('selectedService').style.color = 'var(--accent)';
    } else {
      setMsg('error', 'Something went wrong. Please try again.', '#ff6b6b');
    }
  } catch (error) {
    console.error(error);
    setMsg('error', 'Server not reachable. Please try again later.', '#ff6b6b');
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

  const ham = document.getElementById('hamburgerBtn');
  const menu = document.getElementById('mobileMenu');
  const overlayEl = document.getElementById('mobileOverlay');
  const closeBtn = document.getElementById('mobileClose');
  const openMenu = () => { document.body.classList.add('menu-open'); if (ham) ham.setAttribute('aria-expanded','true'); };
  const closeMenu = () => { document.body.classList.remove('menu-open'); if (ham) ham.setAttribute('aria-expanded','false'); };
  if (ham) ham.addEventListener('click', () => { if (document.body.classList.contains('menu-open')) closeMenu(); else openMenu(); });
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (overlayEl) overlayEl.addEventListener('click', closeMenu);
  // Smooth scroll helper with sticky header offset so section titles are visible
  const getHeaderOffset = () => {
    const header = document.querySelector('header');
    const h = header ? header.getBoundingClientRect().height : 0;
    return Math.max(0, Math.round(h + 8)); // add small margin
  };
  const scrollToSection = (id) => {
    const target = document.getElementById((id || '').replace(/^#/, ''));
    if (!target) return false;
    const top = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
    window.scrollTo({ top, behavior: 'smooth' });
    return true;
  };
  // Intercept all in-page links to apply offset scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = (a.getAttribute('href') || '').trim();
      if (!href || href === '#') return; // ignore placeholders
      const target = document.getElementById(href.replace(/^#/, ''));
      if (!target) return;
      e.preventDefault();
      const mode = (a.getAttribute('data-scroll') || '').toLowerCase();
      if (mode === 'bottom'){
        const bottomTop = target.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
        window.scrollTo({ top: Math.max(0, bottomTop), behavior: 'smooth' });
      } else {
        scrollToSection(href);
      }
      if (document.body.classList.contains('menu-open')) closeMenu();
    });
  });
  if (menu) menu.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', () => { closeMenu(); });
  });
  if (menu){
    const stayBtn = menu.querySelector('[data-stay]');
    if (stayBtn){
      stayBtn.addEventListener('click', (ev) => { ev.preventDefault(); closeMenu(); });
    }
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  // Adjust initial hash on load (if user opened direct link)
  if (location.hash){ setTimeout(() => { scrollToSection(location.hash); }, 0); }

  // Region-Country Currency handling with search
  (function initRegionCountryCurrency(){
    const form = document.getElementById('contactForm');
    if (!form) return;
    const regionSelect = document.getElementById('regionSelect');
    const countryInput = document.getElementById('countryInput');
    const countryPanel = document.getElementById('countryPanel');
    const countryListV = document.getElementById('countryListV');
    const budgetInput = document.getElementById('budget');

    // Known currency meta for better formatting; fallback to API symbol
    const currencyMeta = {
      USD: { symbol: '$',  locale: 'en-US', maxFrac: 2 },
      INR: { symbol: '₹',  locale: 'en-IN', maxFrac: 0 },
      EUR: { symbol: '€',  locale: 'de-DE', maxFrac: 2 },
      GBP: { symbol: '£',  locale: 'en-GB', maxFrac: 2 },
      AED: { symbol: 'د.إ', locale: 'ar-AE', maxFrac: 2 },
      KWD: { symbol: 'د.ك', locale: 'ar-KW', maxFrac: 3 },
      JPY: { symbol: '¥', locale: 'ja-JP', maxFrac: 0 },
      CNY: { symbol: '¥', locale: 'zh-CN', maxFrac: 2 },
      AUD: { symbol: 'A$', locale: 'en-AU', maxFrac: 2 },
      CAD: { symbol: 'C$', locale: 'en-CA', maxFrac: 2 }
    };
    // Fallback INR-per-unit values (approx) so we always convert through INR
    // These are INR for 1 unit of that currency (e.g., 1 USD ≈ 87 INR; 1 EUR ≈ 102 INR)
    const defaultInrPer = { USD: 87, EUR: 120, GBP: 118, AED: 23.7, KWD: 285, JPY: 0.56, CNY: 12.0, AUD: 55, CAD: 65, INR: 1 };

    const state = { code: 'USD', symbol: '$', locale: 'en-US', maxFrac: 2, region: '', country: '', inrPer: { ...defaultInrPer } };
    let countriesCache = []; // [{name, currencyCode, currencySymbol}]

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
        const inrPerUSD = Number(state.inrPer?.USD || defaultInrPer.USD || 87);
        const priceINR = usd * inrPerUSD;
        let converted;
        if (state.code === 'INR'){
          converted = priceINR;
        } else {
          const inrPerTarget = Number(state.inrPer?.[state.code] || defaultInrPer[state.code] || 1);
          converted = priceINR / (inrPerTarget || 1);
        }
        el.textContent = state.symbol + fmt(converted);
      });
      // Convert Launch Offer amounts as well
      document.querySelectorAll('#pricing .offer .amount').forEach(el => {
        if (!el.dataset.usd){ el.dataset.usd = String(parseUSD(el.textContent)); }
        const usd = Number(el.dataset.usd || '0');
        const inrPerUSD = Number(state.inrPer?.USD || defaultInrPer.USD || 87);
        const priceINR = usd * inrPerUSD;
        let converted;
        if (state.code === 'INR'){
          converted = priceINR;
        } else {
          const inrPerTarget = Number(state.inrPer?.[state.code] || defaultInrPer[state.code] || 1);
          converted = priceINR / (inrPerTarget || 1);
        }
        el.textContent = state.symbol + fmt(converted);
      });
      // Convert Add-ons amounts as well
      document.querySelectorAll('#pricing .addons .amount').forEach(el => {
        if (!el.dataset.usd){ el.dataset.usd = String(parseUSD(el.textContent)); }
        const usd = Number(el.dataset.usd || '0');
        const inrPerUSD = Number(state.inrPer?.USD || defaultInrPer.USD || 87);
        const priceINR = usd * inrPerUSD;
        let converted;
        if (state.code === 'INR'){
          converted = priceINR;
        } else {
          const inrPerTarget = Number(state.inrPer?.[state.code] || defaultInrPer[state.code] || 1);
          converted = priceINR / (inrPerTarget || 1);
        }
        el.textContent = state.symbol + fmt(converted);
      });
      if (budgetInput){
        // Build placeholder using local_per_usd derived via INR: local_per_usd = INR_per_USD / INR_per_target
        const inrPerUSD = Number(state.inrPer?.USD || defaultInrPer.USD || 87);
        const inrPerTarget = Number(state.inrPer?.[state.code] || defaultInrPer[state.code] || 1);
        const localPerUSD = state.code === 'INR' ? inrPerUSD : (inrPerUSD / (inrPerTarget || 1));
        budgetInput.placeholder = `e.g. ${state.symbol}${fmt(2000 * localPerUSD)} - ${state.symbol}${fmt(5000 * localPerUSD)}`;
      }
      // Expose to form. For compatibility, set data-currency-rate as local_per_usd
      const inrPerUSD2 = Number(state.inrPer?.USD || defaultInrPer.USD || 87);
      const inrPerTarget2 = Number(state.inrPer?.[state.code] || defaultInrPer[state.code] || 1);
      const localPerUSD2 = state.code === 'INR' ? inrPerUSD2 : (inrPerUSD2 / (inrPerTarget2 || 1));
      form.setAttribute('data-currency-code', state.code);
      form.setAttribute('data-currency-rate', String(localPerUSD2));
      form.setAttribute('data-currency-region', state.region || '');
      form.setAttribute('data-country', state.country || '');
    }
    async function setCurrency(code, symbolFromApi){
      const meta = currencyMeta[code] || { symbol: symbolFromApi || '$', locale: 'en-US', maxFrac: 2 };
      state.code = code; state.symbol = meta.symbol || symbolFromApi || '$'; state.locale = meta.locale; state.maxFrac = meta.maxFrac;
      // Lock to fixed INR mappings only (no live API)
      state.inrPer = { ...defaultInrPer };
      renderPrices();
    }

    function populateCountries(list){
      countriesCache = list;
      if (countryListV){
        countryListV.innerHTML = '';
        list.forEach(c => {
          const li = document.createElement('li');
          li.setAttribute('role','option');
          li.dataset.currency = c.currencyCode || 'USD';
          if (c.currencySymbol) li.dataset.symbol = c.currencySymbol;
          if (c.cca2) li.dataset.cca2 = c.cca2;
          li.dataset.name = c.name || '';
          const cc = (c.cca2 || '').toLowerCase();
          const flag = cc ? `https://flagcdn.com/w20/${cc}.png` : '';
          li.innerHTML = flag
            ? `<span style="display:inline-flex;align-items:center;gap:8px"><img src="${flag}" width="20" height="14" alt="" loading="lazy" decoding="async" style="border-radius:2px;box-shadow:0 0 0 1px rgba(255,255,255,0.15)"/><span>${c.name}</span></span>`
            : `<span>${c.name}</span>`;
          li.addEventListener('click', () => {
            selectCountry(c.name, c.currencyCode, c.currencySymbol, c.cca2);
          });
          countryListV.appendChild(li);
        });
      }
      if (countryInput){ countryInput.disabled = list.length === 0; }
    }

    async function loadCountriesForRegion(region){
      if (!region){ populateCountries([]); return; }
      let url = '';
      if (region === 'Other'){
        url = 'https://restcountries.com/v3.1/all?fields=name,currencies,cca2,region,subregion';
      } else if (region === 'Middle East'){
        url = 'https://restcountries.com/v3.1/subregion/Western%20Asia?fields=name,currencies,cca2,region,subregion';
      } else {
        url = `https://restcountries.com/v3.1/region/${encodeURIComponent(region)}?fields=name,currencies,cca2,region,subregion`;
      }
      try{
        const r = await fetch(url, { mode: 'cors' });
        if (!r.ok) throw new Error('fetch failed');
        const data = await r.json();
        const list = [];
        (data || []).forEach(item => {
          try{
            const name = item?.name?.common || '';
            const currencies = item?.currencies || {};
            const codes = Object.keys(currencies);
            if (!name || !codes.length) return;
            const code = codes[0];
            const symbol = currencies[code]?.symbol || '';
            const cca2 = item?.cca2 || '';
            list.push({ name, currencyCode: code, currencySymbol: symbol, cca2 });
          }catch(e){ /* skip */ }
        });
        // sort by name
        list.sort((a,b)=> a.name.localeCompare(b.name));
        populateCountries(list);
      }catch(e){
        populateCountries([]);
      }
    }

    // Helper: show/hide panel
    let hasLazyLoadedAll = false;
    async function openCountryPanel(){
      if (!countryPanel) return;
      // Lazy-load all countries if no region chosen yet
      if (!countriesCache.length && !state.region && !hasLazyLoadedAll){
        hasLazyLoadedAll = true;
        await loadCountriesForRegion('Other');
      }
      countryPanel.hidden = false; countryPanel.classList.add('open');
      countryInput?.setAttribute('aria-expanded','true');
    }
    function closeCountryPanel(){
      if (!countryPanel) return; countryPanel.hidden = true; countryPanel.classList.remove('open'); countryInput?.setAttribute('aria-expanded','false');
      // clear active highlight
      countryListV && countryListV.querySelectorAll('[aria-selected="true"]').forEach(el=>el.removeAttribute('aria-selected'));
    }
    function filterCountryPanel(term){
      const t = (term||'').toLowerCase();
      if (!countryListV) return;
      const items = Array.from(countryListV.children);
      let any = false;
      items.forEach((li) => {
        const show = (li.textContent||'').toLowerCase().includes(t);
        li.hidden = !show;
        if (show) any = true;
      });
      // Simple empty state
      let empty = countryPanel && countryPanel.querySelector('.empty-state');
      if (!any){
        if (!empty){
          empty = document.createElement('div');
          empty.className = 'empty-state';
          empty.style.cssText = 'padding:10px 12px; color:var(--muted); font-size:13px;';
          empty.textContent = 'No results';
          countryPanel.appendChild(empty);
        }
      } else if (empty){ empty.remove(); }
    }
    function selectCountry(name, code, symbol, cca2){
      if (countryInput) countryInput.value = name;
      state.country = name;
      closeCountryPanel();
      setCurrency(code || 'USD', symbol || '');
      try{
        if (countryInput){
          if (cca2){
            const u = `https://flagcdn.com/w20/${String(cca2).toLowerCase()}.png`;
            countryInput.style.backgroundImage = `url(${u})`;
            countryInput.style.backgroundRepeat = 'no-repeat';
            countryInput.style.backgroundPosition = '8px center';
            countryInput.style.backgroundSize = '20px 14px';
            countryInput.style.paddingLeft = '36px';
          } else {
            countryInput.style.backgroundImage = '';
            countryInput.style.paddingLeft = '';
          }
        }
      }catch(e){ /* ignore */ }
    }

    // Events
    if (regionSelect){
      regionSelect.addEventListener('change', async () => {
        state.region = regionSelect.value || '';
        state.country = '';
        if (countryInput){
          countryInput.value = '';
          countryInput.style.backgroundImage = '';
          countryInput.style.paddingLeft = '';
        }
        await loadCountriesForRegion(state.region);
        // Optional: auto suggest common default for NA
        closeCountryPanel();
      });
    }
    if (countryInput){
      countryInput.addEventListener('focus', () => { openCountryPanel(); filterCountryPanel(countryInput.value); });
      countryInput.addEventListener('click', () => { openCountryPanel(); filterCountryPanel(countryInput.value); });
      countryInput.addEventListener('input', () => { openCountryPanel(); filterCountryPanel(countryInput.value); });
      countryInput.addEventListener('keydown', (e) => {
        if (!countryPanel || countryPanel.hidden) return;
        const items = Array.from(countryListV?.querySelectorAll('li:not([hidden])') || []);
        if (!items.length) return;
        const current = countryListV.querySelector('li[aria-selected="true"]');
        let idx = current ? items.indexOf(current) : -1;
        if (e.key === 'ArrowDown'){ e.preventDefault(); idx = Math.min(idx+1, items.length-1); items.forEach(li=>li.removeAttribute('aria-selected')); items[idx].setAttribute('aria-selected','true'); items[idx].scrollIntoView({ block:'nearest' }); }
        else if (e.key === 'ArrowUp'){ e.preventDefault(); idx = Math.max(idx-1, 0); items.forEach(li=>li.removeAttribute('aria-selected')); items[idx].setAttribute('aria-selected','true'); items[idx].scrollIntoView({ block:'nearest' }); }
        else if (e.key === 'Enter'){ e.preventDefault(); const pick = current || items[0]; if (pick){ selectCountry(pick.dataset.name || (pick.textContent || ''), pick.dataset.currency, pick.dataset.symbol, pick.dataset.cca2); } }
        else if (e.key === 'Escape'){ closeCountryPanel(); }
      });
    }
    // Click outside to close
    document.addEventListener('click', (e) => {
      if (!countryPanel) return;
      const combo = document.getElementById('countryCombo');
      if (!combo) return;
      if (!combo.contains(e.target)) closeCountryPanel();
    });

    // Initialize with default USD
    renderPrices();
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

  const ytIframes = document.querySelectorAll('.proj iframe, .reel iframe');
  ytIframes.forEach((ifr) => {
    try{
      const u = new URL(ifr.src, window.location.origin);
      if (u.hostname.includes('youtube.com')){
        u.hostname = 'www.youtube-nocookie.com';
      }
      u.searchParams.set('modestbranding','1');
      u.searchParams.set('rel','0');
      u.searchParams.set('iv_load_policy','3');
      u.searchParams.set('playsinline','1');
      u.searchParams.set('fs','1');
      u.searchParams.set('disablekb','1');
      u.searchParams.set('controls','1');
      u.searchParams.set('enablejsapi','1');
      u.searchParams.delete('si');
      ifr.src = u.toString();
      if (!ifr.allow) ifr.setAttribute('allow','accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen');
    }catch(e){ /* ignore invalid URL */ }
  });

  function subscribeIframe(ifr){
    const send = () => {
      try{
        if (!ifr.contentWindow) return;
        ifr.contentWindow.postMessage(JSON.stringify({ event: 'listening' }), '*');
        ifr.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'addEventListener', args: ['onStateChange'] }), '*');
      }catch(e){ /* ignore */ }
    };
    // Attempt immediately and on load
    send();
    ifr.addEventListener('load', send);
  }

  ytIframes.forEach(subscribeIframe);

  window.addEventListener('message', (e) => {
    let data;
    try { data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data; } catch { return; }
    if (!data || data.event !== 'onStateChange') return;
    if (data.info === 1) {
      ytIframes.forEach((ifr) => {
        try{
          if (ifr.contentWindow && ifr.contentWindow !== e.source){
            ifr.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
          }
        }catch(err){ /* ignore */ }
      });
    }
  });
  document.querySelectorAll('.reel iframe').forEach((ifr) => {
    try{
      const u = new URL(ifr.src, window.location.origin);
      if (u.hostname.includes('youtube-nocookie.com')){
        u.hostname = 'www.youtube.com';
      }
      u.searchParams.set('modestbranding','1');
      u.searchParams.set('rel','0');
      u.searchParams.set('iv_load_policy','3');
      u.searchParams.set('playsinline','1');
      u.searchParams.set('fs','1');
      u.searchParams.set('disablekb','1');
      u.searchParams.set('controls','1');
      u.searchParams.delete('si');
      ifr.src = u.toString();
      if (!ifr.allow) ifr.setAttribute('allow','accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen');
    }catch(e){ /* ignore invalid URL */ }
  });

  // Disable top-right in-player share/copy link by intercepting clicks in that area
  document.querySelectorAll('.proj, .reel').forEach((card) => {
    const blocker = document.createElement('div');
    blocker.style.cssText = 'position:absolute;top:0;right:0;width:72px;height:56px;z-index:4;pointer-events:auto;background:transparent;';
    blocker.setAttribute('aria-hidden','true');
    card.appendChild(blocker);
  });

  document.querySelectorAll('.reel').forEach((card) => {
    const iframe = card.querySelector('iframe');
    if (!iframe) return;
    try{
      const u = new URL(iframe.src, window.location.origin);
      const match = u.pathname.match(/\/embed\/([\w-]+)/);
      if (!match) return;
      const vid = match[1];

      const overlay = document.createElement('div');
      overlay.className = 'reel-thumb-overlay';
      overlay.style.cssText = 'position:absolute;inset:0;background:#000 center/cover no-repeat;cursor:pointer;z-index:2;';
      overlay.style.backgroundImage = `url(https://i.ytimg.com/vi/${vid}/hqdefault.jpg)`;

      const play = document.createElement('div');
      play.style.cssText = 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,0.92);box-shadow:0 8px 24px rgba(0,0,0,0.25);';
      const tri = document.createElement('div');
      tri.style.cssText = 'position:absolute;left:50%;top:50%;transform:translate(-35%,-50%);width:0;height:0;border-left:18px solid #000;border-top:12px solid transparent;border-bottom:12px solid transparent;';
      play.appendChild(tri);
      overlay.appendChild(play);

      iframe.style.visibility = 'hidden';
      card.appendChild(overlay);

      overlay.addEventListener('click', () => {
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
