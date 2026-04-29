(function () {
  'use strict';

  // ★ STEP3でコピーしたURLをここに貼り付ける
  const GAS_URL = 'https://script.google.com/macros/s/AKfycbznGFM5mpKhLp_gSoQEQZACcUvVPOjyLHXzb4zMnTe51h_LcuaEKFvLojuWjaIYpE2i/exec';

  const form      = document.getElementById('rv-form');
  const submitBtn = document.getElementById('rv-submit');
  const successEl = document.getElementById('rv-success');

  if (!form) return;

  /* ========== バリデーションルール ========== */
  const RULES = {
    name: {
      el: () => document.getElementById('name'),
      err: () => document.getElementById('err-name'),
      validate(v) {
        if (!v) return 'お名前を入力してください';
        if (v.length < 2) return '2文字以上で入力してください';
        return '';
      }
    },
    email: {
      el: () => document.getElementById('email'),
      err: () => document.getElementById('err-email'),
      validate(v) {
        if (!v) return 'メールアドレスを入力してください';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
          return '正しいメールアドレスを入力してください';
        return '';
      }
    },
    tel: {
      el: () => document.getElementById('tel'),
      err: () => document.getElementById('err-tel'),
      validate(v) {
        if (!v) return '電話番号を入力してください';
        if (!/^[0-9\-+]{10,15}$/.test(v.replace(/\s/g, '')))
          return '正しい電話番号を入力してください（半角数字）';
        return '';
      }
    },
    plan: {
      el: () => document.getElementById('plan'),
      err: () => document.getElementById('err-plan'),
      validate(v) {
        if (!v) return 'プランを選択してください';
        return '';
      }
    },
    date: {
      el: () => document.getElementById('date'),
      err: () => document.getElementById('err-date'),
      validate(v) {
        if (!v) return '希望日を選択してください';
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selected = new Date(v);
        if (selected <= today) return '翌日以降の日付を選択してください';
        return '';
      }
    },
    time: {
      el: () => document.getElementById('time'),
      err: () => document.getElementById('err-time'),
      validate(v) {
        if (!v) return '希望時間帯を選択してください';
        return '';
      }
    },
    guests: {
      el: () => document.getElementById('guests'),
      err: () => document.getElementById('err-guests'),
      validate(v) {
        if (!v) return '人数を選択してください';
        return '';
      }
    }
  };

  /* ========== 1フィールド検証 ========== */
  function validateField(key) {
    const rule = RULES[key];
    const el   = rule.el();
    const errEl = rule.err();
    const msg  = rule.validate(el.value.trim());

    errEl.textContent = msg;
    el.classList.toggle('is-error', !!msg);
    el.classList.toggle('is-ok', !msg && el.value.trim() !== '');
    return !msg;
  }

  /* ========== リアルタイムバリデーション ========== */
  Object.keys(RULES).forEach(function (key) {
    const el = RULES[key].el();
    if (!el) return;
    // 入力が終わったタイミングで検証（blur）
    el.addEventListener('blur', function () { validateField(key); });
    // 一度エラーが出たら入力のたびに再検証（input）
    el.addEventListener('input', function () {
      if (el.classList.contains('is-error')) validateField(key);
    });
  });

  /* ========== 送信 ========== */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // 全フィールド検証
    const allOk = Object.keys(RULES).map(validateField).every(Boolean);
    if (!allOk) {
      // 最初のエラー箇所へスクロール
      const firstError = form.querySelector('.is-error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // ボタンをローディング状態に
    submitBtn.disabled = true;
    submitBtn.textContent = '送信中...';

    const payload = {
      name:    document.getElementById('name').value.trim(),
      email:   document.getElementById('email').value.trim(),
      tel:     document.getElementById('tel').value.trim(),
      plan:    document.getElementById('plan').value,
      date:    document.getElementById('date').value,
      time:    document.getElementById('time').value,
      guests:  document.getElementById('guests').value,
      coupon:  document.getElementById('coupon').value.trim().toUpperCase(),
      message: document.getElementById('message').value.trim(),
    };

    fetch(GAS_URL, {
      method: 'POST',
      // GASはCORSの関係でno-corsが必要な場合あり
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    .then(function () {
      // no-corsではレスポンスが読めないため送信成功とみなす
      form.style.display = 'none';
      successEl.classList.add('is-show');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    })
    .catch(function (err) {
      alert('送信に失敗しました。お手数ですがお電話にてご予約ください。\nTel: 03-1234-5678');
      submitBtn.disabled = false;
      submitBtn.textContent = '予約を確定する';
      console.error(err);
    });
  });

})();