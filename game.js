(() => {
  "use strict";

  const screen = document.getElementById("game-screen");
  const titleMenu = document.querySelector(".title-menu");
  const hud = document.querySelector(".game-hud");
  const inscription = document.querySelector(".world-inscription");
  const footer = document.querySelector(".game-footer");
  const campaign = document.getElementById("campaign-screen");
  const campaignMain = document.getElementById("campaign-main");
  const campaignTitle = document.getElementById("campaign-location-title");
  const resources = {
    gold: document.getElementById("gold-count"),
    rations: document.getElementById("ration-count")
  };
  const backdrop = document.getElementById("dialog-backdrop");
  const dialogTitle = document.getElementById("dialog-title");
  const dialogEyebrow = document.getElementById("dialog-eyebrow");
  const dialogContent = document.getElementById("dialog-content");
  const dialogActions = document.getElementById("dialog-actions");
  const continueButton = document.getElementById("continue-button");

  const characters = [
    { id:"guardian", name:"Darian Voss", title:"El Muro", role:"GUARDIÁN", sign:"D", icon:"♜", detail:"Defensor de primera línea. Protege a la compañía cuando la oscuridad se acerca.", trait:"Firme como la piedra" },
    { id:"duelist", name:"Kael Veyr", title:"La Hoja Gris", role:"DUELISTA", sign:"K", icon:"⚔", detail:"Combatiente ágil que busca los puntos débiles y remata a los enemigos.", trait:"Nunca ataca dos veces igual" },
    { id:"arcanist", name:"Ilyra Noct", title:"La Velada", role:"ARCANISTA", sign:"I", icon:"✧", detail:"Estudia artes prohibidas. Sus conjuros alteran el campo de batalla.", trait:"Escucha voces en las ruinas" },
    { id:"tracker", name:"Bram Cendra", title:"El Rastreador", role:"RASTREADOR", sign:"B", icon:"➶", detail:"Explorador y tirador. Encuentra rutas ocultas y amenaza desde lejos.", trait:"Siempre encuentra un camino" },
    { id:"alchemist", name:"Soren Vale", title:"El Remendón", role:"ALQUIMISTA", sign:"S", icon:"⚗", detail:"Prepara remedios y mezclas peligrosas. Mantiene con vida a los demás.", trait:"La muerte puede esperar" }
  ];

  const regions = [
    {
      id:"forest", index:"I", name:"Bosque de los Ahogados", short:"EL BOSQUE", atmosphere:"Donde los árboles recuerdan a los muertos",
      description:"Un bosque anegado por una niebla espesa. Las ramas cuelgan como sogas y las antiguas casas todavía conservan luz en sus ventanas.",
      boss:"El Verdugo sin Rostro", bossRole:"CARCELERO DEL BOSQUE",
      bossDescription:"Una figura gigantesca que patrulla los senderos con una campana oxidada. Nadie recuerda qué rostro tenía antes de perderlo.",
      sites:[
        {id:"forest-path",name:"Sendero de los Ahorcados",kind:"EXPLORACIÓN",description:"Un camino estrecho entre robles retorcidos. De las ramas cuelgan campanas y jirones de viejas vestiduras.",icon:"Ⅰ"},
        {id:"forest-village",name:"Aldea Inundada",kind:"ASENTAMIENTO",description:"Las puertas están abiertas y el agua llega a las ventanas. Puede que todavía quede alguien escondido en los sótanos.",icon:"Ⅱ"},
        {id:"forest-chapel",name:"Capilla de Raíces",kind:"SANTUARIO",description:"Las raíces han atravesado el altar. Bajo la piedra se oye una plegaria que nadie ha terminado.",icon:"Ⅲ"}
      ]
    },
    {
      id:"mines", index:"II", name:"Minas de Sal Negra", short:"LAS MINAS", atmosphere:"Bajo la tierra, algo sigue trabajando",
      description:"Galerías excavadas bajo una montaña enferma. Los raíles se mueven solos y el polvo negro se pega a la piel como ceniza húmeda.",
      boss:"La Matriarca de Sal", bossRole:"MADRE DE LAS GALERÍAS",
      bossDescription:"Una criatura nacida de los mineros desaparecidos. Su cuerpo cristalino guarda las voces de quienes quedaron atrapados.",
      sites:[
        {id:"mine-shaft",name:"Galería Hundida",kind:"EXPLORACIÓN",description:"Un pozo de extracción partido por la mitad. Los ascensores aún bajan, aunque nadie acciona sus cadenas.",icon:"Ⅰ"},
        {id:"mine-forge",name:"Fundición de Cadenas",kind:"TALLER ABANDONADO",description:"Hornos apagados, herramientas dispersas y grilletes demasiado grandes para un ser humano.",icon:"Ⅱ"},
        {id:"mine-chamber",name:"Cámara del Capataz",kind:"CÁMARA ÉLITE",description:"La sala de mando está sellada desde dentro. Tras la puerta se escucha el golpe lento de un pico.",icon:"Ⅲ"}
      ]
    },
    {
      id:"cathedral", index:"III", name:"Catedral Sumergida", short:"LA CATEDRAL", atmosphere:"La fe no se hunde en silencio",
      description:"Una catedral cubierta por aguas negras. Las campanas suenan bajo la superficie y las vidrieras iluminan algo que se mueve en la cripta.",
      boss:"El Obispo Abisal", bossRole:"ÚLTIMO OFICIANTE",
      bossDescription:"El antiguo guardián de la catedral ha seguido celebrando su ceremonia durante décadas. Ahora la congregación es algo distinto.",
      sites:[
        {id:"cathedral-atrium",name:"Atrio Inundado",kind:"EXPLORACIÓN",description:"El agua cubre las losas y los bancos flotan entre columnas partidas. Algo golpea desde el otro lado de la puerta.",icon:"Ⅰ"},
        {id:"cathedral-cloister",name:"Claustro de Campanas",kind:"SANTUARIO PROFANADO",description:"Las campanas cuelgan casi a ras del agua. Cada una lleva grabado el nombre de una persona desaparecida.",icon:"Ⅱ"},
        {id:"cathedral-crypt",name:"Cripta del Juramento",kind:"CÁMARA ÉLITE",description:"Cinco nichos rodean un sepulcro vacío. En la tapa aparecen escritos cinco nombres que todavía no conocéis.",icon:"Ⅲ"}
      ]
    }
  ];

  const items = [
    {id:"ration",name:"Ración de marcha",desc:"Comida seca para recuperar fuerzas en el bastión.",price:15,icon:"✚",kind:"rations"},
    {id:"bandage",name:"Venda de lino",desc:"Un paquete de vendas limpias para futuras expediciones.",price:20,icon:"╱",kind:"bandage"},
    {id:"tonic",name:"Tónico de raíz negra",desc:"Un frasco amargo de uso medicinal. Su fórmula es inestable.",price:35,icon:"⚗",kind:"tonic"},
    {id:"oil",name:"Aceite de lámpara",desc:"Combustible para no caminar a oscuras.",price:12,icon:"♨",kind:"oil"}
  ];

  const defaultState = () => ({
    gold:120,
    rations:2,
    inventory:{bandage:0,tonic:0,oil:0},
    hp:{guardian:100,duelist:100,arcanist:100,tracker:100,alchemist:100},
    party:["guardian","duelist","arcanist","tracker"],
    tab:"bastion",
    selectedRegion:"forest",
    selectedSite:"forest-path",
    visitedSites:[],
    notice:"La compañía se reúne en el bastión. La ruta aguarda al otro lado de las murallas."
  });

  let state = null;
  let lastFocusedElement = null;
  const SETTINGS_KEY = "the-five-settings";
  const SAVE_KEY = "the-five-campaign-v1";
  const settings = {highContrast:false,reduceMotion:false};

  try {
    const savedSettings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
    settings.highContrast = Boolean(savedSettings.highContrast);
    settings.reduceMotion = Boolean(savedSettings.reduceMotion);
  } catch (error) {}

  function applySettings() {
    screen.dataset.highContrast = String(settings.highContrast);
    document.body.classList.toggle("reduce-motion", settings.reduceMotion);
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (error) {}
  }

  function getSavedState() {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || "null");
      if (!saved || !Array.isArray(saved.party) || !saved.hp) return null;
      return Object.assign(defaultState(), saved, {
        inventory:Object.assign(defaultState().inventory, saved.inventory || {}),
        hp:Object.assign(defaultState().hp, saved.hp || {})
      });
    } catch (error) { return null; }
  }

  function saveState() {
    if (!state) return;
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (error) {
      state.notice = "No se ha podido guardar en este navegador. La partida seguirá activa mientras no cierres la página.";
    }
    updateContinueButton();
  }

  function updateContinueButton() {
    const hasSave = Boolean(getSavedState());
    if (!continueButton) return;
    continueButton.disabled = !hasSave;
    continueButton.setAttribute("aria-disabled", String(!hasSave));
    continueButton.classList.toggle("is-disabled", !hasSave);
    const lock = continueButton.querySelector(".entry-lock");
    if (lock) lock.textContent = hasSave ? "↗" : "—";
  }

  function openCampaign() {
    titleMenu.hidden = true;
    hud.hidden = true;
    inscription.hidden = true;
    footer.hidden = true;
    campaign.hidden = false;
    renderCampaign();
  }

  function returnToTitle() {
    campaign.hidden = true;
    titleMenu.hidden = false;
    hud.hidden = false;
    inscription.hidden = false;
    footer.hidden = false;
    updateContinueButton();
  }

  function startNewGame() {
    state = defaultState();
    saveState();
    openCampaign();
  }

  function continueGame() {
    state = getSavedState();
    if (!state) return startNewGame();
    openCampaign();
  }

  function switchTab(tab) {
    if (!state) return;
    state.tab = tab;
    document.querySelectorAll(".campaign-tab").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.tab === tab);
    });
    renderCampaign();
    saveState();
  }

  function renderCampaign() {
    if (!state) return;
    resources.gold.textContent = String(state.gold);
    resources.rations.textContent = String(state.rations);
    campaignTitle.textContent = state.tab === "bastion" ? "BASTIÓN DEL ÚLTIMO FAROL" :
      state.tab === "company" ? "REGISTRO DE LA COMPAÑÍA" :
      state.tab === "route" ? "MAPA DE LAS TIERRAS MALDITAS" :
      state.tab === "rest" ? "CÁMARA DEL ÚLTIMO FAROL" : "MERCADER DEL BASTIÓN";

    document.querySelectorAll(".campaign-tab").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.tab === state.tab);
    });

    if (state.tab === "bastion") campaignMain.innerHTML = renderBastion();
    if (state.tab === "company") campaignMain.innerHTML = renderCompany();
    if (state.tab === "route") campaignMain.innerHTML = renderRoute();
    if (state.tab === "rest") campaignMain.innerHTML = renderRest();
    if (state.tab === "shop") campaignMain.innerHTML = renderShop();
  }

  function renderBastion() {
    const peek = characters.map((character) => {
      const active = state.party.includes(character.id);
      return '<div class="peek-member"><span class="member-sigil">' + character.sign + '</span><div><strong>' + character.name + '</strong><small>' + character.role + '</small></div><span class="peek-status">' + (active ? "EN RUTA" : "EN RESERVA") + '</span></div>';
    }).join("");
    const regionPreview = regions.map((region) =>
      '<div class="region-preview-item"><strong>' + region.index + ' · ' + region.name + '</strong><small>' + region.sites.length + ' LOCALIZACIONES · JEFE: ' + region.boss + '</small></div>'
    ).join("");

    return '<div class="campaign-page">' +
      '<div class="page-heading"><div><span class="section-eyebrow">ZONA SEGURA · SIN AMENAZAS CONOCIDAS</span><h2>El Bastión del Último Farol</h2><p>Un refugio levantado alrededor de una llama que se niega a morir. Aquí la compañía puede prepararse antes de cruzar las murallas.</p></div><span class="route-legend">CAMPAMENTO PRINCIPAL</span></div>' +
      '<div class="bastion-grid">' +
        '<section class="camp-panel bastion-intro"><span class="section-eyebrow">EL ÚLTIMO LUGAR ENCENDIDO</span><h3>La noche no ha conseguido entrar… todavía.</h3><p>Tras las puertas del bastión, los cinco juramentos permanecen unidos. Fuera esperan tres territorios corrompidos, cada uno gobernado por una criatura que guarda parte de la maldición.</p><div class="bastion-quote">«Descansad mientras la llama siga viva.»</div></section>' +
        '<aside class="camp-panel company-peek"><div class="panel-heading"><h3>La compañía</h3><span>05 DESTINOS</span></div><div class="peek-roster">' + peek + '</div></aside>' +
      '</div>' +
      '<div class="sanctuary-strip">' +
        '<button class="sanctuary-tile" type="button" data-tab="rest"><span class="sanctuary-icon">✚</span><span><strong>Descansar</strong><small>Recuperar fuerzas y heridas</small></span></button>' +
        '<button class="sanctuary-tile" type="button" data-tab="shop"><span class="sanctuary-icon">⚒</span><span><strong>Mercader</strong><small>Comprar suministros para la ruta</small></span></button>' +
        '<button class="sanctuary-tile" type="button" data-tab="route"><span class="sanctuary-icon">⌖</span><span><strong>Partir de expedición</strong><small>Elegir uno de los tres territorios</small></span></button>' +
      '</div>' +
      '<section class="camp-panel region-preview"><div class="panel-heading"><h3>La ruta que aguarda más allá</h3><span>03 TERRITORIOS · 03 JEFES</span></div><div class="region-preview-list">' + regionPreview + '</div></section>' +
      '<p class="campaign-notice">' + state.notice + '</p>' +
    '</div>';
  }

  function renderCompany() {
    const rows = characters.map((character) => {
      const active = state.party.includes(character.id);
      const hp = state.hp[character.id] || 100;
      const disabled = !active && state.party.length >= 4;
      return '<article class="character-row ' + (active ? "is-active" : "") + '">' +
        '<div class="character-portrait">' + character.sign + '</div>' +
        '<div class="character-meta"><strong>' + character.name + '</strong><small>' + character.role + ' · ' + character.title.toUpperCase() + '</small><p>' + character.detail + '</p></div>' +
        '<div class="character-side"><small>VITALIDAD ' + hp + '%</small><button class="party-toggle ' + (active ? "is-selected" : "") + '" type="button" data-action="toggle-party" data-id="' + character.id + '" ' + (disabled ? "disabled" : "") + '>' + (active ? "EN EL GRUPO" : "EN RESERVA") + '</button></div>' +
      '</article>';
    }).join("");
    const remaining = 4 - state.party.length;
    const slots = [0,1,2,3].map((n) => '<span class="party-slot ' + (n < state.party.length ? "filled" : "") + '"></span>').join("");
    return '<div class="campaign-page"><div class="page-heading"><div><span class="section-eyebrow">CINCO PERSONAS · UNA COMPAÑÍA</span><h2>Los cinco juramentos</h2><p>La expedición admite cuatro miembros. El quinto permanece en el bastión y puede entrar en el grupo cuando reorganices la compañía.</p></div></div>' +
      '<div class="company-layout"><section class="character-roster">' + rows + '</section>' +
      '<aside class="camp-panel party-summary"><span class="section-eyebrow">GRUPO DE EXPEDICIÓN</span><div class="party-number">' + state.party.length + '<small> / 4</small></div><div class="party-slots">' + slots + '</div><div class="panel-heading"><h3>Los elegidos</h3><span>' + (remaining === 0 ? "LISTOS" : "FALTAN " + remaining) + '</span></div>' +
      '<p>Selecciona cuatro héroes para salir del bastión. Para cambiar a uno, primero retira a alguien del grupo y después incorpora al personaje que está en reserva.</p><p>Los nombres, las clases y los rasgos son provisionales. Más adelante los adaptaremos a ti y a tus amigos.</p><button class="game-action" type="button" data-tab="route">PREPARAR RUTA →</button></aside></div><p class="campaign-notice">' + state.notice + '</p></div>';
  }

  function renderRoute() {
    const selectedRegion = regions.find((region) => region.id === state.selectedRegion) || regions[0];
    const selectedSite = selectedRegion.sites.find((site) => site.id === state.selectedSite);
    const cards = regions.map((region) => {
      const selected = region.id === selectedRegion.id;
      const sites = region.sites.map((site) => {
        const visited = state.visitedSites.includes(site.id);
        const active = state.selectedSite === site.id;
        return '<button class="site-node ' + (active ? "is-selected" : "") + '" type="button" data-action="select-site" data-region="' + region.id + '" data-site="' + site.id + '">' +
          '<span class="node-number">' + site.icon + '</span><span><strong>' + site.name + '</strong><small>' + (visited ? "VISITADO" : site.kind) + '</small></span></button>';
      }).join("");
      return '<article class="region-column ' + (selected ? "is-selected" : "") + '">' +
        '<div class="region-topline"><span>REGIÓN ' + region.index + '</span><span>' + region.short + '</span></div>' +
        '<h3>' + region.name + '</h3><p class="region-description">' + region.atmosphere + '</p>' +
        '<button class="game-action secondary" type="button" data-action="select-region" data-region="' + region.id + '">VER TERRITORIO</button>' +
        '<div class="route-sites">' + sites + '</div>' +
        '<div class="region-boss"><small>JEFE FINAL · ' + region.bossRole + '</small><strong>' + region.boss + '</strong><p>Encuentro principal al final de este territorio</p></div>' +
      '</article>';
    }).join("");

    let detailTitle = selectedRegion.boss;
    let detailType = "JEFE FINAL";
    let detailText = selectedRegion.bossDescription;
    let detailAction = '<button class="game-action" type="button" data-action="boss-preview">INSPECCIONAR JEFE →</button>';
    if (selectedSite) {
      detailTitle = selectedSite.name;
      detailType = selectedSite.kind;
      detailText = selectedSite.description;
      const visited = state.visitedSites.includes(selectedSite.id);
      detailAction = visited
        ? '<span class="section-eyebrow">LOCALIZACIÓN REGISTRADA</span>'
        : '<button class="game-action" type="button" data-action="visit-site" data-site="' + selectedSite.id + '">REGISTRAR VISITA</button>';
    }
    return '<div class="campaign-page"><div class="page-heading"><div><span class="section-eyebrow">TRES TERRITORIOS · TRES JEFES</span><h2>La ruta de la maldición</h2><p>Cada territorio esconde tres localizaciones. Al final de cada uno espera un jefe que guarda una parte de la historia.</p></div><span class="route-legend">⌖ SELECCIONA UN MARCADOR</span></div>' +
      '<div class="route-layout">' + cards + '</div>' +
      '<section class="site-detail"><div><span class="section-eyebrow">' + selectedRegion.name.toUpperCase() + ' · ' + detailType + '</span><h3>' + detailTitle + '</h3><p>' + detailText + '</p></div><div class="site-detail-actions">' + detailAction + '<button class="game-action secondary" type="button" data-action="prepare-expedition">PREPARAR EXPEDICIÓN</button></div></section>' +
      '<p class="campaign-notice">' + state.notice + '</p></div>';
  }

  function renderRest() {
    const hurt = characters.filter((character) => (state.hp[character.id] || 100) < 100).length;
    return '<div class="campaign-page"><div class="page-heading"><div><span class="section-eyebrow">EL FUEGO TODAVÍA ARDE</span><h2>Descanso en el bastión</h2><p>Lejos de las rutas malditas, la compañía puede cerrar heridas y recuperar fuerzas antes de volver a salir.</p></div></div>' +
      '<div class="rest-layout"><section class="camp-panel rest-chamber"><div class="rest-symbol">✚</div><span class="section-eyebrow">CÁMARA DEL ÚLTIMO FAROL</span><h3>Unas horas lejos de la oscuridad</h3><p>La compañía se reúne alrededor del fuego. El calor devuelve el aliento y las vendas se renuevan. El descanso consume una ración de marcha.</p><div class="rest-cost">COSTE: 1 RACIÓN · DISPONIBLES: ' + state.rations + '</div><button class="game-action" type="button" data-action="rest" ' + (state.rations < 1 ? "disabled" : "") + '>DESCANSAR Y RECUPERAR →</button></section>' +
      '<aside class="camp-panel rest-effect"><h3>Estado de la compañía</h3><div class="inventory-row"><span>Héroes heridos</span><strong>' + hurt + ' / 5</strong></div><div class="inventory-row"><span>Vitalidad recuperada</span><strong>+25 por héroe</strong></div><div class="inventory-row"><span>Grupo activo</span><strong>' + state.party.length + ' / 4</strong></div><p>El descanso también atiende al miembro que permanece en reserva. Nadie queda atrás dentro de los muros.</p></aside></div><p class="campaign-notice">' + state.notice + '</p></div>';
  }

  function renderShop() {
    const offers = items.map((item) => {
      const owned = item.kind === "rations" ? state.rations : (state.inventory[item.kind] || 0);
      return '<div class="supply-item"><span class="supply-icon">' + item.icon + '</span><div><strong>' + item.name + '</strong><small>' + item.desc + '</small><em>' + item.price + ' ORO · EN BOLSA: ' + owned + '</em></div><button class="buy-button" type="button" data-action="buy" data-item="' + item.id + '" ' + (state.gold < item.price ? "disabled" : "") + '>COMPRAR</button></div>';
    }).join("");
    return '<div class="campaign-page"><div class="page-heading"><div><span class="section-eyebrow">SUMINISTROS PARA QUIENES SE ATREVEN A SALIR</span><h2>El mercader del bastión</h2><p>No pregunta qué habéis visto en el camino. Solo cuánto oro queda y cuánto tiempo podéis aguantar fuera.</p></div><span class="route-legend">◈ ' + state.gold + ' MONEDAS</span></div>' +
      '<div class="shop-layout"><section class="supply-list">' + offers + '</section><aside class="camp-panel inventory-panel"><div class="panel-heading"><h3>Inventario de la compañía</h3><span>MOCHILA</span></div>' +
      '<div class="inventory-row"><span>Raciones de marcha</span><strong>' + state.rations + '</strong></div><div class="inventory-row"><span>Vendas de lino</span><strong>' + state.inventory.bandage + '</strong></div><div class="inventory-row"><span>Tónicos de raíz negra</span><strong>' + state.inventory.tonic + '</strong></div><div class="inventory-row"><span>Aceite de lámpara</span><strong>' + state.inventory.oil + '</strong></div><p class="campaign-notice">Los objetos están preparados como estructura inicial. Sus efectos en combate se añadirán cuando desarrollemos el sistema de batalla.</p></aside></div><p class="campaign-notice">' + state.notice + '</p></div>';
  }

  function openDialog(kind) {
    lastFocusedElement = document.activeElement;
    backdrop.hidden = false;
    if (kind === "begin") {
      dialogEyebrow.textContent = "EL PRIMER JURAMENTO";
      dialogTitle.textContent = "La noche tiene memoria";
      dialogContent.innerHTML = '<p class="dialog-emphasis">En algún lugar, más allá de las murallas, algo ha despertado.</p><p>La tierra se ha vuelto hostil. Cinco destinos quedarán unidos por una misma maldición.</p><p>Cuatro caminarán hacia la oscuridad. Uno guardará el fuego.</p>';
      dialogActions.innerHTML = '<button class="dialog-button" type="button" data-action="close-dialog">Volver al menú <span>←</span></button>';
    }
    if (kind === "options") {
      dialogEyebrow.textContent = "AJUSTES DEL BASTIÓN";
      dialogTitle.textContent = "Opciones";
      dialogContent.innerHTML = '<div class="options-list"><div class="option-row"><div><span class="option-name">Contraste sombrío</span><span class="option-description">Refuerza las sombras del escenario.</span></div><button class="toggle-button" type="button" data-setting="highContrast" aria-pressed="' + settings.highContrast + '">' + (settings.highContrast ? "SÍ" : "NO") + '</button></div><div class="option-row"><div><span class="option-name">Reducir movimiento</span><span class="option-description">Desactiva las animaciones ambientales.</span></div><button class="toggle-button" type="button" data-setting="reduceMotion" aria-pressed="' + settings.reduceMotion + '">' + (settings.reduceMotion ? "SÍ" : "NO") + '</button></div></div>';
      dialogActions.innerHTML = '<button class="dialog-button" type="button" data-action="close-dialog">Guardar y volver <span>←</span></button>';
    }
    if (kind === "credits") {
      dialogEyebrow.textContent = "REGISTRO DE LA COMPAÑÍA";
      dialogTitle.textContent = "Créditos";
      dialogContent.innerHTML = '<div class="credits-list"><div class="credit-item"><span class="credit-role">CONCEPTO Y DESARROLLO</span><span class="credit-name">THE FIVE — La Maldición</span></div><div class="credit-item"><span class="credit-role">DIRECCIÓN ARTÍSTICA</span><span class="credit-name">Fantasía oscura · Pixel art original</span></div><div class="credit-item"><span class="credit-role">ESTADO</span><span class="credit-name">Build 002 — esqueleto de campaña</span></div></div>';
      dialogActions.innerHTML = '<button class="dialog-button" type="button" data-action="close-dialog">Volver al menú <span>←</span></button>';
    }
    if (kind === "boss") {
      const region = regions.find((entry) => entry.id === state.selectedRegion) || regions[0];
      dialogEyebrow.textContent = region.bossRole;
      dialogTitle.textContent = region.boss;
      dialogContent.innerHTML = '<p class="dialog-emphasis">' + region.name + '</p><p>' + region.bossDescription + '</p><p>El jefe está definido en el mapa. Su combate, patrones y recompensas se desarrollarán en la siguiente fase del juego.</p>';
      dialogActions.innerHTML = '<button class="dialog-button" type="button" data-action="close-dialog">Volver al mapa <span>←</span></button>';
    }
    if (kind === "expedition") {
      const region = regions.find((entry) => entry.id === state.selectedRegion) || regions[0];
      const partyNames = characters.filter((entry) => state.party.includes(entry.id)).map((entry) => entry.name).join(", ");
      dialogEyebrow.textContent = "ORDEN DE MARCHA";
      dialogTitle.textContent = "La compañía está preparada";
      dialogContent.innerHTML = '<p class="dialog-emphasis">' + region.name + '</p><p>Partirán: ' + partyNames + '.</p><p>Esta versión contiene el mapa, las localizaciones y la preparación de expedición. El desplazamiento y el combate táctico se añadirán después.</p>';
      dialogActions.innerHTML = '<button class="dialog-button" type="button" data-action="close-dialog">Volver al mapa <span>←</span></button>';
    }
    const first = backdrop.querySelector("button");
    if (first) first.focus();
  }

  function closeDialog() {
    if (backdrop.hidden) return;
    backdrop.hidden = true;
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") lastFocusedElement.focus();
  }

  function showNotice(message) {
    state.notice = message;
    renderCampaign();
    saveState();
  }

  function visitSite(siteId) {
    if (!state.visitedSites.includes(siteId)) state.visitedSites.push(siteId);
    state.selectedSite = siteId;
    showNotice("Localización registrada en el diario de ruta. La siguiente fase añadirá encuentros y recompensas para cada lugar.");
  }

  function restCompany() {
    if (state.rations < 1) return showNotice("No quedan raciones. Visita al mercader antes de descansar.");
    state.rations -= 1;
    characters.forEach((character) => {
      state.hp[character.id] = Math.min(100, (state.hp[character.id] || 100) + 25);
    });
    showNotice("La compañía ha descansado. Todos recuperan hasta 25 puntos de vitalidad.");
  }

  function buyItem(itemId) {
    const item = items.find((entry) => entry.id === itemId);
    if (!item) return;
    if (state.gold < item.price) return showNotice("No tienes oro suficiente para comprar " + item.name + ".");
    state.gold -= item.price;
    if (item.kind === "rations") state.rations += 1;
    else state.inventory[item.kind] = (state.inventory[item.kind] || 0) + 1;
    showNotice("Has comprado: " + item.name + ". El mercader guarda el resto de sus mercancías.");
  }

  function handleAction(action, target) {
    if (action === "begin") return startNewGame();
    if (action === "continue") return continueGame();
    if (action === "options" || action === "credits") return openDialog(action);
    if (action === "close-dialog") return closeDialog();
    if (action === "back-menu") return returnToTitle();
    if (action === "boss-preview") return openDialog("boss");
    if (action === "prepare-expedition") {
      if (state.party.length !== 4) return showNotice("Necesitas seleccionar exactamente cuatro héroes en la sección Compañía antes de partir.");
      return openDialog("expedition");
    }
    if (action === "visit-site") return visitSite(target.dataset.site);
    if (action === "rest") return restCompany();
    if (action === "buy") return buyItem(target.dataset.item);
    if (action === "toggle-party") {
      const id = target.dataset.id;
      if (state.party.includes(id)) {
        if (state.party.length <= 1) return showNotice("La compañía necesita al menos un miembro.");
        state.party = state.party.filter((entry) => entry !== id);
      } else {
        if (state.party.length >= 4) return showNotice("El grupo ya tiene cuatro miembros. Retira a alguien antes de incorporar a otro.");
        state.party.push(id);
      }
      showNotice("Composición de la compañía actualizada.");
      return;
    }
    if (action === "select-region") {
      state.selectedRegion = target.dataset.region;
      const region = regions.find((entry) => entry.id === state.selectedRegion) || regions[0];
      state.selectedSite = region.sites[0].id;
      renderCampaign();
      saveState();
      return;
    }
    if (action === "select-site") {
      state.selectedRegion = target.dataset.region;
      state.selectedSite = target.dataset.site;
      renderCampaign();
      saveState();
      return;
    }
  }

  document.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-action]");
    if (actionButton) {
      handleAction(actionButton.dataset.action, actionButton);
      return;
    }
    const tabButton = event.target.closest("[data-tab]");
    if (tabButton) {
      switchTab(tabButton.dataset.tab);
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
      const focusable = Array.from(backdrop.querySelectorAll("button:not(:disabled)"));
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
  updateContinueButton();
})();