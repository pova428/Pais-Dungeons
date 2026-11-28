export const BASIC_ATTACK = {
    id:"basic-attack",manaCost:0,target:"enemy",name:"Ataque básico",
    detail:"Golpe físico sin consumir maná: 70% de ATQ.",unlockLevel:1,icon:"⚔",kind:"BÁSICA"
  };

export const ENEMY_TYPES = {
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

export const SITE_ENCOUNTERS = {
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
