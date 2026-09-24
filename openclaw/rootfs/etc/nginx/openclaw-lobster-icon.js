/**
 * OpenClaw Official Lobster Sidebar Icon for Home Assistant
 * Registers customIcons['openclaw'] and upgrades the OpenClaw sidebar item with the official animated red-orange lobster SVG.
 */
(function() {
  const LOBSTER_SVG = `<svg viewBox="0 0 120 120" style="width: 24px; height: 24px; display: block;" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="oc-lobster-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ff4d4d"/>
        <stop offset="100%" stop-color="#991b1b"/>
      </linearGradient>
    </defs>
    <g>
      <path d="M60 10 C30 10 15 35 15 55 C15 75 30 95 45 100 L45 110 L55 110 L55 100 C55 100 60 102 65 100 L65 110 L75 110 L75 100 C90 95 105 75 105 55 C105 35 90 10 60 10Z" fill="url(#oc-lobster-grad)"/>
      <path d="M20 45 C5 40 0 50 5 60 C10 70 20 65 25 55 C28 48 25 45 20 45Z" fill="url(#oc-lobster-grad)"/>
      <path d="M100 45 C115 40 120 50 115 60 C110 70 100 65 95 55 C92 48 95 45 100 45Z" fill="url(#oc-lobster-grad)"/>
      <path d="M45 15 Q35 5 30 8" stroke="#ff4d4d" stroke-width="4" stroke-linecap="round" fill="none"/>
      <path d="M75 15 Q85 5 90 8" stroke="#ff4d4d" stroke-width="4" stroke-linecap="round" fill="none"/>
      <circle cx="45" cy="35" r="5" fill="#ffffff"/>
      <circle cx="75" cy="35" r="5" fill="#ffffff"/>
      <circle cx="46" cy="35" r="2.5" fill="#000000"/>
      <circle cx="76" cy="35" r="2.5" fill="#000000"/>
    </g>
  </svg>`;

  // 1. Register in HA's native customIcons registry for any <ha-icon icon="openclaw:lobster"> or <ha-icon icon="mdi:lobster">
  window.customIcons = window.customIcons || {};
  const lobsterIconDef = {
    getIcon: () => ({
      path: "M12 2C7 2 4.5 6.2 4.5 9.5C4.5 12.8 7 16.2 9.5 17V18.7H11.2V17C11.2 17 12 17.3 12.8 17V18.7H14.5V17C17 16.2 19.5 12.8 19.5 9.5C19.5 6.2 17 2 12 2M3.3 7.8C0.8 7 0 8.7 0.8 10.3C1.7 12 3.3 11.2 4.2 9.5C4.7 8.3 4.2 7.8 3.3 7.8M20.7 7.8C23.2 7 24 8.7 23.2 10.3C22.3 12 20.7 11.2 19.8 9.5C19.3 8.3 19.8 7.8 20.7 7.8Z",
      viewBox: "0 0 24 24"
    })
  };
  window.customIcons["openclaw"] = lobsterIconDef;
  window.customIcons["lobster"] = lobsterIconDef;

  // 2. Continuously watch the sidebar and inject the full-color OpenClaw Lobster SVG
  function injectSidebarLobster() {
    try {
      const ha = document.querySelector("home-assistant");
      if (!ha || !ha.shadowRoot) return;
      const main = ha.shadowRoot.querySelector("home-assistant-main");
      if (!main || !main.shadowRoot) return;
      const sidebar = main.shadowRoot.querySelector("ha-sidebar");
      if (!sidebar || !sidebar.shadowRoot) return;

      const items = sidebar.shadowRoot.querySelectorAll("ha-list-item-button, a, paper-icon-item");
      items.forEach(btn => {
        const id = btn.id || "";
        const text = (btn.innerText || "").trim();
        if (id.includes("openclaw") || text === "OpenClaw") {
          if (!btn.querySelector(".custom-lobster-icon")) {
            const oldIcon = btn.querySelector("ha-icon, ha-svg-icon");
            if (oldIcon) oldIcon.style.display = "none";
            const span = document.createElement("span");
            span.className = "custom-lobster-icon";
            span.setAttribute("slot", "start");
            span.style.display = "inline-flex";
            span.style.alignItems = "center";
            span.style.justifyContent = "center";
            span.style.width = "24px";
            span.style.height = "24px";
            span.innerHTML = LOBSTER_SVG;
            btn.prepend(span);
          }
        }
      });
    } catch (e) {}
  }

  injectSidebarLobster();
  setInterval(injectSidebarLobster, 600);
})();
