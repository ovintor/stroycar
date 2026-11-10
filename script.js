/* Стройкар.рф — интерактив: меню, подменю, формы */
(function () {
  'use strict';

  // ---------- Мобильное меню ----------
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('primary-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    });

    // Закрываем мобильное меню после клика по ссылке
    nav.addEventListener('click', function (e) {
      var link = e.target.closest('a');
      if (link && window.matchMedia('(max-width: 820px)').matches) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Открыть меню');
      }
    });
  }

  // ---------- Выпадающее подменю «Услуги» ----------
  document.querySelectorAll('.nav-dropdown-toggle').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var dd = btn.closest('.nav-dropdown');
      if (!dd) return;
      var open = dd.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  // Закрытие по клику вне меню
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-dropdown')) {
      document.querySelectorAll('.nav-dropdown.is-open').forEach(function (dd) {
        dd.classList.remove('is-open');
        var b = dd.querySelector('.nav-dropdown-toggle');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Закрытие по Escape
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.nav-dropdown.is-open').forEach(function (dd) {
      dd.classList.remove('is-open');
      var b = dd.querySelector('.nav-dropdown-toggle');
      if (b) { b.setAttribute('aria-expanded', 'false'); b.focus(); }
    });
    if (nav && nav.classList.contains('is-open') && toggle) {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Открыть меню');
      toggle.focus();
    }
  });

  // ---------- Формы ----------
  document.querySelectorAll('form.lead-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      var status = form.querySelector('.form-status');

      // Honeypot: если заполнен — молча отбрасываем
      var hp = form.querySelector('[name="website"]');
      if (hp && hp.value) {
        e.preventDefault();
        return;
      }

      // Базовая валидация браузера (pattern, required)
      if (!form.checkValidity()) {
        e.preventDefault();
        if (status) {
          status.className = 'form-status form-status--error';
          status.textContent = 'Проверьте, пожалуйста, поля формы.';
        }
        var firstInvalid = form.querySelector(':invalid');
        if (firstInvalid && typeof firstInvalid.focus === 'function') firstInvalid.focus();
        return;
      }

      // Демо-режим: action="#" — показываем сообщение, не отправляем
      if (form.getAttribute('action') === '#') {
        e.preventDefault();
        var btn = form.querySelector('button[type="submit"]');
        if (btn) { btn.disabled = true; btn.setAttribute('aria-busy', 'true'); }
        setTimeout(function () {
          if (status) {
            status.className = 'form-status form-status--success';
            status.textContent = 'Спасибо! Заявка получена. Мы свяжемся с вами в рабочее время.';
          }
          form.reset();
          if (btn) { btn.disabled = false; btn.removeAttribute('aria-busy'); }
        }, 300);
      }
      // С реальным action — форма уходит на сервер как обычно
    });
  });
})();
