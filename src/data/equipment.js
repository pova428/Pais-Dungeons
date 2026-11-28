export const EQUIPMENT_ITEMS = [
    {id:"copper-ring",name:"Anillo de cobre",rarity:"Común",icon:"◉",type:"Anillo",price:35,description:"Un aro sencillo que protege contra golpes pequeños.",bonuses:{defense:1}},
    {id:"worn-gloves",name:"Guantes gastados",rarity:"Común",icon:"♧",type:"Guantes",price:38,description:"Mejor agarre para armas y herramientas.",bonuses:{attack:1,agility:1}},
    {id:"dusty-grimoire",name:"Grimorio polvoriento",rarity:"Común",icon:"▤",type:"Reliquia",price:40,description:"Unas pocas páginas aún conservan energía.",bonuses:{magic:1}},
    {id:"hunter-boots",name:"Botas del rastreador",rarity:"Poco común",icon:"⌁",type:"Botas",price:75,description:"Su suela ligera permite reaccionar antes.",bonuses:{speed:2,agility:1}},
    {id:"bone-pendant",name:"Colgante de hueso",rarity:"Poco común",icon:"♢",type:"Amuleto",price:82,description:"Un fragmento tallado que estabiliza la magia.",bonuses:{magic:2,defense:1}},
    {id:"thorn-band",name:"Banda de espinas",rarity:"Poco común",icon:"✥",type:"Anillo",price:88,description:"Duele llevarla, pero endurece el brazo.",bonuses:{attack:2}},
    {id:"bastion-buckle",name:"Hebilla del bastión",rarity:"Rara",icon:"⬟",type:"Armadura",price:145,description:"Una pieza de metal recuperada de una antigua guardia.",bonuses:{defense:3,attack:1}},
    {id:"ember-tome",name:"Tomo de brasa",rarity:"Rara",icon:"♨",type:"Reliquia",price:155,description:"Sus páginas guardan calor arcano.",bonuses:{magic:3}},
    {id:"eagle-charm",name:"Amuleto del águila",rarity:"Rara",icon:"⌖",type:"Amuleto",price:165,description:"Afina los reflejos y favorece los golpes precisos.",bonuses:{agility:2,critChance:.04}},
    {id:"ash-crown",name:"Corona de ceniza",rarity:"Épica",icon:"♛",type:"Reliquia",price:260,description:"Una corona quemada que aún conserva poder.",bonuses:{magic:3,defense:2,speed:1}},
    {id:"duelist-sash",name:"Faja del duelista",rarity:"Épica",icon:"╱",type:"Armadura",price:275,description:"Ligera y flexible, acompaña cada movimiento.",bonuses:{attack:3,agility:2}},
    {id:"green-cross",name:"Cruz de savia",rarity:"Épica",icon:"✚",type:"Amuleto",price:290,description:"Aumenta la energía de las curaciones.",bonuses:{magic:2,healingBonus:.12}},
    {id:"bloodfang",name:"Colmillo carmesí",rarity:"Legendaria",icon:"牙",type:"Arma",price:440,description:"Un filo antiguo que premia la agresividad.",bonuses:{attack:4,agility:2,critChance:.08}},
    {id:"titan-core",name:"Núcleo del titán",rarity:"Legendaria",icon:"⬢",type:"Armadura",price:465,description:"Una piedra pesada que refuerza cualquier defensa.",bonuses:{defense:5,shieldBonus:.12}},
    {id:"star-heart",name:"Corazón estelar",rarity:"Legendaria",icon:"✦",type:"Reliquia",price:490,description:"Concentra una gran cantidad de energía mágica.",bonuses:{magic:4,healingBonus:.08}},
    {id:"navaja-de-ala",name:"Navaja de Ala",rarity:"Hyperrara",icon:"⚔",type:"Arma única",price:0,character:"duelist",description:"La navaja legendaria de Salim. Su filo parece moverse antes que la mano.",bonuses:{attack:5,speed:3,agility:3,critChance:.12}},
    {id:"varita-aula-prohibida",name:"Varita del Aula Prohibida",rarity:"Hyperrara",icon:"✧",type:"Báculo único",price:0,character:"guardian",description:"La magia olvidada del instituto responde a Pol.",bonuses:{magic:5,speed:2,agility:2,critChance:.08}},
    {id:"antivirus-raiz",name:"Antivirus Raíz",rarity:"Hyperrara",icon:"✚",type:"Reliquia única",price:0,character:"arcanist",description:"Un núcleo curativo que limpia cualquier corrupción.",bonuses:{magic:4,defense:3,healingBonus:.25}},
    {id:"escudo-de-los-cinco",name:"Escudo de los Cinco",rarity:"Hyperrara",icon:"⬡",type:"Escudo único",price:0,character:"tracker",description:"El bastión de Ivan convertido en una defensa imposible de quebrar.",bonuses:{defense:7,speed:2,shieldBonus:.25}},
    {id:"balon-del-ultimo-gol",name:"Balón del Último Gol",rarity:"Hyperrara",icon:"⚽",type:"Reliquia única",price:0,character:"alchemist",description:"El balón que convierte cada remate de Alex en una jugada decisiva.",bonuses:{attack:4,defense:2,speed:3,critChance:.08}}
  ];
export const RARITY_ORDER=["Común","Poco común","Rara","Épica","Legendaria","Hyperrara"];
export const GACHA_RARITY_RATES=[
    {rarity:"Común",chance:50},{rarity:"Poco común",chance:25},{rarity:"Rara",chance:15},
    {rarity:"Épica",chance:7},{rarity:"Legendaria",chance:2.5},{rarity:"Hyperrara",chance:.5}
  ];
export const GACHA_COST=100,SHOP_REFRESH_COST=35,SHOP_STOCK_SIZE=4,MAX_EQUIPPED_ITEMS=5;
export const GACHA_ANIMATION_DURATIONS={spin:1350,drop:850,open:720};

export const items = [
    {id:"ration",name:"Ración de marcha",desc:"Comida seca para recuperar fuerzas en el bastión.",price:15,icon:"✚",kind:"rations"},
    {id:"bandage",name:"Venda de lino",desc:"Un paquete de vendas limpias para futuras expediciones.",price:20,icon:"╱",kind:"bandage"},
    {id:"tonic",name:"Tónico de raíz negra",desc:"Un frasco amargo de uso medicinal. Su fórmula es inestable.",price:35,icon:"⚗",kind:"tonic"},
    {id:"oil",name:"Aceite de lámpara",desc:"Combustible para no caminar a oscuras.",price:12,icon:"♨",kind:"oil"}
  ];

