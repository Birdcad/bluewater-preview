/* Bluewater Medical — small progressive-enhancement interactions */
(function () {
  "use strict";

  var header = document.getElementById("siteHeader");
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");

  /* sticky header shadow */
  var onScroll = function () {
    if (!header) return;
    header.classList.toggle("is-stuck", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* mobile menu */
  if (toggle && header) {
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
  if (links) {
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        header.classList.remove("open");
        if (toggle) toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* reveal on scroll */
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && items.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 70 + "ms";
      io.observe(el);
    });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }

  /* contact form: send via contact.php without leaving the page */
  var params = new URLSearchParams(window.location.search);
  document.querySelectorAll("[data-contact-form]").forEach(function (form) {
    var status = form.querySelector(".form-status");
    var button = form.querySelector("button[type=submit]");
    var show = function (ok, msg) {
      status.textContent = msg;
      status.className = "form-status " + (ok ? "ok" : "err");
    };
    if (params.has("sent")) {
      show(params.get("sent") === "1", params.get("sent") === "1"
        ? "Thank you — we will get back to you shortly."
        : "Sorry, the message could not be sent. Please email us directly.");
    }
    form.addEventListener("submit", function (e) {
      if (!window.fetch) return;  // old browsers fall back to a normal POST
      e.preventDefault();
      button.disabled = true;
      show(true, "Sending…");
      fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          show(data.ok, data.message);
          if (data.ok) form.reset();
        })
        .catch(function () {
          show(false, "Sorry, the message could not be sent. Please email us at info@bluewater-medical.net.");
        })
        .then(function () { button.disabled = false; });
    });
  });

  /* current year */
  document.querySelectorAll(".js-year").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
