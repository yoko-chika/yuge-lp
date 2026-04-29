/* =========================================
   YUGE Sauna & Spa 神田 — main.js
   ========================================= */

(function () {
  'use strict';

  /* ---------- Popup ---------- */
  function closePopup() {
    var overlay = document.getElementById('popup-overlay');
    if (!overlay) return;
    overlay.style.transition = 'opacity 0.3s ease';
    overlay.style.opacity = '0';
    setTimeout(function () {
      overlay.style.display = 'none';
    }, 320);
  }

  window.closePopup = closePopup;   // グローバル公開（onclick属性から呼べる）

  // オーバーレイ背景クリックで閉じる
  var overlay = document.getElementById('popup-overlay');
  if (overlay) {
    overlay.addEventListener('click', function (e) {
      // popup-box 内部クリックは無視
      if (e.target === overlay) {
        closePopup();
      }
    });
  }

  // ESCキーでも閉じる
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closePopup();
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.closest('.faq-item');
      item.classList.toggle('open');
    });
  });

  /* ---------- Scroll fade-up ---------- */
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-up').forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // フォールバック: IntersectionObserver非対応ブラウザ
    document.querySelectorAll('.fade-up').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ---------- STATSカウントアップ ---------- */
function animateCount(el, target, suffix, duration) {
  var start = 0;
  var step = target / (duration / 16);
  var timer = setInterval(function () {
    start += step;
    if (start >= target) {
      start = target;
      clearInterval(timer);
    }
    el.textContent = (Number.isInteger(target) ? Math.floor(start) : start.toFixed(1)) + suffix;
  }, 16);
}

var statsObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (!entry.isIntersecting) return;
    statsObserver.unobserve(entry.target);
    var nums = entry.target.querySelectorAll('.stat-num');
    var configs = [
      { target: 4.7, suffix: '/5' },
      { target: 5,   suffix: '万人+' },
      { target: 46,  suffix: '%' },
      { target: 6,   suffix: '名' },
    ];
    nums.forEach(function (el, i) {
      var c = configs[i];
      if (c) animateCount(el, c.target, c.suffix, 1200);
    });
  });
}, { threshold: 0.3 });

var statsSection = document.querySelector('.stats-section');
if (statsSection) statsObserver.observe(statsSection);

})();
