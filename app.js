(() => {
  const d = document, root = d.documentElement;
  root.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const PHONE = '+7 (918) 196-36-77', TEL = 'tel:+79181963677', WA = 'https://wa.me/79181963677';
  const page = d.body.dataset.page;

  /* ---------- shared header / menu / footer ---------- */
  const links = [['index.html','Главная','home'],['uslugi.html','Услуги и цены','uslugi'],['raboty.html','Работы','raboty'],['otzyvy.html','Отзывы','otzyvy'],['kontakty.html','Контакты','kontakty']];
  const nav = links.map(([h,t,k]) => `<a href="${h}"${k===page?' aria-current="page"':''}>${t}</a>`).join('');
  d.body.insertAdjacentHTML('afterbegin', `
  <div class="curtain" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
  <header class="hdr"><div class="wrap hdr__in">
    <a class="logo" href="index.html" aria-label="Студия красоты — на главную"><b>Студия красоты</b><small>Виктория · Краснодар</small></a>
    <nav class="nav" aria-label="Основное меню">${nav}</nav>
    <a class="btn mag" href="${TEL}">Записаться <span class="arr">→</span></a>
    <button class="burger" aria-label="Открыть меню" aria-expanded="false"><span></span><span></span></button>
  </div></header>
  <div class="mmenu" aria-hidden="true">${links.map(([h,t])=>`<a href="${h}"><span>${t}</span></a>`).join('')}
    <p>${PHONE}<br>Вт–Сб 10:00–19:00</p></div>`);
  d.body.insertAdjacentHTML('beforeend', `
  <footer class="ftr"><div class="wrap">
    <div class="ftr__grid">
      <div><h4>Студия красоты</h4><p style="color:var(--mute);max-width:32ch">Стрижки, окрашивание и уход за волосами в центре Краснодара. Работаем по предварительной записи.</p></div>
      <div><h4>Адрес</h4><p>ул. Железнодорожная, 31</p><p style="color:var(--mute)">цокольный этаж, по коридору, кабинет 2</p></div>
      <div><h4>Часы</h4><p>Вт–Сб 10:00–19:00</p><p style="color:var(--mute)">Вс, Пн — выходной</p></div>
      <div><h4>Связь</h4><a class="link-u" href="${TEL}">${PHONE}</a><a class="link-u" href="${WA}" target="_blank" rel="noopener">WhatsApp</a><a class="link-u" href="https://vk.ru/trikolor_hair" target="_blank" rel="noopener">ВКонтакте</a></div>
    </div>
    <div class="ftr__big" aria-hidden="true">Студия красоты</div>
    <div class="ftr__copy"><span>© ${new Date().getFullYear()} Студия красоты, Краснодар</span><span>Можно прийти с собакой 🐾</span></div>
  </div></footer>
  <div class="cur" aria-hidden="true"></div>`);

  /* ---------- page transitions: curtain ---------- */
  const curtain = d.querySelector('.curtain');
  const open = () => requestAnimationFrame(() => requestAnimationFrame(() => curtain.classList.add('is-open')));
  if (reduce) curtain.style.display = 'none'; else open();
  addEventListener('pageshow', e => { if (e.persisted) { curtain.classList.remove('is-closing'); curtain.classList.add('is-open'); } });
  d.addEventListener('click', e => {
    const a = e.target.closest('a'); if (!a || reduce) return;
    const href = a.getAttribute('href') || '';
    if (!/\.html(#.*)?$/.test(href) || a.target || e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (href === location.pathname.split('/').pop()) { e.preventDefault(); return; }
    e.preventDefault();
    d.body.classList.remove('menu-open');
    curtain.classList.remove('is-open'); curtain.classList.add('is-closing');
    void curtain.offsetWidth; curtain.classList.add('is-open');
    setTimeout(() => (window.__go ? window.__go(href) : (location.href = href)), 820);
  });

  /* ---------- header behaviour ---------- */
  const hdr = d.querySelector('.hdr'); let lastY = 0;
  addEventListener('scroll', () => {
    const y = scrollY;
    hdr.classList.toggle('is-scrolled', y > 20);
    hdr.classList.toggle('is-hidden', y > 400 && y > lastY && !d.body.classList.contains('menu-open'));
    lastY = y;
  }, { passive: true });
  const burger = d.querySelector('.burger'), mm = d.querySelector('.mmenu');
  burger.addEventListener('click', () => {
    const on = d.body.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', on); mm.setAttribute('aria-hidden', !on);
    d.body.style.overflow = on ? 'hidden' : '';
  });

  /* ---------- split headings into lines ---------- */
  d.querySelectorAll('[data-split]').forEach(el => {
    el.innerHTML = el.innerHTML.split(/<br\s*\/?>/i).map(l => `<span class="line"><span>${l}</span></span>`).join('');
    el.classList.add('split');
  });

  /* ---------- reveal on enter ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in'); io.unobserve(e.target);
    e.target.querySelectorAll?.('[data-count]').forEach(count);
  }), { rootMargin: '0px 0px -8% 0px', threshold: .08 });
  d.querySelectorAll('.rv,.split,.unmask,.collage figure,.bars,.stats').forEach(el => io.observe(el));
  // safety: never leave content hidden — reveal anything already scrolled to or past (fast scroll / jump links)
  let pend = false, maxY = 0;
  const sweep = () => { pend = false; maxY = Math.max(maxY, scrollY);
    d.querySelectorAll('.rv:not(.in),.split:not(.in),.unmask:not(.in),.stats:not(.in),.bars:not(.in)').forEach(el => {
      if (el.getBoundingClientRect().top + scrollY < maxY + innerHeight) { el.classList.add('in'); io.unobserve(el); el.querySelectorAll('[data-count]').forEach(count); }
    }); };
  addEventListener('scroll', () => { maxY = Math.max(maxY, scrollY); if (!pend) { pend = true; requestAnimationFrame(sweep); } }, { passive: true });
  setTimeout(sweep, 1500);

  function count(el) {
    const to = parseFloat(el.dataset.count), dec = (el.dataset.count.split('.')[1] || '').length, t0 = performance.now();
    const step = t => { const p = Math.min(1, (t - t0) / 1600), v = to * (1 - Math.pow(1 - p, 4));
      el.textContent = v.toFixed(dec).replace('.', ','); if (p < 1) requestAnimationFrame(step); };
    reduce ? el.textContent = String(to).replace('.', ',') : requestAnimationFrame(step);
  }

  /* ---------- marquee with scroll-velocity ---------- */
  d.querySelectorAll('.marquee').forEach(m => {
    const t = m.querySelector('.marquee__t'); t.parentNode.appendChild(t.cloneNode(true)).setAttribute('aria-hidden', 'true');
    const ts = m.querySelectorAll('.marquee__t'); let x = 0, v = 0, prev = scrollY;
    const tick = () => {
      const dy = scrollY - prev; prev = scrollY; v += (Math.abs(dy) * .15 - v) * .1;
      x -= .6 + v; const w = ts[0].offsetWidth; if (-x >= w) x += w;
      ts.forEach(e => e.style.transform = `translateX(${x}px)`); requestAnimationFrame(tick);
    };
    if (!reduce) tick();
  });

  /* ---------- hero parallax on mouse ---------- */
  const col = d.querySelector('.collage');
  if (col && !reduce && matchMedia('(hover:hover)').matches) {
    const figs = [...col.querySelectorAll('figure')], k = [10, -22, -34];
    addEventListener('mousemove', e => {
      const nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5;
      figs.forEach((f, i) => f.style.translate = `${nx * k[i]}px ${ny * k[i]}px`);
    });
  }

  /* ---------- spotlight cards ---------- */
  d.querySelectorAll('.card').forEach(c => c.addEventListener('pointermove', e => {
    const r = c.getBoundingClientRect(); c.style.setProperty('--x', e.clientX - r.left + 'px'); c.style.setProperty('--y', e.clientY - r.top + 'px');
  }));

  /* ---------- magnetic buttons + cursor ---------- */
  if (!reduce && matchMedia('(hover:hover)').matches) {
    d.querySelectorAll('.mag').forEach(b => {
      b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px,${(e.clientY - r.top - r.height / 2) * .35}px)`; });
      b.addEventListener('pointerleave', () => b.style.transform = '');
    });
    const cur = d.querySelector('.cur'); let cx = 0, cy = 0, tx = 0, ty = 0;
    addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; });
    (function loop() { cx += (tx - cx) * .2; cy += (ty - cy) * .2; cur.style.translate = `${cx}px ${cy}px`; requestAnimationFrame(loop); })();
    d.addEventListener('pointerover', e => cur.classList.toggle('big', !!e.target.closest('a,button,figure,.prow')));
  }

  /* ---------- drag-to-scroll strip ---------- */
  d.querySelectorAll('.strip').forEach(s => {
    let down = false, sx = 0, sl = 0;
    s.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; sx = e.clientX; sl = s.scrollLeft; s.classList.add('drag'); });
    addEventListener('pointerup', () => { down = false; s.classList.remove('drag'); });
    s.addEventListener('pointermove', e => { if (down) s.scrollLeft = sl - (e.clientX - sx); });
  });

  /* ---------- price list: image follows cursor ---------- */
  const hv = d.querySelector('.hover-img');
  if (hv) {
    const img = hv.querySelector('img'); let x = 0, y = 0, hx = 0, hy = 0;
    d.querySelectorAll('.prow[data-img]').forEach(r => {
      r.addEventListener('pointerenter', () => { img.src = r.dataset.img; hv.classList.add('on'); });
      r.addEventListener('pointerleave', () => hv.classList.remove('on'));
    });
    addEventListener('pointermove', e => { x = e.clientX + 150; y = e.clientY; });
    (function loop() { hx += (x - hx) * .12; hy += (y - hy) * .12; hv.style.left = hx + 'px'; hv.style.top = hy + 'px'; requestAnimationFrame(loop); })();
  }

  /* ---------- gallery filters + lightbox ---------- */
  const fl = d.querySelector('.filters');
  if (fl) fl.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    fl.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
    const f = b.dataset.f;
    d.querySelectorAll('.masonry figure').forEach(fg => fg.classList.toggle('hide', f !== 'all' && fg.dataset.cat !== f));
  });
  const lb = d.querySelector('.lb');
  if (lb) {
    const im = lb.querySelector('img'), cap = lb.querySelector('.cap'); let list = [], i = 0;
    const show = n => { i = (n + list.length) % list.length; const f = list[i]; im.src = f.querySelector('img').src; im.alt = f.querySelector('img').alt; cap.textContent = `${f.querySelector('figcaption')?.textContent || ''} · ${i + 1} / ${list.length}`; };
    d.querySelectorAll('.masonry figure').forEach(f => f.addEventListener('click', () => {
      list = [...d.querySelectorAll('.masonry figure:not(.hide)')]; show(list.indexOf(f)); lb.classList.add('on'); lb.querySelector('.x').focus();
    }));
    const close = () => lb.classList.remove('on');
    lb.querySelector('.x').onclick = close; lb.querySelector('.pv').onclick = () => show(i - 1); lb.querySelector('.nx').onclick = () => show(i + 1);
    lb.addEventListener('click', e => { if (e.target === lb) close(); });
    addEventListener('keydown', e => { if (!lb.classList.contains('on')) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') show(i - 1); if (e.key === 'ArrowRight') show(i + 1); });
  }

  /* ---------- hours: highlight today ---------- */
  const day = new Date().getDay(); // 0=Вс
  d.querySelectorAll('.hours tr[data-d]').forEach(tr => { if (tr.dataset.d.split(',').includes(String(day))) tr.classList.add('today'); });

  /* ---------- copy buttons ---------- */
  d.querySelectorAll('[data-copy]').forEach(b => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); b.textContent = 'Скопировано'; }
    catch { const r = d.createRange(); r.selectNodeContents(b.previousElementSibling); getSelection().removeAllRanges(); getSelection().addRange(r); }
    setTimeout(() => b.textContent = 'Скопировать', 1800);
  }));
})();
