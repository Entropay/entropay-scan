(function () {
  "use strict";

  var STORAGE_KEY = "ent_theme_variant";
  var DEFAULT_THEME = "blockscout";
  var THEMES = {
    blockscout: {
      label: "Blockscout"
    },
    bscscan: {
      label: "BSCScan-like",
      logo: "/entropay-theme/logos/bscscan-logo-light.svg",
      logoDark: "/entropay-theme/logos/bscscan-logo-dark.svg",
      icon: "/entropay-theme/logos/bscscan-chain-light.svg",
      iconDark: "/entropay-theme/logos/bscscan-chain-dark.svg"
    }
  };

  function normalizeTheme(value) {
    return Object.prototype.hasOwnProperty.call(THEMES, value) ? value : DEFAULT_THEME;
  }

  function readTheme() {
    try {
      return normalizeTheme(localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME);
    } catch (_error) {
      return DEFAULT_THEME;
    }
  }

  function writeTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, normalizeTheme(theme));
    } catch (_error) {
      // Ignore storage write errors.
    }
  }

  function ensureEnvBackup() {
    if (!window.__envs || window.__ent_theme_original_envs) {
      return;
    }

    window.__ent_theme_original_envs = {
      NEXT_PUBLIC_NETWORK_LOGO: window.__envs.NEXT_PUBLIC_NETWORK_LOGO,
      NEXT_PUBLIC_NETWORK_LOGO_DARK: window.__envs.NEXT_PUBLIC_NETWORK_LOGO_DARK,
      NEXT_PUBLIC_NETWORK_ICON: window.__envs.NEXT_PUBLIC_NETWORK_ICON,
      NEXT_PUBLIC_NETWORK_ICON_DARK: window.__envs.NEXT_PUBLIC_NETWORK_ICON_DARK
    };
  }

  function applyEnvOverrides(theme) {
    if (!window.__envs) {
      return;
    }

    ensureEnvBackup();

    if (theme === "bscscan") {
      window.__envs.NEXT_PUBLIC_NETWORK_LOGO = THEMES.bscscan.logo;
      window.__envs.NEXT_PUBLIC_NETWORK_LOGO_DARK = THEMES.bscscan.logoDark;
      window.__envs.NEXT_PUBLIC_NETWORK_ICON = THEMES.bscscan.icon;
      window.__envs.NEXT_PUBLIC_NETWORK_ICON_DARK = THEMES.bscscan.iconDark;
      return;
    }

    if (window.__ent_theme_original_envs) {
      window.__envs.NEXT_PUBLIC_NETWORK_LOGO = window.__ent_theme_original_envs.NEXT_PUBLIC_NETWORK_LOGO;
      window.__envs.NEXT_PUBLIC_NETWORK_LOGO_DARK = window.__ent_theme_original_envs.NEXT_PUBLIC_NETWORK_LOGO_DARK;
      window.__envs.NEXT_PUBLIC_NETWORK_ICON = window.__ent_theme_original_envs.NEXT_PUBLIC_NETWORK_ICON;
      window.__envs.NEXT_PUBLIC_NETWORK_ICON_DARK = window.__ent_theme_original_envs.NEXT_PUBLIC_NETWORK_ICON_DARK;
    }
  }

  function applyTheme(theme) {
    var normalizedTheme = normalizeTheme(theme);
    document.documentElement.setAttribute("data-ent-theme", normalizedTheme);
    applyEnvOverrides(normalizedTheme);
  }

  function buildThemeSwitcher() {
    if (document.getElementById("ent-theme-switcher")) {
      return;
    }

    var wrapper = document.createElement("div");
    wrapper.id = "ent-theme-switcher";
    wrapper.className = "ent-theme-switcher";

    var label = document.createElement("label");
    label.setAttribute("for", "ent-theme-select");
    label.textContent = "Theme";

    var select = document.createElement("select");
    select.id = "ent-theme-select";
    select.setAttribute("aria-label", "Select explorer theme");

    Object.keys(THEMES).forEach(function (themeKey) {
      var option = document.createElement("option");
      option.value = themeKey;
      option.textContent = THEMES[themeKey].label;
      select.appendChild(option);
    });

    select.value = readTheme();

    select.addEventListener("change", function (event) {
      var nextTheme = normalizeTheme(event.target.value);
      writeTheme(nextTheme);
      applyTheme(nextTheme);
      window.location.reload();
    });

    wrapper.appendChild(label);
    wrapper.appendChild(select);
    document.body.appendChild(wrapper);
  }

  applyTheme(readTheme());

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildThemeSwitcher);
  } else {
    buildThemeSwitcher();
  }
})();
