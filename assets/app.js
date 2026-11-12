(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var stored = null;
  try {
    stored = localStorage.getItem("jcy-lang");
  } catch (err) {
    stored = null;
  }

  function pageTitle(lang) {
    var isProject = location.pathname.indexOf("project") !== -1;
    if (isProject) {
      return lang === "zh"
        ? "ICU 延长住院预测 | 杨济丞"
        : "Early Prediction of Prolonged ICU Stay | Jicheng Yang";
    }
    return lang === "zh"
      ? "杨济丞 | Jicheng Yang — 蛋白质组学与空间组学"
      : "Jicheng Yang — Proteomics & Spatial Omics";
  }

  function applyLang(lang) {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";

    document.querySelectorAll("[data-zh]").forEach(function (el) {
      var value = el.getAttribute("data-" + lang);
      if (value !== null) {
        el.textContent = value;
      }
    });

    document.querySelectorAll(".lang-switch button").forEach(function (btn) {
      var active = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    document.title = pageTitle(lang);
    try {
      localStorage.setItem("jcy-lang", lang);
    } catch (err) {
      /* storage may be unavailable */
    }
  }

  document.querySelectorAll(".lang-switch button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyLang(btn.getAttribute("data-lang"));
    });
  });

  applyLang(stored === "en" ? "en" : "zh");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  if (!reduceMotion && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    reveals.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }
})();
