export const characters = [
    {id:"guardian",name:"Pol",title:"El Flaco",role:"MAGO",sign:"P",icon:"✧",detail:"Mago veloz y frágil, especialista en esferas, rayos y explosiones de magia oscura.",strengths:"Mayor velocidad y agilidad. Magia muy potente y gran evasión.",weaknesses:"Poca vida, defensa baja y daño físico reducido.",portrait:"assets/pol-portrait.png",sprites:"assets/pol-sprites.png",base:{hp:58,attack:5,magic:12,defense:4,speed:18,agility:17,mp:60},growth:{hp:5,attack:1,magic:1,defense:1,speed:1,agility:1,mp:4},skills:[
      {id:"arcane-bolt",manaCost:9,target:"enemy",name:"Ataque Maligno",detail:"Lanza una esfera de magia oscura a un enemigo: 105% de MAG.",unlockLevel:1,icon:"✧",kind:"BÁSICA"},
      {id:"burn-mark",manaCost:15,target:"enemy",name:"Materia oscura",detail:"Un rayo de magia cae del cielo sobre un enemigo: 145% de MAG.",unlockLevel:4,icon:"♨",kind:"MAGIA"},
      {id:"nova",manaCost:26,target:"all-enemies",name:"Estallido primordial",detail:"Invoca una esfera arcana gigante que estalla y golpea a todos los enemigos: 110% de MAG.",unlockLevel:10,icon:"✦",kind:"ULTIMATE"}
    ]},
    {id:"duelist",name:"Salim",title:"El Moro",role:"ASESINO",sign:"S",icon:"⚔",detail:"Asesino de gran daño y agilidad, pero muy vulnerable.",strengths:"Daño físico más alto. Muy rápido, ágil y con gran potencial crítico.",weaknesses:"Menor vida y defensa del equipo. Sufre mucho si recibe golpes directos.",portrait:"assets/salim-portrait.png",base:{hp:48,attack:13,magic:1,defense:3,speed:17,agility:18,mp:36},growth:{hp:4,attack:1,magic:0,defense:1,speed:1,agility:1,mp:3},skills:[
      {id:"stab",manaCost:8,target:"enemy",name:"Navajazo",detail:"Corte rápido a un enemigo: 100% de ATQ.",unlockLevel:1,icon:"🗡",kind:"BÁSICA"},
      {id:"multi-stab",manaCost:17,target:"enemy",name:"Navajazos múltiples",detail:"Tres cortes consecutivos de 35% de ATQ cada uno.",unlockLevel:4,icon:"⚔",kind:"ATAQUE"},
      {id:"brothers",manaCost:28,target:"all-enemies",name:"Llamar a sus hermanos",detail:"Ataque conjunto contra todos los enemigos con dos impactos de 50% de ATQ.",unlockLevel:10,icon:"✦",kind:"ULTIMATE"}
    ]},
    {id:"arcanist",name:"Igor",title:"El Alto",role:"SANADOR",sign:"I",icon:"✚",detail:"Sanador que cura aliados, roba vida y puede recuperar a toda la compañía.",strengths:"Curación potente, buena vida y estadísticas equilibradas.",weaknesses:"Menor daño directo que los atacantes y velocidad moderada.",portrait:"assets/igor-portrait.png",sprites:"assets/igor-sprites.png",base:{hp:78,attack:6,magic:11,defense:8,speed:10,agility:10,mp:80},growth:{hp:7,attack:1,magic:1,defense:1,speed:1,agility:1,mp:5},skills:[
      {id:"antivirus",manaCost:12,target:"ally",name:"Antivirus",detail:"Cura a un aliado: 90% de MAG + 6 PV.",unlockLevel:1,icon:"✚",kind:"BÁSICA"},
      {id:"life-drain",manaCost:18,target:"enemy",name:"Chupadita",detail:"Roba vida a un enemigo: 80% de MAG. Igor recupera el 50% del daño infligido.",unlockLevel:4,icon:"☯",kind:"APOYO"},
      {id:"reboot",manaCost:30,target:"all-allies",name:"Diarrea para todos",detail:"Cura a todos los aliados vivos: 75% de MAG + 8 PV a cada uno.",unlockLevel:10,icon:"✦",kind:"ULTIMATE"}
    ]},
    {id:"tracker",name:"Ivan",title:"El Gordo",role:"TANQUE",sign:"V",icon:"⬟",detail:"Tanque del equipo. Protege a sus compañeros con escudos y derribos.",strengths:"Mayor vida y defensa. Escudos fuertes y gran capacidad de protección.",weaknesses:"El más lento y menos ágil. Magia y daño explosivo muy bajos.",portrait:"assets/ivan-portrait.png",sprites:"assets/ivan-sprites.png",base:{hp:116,attack:8,magic:1,defense:15,speed:5,agility:4,mp:48},growth:{hp:11,attack:1,magic:0,defense:1,speed:0,agility:0,mp:3},skills:[
      {id:"protective-shield",manaCost:11,target:"ally",name:"Escudo protector",detail:"Concede a un aliado un escudo del 22% de su vida máxima. Bloquea el siguiente ataque que reciba y dura como máximo una ronda.",unlockLevel:1,icon:"⬡",kind:"BÁSICA"},
      {id:"knockdown",manaCost:16,target:"enemy",name:"Barrilete",detail:"Embestida que inflige 90% de ATQ y derriba al enemigo, que pierde su próximo turno.",unlockLevel:4,icon:"⚒",kind:"CONTROL"},
      {id:"team-bastion",manaCost:28,target:"all-allies",name:"Culo Gordo",detail:"Protege a todos los aliados con un escudo del 15% de su vida máxima. Bloquea el siguiente golpe de cada uno o desaparece al terminar la ronda.",unlockLevel:10,icon:"✦",kind:"ULTIMATE"}
    ]},
    {id:"alchemist",name:"Alex",title:"El Mujeriego",role:"DUELISTA",sign:"A",icon:"⚔",detail:"Duelista equilibrado, combina daño, resistencia y mejoras propias.",strengths:"Buen daño físico y vida. Puede potenciarse antes de atacar.",weaknesses:"No destaca en magia ni supera a Salim en daño o a Ivan en resistencia.",portrait:"assets/alex-portrait.png",sprites:"assets/alex-sprites.png",base:{hp:86,attack:10,magic:1,defense:8,speed:12,agility:12,mp:52},growth:{hp:8,attack:1,magic:0,defense:1,speed:1,agility:1,mp:4},skills:[
      {id:"balonazo",manaCost:9,target:"enemy",name:"Balonazo",detail:"Lanza un balón contra un enemigo: 105% de ATQ.",unlockLevel:1,icon:"⚽",kind:"BÁSICA"},
      {id:"modo-mujer",manaCost:16,target:"self",name:"Modo Mujer",detail:"Se potencia durante 2 turnos: +20% de ATQ y +10% de VEL.",unlockLevel:4,icon:"♛",kind:"MEJORA"},
      {id:"field-finish",manaCost:27,target:"all-enemies",name:"Dedeo",detail:"Ataque tóxico que golpea a todos los enemigos: 85% de ATQ y veneno durante 2 turnos.",unlockLevel:10,icon:"✦",kind:"ULTIMATE"}
    ]}
  ];

export const XP_THRESHOLDS = [0,100,240,420,650,930,1260,1640,2070,2550];
