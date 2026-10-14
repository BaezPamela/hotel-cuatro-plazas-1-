(function () {
  'use strict';

  var WA_NUMBER = '5493464680109';

  // Año del footer
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Menú móvil
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Fechas: mínimo hoy, egreso posterior al ingreso
  var checkin = document.getElementById('checkin');
  var checkout = document.getElementById('checkout');
  function iso(d) {
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }
  if (checkin && checkout) {
    var today = new Date();
    checkin.min = iso(today);
    checkout.min = iso(today);
    checkin.addEventListener('change', function () {
      if (!checkin.value) return;
      var next = new Date(checkin.value + 'T00:00:00');
      next.setDate(next.getDate() + 1);
      checkout.min = iso(next);
      if (checkout.value && checkout.value <= checkin.value) checkout.value = '';
    });
  }

  function formatDate(value) {
    var p = value.split('-');
    return p[2] + '/' + p[1] + '/' + p[0];
  }

  function setMsg(el, text, type) {
    if (!el) return;
    el.textContent = text;
    el.className = 'form-msg' + (type ? ' ' + type : '');
  }

  // Disponibilidad -> WhatsApp
  var availForm = document.getElementById('availability-form');
  var availMsg = document.getElementById('availability-msg');
  if (availForm) {
    availForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!checkin.value || !checkout.value) {
        setMsg(availMsg, 'Completá las fechas de ingreso y egreso.', 'error');
        return;
      }
      if (checkout.value <= checkin.value) {
        setMsg(availMsg, 'La fecha de egreso debe ser posterior al ingreso.', 'error');
        return;
      }
      var guests = document.getElementById('guests').value;
      var text = 'Hola, quisiera consultar disponibilidad en el Hotel Cuatro Plazas.\n' +
        'Ingreso: ' + formatDate(checkin.value) + '\n' +
        'Egreso: ' + formatDate(checkout.value) + '\n' +
        'Huéspedes: ' + guests;
      setMsg(availMsg, 'Abriendo WhatsApp…', 'ok');
      window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    });
  }

  // Contacto -> correo / WhatsApp (sitio estático, sin backend)
  var contactForm = document.getElementById('contact-form');
  var contactMsg = document.getElementById('contact-msg');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('name').value.trim();
      var email = document.getElementById('email').value.trim();
      var message = document.getElementById('message').value.trim();
      if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setMsg(contactMsg, 'Revisá nombre, email y mensaje.', 'error');
        return;
      }
      var subject = 'Consulta desde la web - ' + name;
      var body = message + '\n\n' + name + '\n' + email;
      setMsg(contactMsg, 'Abriendo tu programa de correo…', 'ok');
      window.location.href = 'mailto:contacto@hotelcuatroplazas.com.ar?subject=' +
        encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }

  // Lightbox de galería
  var lightbox = document.getElementById('lightbox');
  var lbImg = document.getElementById('lb-img');
  var lbCap = document.getElementById('lb-cap');
  var lastFocus = null;

  function closeLightbox() {
    lightbox.hidden = true;
    if (lastFocus) lastFocus.focus();
  }
  document.querySelectorAll('.g-item').forEach(function (btn) {
    btn.addEventListener('click', function () {
      lastFocus = btn;
      var cls = Array.prototype.find.call(btn.classList, function (c) { return c.indexOf('img-') === 0; });
      lbImg.className = 'lb-img ' + (cls || '');
      lbCap.textContent = btn.getAttribute('data-label') || '';
      lightbox.hidden = false;
      lightbox.querySelector('.lb-close').focus();
    });
  });
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target.classList.contains('lb-close')) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
    });
  }

  // Animación de entrada al hacer scroll
  var targets = document.querySelectorAll('.section .container, .card');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('visible');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    targets.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  }
})();
