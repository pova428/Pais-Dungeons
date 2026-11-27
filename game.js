(() => {
  "use strict";

  const screen = document.getElementById("game-screen");
  const backdrop = document.getElementById("dialog-backdrop");
  const title = document.getElementById("dialog-title");
  const eyebrow = document.getElementById("dialog-eyebrow");
  const body = document.getElementById("dialog-content");
  const actions = document.getElementById("dialog-actions");
  const settings = { highContrast: false, reduceMotion: false };
  let lastFocusedElement = null;

  try {
    const saved = JSON.parse(localStorage.getItem("the-five-settings") || "{}");
    settings.highContrast = Boolean(saved.highContrast);
    settings.reduceMotion = Boolean(saved.reduceMotion);
  } catch (error) {
    // El menú sigue funcionando aunque el navegador bloquee localStorage.
  }

  function applySettings() {
    screen.dataset.highContrast = String(settings.highContrast);
    document.body.classList.toggle("reduce-motion", settings.reduceMotion);
    try {
      localStorage.setItem("the-five-settings", JSON.stringify(settings));
    } catch (error) {
      // Las preferencias se mantienen durante esta sesión.
    }
  }

  function openDialog(kind) {
    lastFocusedElement = document.activeElement;
    backdrop.hidden = false;

    if (kind === "begin") {
      eyebrow.textContent = "EL PRIMER JURAMENTO";
      title.textContent = "La noche tiene memoria";
      body.innerHTML = `
        <p class="dialog-emphasis">En algún lugar, más allá de las murallas, algo ha despertado.</p>
        <p>La tierra se ha vuelto hostil. Los caminos se apagan uno a uno y las viejas historias vuelven a pronunciarse en voz baja.</p>
        <p>Cinco destinos quedarán unidos por una misma maldición. Cuatro caminarán hacia la oscuridad. Uno guardará el fuego.</p>
        <p>La compañía todavía no ha sido reunida.</p>`;
      actions.innerHTML = '<button class="dialog-button" type="button" data-action="close-dialog">Volver al menú <span>←</span></button>';
    }

    if (kind === "options") {
      eyebrow.textContent = "AJUSTES DEL BASTIÓN";
      title.textContent = "Opciones";
      body.innerHTML = `
        <div class="options-list">
          <div class="option-row">
            <div><span class="option-name">Contraste sombrío</span><span class="option-description">Refuerza las sombras del escenario.</span></div>
            <button class="toggle-button" type="button" data-setting="highContrast" aria-pressed="${settings.highContrast}">${settings.highContrast ? "SÍ" : "NO"}</button>
          </div>
          <div class="option-row">
            <div><span class="option-name">Reducir movimiento</span><span class="option-description">Desactiva las animaciones ambientales.</span></div>
            <button class="toggle-button" type="button" data-setting="reduceMotion" aria-pressed="${settings.reduceMotion}">${settings.reduceMotion ? "SÍ" : "NO"}</button>
          </div>
        </div>`;
      actions.innerHTML = '<button class="dialog-button" type="button" data-action="close-dialog">Guardar y volver <span>←</span></button>';
    }

    if (kind === "credits") {
      eyebrow.textContent = "REGISTRO DE LA COMPAÑÍA";
      title.textContent = "Créditos";
      body.innerHTML = `
        <div class="credits-list">
          <div class="credit-item"><span class="credit-role">CONCEPTO Y DESARROLLO</span><span class="credit-name">THE FIVE — La Maldición</span></div>
          <div class="credit-item"><span class="credit-role">DIRECCIÓN ARTÍSTICA</span><span class="credit-name">Fantasía oscura · Pixel art original</span></div>
          <div class="credit-item"><span class="credit-role">MOTOR</span><span class="credit-name">HTML · CSS · JavaScript</span></div>
          <div class="credit-item"><span class="credit-role">ESTADO</span><span class="credit-name">Primera versión — pantalla de título</span></div>
        </div>`;
      actions.innerHTML = '<button class="dialog-button" type="button" data-action="close-dialog">Volver al menú <span>←</span></button>';
    }

    const firstButton = backdrop.querySelector("button");
    if (firstButton) firstButton.focus();
  }

  function closeDialog() {
    if (backdrop.hidden) return;
    backdrop.hidden = true;
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") lastFocusedElement.focus();
  }

  document.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-action]");
    if (actionButton) {
      const action = actionButton.dataset.action;
      if (action === "begin" || action === "options" || action === "credits") openDialog(action);
      if (action === "close-dialog") closeDialog();
      return;
    }

    const settingButton = event.target.closest("[data-setting]");
    if (settingButton) {
      const setting = settingButton.dataset.setting;
      if (Object.prototype.hasOwnProperty.call(settings, setting)) {
        settings[setting] = !settings[setting];
        applySettings();
        openDialog("options");
      }
    }
  });

  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) closeDialog();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeDialog();
    if (event.key === "Tab" && !backdrop.hidden) {
      const focusable = [...backdrop.querySelectorAll("button:not(:disabled)")];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  applySettings();
})();