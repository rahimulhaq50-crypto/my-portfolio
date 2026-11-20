(() => {
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Preloader
  const num = $('#plNum'), bar = $('#plBar'), pre = $('#preloader');
  let p = 0;
  const start = performance.now(), dur = reduce ? 200 : 2200;
  (function tick(t) {
    p = Math.min(100, Math.round(((t - start) / dur) * 100));
    num.textContent = p; bar.style.width = p + '%';
    if (p < 100) return requestAnimationFrame(tick);
    pre.classList.add('done');
    document.body.classList.remove('loading');
    setTimeout(() => document.body.classList.add('ready'), 500);
    setTimeout(() => pre.remove(), 1200);
  })(start);

  // Nav
  const nav = $('#nav'), burger = $('#burger'), links = $('#links');
  const onScroll = () => nav.classList.toggle('solid', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const toggle = (open) => {
    links.classList.toggle('open', open); burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open); document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => toggle(!links.classList.contains('open')));
  $$('a', links).forEach(a => a.addEventListener('click', () => toggle(false)));
  addEventListener('keydown', e => e.key === 'Escape' && toggle(false));

  // Scroll reveal + counters
  const pad = (n, l) => String(n).padStart(l || 0, '0');
  const count = el => {
    const to = +el.dataset.to, l = +el.dataset.pad || 0;
    if (reduce) return el.textContent = pad(to, l);
    const t0 = performance.now();
    (function f(t) {
      const k = Math.min(1, (t - t0) / 1800), e = 1 - Math.pow(1 - k, 3);
      el.textContent = pad(Math.round(to * e), l);
      if (k < 1) requestAnimationFrame(f);
    })(t0);
  };
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    $$('[data-to]', e.target).forEach(count);
    io.unobserve(e.target);
  }), { threshold: .15 });
  $$('.rv').forEach(el => io.observe(el));

  // Testimonials
  const slides = $$('.slide'), dots = $('#dots');
  let i = 0;
  slides.forEach(() => dots.appendChild(document.createElement('i')));
  const show = n => {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle('on', k === i));
    $$('i', dots).forEach((d, k) => d.classList.toggle('on', k === i));
  };
  $('#prev').onclick = () => show(i - 1);
  $('#next').onclick = () => show(i + 1);
  show(0);

  // Back to top
  $('#top').onclick = () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
})();