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
    {id:"guardian",name:"Pol",title:"El Flaco",role:"MAGO",sign:"P",icon:"✧",detail:"Mago veloz y frágil, especialista en daño mágico.",strengths:"Mayor velocidad y agilidad. Magia muy potente y gran evasión.",weaknesses:"Poca vida, defensa baja y daño físico reducido.",portrait:"assets/pol-portrait.png",sprites:"assets/pol-sprites.png",base:{hp:58,attack:5,magic:12,defense:4,speed:18,agility:17,mp:60},growth:{hp:5,attack:1,magic:1,defense:1,speed:1,agility:1,mp:4},skills:[
      {id:"arcane-bolt",manaCost:9,target:"enemy",name:"Chispa arcana",detail:"Daño mágico a un enemigo: 90% de MAG.",unlockLevel:1,icon:"✧",kind:"BÁSICA"},
      {id:"burn-mark",manaCost:15,target:"enemy",name:"Marca ígnea",detail:"Quema a un enemigo: 55% de MAG y daño durante 2 turnos.",unlockLevel:4,icon:"♨",kind:"MAGIA"},
      {id:"nova",manaCost:26,target:"all-enemies",name:"Nova elemental",detail:"Explosión mágica que golpea a todos los enemigos: 85% de MAG.",unlockLevel:10,icon:"✦",kind:"ULTIMATE"}
    ]},
    {id:"duelist",name:"Salim",title:"El Moro",role:"ASESINO",sign:"S",icon:"⚔",detail:"Asesino de gran daño y agilidad, pero muy vulnerable.",strengths:"Daño físico más alto. Muy rápido, ágil y con gran potencial crítico.",weaknesses:"Menor vida y defensa del equipo. Sufre mucho si recibe golpes directos.",portrait:"assets/salim-portrait.png",sprites:"assets/salim-sprites.webp",base:{hp:48,attack:13,magic:1,defense:3,speed:17,agility:18,mp:36},growth:{hp:4,attack:1,magic:0,defense:1,speed:1,agility:1,mp:3},skills:[
      {id:"stab",manaCost:8,target:"enemy",name:"Navajazo",detail:"Corte rápido a un enemigo: 100% de ATQ.",unlockLevel:1,icon:"🗡",kind:"BÁSICA"},
      {id:"multi-stab",manaCost:17,target:"enemy",name:"Navajazos múltiples",detail:"Tres cortes consecutivos de 35% de ATQ cada uno.",unlockLevel:4,icon:"⚔",kind:"ATAQUE"},
      {id:"brothers",manaCost:28,target:"all-enemies",name:"Llamar a sus hermanos",detail:"Ataque conjunto contra todos los enemigos con dos impactos de 50% de ATQ.",unlockLevel:10,icon:"✦",kind:"ULTIMATE"}
    ]},
    {id:"arcanist",name:"Igor",title:"El Alto",role:"SANADOR",sign:"I",icon:"✚",detail:"Sanador equilibrado que mantiene al grupo en pie.",strengths:"Curación potente, buena vida y estadísticas equilibradas.",weaknesses:"Menor daño directo que los atacantes y velocidad moderada.",portrait:"assets/igor-portrait.png",sprites:"assets/igor-sprites.png",base:{hp:78,attack:6,magic:11,defense:8,speed:10,agility:10,mp:80},growth:{hp:7,attack:1,magic:1,defense:1,speed:1,agility:1,mp:5},skills:[
      {id:"antivirus",manaCost:12,target:"ally",name:"Antivirus",detail:"Cura a un aliado: 90% de MAG + 6 PV.",unlockLevel:1,icon:"✚",kind:"BÁSICA"},
      {id:"life-drain",manaCost:18,target:"enemy",name:"Drenaje de vida",detail:"Roba vida a un enemigo y recupera el 35% del daño causado.",unlockLevel:4,icon:"☯",kind:"APOYO"},
      {id:"reboot",manaCost:30,target:"all-allies",name:"Reinicio total",detail:"Cura hasta a tres aliados: 75% de MAG + 8 PV a cada uno.",unlockLevel:10,icon:"✦",kind:"ULTIMATE"}
    ]},
    {id:"tracker",name:"Ivan",title:"El Gordo",role:"TANQUE",sign:"V",icon:"⬟",detail:"Tanque del equipo. Aguanta golpes y protege a los demás.",strengths:"Mayor vida y defensa. Escudos fuertes y gran capacidad de protección.",weaknesses:"El más lento y menos ágil. Magia y daño explosivo muy bajos.",portrait:"assets/ivan-portrait.png",sprites:"assets/ivan-sprites.png",base:{hp:116,attack:8,magic:1,defense:15,speed:5,agility:4,mp:48},growth:{hp:11,attack:1,magic:0,defense:1,speed:0,agility:0,mp:3},skills:[
      {id:"protective-shield",manaCost:11,target:"ally",name:"Escudo protector",detail:"Aplica a un aliado un escudo del 22% de su vida máxima durante 2 turnos.",unlockLevel:1,icon:"⬡",kind:"BÁSICA"},
      {id:"knockdown",manaCost:16,target:"enemy",name:"Derribo",detail:"Golpea a un enemigo: 90% de ATQ y lo derriba, retrasando su turno.",unlockLevel:4,icon:"⚒",kind:"CONTROL"},
      {id:"team-bastion",manaCost:28,target:"all-allies",name:"Bastión de equipo",detail:"Protege a todo el grupo con un escudo del 15% de su vida máxima durante 2 turnos.",unlockLevel:10,icon:"✦",kind:"ULTIMATE"}
    ]},
    {id:"alchemist",name:"Alex",title:"El Mujeriego",role:"DUELISTA",sign:"A",icon:"⚔",detail:"Duelista equilibrado, combina daño, resistencia y mejoras propias.",strengths:"Buen daño físico y vida. Puede potenciarse antes de atacar.",weaknesses:"No destaca en magia ni supera a Salim en daño o a Ivan en resistencia.",portrait:"assets/alex-portrait.png",sprites:"assets/alex-sprites.png",base:{hp:86,attack:10,magic:1,defense:8,speed:12,agility:12,mp:52},growth:{hp:8,attack:1,magic:0,defense:1,speed:1,agility:1,mp:4},skills:[
      {id:"balonazo",manaCost:9,target:"enemy",name:"Balonazo",detail:"Lanza un balón contra un enemigo: 105% de ATQ.",unlockLevel:1,icon:"⚽",kind:"BÁSICA"},
      {id:"modo-mujer",manaCost:16,target:"self",name:"Modo Mujer",detail:"Se potencia durante 2 turnos: +20% de ATQ y +10% de VEL.",unlockLevel:4,icon:"♛",kind:"MEJORA"},
      {id:"field-finish",manaCost:27,target:"all-enemies",name:"Remate de campo",detail:"Remate explosivo que golpea a todos los enemigos: 80% de ATQ.",unlockLevel:10,icon:"✦",kind:"ULTIMATE"}
    ]}
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

  const XP_THRESHOLDS = [0,100,240,420,650,930,1260,1640,2070,2550];

  function getCharacterStats(character,level) {
    const safeLevel = Math.min(10,Math.max(1,Number(level) || 1));
    const gains = safeLevel - 1;
    return Object.fromEntries(Object.keys(character.base).map((key) => [key,character.base[key] + character.growth[key] * gains]));
  }

  function getUnlockForLevel(character,level) {
    const skill = character.skills.find((entry) => entry.unlockLevel === level);
    if (skill) return "Habilidad: " + skill.name;
    if (level === 3) return "Ranura de pasiva reservada";
    return "Mejora de atributos";
  }

  function getLevelForXP(xp) {
    let level = 1;
    for (let i=1;i<XP_THRESHOLDS.length;i+=1) if (xp >= XP_THRESHOLDS[i]) level=i+1;
    return Math.min(10,level);
  }

  function grantExperience(characterId,amount) {
    const character = characters.find((entry) => entry.id === characterId);
    if (!character) return;
    const oldLevel = state.levels[characterId] || 1;
    const oldStats = getCharacterStats(character,oldLevel);
    state.xp[characterId] = (state.xp[characterId] || 0) + amount;
    const newLevel = getLevelForXP(state.xp[characterId]);
    if (newLevel > oldLevel) {
      state.levels[characterId] = newLevel;
      const newStats = getCharacterStats(character,newLevel);
      const currentHp = Number.isFinite(state.hp[characterId]) ? state.hp[characterId] : oldStats.hp;
      const currentMp = Number.isFinite(state.mp[characterId]) ? state.mp[characterId] : oldStats.mp;
      state.hp[characterId] = Math.min(newStats.hp,currentHp + newStats.hp - oldStats.hp);
      state.mp[characterId] = Math.min(newStats.mp,currentMp + newStats.mp - oldStats.mp);
    }
  }

  function awardPartyExperience(amount) {
    characters.forEach((character) => {
      grantExperience(character.id,state.party.includes(character.id) ? amount : Math.floor(amount/2));
    });
  }

  const BASIC_ATTACK = {
    id:"basic-attack",manaCost:0,target:"enemy",name:"Ataque básico",
    detail:"Golpe físico sin consumir maná: 70% de ATQ.",unlockLevel:1,icon:"⚔",kind:"BÁSICA"
  };

  const ENEMY_TYPES = {
    "process-wisp":{name:"Eco de proceso",role:"ESPÍRITU DIGITAL",maxHp:46,attack:7,speed:16,mark:"404",ai:"hunter",asset:"process-wisp"},
    "virus-larva":{name:"Larva de virus",role:"PLAGA",maxHp:40,attack:6,speed:12,mark:"!",ai:"hexer",asset:"virus-larva"},
    "code-fragment":{name:"Fragmento de código",role:"ANOMALÍA",maxHp:52,attack:8,speed:8,mark:"//",ai:"bruiser",asset:"code-fragment"},

    "archive-mimic":{name:"Mímico de archivo",role:"DEPREDADOR",maxHp:48,attack:7,speed:9,mark:"DB",ai:"support",asset:"archive-mimic"},
    "query-leech":{name:"Sanguijuela SQL",role:"PARÁSITO",maxHp:44,attack:7,speed:14,mark:"SQL",ai:"hunter",asset:"query-leech"},
    "null-sentinel":{name:"Centinela nulo",role:"GUARDIÁN",maxHp:61,attack:9,speed:6,mark:"0",ai:"bruiser",asset:"null-sentinel"},

    "ash-hound":{name:"Sabueso de ceniza",role:"CAZADOR",maxHp:50,attack:8,speed:17,mark:"H",ai:"hunter",asset:"ash-hound"},
    "yard-haunt":{name:"Aparición del patio",role:"ESPECTRO",maxHp:48,attack:7,speed:11,mark:"✦",ai:"hexer",asset:"yard-haunt"},
    "broken-desk":{name:"Pupitre roto",role:"BRUTO",maxHp:60,attack:9,speed:7,mark:"▰",ai:"bruiser",asset:"broken-desk"},

    "router-wraith":{name:"Espectro del router",role:"JEFE · REDES",maxHp:112,attack:10,speed:13,mark:"R",ai:"boss",asset:"router-wraith",boss:true},
    "cable-stalker":{name:"Acechador de cable",role:"CAZADOR",maxHp:52,attack:8,speed:17,mark:"~",ai:"hunter",asset:"cable-stalker"},
    "firewall-drone":{name:"Dron cortafuegos",role:"SOPORTE",maxHp:56,attack:8,speed:9,mark:"FW",ai:"support",asset:"firewall-drone"},

    "pin-ghoul":{name:"Necrófago de bolera",role:"BRUTO",maxHp:58,attack:8,speed:11,mark:"9",ai:"bruiser",asset:"pin-ghoul"},
    "lane-phantom":{name:"Fantasma de pista",role:"ESPECTRO",maxHp:50,attack:8,speed:14,mark:"X",ai:"hexer",asset:"lane-phantom"},
    "ball-mauler":{name:"Aplastabolos",role:"BRUTO",maxHp:64,attack:9,speed:7,mark:"●",ai:"bruiser",asset:"ball-mauler"},

    "asphalt-reaver":{name:"Desollador de asfalto",role:"CAZADOR",maxHp:60,attack:9,speed:14,mark:"N",ai:"hunter",asset:"asphalt-reaver"},
    "signal-crawler":{name:"Rastrero de señal",role:"PARÁSITO",maxHp:52,attack:8,speed:12,mark:"≈",ai:"hexer",asset:"signal-crawler"},
    "wreck-hound":{name:"Sabueso de chatarra",role:"BRUTO",maxHp:67,attack:10,speed:8,mark:"W",ai:"bruiser",asset:"wreck-hound"},

    "screen-haunt":{name:"Aparición de pantalla",role:"ESPECTRO",maxHp:62,attack:9,speed:12,mark:"▣",ai:"hexer",asset:"screen-haunt"},
    "frame-mimic":{name:"Mímico de fotograma",role:"SOPORTE",maxHp:58,attack:9,speed:10,mark:"F",ai:"support",asset:"frame-mimic"},
    "usher-wraith":{name:"Acomodador espectral",role:"CAZADOR",maxHp:52,attack:10,speed:16,mark:"U",ai:"hunter",asset:"usher-wraith"},

    "sushi-chef":{name:"El chef de la última mesa",role:"JEFE · SUSHI",maxHp:132,attack:11,speed:14,mark:"寿",ai:"boss",asset:"sushi-chef",boss:true},
    "wasabi-fiend":{name:"Demonio de wasabi",role:"CAZADOR",maxHp:61,attack:9,speed:17,mark:"辣",ai:"hunter",asset:"wasabi-fiend"},
    "soy-shadow":{name:"Sombra de soja",role:"ESPECTRO",maxHp:66,attack:9,speed:10,mark:"影",ai:"hexer",asset:"soy-shadow"},

    "camera-stalker":{name:"Acechador de cámara",role:"CAZADOR",maxHp:68,attack:10,speed:17,mark:"REC",ai:"hunter",asset:"camera-stalker"},
    "clip-fiend":{name:"Demonio de clip",role:"PARÁSITO",maxHp:59,attack:9,speed:13,mark:"▶",ai:"hexer",asset:"clip-fiend"},
    "recording-ghost":{name:"Fantasma grabado",role:"SOPORTE",maxHp:65,attack:9,speed:9,mark:"◉",ai:"support",asset:"recording-ghost"},

    "maze-binder":{name:"Tejedor del laberinto",role:"ESPECTRO",maxHp:72,attack:10,speed:12,mark:"⌘",ai:"hexer",asset:"maze-binder"},
    "thorn-minotaur":{name:"Minotauro de espinas",role:"BRUTO",maxHp:82,attack:11,speed:7,mark:"M",ai:"bruiser",asset:"thorn-minotaur"},
    "wall-crawler":{name:"Rastrero de pared",role:"CAZADOR",maxHp:66,attack:10,speed:16,mark:"W",ai:"hunter",asset:"wall-crawler"},

    "faceless-runner":{name:"Corredor sin rostro",role:"CAZADOR",maxHp:72,attack:10,speed:18,mark:"?",ai:"hunter",asset:"faceless-runner"},
    "yellow-mimic":{name:"Mímico amarillo",role:"SOPORTE",maxHp:70,attack:10,speed:11,mark:"Y",ai:"support",asset:"yellow-mimic"},
    "ceiling-watcher":{name:"Vigía del techo",role:"ESPECTRO",maxHp:76,attack:11,speed:8,mark:"⌃",ai:"hexer",asset:"ceiling-watcher"},

    "club-master":{name:"Maestro de Clubes",role:"JEFE FINAL · STEAM",maxHp:158,attack:12,speed:15,mark:"DJ",ai:"boss",asset:"club-master",boss:true},
    "bass-brute":{name:"Bruto del bajo",role:"BRUTO",maxHp:78,attack:11,speed:8,mark:"♬",ai:"bruiser",asset:"bass-brute"},
    "strobe-witch":{name:"Bruja estroboscópica",role:"ESPECTRO",maxHp:74,attack:10,speed:17,mark:"✧",ai:"hexer",asset:"strobe-witch"}
  };

  const SITE_ENCOUNTERS = {
    "institute-programming":["process-wisp","virus-larva","code-fragment"],
    "institute-database":["archive-mimic","query-leech","null-sentinel"],
    "institute-yard":["ash-hound","yard-haunt","broken-desk"],
    "institute-networks":["router-wraith","cable-stalker","firewall-drone"],
    "baix-bowling":["pin-ghoul","lane-phantom","ball-mauler"],
    "baix-n340":["asphalt-reaver","signal-crawler","wreck-hound"],
    "baix-cinema":["screen-haunt","frame-mimic","usher-wraith"],
    "baix-sushi":["sushi-chef","wasabi-fiend","soy-shadow"],
    "steam-content-warning":["camera-stalker","clip-fiend","recording-ghost"],
    "steam-labyrinthine":["maze-binder","thorn-minotaur","wall-crawler"],
    "steam-backrooms":["faceless-runner","yellow-mimic","ceiling-watcher"],
    "steam-clubs":["club-master","bass-brute","strobe-witch"]
  };

  function createBattleState(siteId) {
    const startingVitals={};
    state.party.forEach((id)=>{
      startingVitals[id]={hp:Number(state.hp[id])||0,mp:Number(state.mp[id])||0};
    });
    const enemyIds=SITE_ENCOUNTERS[siteId]||SITE_ENCOUNTERS["institute-programming"];
    const enemies=enemyIds.map((enemyId)=>{
      const template=ENEMY_TYPES[enemyId];
      return Object.assign({id:enemyId},template,{hp:template.maxHp,burn:0,stun:0,shield:0,enraged:false});
    });
    return {
      siteId,encounterVersion:2,round:1,order:[],turnIndex:0,currentTurnStarted:null,startingVitals,
      enemies,shields:{},shieldTurns:{},buffs:{},debuffs:{},pendingSkillId:null,targetMode:null,status:"active",
      log:["La compañía entra en la sala. ¡Comienza el combate!"]
    };
  }

  function getAliveParty() {
    return state.party.filter((id) => {
      const character = characters.find((entry) => entry.id === id);
      return character && (Number(state.hp[id]) || 0) > 0;
    });
  }

  function getBattleOrder() {
    const allies = getAliveParty().map((id) => {
      const character = characters.find((entry) => entry.id === id);
      const baseSpeed=getCharacterStats(character,state.levels[id] || 1).speed;
      const speedBuff=state.battle.buffs[id] ? state.battle.buffs[id].speed || 0 : 0;
      return {side:"ally",id,name:character.name,speed:baseSpeed*(1+speedBuff)};
    });
    const enemies = state.battle.enemies.filter((enemy) => enemy.hp > 0).map((enemy) => ({
      side:"enemy",id:enemy.id,name:enemy.name,speed:enemy.speed
    }));
    return allies.concat(enemies).sort((a,b) => b.speed-a.speed || a.id.localeCompare(b.id));
  }

  function getActiveBattleActor() {
    if (!state.battle || state.battle.status !== "active") return null;
    return state.battle.order[state.battle.turnIndex] || null;
  }

  function pushBattleLog(message) {
    if (!state.battle) return;
    state.battle.log.unshift(message);
    state.battle.log = state.battle.log.slice(0,4);
  }

  function setBattleVictory() {
    const battle=state.battle;
    if(battle.status!=="active") return;
    clearBattleTimer();
    battle.status="victory";
    battle.pendingSkillId=null;
    battle.targetMode=null;
    const region=regions.find((entry)=>entry.sites.some((site)=>site.id===battle.siteId));
    const site=region ? region.sites.find((entry)=>entry.id===battle.siteId) : null;
    const reward=site && site.boss ? 120 : 45;
    if(!state.visitedSites.includes(battle.siteId)) {
      state.visitedSites.push(battle.siteId);
      awardPartyExperience(reward);
    }
    if(region && site && site.boss) {
      const regionIndex=regions.findIndex((entry)=>entry.id===region.id);
      const nextRegion=regions[regionIndex+1];
      if(nextRegion) {
        state.selectedRegion=nextRegion.id;
        state.selectedSite=getFirstAvailableSite(nextRegion,state.visitedSites);
        state.notice="Jefe derrotado. Se ha desbloqueado "+nextRegion.name+".";
      } else {
        state.selectedRegion=region.id;
        state.selectedSite=site.id;
        state.notice="Has derrotado al último jefe. La campaña provisional está completada.";
      }
    } else if(region) {
      const index=region.sites.findIndex((entry)=>entry.id===battle.siteId);
      const next=region.sites[index+1];
      state.selectedRegion=region.id;
      state.selectedSite=next ? next.id : battle.siteId;
      state.notice=next ? "Sala superada. Se ha desbloqueado "+next.name+"." : "La zona está lista para su jefe final.";
    }
    pushBattleLog("¡Victoria! La compañía obtiene "+reward+" XP.");
    saveState();
  }

  function setBattleDefeat() {
    const battle = state.battle;
    if (battle.status !== "active") return;
    clearBattleTimer();
    battle.status = "defeat";
    battle.pendingSkillId = null;
    battle.targetMode = null;
    pushBattleLog("La compañía ha caído. Podéis reintentar la sala.");
    saveState();
  }

  function applyEnemyDamage(enemy,amount) {
    const damage = Math.max(1,Math.round(amount));
    enemy.hp = Math.max(0,enemy.hp-damage);
    pushBattleLog(enemy.name + " recibe " + damage + " de daño.");
    if (enemy.hp <= 0) pushBattleLog(enemy.name + " ha sido derrotado.");
  }

  function applyHeroDamage(heroId,amount) {
    const character = characters.find((entry) => entry.id === heroId);
    if (!character) return 0;
    const level = state.levels[heroId] || 1;
    const maxHp = getCharacterStats(character,level).hp;
    let damage = Math.max(1,Math.round(amount));
    const curse=state.battle.debuffs[heroId];
    if(curse && curse.turns>0) {
      damage=Math.ceil(damage*(1+(curse.damageTaken||.18)));
      pushBattleLog(character.name+" sufre daño amplificado por la maldición.");
    }
    const shield = state.battle.shields[heroId] || 0;
    if (shield > 0) {
      const absorbed = Math.min(shield,damage);
      state.battle.shields[heroId] -= absorbed;
      damage -= absorbed;
      pushBattleLog(character.name + " bloquea " + absorbed + " con su escudo.");
      if (state.battle.shields[heroId] <= 0) {
        delete state.battle.shields[heroId];
        delete state.battle.shieldTurns[heroId];
        pushBattleLog("El escudo de " + character.name + " se rompe.");
      }
    }
    const current = Math.max(0,Number(state.hp[heroId]) || 0);
    const actual = Math.min(current,damage);
    state.hp[heroId] = Math.max(0,current-damage);
    if (actual > 0) pushBattleLog(character.name + " pierde " + actual + " PV.");
    if (state.hp[heroId] <= 0) pushBattleLog(character.name + " queda fuera de combate.");
    return actual;
  }

  function healHero(heroId,amount) {
    const character = characters.find((entry) => entry.id === heroId);
    if (!character) return 0;
    const maxHp = getCharacterStats(character,state.levels[heroId] || 1).hp;
    const current = Math.max(0,Number(state.hp[heroId]) || 0);
    const healed = Math.min(maxHp-current,Math.max(0,Math.round(amount)));
    state.hp[heroId] = current+healed;
    if (healed > 0) pushBattleLog(character.name + " recupera " + healed + " PV.");
    return healed;
  }

  function applyBurnAtEnemyTurn(enemy) {
    if (enemy.burn <= 0 || enemy.hp <= 0) return;
    const burnDamage = Math.max(2,enemy.burnDamage || 5);
    enemy.hp = Math.max(0,enemy.hp-burnDamage);
    enemy.burn -= 1;
    pushBattleLog(enemy.name + " recibe " + burnDamage + " de quemadura.");
    if (enemy.hp <= 0) pushBattleLog(enemy.name + " cae por la quemadura.");
  }

  function chooseEnemyTarget(enemy,candidates) {
    const battle=state.battle;
    const scored=candidates.map((id)=>{
      const character=characters.find((entry)=>entry.id===id);
      const stats=getCharacterStats(character,state.levels[id]||1);
      const maxHp=Math.max(1,stats.hp);
      const hpRatio=(Number(state.hp[id])||0)/maxHp;
      const shield=battle.shields[id]||0;
      let score=(1-hpRatio)*3 + (stats.defense<=5?2:stats.defense<=8?1:0) + (shield>0?-1:0);
      if(id==="arcanist") score+=5;
      if(id==="guardian") score+=3;
      if(enemy.ai==="hunter" && (id==="arcanist"||id==="guardian")) score+=3;
      if(enemy.ai==="hexer" && (id==="arcanist"||id==="guardian")) score+=4;
      if(enemy.ai==="bruiser" && hpRatio<.55) score+=3;
      if(enemy.ai==="boss" && id===enemy.focusTargetId) score+=2;
      if(battle.buffs[id] && battle.buffs[id].turns>0) score+=1;
      return {id,score};
    });
    scored.sort((a,b)=>b.score-a.score || candidates.indexOf(a.id)-candidates.indexOf(b.id));
    const targetId=scored[0].id;
    enemy.focusTargetId=targetId;
    return targetId;
  }

  function performEnemyTurn(enemy) {
    if(enemy.hp<=0) return;
    if(enemy.stun>0) {
      enemy.stun-=1;
      pushBattleLog(enemy.name+" pierde su turno por el derribo.");
      return;
    }
    const candidates=getAliveParty();
    if(!candidates.length) return;

    if(enemy.ai==="support") {
      const wounded=state.battle.enemies
        .filter((other)=>other.id!==enemy.id && other.hp>0 && other.hp<other.maxHp*.78)
        .sort((a,b)=>(a.hp/a.maxHp)-(b.hp/b.maxHp))[0];
      if(wounded) {
        const healed=Math.min(wounded.maxHp-wounded.hp,Math.max(5,Math.round(wounded.maxHp*.13)));
        wounded.hp+=healed;
        pushBattleLog(enemy.name+" repara a "+wounded.name+" y recupera "+healed+" PV.");
        return;
      }
    }

    const targetId=chooseEnemyTarget(enemy,candidates);
    const target=characters.find((character)=>character.id===targetId);
    const targetStats=getCharacterStats(target,state.levels[targetId]||1);

    if(enemy.ai==="hexer" && !state.battle.debuffs[targetId]) {
      state.battle.debuffs[targetId]={turns:2,damageTaken:.18};
      pushBattleLog(enemy.name+" maldice a "+target.name+". Recibirá un 18% más de daño durante 2 turnos.");
      return;
    }

    if(enemy.ai==="boss" && !enemy.enraged && enemy.hp<=enemy.maxHp*.4) {
      enemy.enraged=true;
      enemy.attack+=2;
      pushBattleLog(enemy.name+" entra en fase de furia. Sus ataques se vuelven más peligrosos.");
    }
    const defenceMitigation=Math.floor(targetStats.defense*.45);
    const rawDamage=Math.max(3,enemy.attack-defenceMitigation+(enemy.ai==="bruiser"?1:0));
    applyHeroDamage(targetId,rawDamage);
  }

  function processBattleUntilPlayerTurn() {
    const battle=state.battle;
    if(!battle || battle.status!=="active") return;
    let safety=0;
    while(battle.status==="active" && safety<30) {
      safety+=1;
      if(battle.enemies.every((enemy)=>enemy.hp<=0)) { setBattleVictory(); break; }
      if(getAliveParty().length===0) { setBattleDefeat(); break; }
      if(battle.turnIndex>=battle.order.length) {
        battle.round+=1;
        battle.order=getBattleOrder();
        battle.turnIndex=0;
        battle.currentTurnStarted=null;
        pushBattleLog("Comienza la ronda "+battle.round+".");
        if(!battle.order.length) { setBattleDefeat(); break; }
      }
      const actor=battle.order[battle.turnIndex];
      if(!actor) break;
      if(actor.side==="ally") {
        if((Number(state.hp[actor.id])||0)<=0) {
          battle.currentTurnStarted=null;
          battle.turnIndex+=1;
          continue;
        }
        const character=characters.find((entry)=>entry.id===actor.id);
        if(battle.currentTurnStarted!==actor.id) {
          const maxMana=getCharacterStats(character,state.levels[actor.id]||1).mp;
          const currentMana=Math.max(0,Number(state.mp[actor.id])||0);
          const recoveredMana=Math.min(3,maxMana-currentMana);
          if(recoveredMana>0) {
            state.mp[actor.id]=currentMana+recoveredMana;
            pushBattleLog(character.name+" recupera "+recoveredMana+" PM al comenzar su turno.");
          }
          battle.currentTurnStarted=actor.id;
        }
        state.selectedCharacter=actor.id;
        state.notice=battle.pendingSkillId
          ? "Elige el objetivo de "+character.name+"."
          : "Turno de "+character.name+". Elige una habilidad.";
        saveState();
        return;
      }
      const enemy=battle.enemies.find((entry)=>entry.id===actor.id);
      if(!enemy || enemy.hp<=0) {
        battle.currentTurnStarted=null;
        battle.turnIndex+=1;
        continue;
      }
      state.notice="Turno de "+enemy.name+".";
      battle.currentTurnStarted=enemy.id;
      saveState();
      renderCampaign();
      if(battleTurnTimer!==null) return;
      battleTurnTimer=window.setTimeout(()=>{
        battleTurnTimer=null;
        if(!state || campaign.hidden || state.tab!=="battle" || state.battle!==battle || battle.status!=="active") return;
        const stillCurrent=getActiveBattleActor();
        if(!stillCurrent || stillCurrent.side!=="enemy" || stillCurrent.id!==enemy.id) return;
        applyBurnAtEnemyTurn(enemy);
        if(enemy.hp>0) performEnemyTurn(enemy);
        battle.currentTurnStarted=null;
        battle.turnIndex+=1;
        processBattleUntilPlayerTurn();
        saveState();
        renderCampaign();
      },520);
      return;
    }
    saveState();
  }

  function beginBattle(siteId) {
    clearBattleTimer();
    state.battleSiteId = siteId;
    state.selectedRegion = regions.find((entry) => entry.sites.some((site) => site.id === siteId)).id;
    state.selectedSite = siteId;
    state.battle = createBattleState(siteId);
    state.tab = "battle";
    state.battle.order = getBattleOrder();
    state.battle.turnIndex = 0;
    processBattleUntilPlayerTurn();
    saveState();
    renderCampaign();
  }

  function retryBattle() {
    const previous=state.battle;
    if(previous && previous.startingVitals) {
      Object.entries(previous.startingVitals).forEach(([id,vitals])=>{
        if(!state.party.includes(id)) return;
        const character=characters.find((entry)=>entry.id===id);
        if(!character) return;
        const stats=getCharacterStats(character,state.levels[id]||1);
        state.hp[id]=Math.max(0,Math.min(stats.hp,Number(vitals.hp)||0));
        state.mp[id]=Math.max(0,Math.min(stats.mp,Number(vitals.mp)||0));
      });
    }
    beginBattle(state.battleSiteId||"institute-programming");
  }

  function chooseBattleSkill(skillId) {
    const battle = state.battle;
    const actor = getActiveBattleActor();
    if (!battle || !actor || actor.side !== "ally" || battle.status !== "active") return;
    const character = characters.find((entry) => entry.id === actor.id);
    const skill = skillId === BASIC_ATTACK.id ? BASIC_ATTACK : character.skills.find((entry) => entry.id === skillId);
    if (!skill) return;
    const level = state.levels[character.id] || 1;
    if (level < skill.unlockLevel) return showNotice("Esta habilidad se desbloquea en el nivel " + skill.unlockLevel + ".");
    const currentMana = Number(state.mp[character.id]) || 0;
    if (currentMana < skill.manaCost) return showNotice("No tienes maná suficiente para usar " + skill.name + ".");
    if (skill.target === "enemy" || skill.target === "ally") {
      battle.pendingSkillId = skillId;
      battle.targetMode = skill.target;
      state.notice = skill.target === "enemy" ? "Selecciona el enemigo al que quieres atacar." : "Selecciona al compañero que quieres ayudar.";
      renderCampaign();
      saveState();
      return;
    }
    executeBattleSkill(character,skill,null);
  }

  function executeBattleSkill(character,skill,targetId) {
    const battle = state.battle;
    if (!battle || battle.status !== "active") return;
    const actor = getActiveBattleActor();
    if (!actor || actor.side !== "ally" || actor.id !== character.id) return;
    const stats = getCharacterStats(character,state.levels[character.id] || 1);
    if ((Number(state.mp[character.id]) || 0) < skill.manaCost) return showNotice("No tienes maná suficiente.");
    const enemy = battle.enemies.find((entry) => entry.id === targetId && entry.hp > 0);
    const ally = characters.find((entry) => entry.id === targetId && state.party.includes(entry.id) && (Number(state.hp[entry.id]) || 0) > 0);
    if (skill.target === "enemy" && !enemy) return showNotice("Selecciona un enemigo válido.");
    if (skill.target === "ally" && !ally) return showNotice("Selecciona un compañero válido.");
    state.mp[character.id] -= skill.manaCost;
    const freshShieldIds = new Set();
    const damageMultiplier = battle.buffs[character.id] && battle.buffs[character.id].attack > 0 ? 1+battle.buffs[character.id].attack : 1;
    const targetDamage = (ratio,magic) => Math.round((magic ? stats.magic : stats.attack)*ratio*damageMultiplier);
    switch(skill.id) {
      case "basic-attack":
        if (!enemy) return showNotice("Selecciona un enemigo válido.");
        applyEnemyDamage(enemy,targetDamage(.7,false));
        break;
      case "arcane-bolt":
        if (!enemy) return showNotice("Selecciona un enemigo válido.");
        applyEnemyDamage(enemy,targetDamage(.9,true)+1);
        break;
      case "burn-mark":
        if (!enemy) return showNotice("Selecciona un enemigo válido.");
        applyEnemyDamage(enemy,targetDamage(.55,true)+1);
        if (enemy.hp > 0) { enemy.burn=2; enemy.burnDamage=Math.max(2,Math.round(stats.magic*.2)); }
        break;
      case "nova":
        battle.enemies.filter((entry) => entry.hp>0).forEach((entry) => applyEnemyDamage(entry,targetDamage(.85,true)));
        break;
      case "stab":
        if (!enemy) return showNotice("Selecciona un enemigo válido.");
        applyEnemyDamage(enemy,targetDamage(1,false)+1);
        break;
      case "multi-stab":
        if (!enemy) return showNotice("Selecciona un enemigo válido.");
        for(let hit=0;hit<3 && enemy.hp>0;hit++) applyEnemyDamage(enemy,targetDamage(.35,false));
        break;
      case "brothers":
        battle.enemies.filter((entry) => entry.hp>0).slice(0,3).forEach((entry) => {
          for(let hit=0;hit<2 && entry.hp>0;hit++) applyEnemyDamage(entry,targetDamage(.5,false));
        });
        break;
      case "antivirus":
        if (!ally) return showNotice("Selecciona un compañero válido.");
        healHero(ally.id,stats.magic*.9+6);
        break;
      case "life-drain":
        if (!enemy) return showNotice("Selecciona un enemigo válido.");
        const drained = targetDamage(.8,true)+2;
        applyEnemyDamage(enemy,drained);
        healHero(character.id,Math.ceil(drained*.35));
        break;
      case "reboot":
        getAliveParty().sort((a,b)=>{
          const ca=characters.find((entry)=>entry.id===a),cb=characters.find((entry)=>entry.id===b);
          return state.hp[a]/getCharacterStats(ca,state.levels[a]||1).hp-state.hp[b]/getCharacterStats(cb,state.levels[b]||1).hp;
        }).slice(0,3).forEach((id)=>healHero(id,stats.magic*.75+8));
        break;
      case "protective-shield":
        if (!ally) return showNotice("Selecciona un compañero válido.");
        const allyMax=getCharacterStats(ally,state.levels[ally.id]||1).hp;
        battle.shields[ally.id]=Math.round(allyMax*.22);
        battle.shieldTurns[ally.id]=2;
        freshShieldIds.add(ally.id);
        pushBattleLog(ally.name+" recibe un escudo de "+battle.shields[ally.id]+" puntos durante sus próximos 2 turnos.");
        break;
      case "knockdown":
        if (!enemy) return showNotice("Selecciona un enemigo válido.");
        applyEnemyDamage(enemy,targetDamage(.9,false));
        if(enemy.hp>0){enemy.stun=1;pushBattleLog(enemy.name+" queda derribado.");}
        break;
      case "team-bastion":
        getAliveParty().forEach((id)=>{
          const allyChar=characters.find((entry)=>entry.id===id);
          const max=getCharacterStats(allyChar,state.levels[id]||1).hp;
          battle.shields[id]=(battle.shields[id]||0)+Math.round(max*.15);
          battle.shieldTurns[id]=Math.max(2,battle.shieldTurns[id]||0);
          freshShieldIds.add(id);
        });
        pushBattleLog("Ivan levanta un bastión que protege a toda la compañía durante 2 turnos de cada aliado.");
        break;
      case "balonazo":
        if (!enemy) return showNotice("Selecciona un enemigo válido.");
        applyEnemyDamage(enemy,targetDamage(.8,false)+1);
        break;
      case "modo-mujer":
        battle.buffs[character.id]={attack:.2,speed:.1,turns:2};
        pushBattleLog("Alex activa Modo Mujer: su ataque y velocidad aumentan.");
        break;
      case "field-finish":
        battle.enemies.filter((entry)=>entry.hp>0).forEach((entry)=>applyEnemyDamage(entry,targetDamage(1.05,false)));
        break;
      default:
        return showNotice("Esta habilidad todavía no está implementada.");
    }
    pushBattleLog(character.name+" utiliza "+skill.name+".");
    if (battle.buffs[character.id] && skill.id !== "modo-mujer") {
      battle.buffs[character.id].turns -= 1;
      if(battle.buffs[character.id].turns<=0) {
        delete battle.buffs[character.id];
        pushBattleLog(character.name + " ya no está bajo los efectos de su mejora.");
      }
    }
    const shieldTurns=battle.shieldTurns[character.id]||0;
    if(shieldTurns>0 && !freshShieldIds.has(character.id)) {
      battle.shieldTurns[character.id]=shieldTurns-1;
      if(battle.shieldTurns[character.id]<=0) {
        delete battle.shieldTurns[character.id];
        delete battle.shields[character.id];
        pushBattleLog("El escudo de " + character.name + " se desvanece.");
      }
    }
    battle.pendingSkillId=null;
    battle.targetMode=null;
    battle.currentTurnStarted=null;
    const curse=battle.debuffs[character.id];
    if(curse && curse.turns>0) {
      curse.turns-=1;
      if(curse.turns<=0) {
        delete battle.debuffs[character.id];
        pushBattleLog("La maldición sobre "+character.name+" desaparece.");
      }
    }
    if (battle.enemies.every((entry)=>entry.hp<=0)) {
      setBattleVictory();
    } else {
      battle.turnIndex += 1;
      processBattleUntilPlayerTurn();
    }
    saveState();
    renderCampaign();
  }

  function chooseBattleTarget(targetId,targetSide) {
    const battle=state.battle;
    if(!battle || !battle.pendingSkillId) return;
    const actor=getActiveBattleActor();
    if(!actor || actor.side!=="ally") return;
    const character=characters.find((entry)=>entry.id===actor.id);
    const skill=character.skills.find((entry)=>entry.id===battle.pendingSkillId);
    if(!skill) return;
    const expectedSide=skill.target==="enemy" ? "enemy" : "ally";
    if(targetSide && targetSide!==expectedSide) return showNotice("Ese objetivo no es válido para esta habilidad.");
    const valid=expectedSide==="enemy"
      ? battle.enemies.some((entry)=>entry.id===targetId && entry.hp>0)
      : state.party.includes(targetId) && (Number(state.hp[targetId])||0)>0;
    if(!valid) return showNotice("El objetivo seleccionado no es válido.");
    executeBattleSkill(character,skill,targetId);
  }

  const defaultState = () => ({
    gold:120,
    rations:2,
    inventory:{bandage:0,tonic:0,oil:0},
    hp:{guardian:58,duelist:48,arcanist:78,tracker:116,alchemist:86},
    mp:{guardian:60,duelist:36,arcanist:80,tracker:48,alchemist:52},
    levels:{guardian:1,duelist:1,arcanist:1,tracker:1,alchemist:1},
    xp:{guardian:0,duelist:0,arcanist:0,tracker:0,alchemist:0},
    battle:null,
    characterDataVersion:5,
    party:["guardian","duelist","arcanist","tracker"],
    tab:"bastion",
    battleSiteId:"institute-programming",
    selectedCharacter:"duelist",
    selectedRegion:"institute",
    selectedSite:"institute-programming",
    visitedSites:[],
    notice:"Elige una ruta y supera cada parada para avanzar."
  });

  let state = null;
  let lastFocusedElement = null;
  let battleTurnTimer = null;

  function clearBattleTimer() {
    if (battleTurnTimer !== null) {
      window.clearTimeout(battleTurnTimer);
      battleTurnTimer = null;
    }
  }
  const SETTINGS_KEY = "the-five-settings";
  const SAVE_KEY = "pais-dungeon-campaign-v3";
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
      const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || localStorage.getItem("the-five-campaign-v2") || "null");
      if (!saved || !Array.isArray(saved.party)) return null;
      const defaults = defaultState();
      const levels = Object.assign({},defaults.levels,saved.levels || {});
      const xp = Object.assign({},defaults.xp,saved.xp || {});
      const hp = {};
      characters.forEach((character) => {
        const level = Math.min(10,Math.max(1,Number(levels[character.id]) || 1));
        levels[character.id] = level;
        const maxHp = getCharacterStats(character,level).hp;
        const storedHp = saved.hp && saved.hp[character.id];
        if (saved.characterDataVersion >= 3 && Number.isFinite(storedHp)) {
          hp[character.id] = Math.min(maxHp,Math.max(0,storedHp));
        } else {
          const oldPercent = Number.isFinite(storedHp) ? Math.min(100,Math.max(0,storedHp)) : 100;
          hp[character.id] = Math.round(maxHp*oldPercent/100);
        }
        xp[character.id] = Math.max(0,Number(xp[character.id]) || 0);
      });
      const mp = {};
      characters.forEach((character) => {
        const level = levels[character.id] || 1;
        const maxMp = getCharacterStats(character,level).mp;
        const storedMp = saved.mp && saved.mp[character.id];
        mp[character.id] = saved.characterDataVersion >= 4 && Number.isFinite(storedMp)
          ? Math.max(0,Math.min(maxMp,storedMp))
          : maxMp;
      });
      const validSiteIds = regions.flatMap((region) => region.sites.map((site) => site.id));
      const merged = Object.assign(defaults,saved,{
        inventory:Object.assign({},defaults.inventory,saved.inventory || {}),
        hp,mp,levels,xp,characterDataVersion:5,
        battle:saved.battle && typeof saved.battle === "object" ? saved.battle : null,
        visitedSites:(saved.visitedSites || []).filter((siteId) => validSiteIds.includes(siteId))
      });
      merged.party = merged.party.filter((id) => characters.some((character) => character.id === id)).slice(0,4);
      if (merged.party.length === 0) merged.party = defaults.party;
      if (!characters.some((character) => character.id === merged.selectedCharacter)) merged.selectedCharacter = "duelist";
      const allSites = regions.flatMap((region) => region.sites);
      const battleSite = allSites.find((site) => site.id === merged.battleSiteId);
      const battleRegion = regions.find((region) => region.sites.some((site) => site.id === merged.battleSiteId));
      const battleSiteIndex = battleRegion ? battleRegion.sites.findIndex((site) => site.id === merged.battleSiteId) : -1;
      if (!battleSite || battleSite.boss || !isSiteUnlocked(battleRegion,battleSiteIndex,merged.visitedSites)) {
        merged.battleSiteId = "institute-programming";
        if (merged.tab === "battle") merged.tab = "route";
      }
      if (merged.tab === "battle" && (!merged.battle || merged.battle.siteId !== merged.battleSiteId)) merged.tab = "route";
      if (merged.battle && merged.battle.encounterVersion !== 2) {
        merged.battle=null;
        if (merged.tab === "battle") merged.tab="route";
        merged.notice="El encuentro ha cambiado. Puedes volver a entrar para probar el nuevo balance.";
      }
      if (merged.battle) {
        const savedBattle=merged.battle;
        if (!savedBattle.shields || typeof savedBattle.shields !== "object") savedBattle.shields={};
        if (!savedBattle.shieldTurns || typeof savedBattle.shieldTurns !== "object") savedBattle.shieldTurns={};
        if (!savedBattle.buffs || typeof savedBattle.buffs !== "object") savedBattle.buffs={};
        if (!savedBattle.debuffs || typeof savedBattle.debuffs !== "object") savedBattle.debuffs={};
        if (!savedBattle.startingVitals) {
          savedBattle.startingVitals={};
          merged.party.forEach((id)=>{
            savedBattle.startingVitals[id]={hp:hp[id],mp:mp[id]};
          });
        }
        if (!Array.isArray(savedBattle.order)) savedBattle.order=[];
        if (!Array.isArray(savedBattle.log)) savedBattle.log=["Combate recuperado desde el guardado."];
      }
      const maximumRegion = getUnlockedRegionIndex(merged.visitedSites);
      let selectedIndex = regions.findIndex((region) => region.id === merged.selectedRegion);
      if (selectedIndex < 0 || selectedIndex > maximumRegion) selectedIndex = maximumRegion;
      merged.selectedRegion = regions[selectedIndex].id;
      const selected = regions[selectedIndex];
      const siteIndex = selected.sites.findIndex((site) => site.id === merged.selectedSite);
      if (siteIndex < 0 || !isSiteUnlocked(selected,siteIndex,merged.visitedSites)) merged.selectedSite = getFirstAvailableSite(selected,merged.visitedSites);
      return merged;
    } catch (error) { return null; }
  }

  function saveState() {
    if (!state) return;
    state.characterDataVersion = 5;
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
    if (state.tab === "battle" && state.battle && state.battle.status === "active") {
      if (!Array.isArray(state.battle.order) || !state.battle.order.length) {
        state.battle.order=getBattleOrder();
        state.battle.turnIndex=0;
      }
      processBattleUntilPlayerTurn();
      renderCampaign();
    }
  }

  function returnToTitle() {
    clearBattleTimer();
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
    const averageLife = Math.round(state.party.reduce((sum,id) => {
      const character = characters.find((entry) => entry.id === id);
      const maxHp = getCharacterStats(character,state.levels[id] || 1).hp;
      return sum + (Math.max(0,Number(state.hp[id]) || 0)/maxHp)*100;
    },0)/Math.max(1,state.party.length));
    const lifeCount = document.getElementById("life-count");
    const healthResource = document.getElementById("health-resource");
    if (lifeCount) lifeCount.textContent = averageLife + "%";
    if (healthResource) healthResource.dataset.low = String(averageLife <= 35);
    const activeBattleSite = state.tab === "battle"
      ? regions.flatMap((region) => region.sites).find((site) => site.id === state.battleSiteId)
      : null;
    campaignTitle.textContent = state.tab === "battle" ? (activeBattleSite ? activeBattleSite.name.toUpperCase() + " · CAMPO DE BATALLA" : "CAMPO DE BATALLA") :
      state.tab === "bastion" ? "BASTIÓN DEL ÚLTIMO FAROL" :
      state.tab === "company" ? "REGISTRO DE LA COMPAÑÍA" :
      state.tab === "route" ? "MAPA DE LAS TIERRAS MALDITAS" :
      state.tab === "rest" ? "CÁMARA DEL ÚLTIMO FAROL" : "MERCADER DEL BASTIÓN";
    const campaignTabs = document.querySelector(".campaign-tabs");
    if (campaignTabs) campaignTabs.hidden = state.tab === "battle";
    document.querySelectorAll(".campaign-tab").forEach((button) => button.classList.toggle("is-active",button.dataset.tab === state.tab));
    if (state.tab === "bastion") campaignMain.innerHTML = renderBastion();
    if (state.tab === "company") campaignMain.innerHTML = renderCompany();
    if (state.tab === "route") campaignMain.innerHTML = renderRoute();
    if (state.tab === "battle") campaignMain.innerHTML = renderBattle();
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
    const selected = characters.find((character) => character.id === state.selectedCharacter) || characters[1];
    const selectedIndex = characters.findIndex((character) => character.id === selected.id);
    const level = state.levels[selected.id] || 1;
    const stats = getCharacterStats(selected,level);
    const maxHp = stats.hp;
    const hp = Math.min(maxHp,Math.max(0,Number(state.hp[selected.id]) || 0));
    const hpPercent = Math.round(hp/maxHp*100);
    const xp = state.xp[selected.id] || 0;
    const nextLevelXP = level < 10 ? XP_THRESHOLDS[level] : null;
    const currentLevelXP = XP_THRESHOLDS[level-1];
    const xpProgress = nextLevelXP === null ? 100 : Math.min(100,Math.round((xp-currentLevelXP)/(nextLevelXP-currentLevelXP)*100));
    const xpRemaining = nextLevelXP === null ? 0 : Math.max(0,nextLevelXP-xp);
    const active = state.party.includes(selected.id);
    const disabled = !active && state.party.length >= 4;
    const characterMenu = characters.map((character) => {
      const isSelected = character.id === selected.id;
      const isActive = state.party.includes(character.id);
      const charLevel = state.levels[character.id] || 1;
      const charMaxHp = getCharacterStats(character,charLevel).hp;
      const charHp = Math.min(charMaxHp,Math.max(0,Number(state.hp[character.id]) || 0));
      const charHpPercent = Math.round(charHp/charMaxHp*100);
      const portrait = character.portrait ? '<img src="' + character.portrait + '" alt="" loading="lazy" onerror="this.remove()">' : "";
      return '<button class="character-nav-entry ' + (isSelected ? "is-selected" : "") + '" type="button" data-character-select="' + character.id + '" aria-pressed="' + isSelected + '">' +
        '<span class="character-nav-avatar"><b>' + character.sign + '</b>' + portrait + '</span>' +
        '<span class="character-nav-copy"><strong>' + character.name + '</strong><small>«' + character.title + '»</small><span class="character-nav-health"><i><b style="width:' + charHpPercent + '%"></b></i><em>' + charHp + '/' + charMaxHp + ' PV</em></span></span>' +
        '<span class="character-nav-state ' + (isActive ? "is-active" : "") + '">' + (isActive ? "●" : "○") + '</span></button>';
    }).join("");
    const portraitImage = selected.portrait ? '<img class="character-portrait-art" src="' + selected.portrait + '" alt="Retrato pixel art de ' + selected.name + ' ' + selected.title + '" loading="eager" onerror="this.remove()">' : "";
    const spriteMarkup = selected.sprites ? '<img class="sprite-load-probe" src="' + selected.sprites + '" alt="" onload="this.parentElement.classList.add(&quot;has-sprite&quot;);this.remove()" onerror="this.parentElement.classList.add(&quot;no-sprite&quot;);this.remove()"><div class="character-sprite-animation" style="background-image:url(' + selected.sprites + ')"></div>' : "";
    const spriteNote = selected.id === "duelist" ? "REPOSO ×4 · CAMINAR ×4 · ATAQUE ×4 · DAÑO ×2" : "ANIMACIONES POR AÑADIR";
    const skills = selected.skills.map((skill) => {
      const unlocked = level >= skill.unlockLevel;
      return '<div class="character-skill ' + (unlocked ? "is-ready" : "is-locked") + '">' +
        '<span class="character-skill-icon">' + skill.icon + '</span><div><strong>' + skill.name + '</strong><small>' + skill.detail + '</small><em>' +
        (unlocked ? "DESBLOQUEADA · NIVEL " + skill.unlockLevel : "SE DESBLOQUEA EN NIVEL " + skill.unlockLevel) +
        '</em></div></div>';
    }).join("");
    const statLabels = [["hp","VIDA","♥"],["attack","ATAQUE","⚔"],["magic","MAGIA","✧"],["defense","DEFENSA","⬟"],["speed","VELOCIDAD","➤"],["agility","AGILIDAD","◇"]];
    const statMarkup = statLabels.map(([key,label,icon]) => '<div class="hero-stat"><span>' + icon + ' ' + label + '</span><strong>' + stats[key] + '</strong></div>').join("");
    const levelSteps = Array.from({length:10},(_,index) => {
      const stepLevel=index+1, stepStats=getCharacterStats(selected,stepLevel);
      return '<div class="level-step ' + (stepLevel===level ? "is-current" : stepLevel<level ? "is-passed" : "") + '">' +
        '<div class="level-step-top"><b>NIVEL ' + stepLevel + '</b><small>' + (stepLevel===1 ? "INICIO" : XP_THRESHOLDS[index] + " XP") + '</small></div>' +
        '<strong class="level-step-unlock">' + getUnlockForLevel(selected,stepLevel) + '</strong>' +
        '<span>PV ' + stepStats.hp + ' · ATQ ' + stepStats.attack + ' · MAG ' + stepStats.magic + '</span>' +
        '<span>DEF ' + stepStats.defense + ' · VEL ' + stepStats.speed + ' · AGI ' + stepStats.agility + '</span></div>';
    }).join("");
    const slots = [0,1,2,3].map((n) => '<span class="party-slot ' + (n<state.party.length ? "filled" : "") + '"></span>').join("");
    return '<div class="campaign-page character-manager-page">' +
      '<div class="page-heading"><div><span class="section-eyebrow">GESTIÓN DE LA COMPAÑÍA</span><h2>Personajes</h2></div><span class="character-count">05 HÉROES</span></div>' +
      '<div class="character-manager">' +
        '<aside class="character-sidebar camp-panel"><div class="character-sidebar-heading"><span>COMPAÑÍA</span><b>05</b></div><div class="character-nav-list">' + characterMenu + '</div>' +
          '<div class="character-party-mini"><span>GRUPO ACTIVO</span><strong>' + state.party.length + ' / 4</strong><div class="party-slots">' + slots + '</div></div></aside>' +
        '<section class="character-sheet camp-panel ' + (active ? "is-active" : "is-reserve") + '">' +
          '<div class="character-art-column"><div class="character-portrait-frame"><div class="character-portrait-placeholder"><b>' + selected.sign + '</b><small>RETRATO PENDIENTE</small></div>' + portraitImage + '</div>' +
            '<div class="character-sprite-window"><span>ANIMACIÓN DE CAMPO</span>' + spriteMarkup + '<div class="character-sprite-empty">SPRITE PENDIENTE</div></div></div>' +
          '<div class="character-profile">' +
            '<div class="character-profile-head"><div><span class="section-eyebrow">PERSONAJE ' + String(selectedIndex+1).padStart(2,"0") + ' · ' + selected.role + '</span><h3>' + selected.name + '</h3><div class="character-alias">«' + selected.title + '»</div>' +
              '<div class="character-quick-stats"><span>NIVEL ' + level + ' / 10</span><span>' + selected.role + '</span></div></div>' +
              '<button class="party-toggle ' + (active ? "is-selected" : "") + '" type="button" data-action="toggle-party" data-id="' + selected.id + '" ' + (disabled ? "disabled" : "") + '>' + (active ? "EN GRUPO" : "AÑADIR AL GRUPO") + '</button></div>' +
            '<div class="character-vitality"><div class="character-vitality-labels"><strong>VIDA ACTUAL</strong><b>' + hp + ' / ' + maxHp + ' PV</b></div><div class="character-health"><span style="width:' + hpPercent + '%"></span></div></div>' +
            '<div class="character-xp"><div><span>EXPERIENCIA</span><b>' + xp + (nextLevelXP===null ? " XP · NIVEL MÁXIMO" : " / " + nextLevelXP + " XP") + '</b></div><div class="character-xp-bar"><span style="width:' + xpProgress + '%"></span></div>' + (nextLevelXP===null ? "" : '<small>FALTAN ' + xpRemaining + ' XP PARA NIVEL ' + (level+1) + '</small>') + '</div>' +
            '<div class="hero-stat-grid">' + statMarkup + '</div>' +
            '<div class="hero-traits"><div><span>FORTALEZA</span><p>' + selected.strengths + '</p></div><div><span>DEBILIDAD</span><p>' + selected.weaknesses + '</p></div></div>' +
            '<div class="character-skill-heading"><span>HABILIDADES</span><small>DESBLOQUEO EN NIVELES 1 · 4 · 10</small></div>' +
            '<div class="character-skill-grid">' + skills +
              '<div class="character-skill character-passive-card is-locked"><span class="character-skill-icon">✧</span><div><strong>Pasiva · Por diseñar</strong><small>Espacio reservado para la habilidad pasiva del héroe.</small><em>SE DESBLOQUEARÁ EN NIVEL 3</em></div></div>' +
            '</div>' +
            '<details class="character-progression"><summary>PROGRESIÓN COMPLETA · NIVELES 1–10</summary><div class="progression-grid">' + levelSteps + '</div></details>' +
            '<div class="character-asset-note">' + spriteNote + '</div>' +
          '</div></section></div>' +
      '<div class="character-manager-footer"><span>Selecciona un héroe en el menú lateral.</span><button class="game-action secondary" type="button" data-tab="route">IR A RUTAS →</button></div></div>';
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
        (regionUnlocked ? '<button class="game-action secondary" type="button" data-action="enter-region" data-region="' + region.id + '">' + (selected ? 'CONTINUAR' : 'ENTRAR') + '</button>' : '<div class="region-seal">🔒 BLOQUEADA</div>') +
        '<div class="route-sites">' + sites + '</div>' +
      '</article>';
    }).join("");
    const siteCompleted = state.visitedSites.includes(selectedSite.id);
    const salimInParty = state.party.includes("duelist");
    const routeCompanion = salimInParty ? '<div class="route-salim"><div class="salim-mini-sprite route-salim-sprite"></div><span>SALIM <em>«EL MORO»</em></span></div>' : '';
    const detailType = selectedSite.boss ? (siteCompleted ? "JEFE DERROTADO" : "JEFE FINAL") : (siteCompleted ? "LOCALIZACIÓN SUPERADA" : "LOCALIZACIÓN");
    const detailAction = selectedSite.boss
      ? (siteCompleted ? '<span class="progress-complete">✓ JEFE SUPERADO</span>' : '<button class="game-action" type="button" data-action="enter-battle" data-site="' + selectedSite.id + '">ENTRAR AL JEFE →</button>')
      : (siteCompleted
          ? '<span class="progress-complete">✓ NIVEL SUPERADO</span>'
          : '<button class="game-action" type="button" data-action="enter-battle" data-site="' + selectedSite.id + '">ENTRAR EN SALA →</button>');
    return '<div class="campaign-page"><div class="page-heading"><div><span class="section-eyebrow">PROGRESO ' + (unlockedRegionIndex + 1) + ' / 3 ZONAS</span><h2>Mapa de rutas</h2></div><span class="route-legend">🔒 CERRADO · ✓ SUPERADO</span></div>' +
      '<div class="route-layout">' + cards + '</div>' +
      '<section class="site-detail"><div><span class="section-eyebrow">' + selectedRegion.name.toUpperCase() + ' · ' + detailType + '</span><h3>' + selectedSite.name + '</h3></div>' + routeCompanion + '<div class="site-detail-actions">' + detailAction + '<button class="game-action secondary" type="button" data-action="prepare-expedition">PREPARAR GRUPO</button></div></section>' +
      '<p class="campaign-notice">' + state.notice + '</p></div>';
  }

  function renderBattle() {
    const battle=state.battle;
    const siteId=state.battleSiteId || "institute-programming";
    const region=regions.find((entry)=>entry.sites.some((site)=>site.id===siteId));
    const site=region ? region.sites.find((entry)=>entry.id===siteId) : null;
    const siteIndex=region ? region.sites.findIndex((entry)=>entry.id===siteId) : -1;
    if(!site || !isSiteUnlocked(region,siteIndex,state.visitedSites) || !battle || battle.siteId!==siteId) {
      state.tab="route";
      return renderRoute();
    }

    const currentActor=getActiveBattleActor();
    const activeHero=currentActor && currentActor.side==="ally" ? characters.find((entry)=>entry.id===currentActor.id) : null;
    const activeEnemy=currentActor && currentActor.side==="enemy" ? battle.enemies.find((entry)=>entry.id===currentActor.id) : null;
    const pendingSkill=activeHero && battle.pendingSkillId ? activeHero.skills.find((entry)=>entry.id===battle.pendingSkillId) : null;
    const isVictory=battle.status==="victory";
    const isDefeat=battle.status==="defeat";

    const orderMarkup=battle.order.map((entry,index)=>{
      const isCurrent=index===battle.turnIndex && !isVictory && !isDefeat;
      const hero=entry.side==="ally" ? characters.find((character)=>character.id===entry.id) : null;
      const enemy=entry.side==="enemy" ? battle.enemies.find((item)=>item.id===entry.id) : null;
      const alive=hero ? (Number(state.hp[hero.id])||0)>0 : Boolean(enemy && enemy.hp>0);
      const label=hero ? hero.name : enemy ? enemy.name : entry.name;
      const mark=hero ? hero.sign : enemy ? enemy.mark : "?";
      return '<div class="battle-initiative-chip '+(isCurrent?"is-current ":"")+(entry.side==="enemy"?"is-enemy ":"")+(alive?"":"is-fallen")+'" '+(isCurrent?'aria-current="step"':'')+' title="'+label+'"><b>'+mark+'</b><small>'+label+'</small></div>';
    }).join("");

    const allyUnits=state.party.map((id,index)=>{
      const character=characters.find((entry)=>entry.id===id);
      if(!character) return "";
      const stats=getCharacterStats(character,state.levels[id]||1);
      const maxHp=stats.hp,maxMp=stats.mp;
      const currentHp=Math.max(0,Math.min(maxHp,Number(state.hp[id])||0));
      const currentMp=Math.max(0,Math.min(maxMp,Number(state.mp[id])||0));
      const hpRatio=Math.round(currentHp/maxHp*100);
      const mpRatio=Math.round(currentMp/maxMp*100);
      const isActive=Boolean(currentActor && currentActor.side==="ally" && currentActor.id===id && !isVictory && !isDefeat);
      const isTarget=battle.targetMode==="ally" && currentHp>0;
      const shield=battle.shields[id]||0;
      const shieldTurns=battle.shieldTurns[id]||0;
      const buff=battle.buffs[id]||null;
      const debuff=battle.debuffs[id]||null;
      const targetAttrs=isTarget ? 'data-action="battle-target" data-target-id="'+id+'" data-target-side="ally" role="button" tabindex="0" aria-label="Elegir a '+character.name+' como objetivo"' : "";
      return '<article class="battle-unit battle-ally battle-hero-'+id+(isActive?" is-active-turn":"")+(currentHp<=0?" is-fallen":"")+(isTarget?" is-targetable":"")+'" '+targetAttrs+'>' +
        '<div class="battle-unit-art"><span class="battle-unit-index">0'+(index+1)+'</span>' +
          '<div class="battle-pixel-figure figure-'+id+'" aria-hidden="true"><i class="figure-shadow"></i><i class="figure-legs"></i><i class="figure-body"></i><i class="figure-arm"></i><i class="figure-head"></i><i class="figure-hair"></i><i class="figure-weapon"></i><b class="figure-mark">'+character.sign+'</b></div>' +
          '<span class="battle-unit-role">'+character.role+'</span>' +
        '</div>' +
        '<div class="battle-unit-info"><div class="battle-unit-name"><strong>'+character.name+'</strong><em>«'+character.title+'»</em></div>' +
          '<div class="battle-unit-life"><span>♥ PV</span><b>'+currentHp+'/'+maxHp+'</b></div><div class="battle-hp-track"><i style="width:'+hpRatio+'%"></i></div>' +
          '<div class="battle-unit-mana"><span>✦ PM</span><b>'+currentMp+'/'+maxMp+'</b></div><div class="battle-mp-track"><i style="width:'+mpRatio+'%"></i></div>' +
          (shield>0?'<small class="battle-shield-value">ESCUDO '+shield+' · '+shieldTurns+'T</small>':"")+
          (buff && buff.turns>0?'<small class="battle-buff-value">MEJORA '+buff.turns+'T · ATQ +'+Math.round(buff.attack*100)+'% · VEL +'+Math.round(buff.speed*100)+'%</small>':"")+
          (debuff && debuff.turns>0?'<small class="battle-curse-value">MALDICIÓN '+debuff.turns+'T · RECIBE +18% DAÑO</small>':"")+
        '</div></article>';
    }).join("");

    const enemyUnits=battle.enemies.map((enemy,index)=>{
      const ratio=Math.round(enemy.hp/enemy.maxHp*100);
      const activeEnemy=Boolean(currentActor && currentActor.side==="enemy" && currentActor.id===enemy.id);
      const isTarget=battle.targetMode==="enemy" && enemy.hp>0;
      const targetAttrs=isTarget?'data-action="battle-target" data-target-id="'+enemy.id+'" data-target-side="enemy" role="button" tabindex="0" aria-label="Atacar a '+enemy.name+'"':'';
      return '<article class="battle-unit battle-enemy battle-enemy-'+enemy.id+(enemy.hp<=0?" is-fallen":"")+(isTarget?" is-targetable":"")+(activeEnemy?" is-active-turn":"")+'" '+targetAttrs+'>' +
        '<div class="battle-unit-art"><span class="battle-unit-index">E0'+(index+1)+'</span>' +
          '<div class="battle-enemy-figure enemy-'+enemy.id+'" aria-hidden="true"><img class="battle-enemy-art-image" src="assets/battles/enemies/'+enemy.asset+'.png" alt="" onerror="this.remove()"><i class="enemy-shadow"></i><i class="enemy-body"></i><i class="enemy-spikes"></i><i class="enemy-eyes"></i><b>'+enemy.mark+'</b></div>' +
          '<span class="battle-unit-role">'+enemy.role+'</span></div>' +
        '<div class="battle-unit-info"><div class="battle-unit-name"><strong>'+enemy.name+'</strong></div>' +
          '<div class="battle-unit-life"><span>♥ PV</span><b>'+enemy.hp+'/'+enemy.maxHp+'</b></div><div class="battle-hp-track enemy-hp-track"><i style="width:'+ratio+'%"></i></div>' +
          (enemy.burn>0?'<small class="battle-status-tag">QUEMADURA '+enemy.burn+'</small>':"")+
          (enemy.stun>0?'<small class="battle-stun-tag">DERRIBADO · PIERDE TURNO</small>':"")+
        '</div></article>';
    }).join("");

    const availableSkills=activeHero ? [BASIC_ATTACK].concat(activeHero.skills) : [];
    const skillsMarkup=activeHero ? availableSkills.map((skill)=>{
      const level=state.levels[activeHero.id]||1;
      const unlocked=level>=skill.unlockLevel;
      const enoughMana=(Number(state.mp[activeHero.id])||0)>=skill.manaCost;
      const disabled=!unlocked || !enoughMana || battle.status!=="active";
      const selected=battle.pendingSkillId===skill.id;
      const helpText=!unlocked ? "Se desbloquea en nivel "+skill.unlockLevel : !enoughMana ? "Necesitas "+skill.manaCost+" PM" : "Usar "+skill.name;
      return '<button class="battle-skill-button '+(unlocked?"is-unlocked":"is-locked")+(selected?" is-selected":"")+'" type="button" data-action="battle-skill" data-skill-id="'+skill.id+'" aria-pressed="'+selected+'" title="'+helpText+'" '+(disabled?"disabled":"")+'>' +
        '<span class="battle-skill-icon">'+skill.icon+'</span><span class="battle-skill-copy"><strong>'+skill.name+'</strong><small>'+skill.kind+' · NIVEL '+skill.unlockLevel+'</small><em>'+skill.detail+'</em></span>' +
        '<span class="battle-skill-cost">'+skill.manaCost+' PM</span></button>';
    }).join("") : '<div class="battle-waiting-message">'+(isVictory?"SALA DESPEJADA":isDefeat?"COMPAÑÍA DERROTADA":"Turno enemigo…")+'</div>';

    const logMarkup=battle.log.slice(0,3).map((line)=>'<li>'+line+'</li>').join("");
    const activeLabel=activeHero ? 'TURNO DE '+activeHero.name.toUpperCase() : activeEnemy ? 'TURNO ENEMIGO · '+activeEnemy.name.toUpperCase() : isVictory ? "VICTORIA" : isDefeat ? "DERROTA" : "RESOLVIENDO TURNO";
    const prompt=pendingSkill ? (pendingSkill.target==="enemy" ? "ELIGE UN ENEMIGO" : "ELIGE UN COMPAÑERO") : activeHero ? "ELIGE UNA HABILIDAD" : "EL TURNO AVANZA AUTOMÁTICAMENTE";

    const commandPanel=isVictory
      ? '<div class="battle-result-panel is-victory"><span>✦</span><div><strong>VICTORIA</strong><small>La sala está despejada. +45 XP para la compañía.</small></div><button type="button" class="game-action" data-action="leave-battle">CONTINUAR →</button></div>'
      : isDefeat
        ? '<div class="battle-result-panel is-defeat"><span>☠</span><div><strong>DERROTA</strong><small>Puedes reintentar con la vida y el maná que tenías al entrar en la sala, o volver al bastión para descansar.</small></div><button type="button" class="game-action" data-action="retry-battle">REINTENTAR</button><button type="button" class="game-action secondary" data-action="leave-battle">VOLVER A RUTAS</button></div>'
        : '<div class="battle-command"><div class="battle-command-heading"><div><span class="section-eyebrow">'+activeLabel+'</span><h3>'+prompt+'</h3></div>' +
            (pendingSkill?'<button class="battle-cancel-target" type="button" data-action="cancel-battle-target">CANCELAR</button>':"")+
          '</div><div class="battle-skill-row">'+skillsMarkup+'</div></div>';

    return '<div class="campaign-page battle-page">'+
      '<div class="battle-topbar"><div><span class="section-eyebrow">'+region.name.toUpperCase()+' · '+site.name.toUpperCase()+'</span><h2>Campo de batalla</h2></div>' +
        '<div class="battle-round-mark"><small>RONDA</small><strong>'+String(battle.round).padStart(2,"0")+'</strong></div>' +
        '<div class="battle-turn-order"><span>ORDEN DE TURNO</span><div>'+orderMarkup+'</div></div></div>'+
      '<section class="battle-stage" aria-label="Campo de batalla por turnos">'+
        '<div class="battle-room-wall battle-room-'+site.id+'"><img class="battle-scene-image" src="assets/battles/backgrounds/'+site.id+'.jpg" alt="" onerror="this.remove()"><div class="battle-window"><i></i><i></i><i></i><i></i></div><div class="battle-blackboard"><span>PROGRAMACIÓN</span><b>if (fear) { run(); }</b><small>// SISTEMA EN ESTADO CRÍTICO</small></div><div class="battle-wall-clock"><i></i></div><div class="battle-server-rack"><i></i><i></i><i></i><i></i><b>SYS</b></div><div class="battle-desk desk-one"><i></i><b></b></div><div class="battle-desk desk-two"><i></i><b></b></div><div class="battle-room-fog"></div></div>'+
        '<div class="battle-stage-topline"><span>COMPAÑÍA <b>‹</b> ENEMIGOS</span><span>UNA SOLA SALA · ENCUENTRO '+(battle.status==="active"?"ACTIVO":battle.status==="victory"?"COMPLETADO":"FALLIDO")+'</span></div>'+
        '<div class="battle-lineup battle-allies-line">'+allyUnits+'</div>'+
        '<div class="battle-lineup battle-enemies-line">'+enemyUnits+'</div>'+
        '<div class="battle-ground-line"></div>'+
        '<div class="battle-stage-foot"><span>ALIADOS · '+getAliveParty().length+'/04</span><span>ENEMIGOS · '+battle.enemies.filter((enemy)=>enemy.hp>0).length+'/03</span><span>MANÁ Y VIDA INDIVIDUALES</span></div>'+
      '</section>'+
      '<section class="battle-actions-area" aria-live="polite">'+
        commandPanel+
        '<aside class="battle-log-panel" aria-live="polite"><div><span>REGISTRO DE COMBATE</span><b>RONDA '+battle.round+'</b></div><ul>'+logMarkup+'</ul></aside>'+
      '</section>'+
      '<div class="battle-bottom-bar"><div><span class="battle-provisional-mark">◆</span><span>ESCENARIO Y ENEMIGOS PROVISIONALES · LOS TURNOS Y HABILIDADES YA FUNCIONAN</span></div><button class="game-action secondary" type="button" data-action="leave-battle">← VOLVER A RUTAS</button></div>'+
    '</div>';
  }

  function renderRest() {
    const hurt = characters.filter((character) => (Number(state.hp[character.id]) || 0) < getCharacterStats(character,state.levels[character.id] || 1).hp).length;
    return '<div class="campaign-page"><div class="page-heading"><div><span class="section-eyebrow">EL FUEGO TODAVÍA ARDE</span><h2>Descanso en el bastión</h2><p>Lejos de las rutas malditas, la compañía puede cerrar heridas y recuperar fuerzas antes de volver a salir.</p></div></div>' +
      '<div class="rest-layout"><section class="camp-panel rest-chamber"><div class="rest-symbol">✚</div><span class="section-eyebrow">CÁMARA DEL ÚLTIMO FAROL</span><h3>Unas horas lejos de la oscuridad</h3><p>La compañía se reúne alrededor del fuego. El calor devuelve el aliento y las vendas se renuevan. El descanso consume una ración de marcha.</p><div class="rest-cost">COSTE: 1 RACIÓN · DISPONIBLES: ' + state.rations + '</div><button class="game-action" type="button" data-action="rest" ' + (state.rations < 1 ? "disabled" : "") + '>DESCANSAR Y RECUPERAR →</button></section>' +
      '<aside class="camp-panel rest-effect"><h3>Estado de la compañía</h3><div class="inventory-row"><span>Héroes heridos</span><strong>' + hurt + ' / 5</strong></div><div class="inventory-row"><span>Vida recuperada</span><strong>+25% PV máximo</strong></div><div class="inventory-row"><span>Maná recuperado</span><strong>+25% PM máximo</strong></div><div class="inventory-row"><span>Grupo activo</span><strong>' + state.party.length + ' / 4</strong></div><p>El descanso también atiende al miembro que permanece en reserva. Nadie queda atrás dentro de los muros.</p></aside></div><p class="campaign-notice">' + state.notice + '</p></div>';
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
      dialogContent.innerHTML = '<div class="credits-list"><div class="credit-item"><span class="credit-role">CONCEPTO Y DESARROLLO</span><span class="credit-name">PAIS DUNGEON</span></div><div class="credit-item"><span class="credit-role">DIRECCIÓN ARTÍSTICA</span><span class="credit-name">Fantasía oscura · Pixel art original</span></div><div class="credit-item"><span class="credit-role">ESTADO</span><span class="credit-name">Build 012 — revisión de combate y campaña</span></div></div>';
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
      dialogContent.innerHTML = '<p class="dialog-emphasis">' + region.name + '</p><p>' + region.bossDescription + '</p><p class="dialog-caveat">El combate de jefe todavía está pendiente de diseño.</p>';
      dialogActions.innerHTML = defeated
        ? '<button class="dialog-button" type="button" data-action="close-dialog">Cerrar <span>←</span></button>'
        : (unlocked ? '<button class="dialog-button" type="button" data-action="defeat-boss">SIMULAR VICTORIA <span>✦</span></button>' : '<button class="dialog-button" type="button" data-action="close-dialog">Volver al mapa <span>←</span></button>');
    }
    if (kind === "expedition") {
      const region = regions.find((entry) => entry.id === state.selectedRegion) || regions[0];
      const partyNames = characters.filter((entry) => state.party.includes(entry.id)).map((entry) => entry.name + " «" + entry.title + "»").join(", ");
      dialogEyebrow.textContent = "ORDEN DE MARCHA";
      dialogTitle.textContent = "La compañía está preparada";
      dialogContent.innerHTML = '<p class="dialog-emphasis">' + region.name + '</p><p>Partirán: ' + partyNames + '.</p><p>La primera sala ya incluye un combate por turnos provisional. Los jefes y el resto de localizaciones se irán incorporando después.</p>';
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
    awardPartyExperience(45);
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
    awardPartyExperience(120);
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
      const level=state.levels[character.id] || 1;
      const maxHp=getCharacterStats(character,level).hp;
      const currentHp=Number.isFinite(state.hp[character.id]) ? state.hp[character.id] : maxHp;
      state.hp[character.id]=Math.min(maxHp,currentHp+Math.ceil(maxHp*0.25));
      const maxMp=getCharacterStats(character,level).mp;
      const currentMp=Number.isFinite(state.mp[character.id]) ? state.mp[character.id] : maxMp;
      state.mp[character.id]=Math.min(maxMp,currentMp+Math.ceil(maxMp*0.25));
    });
    showNotice("La compañía ha descansado. Todos recuperan un 25% de su vida y su maná máximos.");
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
    if (action === "enter-region") {
      const region=regions.find((entry)=>entry.id===target.dataset.region);
      const regionIndex=region ? regions.findIndex((entry)=>entry.id===region.id) : -1;
      if(!region || !isRegionUnlocked(regionIndex,state.visitedSites)) return showNotice("Esta zona está cerrada. Derrota al jefe de la zona anterior.");
      const nextIndex=region.sites.findIndex((site,index)=>isSiteUnlocked(region,index,state.visitedSites) && !state.visitedSites.includes(site.id));
      if(nextIndex<0) {
        state.selectedRegion=region.id;
        state.selectedSite=region.sites[region.sites.length-1].id;
        return showNotice("Ya has superado todas las localizaciones de "+region.name+".");
      }
      if(state.party.length!==4) return showNotice("Selecciona exactamente cuatro personajes en Compañía para entrar en la sala.");
      const site=region.sites[nextIndex];
      state.selectedRegion=region.id;
      state.selectedSite=site.id;
      beginBattle(site.id);
      return;
    }
    if (action === "enter-battle") {
      const siteId = target.dataset.site;
      const region = regions.find((entry) => entry.sites.some((site) => site.id === siteId));
      const siteIndex = region ? region.sites.findIndex((site) => site.id === siteId) : -1;
      if (!region || siteIndex < 0 || !isSiteUnlocked(region,siteIndex,state.visitedSites)) {
        return showNotice("Esta sala todavía está bloqueada.");
      }
      if (state.party.length !== 4) return showNotice("Selecciona exactamente cuatro personajes en Compañía para entrar en la sala.");
      beginBattle(siteId);
      return;
    }
    if (action === "leave-battle") {
      state.tab = "route";
      if (state.battle && state.battle.status === "victory") state.battle = null;
      if (state.battleSiteId) state.selectedSite = state.selectedSite || state.battleSiteId;
      saveState();
      renderCampaign();
      return;
    }
    if (action === "retry-battle") {
      retryBattle();
      return;
    }
    if (action === "battle-skill") {
      chooseBattleSkill(target.dataset.skillId);
      return;
    }
    if (action === "battle-target") {
      chooseBattleTarget(target.dataset.targetId,target.dataset.targetSide);
      return;
    }
    if (action === "cancel-battle-target") {
      if (state.battle) {
        state.battle.pendingSkillId=null;
        state.battle.targetMode=null;
        state.notice="Elige una habilidad.";
        renderCampaign();
        saveState();
      }
      return;
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
    const characterButton = event.target.closest("[data-character-select]");
    if (characterButton && state) {
      const characterId = characterButton.dataset.characterSelect;
      if (characters.some((character) => character.id === characterId)) {
        state.selectedCharacter = characterId;
        renderCampaign();
        saveState();
      }
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
    const targetCard=event.target.closest && event.target.closest('[data-action="battle-target"]');
    if (targetCard && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      handleAction("battle-target",targetCard);
      return;
    }
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