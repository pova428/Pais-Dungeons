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
    { id:"guardian", name:"Pol", title:"El Flaco", role:"GUARDIÁN", sign:"P", icon:"♜", detail:"Defensor de primera línea.", trait:"Firme como la piedra" },
    { id:"duelist", name:"Salim", title:"El Moro", role:"DUELISTA", sign:"S", icon:"⚔", detail:"Combatiente ágil y preciso.", trait:"Nunca ataca dos veces igual" },
    { id:"arcanist", name:"Igor", title:"El Alto", role:"ARCANISTA", sign:"I", icon:"✧", detail:"Estudia artes prohibidas.", trait:"Escucha voces en las ruinas" },
    { id:"tracker", name:"Ivan", title:"El Gordo", role:"RASTREADOR", sign:"V", icon:"➶", detail:"Explorador y tirador.", trait:"Siempre encuentra un camino" },
    { id:"alchemist", name:"Alex", title:"El Mujeriego", role:"ALQUIMISTA", sign:"A", icon:"⚗", detail:"Prepara remedios y mezclas.", trait:"La muerte puede esperar" }
  ];

  const regions = [
    {
      id:"institute", index:"I", name:"Instituto Camí de Mar", short:"CAMÍ DE MAR", atmosphere:"Las clases han terminado. La pesadilla acaba de empezar.",
      description:"Los pasillos del instituto están vacíos, pero las aulas siguen encendidas. Algo se mueve detrás de las puertas de las clases.",
      boss:"Redes", bossRole:"SALA DEL JEFE",
      bossDescription:"El último aula del instituto. Los cables se retuercen por las paredes y el equipo de red sigue funcionando aunque el edificio esté desierto.",
      sites:[
        {id:"institute-programming",name:"Programacion",kind:"AULA",description:"Las pantallas siguen mostrando líneas de código que nadie recuerda haber escrito. Cada ordenador parece estar esperando una orden.",icon:"Ⅰ"},
        {id:"institute-database",name:"Base de Datos",kind:"AULA",description:"En el aula hay archivadores abiertos y servidores que zumban detrás de una puerta cerrada. Los registros no dejan de cambiar.",icon:"Ⅱ"},
        {id:"institute-yard",name:"Patio",kind:"EXTERIOR",description:"El patio está cubierto por una niebla espesa. Las puertas de acceso se han cerrado y se oyen pasos al otro lado de la pista.",icon:"Ⅲ"},
        {id:"institute-networks",name:"Redes",kind:"JEFE FINAL",description:"La sala final del instituto. Una maraña de cables, armarios de comunicaciones y luces rojas protege el camino de salida.",icon:"Ⅳ",boss:true}
      ]
    },
    {
      id:"baix-penedes", index:"II", name:"Baix Penedes", short:"BAIX PENEDES", atmosphere:"Carreteras conocidas que ya no llevan a casa.",
      description:"Una comarca convertida en territorio hostil. Los lugares cotidianos han quedado aislados y la carretera parece no terminar nunca.",
      boss:"Sushi", bossRole:"SALA DEL JEFE",
      bossDescription:"La sala final de Baix Penedes. Tras la última puerta espera el encuentro que cierra esta zona y guarda el paso hacia Steam.",
      sites:[
        {id:"baix-bowling",name:"Bolera",kind:"LOCAL DE OCIO",description:"Las pistas siguen encendidas y los bolos caen sin que nadie lance la bola. Algo espera al fondo del local.",icon:"Ⅰ"},
        {id:"baix-n340",name:"N-340",kind:"CARRETERA",description:"Una carretera bloqueada por vehículos abandonados. Las señales apuntan a destinos que ya no existen.",icon:"Ⅱ"},
        {id:"baix-cinema",name:"Cine",kind:"EDIFICIO",description:"La sesión lleva horas empezada. En la pantalla se proyectan imágenes de la propia compañía caminando por el edificio.",icon:"Ⅲ"},
        {id:"baix-sushi",name:"Sushi",kind:"JEFE FINAL",description:"La última sala de Baix Penedes. El local parece tranquilo desde fuera, pero la puerta no se abre desde dentro.",icon:"Ⅳ",boss:true}
      ]
    },
    {
      id:"steam", index:"III", name:"Steam", short:"STEAM", atmosphere:"Las partidas no terminan cuando abandonas el ordenador.",
      description:"Un territorio formado por mundos de terror que se han mezclado entre sí. Cada puerta lleva a una experiencia distinta y ninguna permite salir fácilmente.",
      boss:"Clubes", bossRole:"SALA DEL JEFE",
      bossDescription:"El último lugar de Steam. La compañía tendrá que superar el desafío final para cerrar esta parte de la maldición.",
      sites:[
        {id:"steam-content-warning",name:"Content warning",kind:"MUNDO DE TERROR",description:"Una expedición con cámara en mano. Hay que grabar lo que acecha en las sombras, aunque algo también esté grabando al grupo.",icon:"Ⅰ"},
        {id:"steam-labyrinthine",name:"Labyrinthine",kind:"LABERINTO",description:"Un laberinto de pasillos cambiantes. Las marcas en las paredes no siempre conducen al mismo sitio.",icon:"Ⅱ"},
        {id:"steam-backrooms",name:"Escape Backrooms",kind:"ZONA LIMINAL",description:"Habitaciones amarillentas, luces que zumban y corredores que se repiten. El camino de vuelta parece haberse borrado.",icon:"Ⅲ"},
        {id:"steam-clubs",name:"Clubes",kind:"JEFE FINAL",description:"La última sala de Steam. Las luces, el ruido y las sombras anuncian el desafío que cierra la tercera ruta.",icon:"Ⅳ",boss:true}
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
    selectedRegion:"institute",
    selectedSite:"institute-programming",
    visitedSites:[],
    notice:"Elige una ruta y supera cada parada para avanzar."
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

  function getUnlockedRegionIndex(completedSites) {
    let unlocked = 0;
    for (let i = 0; i < regions.length - 1; i += 1) {
      const boss = regions[i].sites.find((site) => site.boss);
      if (boss && completedSites.includes(boss.id)) unlocked = i + 1;
      else break;
    }
    return unlocked;
  }

  function isRegionUnlocked(regionIndex, completedSites) {
    return regionIndex >= 0 && regionIndex <= getUnlockedRegionIndex(completedSites || state.visitedSites);
  }

  function isSiteUnlocked(region, siteIndex, completedSites) {
    const index = regions.findIndex((entry) => entry.id === region.id);
    const completed = completedSites || state.visitedSites;
    if (siteIndex < 0 || index < 0 || !isRegionUnlocked(index, completed)) return false;
    return region.sites.slice(0, siteIndex).every((site) => completed.includes(site.id));
  }

  function getFirstAvailableSite(region, completedSites) {
    const completed = completedSites || state.visitedSites;
    const index = region.sites.findIndex((site, siteIndex) => isSiteUnlocked(region, siteIndex, completed) && !completed.includes(site.id));
    return index >= 0 ? region.sites[index].id : region.sites[region.sites.length - 1].id;
  }

  function getSavedState() {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || "null");
      if (!saved || !Array.isArray(saved.party) || !saved.hp) return null;
      const validSiteIds = regions.flatMap((region) => region.sites.map((site) => site.id));
      const merged = Object.assign(defaultState(), saved, {
        inventory:Object.assign(defaultState().inventory, saved.inventory || {}),
        hp:Object.assign(defaultState().hp, saved.hp || {}),
        visitedSites:(saved.visitedSites || []).filter((siteId) => validSiteIds.includes(siteId))
      });
      merged.party = merged.party.filter((id) => characters.some((character) => character.id === id)).slice(0,4);
      if (merged.party.length === 0) merged.party = defaultState().party;
      const maximumRegion = getUnlockedRegionIndex(merged.visitedSites);
      let selectedIndex = regions.findIndex((region) => region.id === merged.selectedRegion);
      if (selectedIndex < 0 || selectedIndex > maximumRegion) selectedIndex = maximumRegion;
      merged.selectedRegion = regions[selectedIndex].id;
      const selected = regions[selectedIndex];
      const siteIndex = selected.sites.findIndex((site) => site.id === merged.selectedSite);
      if (siteIndex < 0 || !isSiteUnlocked(selected,siteIndex,merged.visitedSites)) {
        merged.selectedSite = getFirstAvailableSite(selected,merged.visitedSites);
      }
      return merged;
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
    const averageLife = Math.round(state.party.reduce((sum,id) => sum + (state.hp[id] || 100),0) / Math.max(1,state.party.length));
    const lifeCount = document.getElementById("life-count");
    const healthResource = document.getElementById("health-resource");
    if (lifeCount) lifeCount.textContent = averageLife + "%";
    if (healthResource) healthResource.dataset.low = String(averageLife <= 35);
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
      return '<div class="peek-member"><span class="member-sigil">' + character.sign + '</span><div><strong>' + character.name + ' <em>«' + character.title + '»</em></strong><small>' + character.role + '</small></div><span class="peek-status">' + (active ? "EN RUTA" : "RESERVA") + '</span></div>';
    }).join("");
    const unlocked = getUnlockedRegionIndex(state.visitedSites);
    const regionPreview = regions.map((region,index) =>
      '<div class="region-preview-item ' + (index > unlocked ? "is-locked" : "") + '"><strong>' + (index > unlocked ? "🔒 " : region.index + " · ") + region.name + '</strong><small>' + (index > unlocked ? "BLOQUEADO" : region.sites.length + " PARADAS") + '</small></div>'
    ).join("");
    return '<div class="campaign-page">' +
      '<div class="page-heading"><div><span class="section-eyebrow">REFUGIO</span><h2>El Bastión</h2></div></div>' +
      '<div class="bastion-grid">' +
        '<section class="camp-panel bastion-intro"><span class="section-eyebrow">ZONA SEGURA</span><h3>Preparaos para salir.</h3><div class="bastion-quote">«La próxima ruta os espera.»</div></section>' +
        '<aside class="camp-panel company-peek"><div class="panel-heading"><h3>Los cinco</h3><span>05</span></div><div class="peek-roster">' + peek + '</div></aside>' +
      '</div>' +
      '<div class="sanctuary-strip">' +
        '<button class="sanctuary-tile" type="button" data-tab="rest"><span class="sanctuary-icon">✚</span><span><strong>Descansar</strong><small>Recuperar vida</small></span></button>' +
        '<button class="sanctuary-tile" type="button" data-tab="shop"><span class="sanctuary-icon">⚒</span><span><strong>Tienda</strong><small>Comprar objetos</small></span></button>' +
        '<button class="sanctuary-tile" type="button" data-tab="route"><span class="sanctuary-icon">⌖</span><span><strong>Rutas</strong><small>Elegir destino</small></span></button>' +
      '</div>' +
      '<section class="camp-panel region-preview"><div class="panel-heading"><h3>Territorios</h3><span>' + (unlocked + 1) + ' / 3 ABIERTOS</span></div><div class="region-preview-list">' + regionPreview + '</div></section>' +
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
        '<div class="character-meta"><strong>' + character.name + ' <em>«' + character.title + '»</em></strong><small>' + character.role + '</small><div class="character-health"><span style="width:' + hp + '%"></span></div></div>' +
        '<div class="character-side"><small>' + hp + '% VIDA</small><button class="party-toggle ' + (active ? "is-selected" : "") + '" type="button" data-action="toggle-party" data-id="' + character.id + '" ' + (disabled ? "disabled" : "") + '>' + (active ? "EN GRUPO" : "EN RESERVA") + '</button></div>' +
      '</article>';
    }).join("");
    const slots = [0,1,2,3].map((n) => '<span class="party-slot ' + (n < state.party.length ? "filled" : "") + '"></span>').join("");
    return '<div class="campaign-page"><div class="page-heading"><div><span class="section-eyebrow">PERSONAJES</span><h2>La compañía</h2></div></div>' +
      '<div class="company-layout"><section class="character-roster">' + rows + '</section>' +
      '<aside class="camp-panel party-summary"><span class="section-eyebrow">GRUPO ACTIVO</span><div class="party-number">' + state.party.length + '<small> / 4</small></div><div class="party-slots">' + slots + '</div><button class="game-action" type="button" data-tab="route">IR A RUTAS →</button></aside></div></div>';
  }

  function renderRoute() {
    const unlockedRegionIndex = getUnlockedRegionIndex(state.visitedSites);
    if (!isRegionUnlocked(regions.findIndex((region) => region.id === state.selectedRegion), state.visitedSites)) {
      state.selectedRegion = regions[unlockedRegionIndex].id;
      state.selectedSite = getFirstAvailableSite(regions[unlockedRegionIndex], state.visitedSites);
    }
    const selectedRegion = regions.find((region) => region.id === state.selectedRegion) || regions[0];
    let selectedSite = selectedRegion.sites.find((site) => site.id === state.selectedSite);
    if (!selectedSite) {
      state.selectedSite = getFirstAvailableSite(selectedRegion, state.visitedSites);
      selectedSite = selectedRegion.sites.find((site) => site.id === state.selectedSite);
    }
    const bossSelected = Boolean(selectedSite.boss);
    const cards = regions.map((region) => {
      const regionIndex = regions.findIndex((entry) => entry.id === region.id);
      const regionUnlocked = isRegionUnlocked(regionIndex, state.visitedSites);
      const selected = region.id === selectedRegion.id;
      const sites = region.sites.map((site, siteIndex) => {
        const siteUnlocked = isSiteUnlocked(region, siteIndex, state.visitedSites);
        const completed = state.visitedSites.includes(site.id);
        const active = state.selectedSite === site.id;
        const locked = !regionUnlocked || !siteUnlocked;
        const action = site.boss ? "select-boss" : "select-site";
        const status = completed ? "SUPERADO" : locked ? "BLOQUEADO" : site.boss ? "JEFE FINAL" : "DISPONIBLE";
        return '<button class="site-node ' + (active ? "is-selected " : "") + (site.boss ? "boss-node " : "") + (locked ? "is-locked" : "") + '" type="button" data-action="' + action + '" data-region="' + region.id + '" data-site="' + site.id + '" ' + (locked ? 'disabled aria-disabled="true"' : "") + '>' +
          '<span class="node-number">' + (completed ? "✓" : locked ? "🔒" : site.icon) + '</span><span><strong>' + site.name + '</strong><small>' + status + '</small></span></button>';
      }).join("");
      return '<article class="region-column ' + (selected ? "is-selected " : "") + (regionUnlocked ? "" : "is-locked") + '">' +
        '<div class="region-topline"><span>ZONA ' + region.index + '</span><span>' + (regionUnlocked ? region.short : "🔒 CERRADA") + '</span></div>' +
        '<h3>' + region.name + '</h3>' +
        (regionUnlocked ? '<button class="game-action secondary" type="button" data-action="select-region" data-region="' + region.id + '">ENTRAR</button>' : '<div class="region-seal">🔒 BLOQUEADA</div>') +
        '<div class="route-sites">' + sites + '</div>' +
      '</article>';
    }).join("");
    const siteCompleted = state.visitedSites.includes(selectedSite.id);
    const detailType = selectedSite.boss ? (siteCompleted ? "JEFE DERROTADO" : "JEFE FINAL") : (siteCompleted ? "LOCALIZACIÓN SUPERADA" : "LOCALIZACIÓN");
    const detailAction = selectedSite.boss
      ? (siteCompleted ? '<span class="progress-complete">✓ JEFE SUPERADO</span>' : '<button class="game-action" type="button" data-action="boss-preview">VER JEFE →</button>')
      : (siteCompleted ? '<span class="progress-complete">✓ NIVEL SUPERADO</span>' : '<button class="game-action" type="button" data-action="complete-site" data-site="' + selectedSite.id + '">SUPERAR NIVEL →</button>');
    return '<div class="campaign-page"><div class="page-heading"><div><span class="section-eyebrow">PROGRESO ' + (unlockedRegionIndex + 1) + ' / 3 ZONAS</span><h2>Mapa de rutas</h2></div><span class="route-legend">🔒 CERRADO · ✓ SUPERADO</span></div>' +
      '<div class="route-layout">' + cards + '</div>' +
      '<section class="site-detail"><div><span class="section-eyebrow">' + selectedRegion.name.toUpperCase() + ' · ' + detailType + '</span><h3>' + selectedSite.name + '</h3></div><div class="site-detail-actions">' + detailAction + '<button class="game-action secondary" type="button" data-action="prepare-expedition">PREPARAR GRUPO</button></div></section>' +
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
      dialogContent.innerHTML = '<div class="credits-list"><div class="credit-item"><span class="credit-role">CONCEPTO Y DESARROLLO</span><span class="credit-name">PAIS DUNGEON</span></div><div class="credit-item"><span class="credit-role">DIRECCIÓN ARTÍSTICA</span><span class="credit-name">Fantasía oscura · Pixel art original</span></div><div class="credit-item"><span class="credit-role">ESTADO</span><span class="credit-name">Build 002 — esqueleto de campaña</span></div></div>';
      dialogActions.innerHTML = '<button class="dialog-button" type="button" data-action="close-dialog">Volver al menú <span>←</span></button>';
    }
    if (kind === "boss") {
      const region = regions.find((entry) => entry.id === state.selectedRegion) || regions[0];
      const boss = region.sites.find((site) => site.boss);
      const bossIndex = region.sites.findIndex((site) => site.boss);
      const unlocked = isSiteUnlocked(region,bossIndex,state.visitedSites);
      const defeated = state.visitedSites.includes(boss.id);
      dialogEyebrow.textContent = region.bossRole;
      dialogTitle.textContent = region.boss;
      dialogContent.innerHTML = '<p class="dialog-emphasis">' + region.name + '</p><p>' + region.bossDescription + '</p><p class="dialog-caveat">El combate real se añadirá en una próxima versión.</p>';
      dialogActions.innerHTML = defeated
        ? '<button class="dialog-button" type="button" data-action="close-dialog">Cerrar <span>←</span></button>'
        : (unlocked ? '<button class="dialog-button" type="button" data-action="defeat-boss">SIMULAR VICTORIA <span>✦</span></button>' : '<button class="dialog-button" type="button" data-action="close-dialog">Volver al mapa <span>←</span></button>');
    }
    if (kind === "expedition") {
      const region = regions.find((entry) => entry.id === state.selectedRegion) || regions[0];
      const partyNames = characters.filter((entry) => state.party.includes(entry.id)).map((entry) => entry.name + " «" + entry.title + "»").join(", ");
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

  function completeSite(siteId) {
    const region = regions.find((entry) => entry.sites.some((site) => site.id === siteId));
    if (!region) return;
    const siteIndex = region.sites.findIndex((site) => site.id === siteId);
    if (!isSiteUnlocked(region, siteIndex, state.visitedSites)) return showNotice("Esta parada sigue bloqueada. Supera la anterior para continuar.");
    if (region.sites[siteIndex].boss) return openDialog("boss");
    if (!state.visitedSites.includes(siteId)) state.visitedSites.push(siteId);
    const nextSite = region.sites[siteIndex + 1];
    state.selectedRegion = region.id;
    if (nextSite) {
      state.selectedSite = nextSite.id;
      state.notice = "Nivel superado. Se ha abierto: " + nextSite.name + ".";
    } else {
      state.selectedSite = region.sites[region.sites.length - 1].id;
      state.notice = "Las tres paradas están superadas. ¡La sala del jefe está abierta!";
    }
    saveState();
    renderCampaign();
  }

  function defeatBoss() {
    const regionIndex = regions.findIndex((region) => region.id === state.selectedRegion);
    const region = regions[regionIndex];
    const boss = region.sites.find((site) => site.boss);
    const bossIndex = region.sites.findIndex((site) => site.boss);
    if (!isSiteUnlocked(region,bossIndex,state.visitedSites)) return showNotice("El jefe permanece protegido. Supera primero todas las localizaciones.");
    if (!state.visitedSites.includes(boss.id)) state.visitedSites.push(boss.id);
    if (regions[regionIndex + 1]) {
      const nextRegion = regions[regionIndex + 1];
      state.selectedRegion = nextRegion.id;
      state.selectedSite = nextRegion.sites[0].id;
      state.tab = "route";
      state.notice = "Jefe superado. Se ha desbloqueado la zona " + nextRegion.name + ".";
    } else {
      state.selectedSite = boss.id;
      state.notice = "Has superado el último jefe. La campaña de Pais Dungeon está completada.";
    }
    saveState();
    closeDialog();
    renderCampaign();
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
    if (action === "complete-site" || action === "visit-site") return completeSite(target.dataset.site);
    if (action === "defeat-boss") return defeatBoss();
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
    if (action === "select-boss" || action === "select-site") {
      const region = regions.find((entry) => entry.id === target.dataset.region);
      const siteIndex = region ? region.sites.findIndex((site) => site.id === target.dataset.site) : -1;
      if (!region || !isSiteUnlocked(region,siteIndex,state.visitedSites)) return showNotice("Ruta bloqueada. Supera la parada anterior para continuar.");
      state.selectedRegion = region.id;
      state.selectedSite = target.dataset.site;
      renderCampaign();
      saveState();
      return;
    }
    if (action === "select-region") {
      const index = regions.findIndex((entry) => entry.id === target.dataset.region);
      if (index < 0 || !isRegionUnlocked(index,state.visitedSites)) return showNotice("Esta zona está cerrada. Derrota al jefe de la zona anterior.");
      state.selectedRegion = regions[index].id;
      state.selectedSite = getFirstAvailableSite(regions[index],state.visitedSites);
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