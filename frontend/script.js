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
    canvas.style.zIndex = '1';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 10;
        this.vy = (Math.random() - 0.5) * 10;
        this.life = 1;
        this.decay = Math.random() * 0.025 + 0.015;
        this.size = Math.random() * 4 + 2;
        this.colors = ['#4CBB17', '#5FD35F', '#7FDD7F', '#32CD32', '#00FF00'];
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
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

    // Glow effect following cursor
    const glow = document.createElement('div');
    glow.style.position = 'fixed';
    glow.style.width = '200px';
    glow.style.height = '200px';
    glow.style.borderRadius = '50%';
    glow.style.background = 'radial-gradient(circle, rgba(76,187,23,0.4) 0%, rgba(76,187,23,0.15) 40%, transparent 70%)';
    glow.style.pointerEvents = 'none';
    glow.style.zIndex = '0';
    glow.style.filter = 'blur(40px)';
    glow.style.opacity = '0.6';
    document.body.appendChild(glow);

    let glowX = 0;
    let glowY = 0;

    document.addEventListener('mousemove', (e) => {
      glowX += (e.clientX - glowX) * 0.1;
      glowY += (e.clientY - glowY) * 0.1;
      glow.style.left = (glowX - 100) + 'px';
      glow.style.top = (glowY - 100) + 'px';
    });

    // Toggle Switch Functionality
    const toggle = document.getElementById('serviceToggle');
    const videoPricing = document.getElementById('videoPricing');
    const reelsPricing = document.getElementById('reelsPricing');
    let isReelsMode = false;

    toggle.addEventListener('click', () => {
      isReelsMode = !isReelsMode;
      toggle.classList.toggle('active');
      
      if (isReelsMode) {
        videoPricing.style.display = 'none';
        reelsPricing.style.display = 'block';
      } else {
        videoPricing.style.display = 'block';
        reelsPricing.style.display = 'none';
      }
    });

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
          selectedServiceDisplay.textContent = '✓ ' + serviceTypeNow + ': ' + plan + ' - Selected';
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
        serviceType   // ✅ add this new field
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
  loadProjects();
  document.getElementById('contact-form').addEventListener('submit', submitContact);
});
