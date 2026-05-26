/* =========================================================
   获客农业 · 交互脚本
   ========================================================= */
(function () {
  'use strict';

  const header = document.getElementById('header');
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const backTop = document.getElementById('backTop');

  /* ---------- 导航栏滚动阴影 + 返回顶部 ---------- */
  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 10);
    backTop.classList.toggle('is-visible', y > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 移动端菜单 ---------- */
  navToggle.addEventListener('click', function () {
    const open = nav.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  });
  // 点击菜单项后收起
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- 滚动显现动画 ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          // 同组元素轻微错峰
          const delay = (entry.target.dataset.delay || (i % 4) * 80);
          setTimeout(function () { entry.target.classList.add('is-in'); }, delay);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- 数字滚动动画 ---------- */
  function animateCount(el) {
    const target = parseFloat(el.dataset.target) || 0;
    const suffix = el.dataset.suffix || '';
    const dur = 1500;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      const val = Math.floor(eased * target);
      el.textContent = val.toLocaleString('en-US') + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString('en-US') + suffix;
    }
    requestAnimationFrame(tick);
  }
  const numEls = document.querySelectorAll('.stat__num[data-target]');
  if ('IntersectionObserver' in window) {
    const numIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          numIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    numEls.forEach(function (el) { numIO.observe(el); });
  } else {
    numEls.forEach(animateCount);
  }

  /* ---------- 导航高亮当前区块 ---------- */
  const sections = ['hero', 'services', 'gov', 'platform', 'products', 'about', 'news']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  const linkMap = {};
  document.querySelectorAll('.nav__link').forEach(function (a) {
    const id = a.getAttribute('href').slice(1);
    linkMap[id] = a;
  });
  if ('IntersectionObserver' in window) {
    const navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          Object.values(linkMap).forEach(function (l) { l.classList.remove('is-active'); });
          const link = linkMap[entry.target.id];
          if (link) link.classList.add('is-active');
        }
      });
    }, { threshold: 0.5 });
    sections.forEach(function (s) { navIO.observe(s); });
  }

  /* ---------- 留言表单校验 ---------- */
  const form = document.getElementById('contactForm');
  const hint = document.getElementById('formHint');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = form.elements['name'].value.trim();
      const phone = form.elements['phone'].value.trim();
      const phoneOk = /^1[3-9]\d{9}$/.test(phone) || /^0\d{2,3}-?\d{7,8}$/.test(phone);

      if (!name) {
        hint.textContent = '请填写您的姓名';
        hint.className = 'footer__formhint err';
        return;
      }
      if (!phoneOk) {
        hint.textContent = '请输入有效的联系电话';
        hint.className = 'footer__formhint err';
        return;
      }
      hint.textContent = '提交成功！我们将尽快与您联系。（演示页面,未实际发送）';
      hint.className = 'footer__formhint ok';
      form.reset();
    });
  }

  /* ---------- 年份自动更新（页脚） ---------- */
  // 保留静态文案,如需动态可在此扩展
})();
