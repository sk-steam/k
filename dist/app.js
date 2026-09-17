(() => {
  'use strict';
  const root = document.documentElement;
  const motionButton = document.querySelector('.motion-toggle');
  const motionLabel = document.querySelector('.motion-label');
  const mediaQuery = matchMedia('(prefers-reduced-motion: reduce)');
  let savedMotion = null;
  try { savedMotion = localStorage.getItem('kyki-motion'); } catch {}
  let paused = mediaQuery.matches || savedMotion === 'paused';
  const canvas = document.querySelector('.particles');
  const context = canvas.getContext('2d');
  const hero = document.querySelector('.hero');
  const heroArt = document.querySelector('.hero-art');
  let width = 0, height = 0, frame = 0, lastTime = 0;
  let inView = true;
  let dots = [];

  function resize() {
    width = hero.clientWidth;
    height = hero.clientHeight;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    if (!context) return;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    dots = Array.from({ length: width < 600 ? 18 : 34 }, () => ({
      x: Math.random() * width, y: Math.random() * height,
      radius: Math.random() * .8 + .2, speed: Math.random() * .009 + .003,
      opacity: Math.random() * .4 + .1
    }));
    draw(0);
  }
  function draw(delta) {
    if (!context) return;
    context.clearRect(0, 0, width, height);
    for (const dot of dots) {
      dot.y -= dot.speed * delta;
      if (dot.y < 0) dot.y = height;
      context.beginPath();
      context.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(214, 210, 237, ${dot.opacity})`;
      context.fill();
    }
  }
  function animate(time) {
    frame = 0;
    if (paused || document.hidden || !inView || !context) return;
    draw(Math.min(time - (lastTime || time), 50));
    lastTime = time;
    frame = requestAnimationFrame(animate);
  }
  function syncAnimation() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    if (!paused && !document.hidden && inView && context) frame = requestAnimationFrame(animate);
  }
  function setMotion(value, save = false) {
    paused = value;
    root.classList.toggle('motion-paused', paused);
    motionButton.setAttribute('aria-pressed', String(paused));
    motionButton.setAttribute('aria-label', paused ? 'Enable ambient motion' : 'Pause ambient motion');
    motionLabel.textContent = paused ? 'Motion off' : 'Motion on';
    if (paused) { heroArt.style.removeProperty('--px'); heroArt.style.removeProperty('--py'); }
    if (save) { try { localStorage.setItem('kyki-motion', paused ? 'paused' : 'on'); } catch {} }
    syncAnimation();
  }
  motionButton.addEventListener('click', () => setMotion(!paused, true));
  mediaQuery.addEventListener('change', event => setMotion(event.matches));
  document.addEventListener('visibilitychange', syncAnimation);
  new ResizeObserver(resize).observe(hero);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { inView = entries[0].isIntersecting; syncAnimation(); }).observe(hero);
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.site-header nav a');
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        navLinks.forEach(link => {
          const active = link.hash === '#' + entry.target.id;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
        });
      }
    }, { rootMargin: '-5% 0px -70% 0px', threshold: 0 });
    sections.forEach(section => observer.observe(section));
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { if (!paused) entry.target.classList.add('entered'); reveal.unobserve(entry.target); }
    }), { threshold: .12 });
    document.querySelectorAll('.project-card, .identity-copy, .network-grid').forEach(element => reveal.observe(element));
  }
  hero.addEventListener('pointermove', event => {
    if (paused || event.pointerType !== 'mouse') return;
    const rect = hero.getBoundingClientRect();
    heroArt.style.setProperty('--px', ((event.clientX - rect.left) / rect.width - .5) * 9 + 'px');
    heroArt.style.setProperty('--py', ((event.clientY - rect.top) / rect.height - .5) * 7 + 'px');
  }, { passive: true });
  hero.addEventListener('pointerleave', () => {
    heroArt.style.setProperty('--px', '0px');
    heroArt.style.setProperty('--py', '0px');
  });
  let toastTimeout;
  function toast(message) {
    const element = document.querySelector('.toast');
    element.textContent = message;
    element.classList.add('visible');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => element.classList.remove('visible'), 3400);
  }
  document.querySelector('.copy-handle').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('kyki678_90621');
      toast('Discord username copied. Say hello.');
    } catch {
      toast('Discord username: kyki678_90621');
    }
  });
  const dialog = document.querySelector('.secret-dialog');
  let sequence = '', previousKeyTime = 0, lastFocus;
  document.addEventListener('keydown', event => {
    if (event.ctrlKey || event.metaKey || event.altKey || event.target.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
    if (event.key.length !== 1) return;
    const now = Date.now();
    if (now - previousKeyTime > 1600) sequence = '';
    previousKeyTime = now;
    sequence = (sequence + event.key.toLowerCase()).slice(-4);
    if (sequence === 'kyki' && !dialog.open) {
      lastFocus = document.activeElement;
      dialog.showModal();
      sequence = '';
    }
  });
  document.querySelector('.secret-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => lastFocus?.focus());
  document.querySelector('#year').textContent = new Date().getFullYear();
  resize();
  setMotion(paused);
})();
