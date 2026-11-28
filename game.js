import { characters, XP_THRESHOLDS } from "./src/data/heroes.js";
import { regions } from "./src/data/world.js";
import {
  EQUIPMENT_ITEMS,
  RARITY_ORDER,
  GACHA_RARITY_RATES,
  GACHA_COST,
  SHOP_REFRESH_COST,
  SHOP_STOCK_SIZE,
  MAX_EQUIPPED_ITEMS,
  GACHA_ANIMATION_DURATIONS,
  items
} from "./src/data/equipment.js";
import { BASIC_ATTACK, ENEMY_TYPES, SITE_ENCOUNTERS } from "./src/data/encounters.js";
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

  function getCharacterStats(character,level) {
    const safeLevel = Math.min(10,Math.max(1,Number(level) || 1));
    const gains = safeLevel - 1;
    return Object.fromEntries(Object.keys(character.base).map((key) => [key,character.base[key] + character.growth[key] * gains]));
  }

  function getOwnedEquipment(uid) {
    return state && Array.isArray(state.equipmentInventory) ? state.equipmentInventory.find((entry)=>String(entry.uid)===String(uid)) || null : null;
  }
  function getEquipmentDefinition(uid) {
    const owned=getOwnedEquipment(uid);
    return owned ? EQUIPMENT_ITEMS.find((item)=>item.id===owned.itemId) || null : null;
  }
  function getCharacterEquipmentIds(characterId) {
    return state && state.equippedItems && Array.isArray(state.equippedItems[characterId]) ? state.equippedItems[characterId] : [];
  }
  function getEffectiveCharacterStats(character,level) {
    const stats=getCharacterStats(character,level);
    stats.critChance=0;
    stats.healingBonus=0;
    stats.shieldBonus=0;
    getCharacterEquipmentIds(character.id).forEach((uid)=>{
      const item=getEquipmentDefinition(uid);
      if(item && item.bonuses) Object.entries(item.bonuses).forEach(([key,value])=>{stats[key]=(Number(stats[key])||0)+(Number(value)||0);});
    });
    return stats;
  }
  function getRarityClass(rarity) {
    return ({ "Común":"common","Poco común":"uncommon","Rara":"rare","Épica":"epic","Legendaria":"legendary","Hyperrara":"hyperrare" })[rarity] || "common";
  }
  function getEquipmentBonusText(item) {
    const labels={attack:"ATQ",magic:"MAG",defense:"DEF",speed:"VEL",agility:"AGI",critChance:"CRÍTICO",healingBonus:"CURACIÓN",shieldBonus:"ESCUDO"};
    return Object.entries(item && item.bonuses || {}).map(([key,value])=>
      (key==="critChance"||key==="healingBonus"||key==="shieldBonus" ? "+"+Math.round(value*100)+"%" : "+"+value)+" "+(labels[key]||key.toUpperCase())
    ).join(" · ");
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

  function createBattleState(siteId) {
    const startingVitals={};
    state.party.forEach((id)=>{
      startingVitals[id]={hp:Number(state.hp[id])||0,mp:Number(state.mp[id])||0};
    });
    const enemyIds=SITE_ENCOUNTERS[siteId]||SITE_ENCOUNTERS["institute-programming"];
    const enemies=enemyIds.map((enemyId)=>{
      const template=ENEMY_TYPES[enemyId];
      return Object.assign({id:enemyId},template,{hp:template.maxHp,burn:0,burnDamage:0,poison:0,poisonDamage:0,stun:0,shield:0,enraged:false});
    });
    return {
      siteId,encounterVersion:2,round:1,order:[],turnIndex:0,currentTurnStarted:null,startingVitals,
      enemies,shields:{},shieldTurns:{},shieldHits:{},shieldExpiresRound:{},buffs:{},debuffs:{},pendingSkillId:null,targetMode:null,
      actionAnimation:null,floatingNumbers:[],nextFloatingNumberId:1,status:"active",
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
      const baseSpeed=getEffectiveCharacterStats(character,state.levels[id] || 1).speed;
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
      state.shopStock=[];
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
    const before=Math.max(0,Number(enemy.hp)||0);
    const damage=Math.max(1,Math.round(amount));
    enemy.hp=Math.max(0,before-damage);
    const actual=before-enemy.hp;
    if(actual>0) addBattleFloatingNumber("enemy",enemy.id,actual,"damage");
    pushBattleLog(enemy.name+" recibe "+actual+" de daño.");
    if(enemy.hp<=0) pushBattleLog(enemy.name+" ha sido derrotado.");
    return actual;
  }

  function applyHeroDamage(heroId,amount) {
    const character=characters.find((entry)=>entry.id===heroId);
    if(!character) return 0;
    const level=state.levels[heroId]||1;
    const maxHp=getEffectiveCharacterStats(character,level).hp;
    let damage=Math.max(1,Math.round(amount));
    const curse=state.battle.debuffs[heroId];
    if(curse && curse.turns>0) {
      damage=Math.ceil(damage*(1+(curse.damageTaken||.18)));
      pushBattleLog(character.name+" sufre daño amplificado por la maldición.");
    }
    const battle=state.battle;
    const shield=battle.shields[heroId]||0;
    if(shield>0) {
      const absorbed=Math.min(shield,damage);
      damage-=absorbed;
      if(absorbed>0) addBattleFloatingNumber("ally",heroId,absorbed,"shield");
      pushBattleLog(character.name+" bloquea "+absorbed+" con su escudo.");
      if((battle.shieldHits[heroId]||0)>0) {
        delete battle.shields[heroId]; delete battle.shieldTurns[heroId];
        delete battle.shieldHits[heroId]; delete battle.shieldExpiresRound[heroId];
        pushBattleLog("El escudo de "+character.name+" se consume tras el primer ataque.");
      } else {
        battle.shields[heroId]-=absorbed;
        if(battle.shields[heroId]<=0) {
          delete battle.shields[heroId]; delete battle.shieldTurns[heroId];
          pushBattleLog("El escudo de "+character.name+" se rompe.");
        }
      }
    }
    const current=Math.max(0,Number(state.hp[heroId])||0);
    const actual=Math.min(current,damage);
    state.hp[heroId]=Math.max(0,current-damage);
    if(actual>0) {
      addBattleFloatingNumber("ally",heroId,actual,"damage");
      pushBattleLog(character.name+" pierde "+actual+" PV.");
    }
    if(state.hp[heroId]<=0) pushBattleLog(character.name+" queda fuera de combate.");
    return actual;
  }

  function healHero(heroId,amount) {
    const character=characters.find((entry)=>entry.id===heroId);
    if(!character) return 0;
    const maxHp=getEffectiveCharacterStats(character,state.levels[heroId]||1).hp;
    const current=Math.max(0,Number(state.hp[heroId])||0);
    const healed=Math.min(maxHp-current,Math.max(0,Math.round(amount)));
    state.hp[heroId]=current+healed;
    if(healed>0) {
      addBattleFloatingNumber("ally",heroId,healed,"heal");
      pushBattleLog(character.name+" recupera "+healed+" PV.");
    }
    return healed;
  }

  function healEnemy(enemyId,amount,sourceName) {
    const enemy=state.battle.enemies.find((entry)=>entry.id===enemyId && entry.hp>0);
    if(!enemy) return 0;
    const healed=Math.min(enemy.maxHp-enemy.hp,Math.max(0,Math.round(amount)));
    enemy.hp+=healed;
    if(healed>0) {
      addBattleFloatingNumber("enemy",enemy.id,healed,"heal");
      pushBattleLog((sourceName || "Un enemigo")+" cura a "+enemy.name+" y recupera "+healed+" PV.");
    }
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

  function applyPoisonAtEnemyTurn(enemy) {
    const turns=Math.max(0,Number(enemy.poison)||0);
    if(turns<=0 || enemy.hp<=0) return;
    const before=enemy.hp;
    const damage=Math.max(1,Math.round(Number(enemy.poisonDamage)||3));
    enemy.hp=Math.max(0,before-damage);
    enemy.poison=turns-1;
    const actual=before-enemy.hp;
    if(actual>0) addBattleFloatingNumber("enemy",enemy.id,actual,"poison");
    pushBattleLog(enemy.name+" recibe "+actual+" de daño por veneno.");
    if(enemy.hp<=0) pushBattleLog(enemy.name+" cae por el veneno.");
    if(enemy.poison<=0) enemy.poisonDamage=0;
  }

  function expireRoundShields(battle) {
    if(!battle || !battle.shieldExpiresRound) return;
    Object.entries(battle.shieldExpiresRound).forEach(([heroId,expiresRound])=>{
      if(Number(expiresRound)>battle.round) return;
      delete battle.shieldExpiresRound[heroId]; delete battle.shieldHits[heroId];
      delete battle.shields[heroId]; delete battle.shieldTurns[heroId];
      const character=characters.find((entry)=>entry.id===heroId);
      if(character) pushBattleLog("El escudo de "+character.name+" se desvanece al terminar la ronda.");
    });
  }

  function chooseEnemyTarget(enemy,candidates) {
    const battle=state.battle;
    const scored=candidates.map((id)=>{
      const character=characters.find((entry)=>entry.id===id);
      const stats=getEffectiveCharacterStats(character,state.levels[id]||1);
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
    const animation=state.battle.actionAnimation;
    if(animation && animation.side==="enemy" && animation.actorId===enemy.id) {
      animation.targets=[{side:"ally",id:targetId}];
    }
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
        const healed=healEnemy(wounded.id,Math.max(5,Math.round(wounded.maxHp*.13)),enemy.name);
        if (!healed) pushBattleLog(enemy.name+" intenta reparar a un aliado, pero ya está al máximo.");
        return;
      }
    }

    const targetId=chooseEnemyTarget(enemy,candidates);
    const target=characters.find((character)=>character.id===targetId);
    const targetStats=getEffectiveCharacterStats(target,state.levels[targetId]||1);

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
    if(!battle || battle.status!=="active" || battle.actionAnimation) return;
    let safety=0;
    while(battle.status==="active" && safety<30) {
      safety+=1;
      if(battle.enemies.every((enemy)=>enemy.hp<=0)) { setBattleVictory(); break; }
      if(getAliveParty().length===0) { setBattleDefeat(); break; }
      if(battle.turnIndex>=battle.order.length) {
        battle.round+=1;
        expireRoundShields(battle);
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
          const maxMana=getEffectiveCharacterStats(character,state.levels[actor.id]||1).mp;
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
      startBattleAction("enemy",enemy.id,"attack",null,null);
      saveState();
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
        const stats=getEffectiveCharacterStats(character,state.levels[id]||1);
        state.hp[id]=Math.max(0,Math.min(stats.hp,Number(vitals.hp)||0));
        state.mp[id]=Math.max(0,Math.min(stats.mp,Number(vitals.mp)||0));
      });
    }
    beginBattle(state.battleSiteId||"institute-programming");
  }

  function chooseBattleSkill(skillId) {
    const battle = state.battle;
    const actor = getActiveBattleActor();
    if (!battle || !actor || actor.side !== "ally" || battle.status !== "active" || battle.actionAnimation) return;
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

  function resolvePlayerSkillEffect(character,skill,targetId) {
    const battle=state.battle;
    const stats=getEffectiveCharacterStats(character,state.levels[character.id]||1);
    const enemy=battle.enemies.find((entry)=>entry.id===targetId && entry.hp>0);
    const ally=characters.find((entry)=>entry.id===targetId && state.party.includes(entry.id) && (Number(state.hp[entry.id])||0)>0);
    const freshShieldIds=new Set();
    const damageMultiplier=battle.buffs[character.id] && battle.buffs[character.id].attack>0 ? 1+battle.buffs[character.id].attack : 1;
    const targetDamage=(ratio,magic)=>{
      const raw=Math.max(1,Math.round((magic?stats.magic:stats.attack)*ratio*damageMultiplier));
      if(stats.critChance>0 && Math.random()<stats.critChance) {
        pushBattleLog("¡Golpe crítico de "+character.name+"!");
        return Math.round(raw*1.5);
      }
      return raw;
    };

    switch(skill.id) {
      case "basic-attack":
        if(enemy) applyEnemyDamage(enemy,targetDamage(.7,false));
        break;
      case "arcane-bolt":
        if(enemy) applyEnemyDamage(enemy,targetDamage(1.05,true)+2);
        break;
      case "burn-mark":
        if(enemy) applyEnemyDamage(enemy,targetDamage(1.45,true)+2);
        break;
      case "nova":
        battle.enemies.filter((entry)=>entry.hp>0).forEach((entry)=>applyEnemyDamage(entry,targetDamage(1.1,true)+2));
        break;
      case "stab":
        if(enemy) applyEnemyDamage(enemy,targetDamage(1,false)+1);
        break;
      case "multi-stab":
        if(enemy) for(let hit=0;hit<3 && enemy.hp>0;hit++) applyEnemyDamage(enemy,targetDamage(.35,false));
        break;
      case "brothers":
        battle.enemies.filter((entry)=>entry.hp>0).slice(0,3).forEach((entry)=>{
          for(let hit=0;hit<2 && entry.hp>0;hit++) applyEnemyDamage(entry,targetDamage(.5,false));
        });
        break;
      case "antivirus":
        if(ally) healHero(ally.id,(stats.magic*.9+6)*(1+(stats.healingBonus||0)));
        break;
      case "life-drain":
        if(enemy) {
          const drained=targetDamage(.8,true)+2;
          const actualDrained=applyEnemyDamage(enemy,drained);
          healHero(character.id,Math.ceil(actualDrained*.5*(1+(stats.healingBonus||0))));
        }
        break;
      case "reboot":
        getAliveParty().forEach((id)=>healHero(id,(stats.magic*.75+8)*(1+(stats.healingBonus||0))));
        break;
      case "protective-shield":
        if(ally) {
          const allyMax=getEffectiveCharacterStats(ally,state.levels[ally.id]||1).hp;
          battle.shields[ally.id]=Math.round(allyMax*.22*(1+(stats.shieldBonus||0)));
          battle.shieldTurns[ally.id]=0; battle.shieldHits[ally.id]=1; battle.shieldExpiresRound[ally.id]=battle.round+1;
          freshShieldIds.add(ally.id);
          addBattleFloatingNumber("ally",ally.id,battle.shields[ally.id],"shield");
          pushBattleLog(ally.name+" recibe un escudo que bloquea su próximo ataque recibido, hasta el final de la ronda.");
        }
        break;
      case "knockdown":
        if(enemy) {
          applyEnemyDamage(enemy,targetDamage(.9,false));
          if(enemy.hp>0) { enemy.stun=1; pushBattleLog(enemy.name+" queda derribado."); }
        }
        break;
      case "team-bastion":
        getAliveParty().forEach((id)=>{
          const allyChar=characters.find((entry)=>entry.id===id);
          const max=getEffectiveCharacterStats(allyChar,state.levels[id]||1).hp;
          const amount=Math.round(max*.15*(1+(stats.shieldBonus||0)));
          battle.shields[id]=amount; battle.shieldTurns[id]=0; battle.shieldHits[id]=1; battle.shieldExpiresRound[id]=battle.round+1;
          freshShieldIds.add(id);
          addBattleFloatingNumber("ally",id,amount,"shield");
        });
        pushBattleLog("Ivan protege a toda la compañía: el próximo golpe de cada aliado queda bloqueado o el escudo desaparece al terminar la ronda.");
        break;
      case "balonazo":
        if(enemy) applyEnemyDamage(enemy,targetDamage(.8,false)+1);
        break;
      case "modo-mujer":
        battle.buffs[character.id]={attack:.2,speed:.1,turns:2};
        pushBattleLog("Alex activa Modo Mujer: su ataque y velocidad aumentan.");
        break;
      case "field-finish":
        battle.enemies.filter((entry)=>entry.hp>0).forEach((entry)=>{
          applyEnemyDamage(entry,targetDamage(.85,false)+1);
          if(entry.hp>0) { entry.poison=2; entry.poisonDamage=Math.max(3,Math.round(stats.attack*.35)); pushBattleLog(entry.name+" queda envenenado durante 2 turnos."); }
        });
        break;
      default:
        pushBattleLog("La habilidad "+skill.name+" todavía no tiene un efecto definido.");
        break;
    }
    pushBattleLog(character.name+" utiliza "+skill.name+".");
    return [...freshShieldIds];
  }

  function completeHeroTurn(characterId,freshShieldIds,actionId) {
    const battle=state.battle;
    const character=characters.find((entry)=>entry.id===characterId);
    if(!character) return;
    const fresh=new Set(freshShieldIds || []);
    if(battle.buffs[characterId] && actionId!=="modo-mujer") {
      battle.buffs[characterId].turns-=1;
      if(battle.buffs[characterId].turns<=0) {
        delete battle.buffs[characterId];
        pushBattleLog(character.name+" ya no está bajo los efectos de su mejora.");
      }
    }
    const shieldTurns=battle.shieldTurns[characterId]||0;
    if(shieldTurns>0 && !fresh.has(characterId)) {
      battle.shieldTurns[characterId]=shieldTurns-1;
      if(battle.shieldTurns[characterId]<=0) {
        delete battle.shieldTurns[characterId];
        delete battle.shields[characterId];
        pushBattleLog("El escudo de "+character.name+" se desvanece.");
      }
    }
    const curse=battle.debuffs[characterId];
    if(curse && curse.turns>0) {
      curse.turns-=1;
      if(curse.turns<=0) {
        delete battle.debuffs[characterId];
        pushBattleLog("La maldición sobre "+character.name+" desaparece.");
      }
    }
  }

  function advanceBattleAction() {
    const battle=state && state.battle;
    if(!battle || battle.status!=="active" || !battle.actionAnimation) return;
    const animation=battle.actionAnimation;

    if(animation.frame===1) {
      animation.frame=2;
      animation.phaseStartedAt=Date.now();
      if(!animation.resolved) {
        if(animation.side==="ally") {
          const character=characters.find((entry)=>entry.id===animation.actorId);
          const skill=animation.actionId===BASIC_ATTACK.id ? BASIC_ATTACK : character && character.skills.find((entry)=>entry.id===animation.actionId);
          if(character && skill) animation.freshShieldIds=resolvePlayerSkillEffect(character,skill,animation.targetId);
        } else {
          const enemy=battle.enemies.find((entry)=>entry.id===animation.actorId);
          if(enemy && enemy.hp>0) {
            applyBurnAtEnemyTurn(enemy);
            if(enemy.hp>0) applyPoisonAtEnemyTurn(enemy);
            if(enemy.hp>0) performEnemyTurn(enemy);
          }
        }
        animation.resolved=true;
      }
      saveState();
      renderCampaign();
      scheduleBattleActionStep(getBattleActionRemainingDelay(animation));
      return;
    }

    if(animation.frame===2) {
      animation.frame=3;
      animation.phaseStartedAt=Date.now();
      saveState();
      renderCampaign();
      scheduleBattleActionStep(getBattleActionRemainingDelay(animation));
      return;
    }

    battle.actionAnimation=null;
    battle.currentTurnStarted=null;
    if(animation.side==="ally") {
      completeHeroTurn(animation.actorId,animation.freshShieldIds,animation.actionId);
    }
    if(battle.enemies.every((enemy)=>enemy.hp<=0)) {
      setBattleVictory();
    } else if(getAliveParty().length===0) {
      setBattleDefeat();
    } else {
      battle.turnIndex+=1;
      processBattleUntilPlayerTurn();
    }
    saveState();
    renderCampaign();
  }

  function executeBattleSkill(character,skill,targetId) {
    const battle=state.battle;
    if(!battle || battle.status!=="active" || battle.actionAnimation) return;
    const actor=getActiveBattleActor();
    if(!actor || actor.side!=="ally" || actor.id!==character.id) return;
    if((Number(state.mp[character.id])||0)<skill.manaCost) return showNotice("No tienes maná suficiente.");
    const enemy=battle.enemies.find((entry)=>entry.id===targetId && entry.hp>0);
    const ally=characters.find((entry)=>entry.id===targetId && state.party.includes(entry.id) && (Number(state.hp[entry.id])||0)>0);
    if(skill.target==="enemy" && !enemy) return showNotice("Selecciona un enemigo válido.");
    if(skill.target==="ally" && !ally) return showNotice("Selecciona un compañero válido.");
    state.mp[character.id]-=skill.manaCost;
    battle.pendingSkillId=null;
    battle.targetMode=null;
    startBattleAction("ally",character.id,skill.id,targetId,skill.target);
  }

  function chooseBattleTarget(targetId,targetSide) {
    const battle=state.battle;
    if(!battle || !battle.pendingSkillId || battle.actionAnimation) return;
    const actor=getActiveBattleActor();
    if(!actor || actor.side!=="ally") return;
    const character=characters.find((entry)=>entry.id===actor.id);
    const skill=battle.pendingSkillId===BASIC_ATTACK.id ? BASIC_ATTACK : character.skills.find((entry)=>entry.id===battle.pendingSkillId);
    if(!skill) return;
    const expectedSide=skill.target==="enemy" ? "enemy" : "ally";
    if(targetSide && targetSide!==expectedSide) return showNotice("Ese objetivo no es válido para esta habilidad.");
    const valid=expectedSide==="enemy"
      ? battle.enemies.some((entry)=>entry.id===targetId && entry.hp>0)
      : state.party.includes(targetId) && (Number(state.hp[targetId])||0)>0;
    if(!valid) return showNotice("El objetivo seleccionado no es válido.");
    executeBattleSkill(character,skill,targetId);
  }

  function generateShopStock() {
    const pool=EQUIPMENT_ITEMS.filter((item)=>item.rarity!=="Hyperrara");
    const result=[];
    const affordable=pool.filter((item)=>item.price<=100);
    if(affordable.length) {
      const first=affordable[Math.floor(Math.random()*affordable.length)];
      result.push(first.id);
      pool.splice(pool.findIndex((item)=>item.id===first.id),1);
    }
    while(result.length<SHOP_STOCK_SIZE && pool.length) result.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0].id);
    return result;
  }
  function ensureShopStock() {
    if(state && (!Array.isArray(state.shopStock)||state.shopStock.length===0)) state.shopStock=generateShopStock();
  }
  function rotateShopStock() {
    if(state.gold<SHOP_REFRESH_COST) return showNotice("Necesitas "+SHOP_REFRESH_COST+" monedas para renovar los expositores.");
    state.gold-=SHOP_REFRESH_COST;
    state.shopStock=generateShopStock();
    state.shopRotation=(Number(state.shopRotation)||0)+1;
    state.notice="El mercader ha renovado sus expositores. ¡Hay nuevas piezas!";
    renderCampaign();saveState();
  }
  function addEquipmentToCollection(itemId) {
    if(!EQUIPMENT_ITEMS.some((item)=>item.id===itemId)) return null;
    const uid="gear-"+(Number(state.nextEquipmentUid)||1);
    state.nextEquipmentUid=(Number(state.nextEquipmentUid)||1)+1;
    state.equipmentInventory.push({uid,itemId});
    return uid;
  }
  function equipOwnedItem(characterId,uid) {
    const character=characters.find((entry)=>entry.id===characterId);
    const owned=getOwnedEquipment(uid);
    const item=owned && EQUIPMENT_ITEMS.find((entry)=>entry.id===owned.itemId);
    if(!character||!item) return showNotice("No se encuentra ese objeto en la colección.");
    if(item.character && item.character!==characterId) return showNotice("Este objeto Hyperraro está ligado a "+characters.find((entry)=>entry.id===item.character).name+".");
    if(Object.values(state.equippedItems).some((ids)=>ids.includes(uid))) return showNotice("Ese objeto ya está equipado. Primero debes retirarlo.");
    const slots=getCharacterEquipmentIds(characterId);
    if(slots.length>=MAX_EQUIPPED_ITEMS) return showNotice(character.name+" ya tiene ocupados los cinco espacios.");
    state.equippedItems[characterId]=slots.concat(uid);
    state.notice=item.name+" equipado en "+character.name+".";
    renderCampaign();saveState();
  }
  function unequipItem(characterId,uid) {
    if(!characters.some((entry)=>entry.id===characterId)) return;
    state.equippedItems[characterId]=getCharacterEquipmentIds(characterId).filter((entry)=>String(entry)!==String(uid));
    const item=getEquipmentDefinition(uid);
    state.notice=(item?item.name:"Objeto")+" guardado en la colección.";
    renderCampaign();saveState();
  }
  function clearGachaAnimationTimer() {
    if(gachaAnimationTimer!==null) {
      window.clearTimeout(gachaAnimationTimer);
      gachaAnimationTimer=null;
    }
  }

  function scheduleGachaAnimationStep(delay) {
    clearGachaAnimationTimer();
    if(!state || !state.gachaAnimation || state.gachaAnimation.stage==="reveal") return;
    gachaAnimationTimer=window.setTimeout(advanceGachaAnimation,Math.max(0,delay));
  }

  function advanceGachaAnimation() {
    if(!state || !state.gachaAnimation) {
      clearGachaAnimationTimer();
      return;
    }
    const flow={spin:"drop",drop:"open",open:"reveal"};
    const next=flow[state.gachaAnimation.stage];
    if(!next) {
      clearGachaAnimationTimer();
      return;
    }
    state.gachaAnimation.stage=next;
    state.gachaAnimation.stageStartedAt=Date.now();
    saveState();
    renderCampaign();
    scheduleGachaAnimationStep(GACHA_ANIMATION_DURATIONS[next]||0);
  }

  function resumeGachaAnimation() {
    if(!state || !state.gachaAnimation || state.gachaAnimation.stage==="reveal") {
      clearGachaAnimationTimer();
      return;
    }
    const stage=state.gachaAnimation.stage;
    const duration=GACHA_ANIMATION_DURATIONS[stage];
    if(!duration) {
      state.gachaAnimation.stage="reveal";
      state.gachaAnimation.stageStartedAt=Date.now();
      saveState();
      renderCampaign();
      return;
    }
    const started=Number(state.gachaAnimation.stageStartedAt)||Date.now();
    scheduleGachaAnimationStep(Math.max(0,duration-(Date.now()-started)));
  }

  function closeGachaReveal() {
    if(!state || !state.gachaAnimation || state.gachaAnimation.stage!=="reveal") return;
    clearGachaAnimationTimer();
    state.gachaAnimation=null;
    renderCampaign();
    saveState();
  }

  function rollGachapon() {
    if(state.gachaAnimation) return;
    if(state.gold<GACHA_COST) return showNotice("Necesitas "+GACHA_COST+" monedas para usar el gachapón.");
    state.gold-=GACHA_COST;
    const roll=Math.random()*100;
    let cursor=0,rarity="Común";
    for(const entry of GACHA_RARITY_RATES) {
      cursor+=entry.chance;
      if(roll<cursor) { rarity=entry.rarity; break; }
    }
    let pool=EQUIPMENT_ITEMS.filter((item)=>item.rarity===rarity);
    if(rarity==="Hyperrara") pool=pool.filter((item)=>!state.equipmentInventory.some((owned)=>owned.itemId===item.id));
    let result={itemId:null,rarity,duplicate:false,refund:0};
    if(!pool.length) {
      result.duplicate=true;
      result.refund=GACHA_COST;
      state.gold+=GACHA_COST;
      state.notice="La colección de esta rareza está completa. La cápsula ha devuelto el coste de la tirada.";
    } else {
      const item=pool[Math.floor(Math.random()*pool.length)];
      addEquipmentToCollection(item.id);
      result.itemId=item.id;
      state.notice="La cápsula ha revelado "+item.name+".";
    }
    state.lastGachaResult=result;
    state.gachaAnimation={
      stage:"spin",
      stageStartedAt:Date.now(),
      itemId:result.itemId,
      rarity:result.rarity,
      duplicate:result.duplicate,
      refund:result.refund
    };
    saveState();
    renderCampaign();
    resumeGachaAnimation();
  }

  function buyEquipment(itemId) {
    const item=EQUIPMENT_ITEMS.find((entry)=>entry.id===itemId);
    if(!item||item.rarity==="Hyperrara") return;
    ensureShopStock();
    if(!state.shopStock.includes(itemId)) return showNotice("Ese objeto ya no está en el expositor.");
    if(state.gold<item.price) return showNotice("No tienes oro suficiente para comprar "+item.name+".");
    state.gold-=item.price;
    addEquipmentToCollection(itemId);
    state.shopStock=state.shopStock.filter((id)=>id!==itemId);
    state.notice="Has comprado "+item.name+". Ya está disponible en Compañía para equiparlo.";
    renderCampaign();saveState();
  }

  const defaultState = () => ({
    gold:120,
    rations:2,
    inventory:{bandage:0,tonic:0,oil:0},
    equipmentInventory:[],
    equippedItems:{guardian:[],duelist:[],arcanist:[],tracker:[],alchemist:[]},
    nextEquipmentUid:1,shopStock:[],shopRotation:0,lastGachaResult:null,gachaAnimation:null,
    hp:{guardian:58,duelist:48,arcanist:78,tracker:116,alchemist:86},
    mp:{guardian:60,duelist:36,arcanist:80,tracker:48,alchemist:52},
    levels:{guardian:1,duelist:1,arcanist:1,tracker:1,alchemist:1},
    xp:{guardian:0,duelist:0,arcanist:0,tracker:0,alchemist:0},
    battle:null,
    characterDataVersion:8,
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
  let battleActionTimer = null;
  let gachaAnimationTimer = null;
  const battleFloatTimers = new WeakMap();
  const BATTLE_ACTION_FRAME_DELAY = 520;
  const BATTLE_ACTION_RECOVERY_DELAY = 440;
  const BATTLE_ENEMY_PREPARE_DELAY = 620;
  const BATTLE_ENEMY_IMPACT_DELAY = 520;
  const BATTLE_ENEMY_RECOVERY_DELAY = 440;
  const BATTLE_FLOATING_NUMBER_DURATION = 1500;
  function getBattleActionStepDuration(animation) {
    if (!animation) return BATTLE_ACTION_FRAME_DELAY;
    if (animation.side === "enemy") {
      if (animation.frame === 1) return BATTLE_ENEMY_PREPARE_DELAY;
      if (animation.frame === 2) return BATTLE_ENEMY_IMPACT_DELAY;
      return BATTLE_ENEMY_RECOVERY_DELAY;
    }
    if (animation.frame === 1) return BATTLE_ACTION_FRAME_DELAY;
    if (animation.frame === 2) return BATTLE_ACTION_FRAME_DELAY;
    return BATTLE_ACTION_RECOVERY_DELAY;
  }

  function getBattleActionRemainingDelay(animation) {
    const duration=getBattleActionStepDuration(animation);
    const started=Number(animation && animation.phaseStartedAt) || Date.now();
    return Math.max(0,duration-(Date.now()-started));
  }

  function clearBattleTimer() {
    if (battleTurnTimer !== null) {
      window.clearTimeout(battleTurnTimer);
      battleTurnTimer = null;
    }
    if (battleActionTimer !== null) {
      window.clearTimeout(battleActionTimer);
      battleActionTimer = null;
    }
  }

  function scheduleBattleFloatingNumberExpiry(battle,number) {
    let timers=battleFloatTimers.get(battle);
    if(!timers) {
      timers=new Map();
      battleFloatTimers.set(battle,timers);
    }
    if(timers.has(number.id)) return;
    const createdAt=Number(number.createdAt)||Date.now();
    const remaining=BATTLE_FLOATING_NUMBER_DURATION-(Date.now()-createdAt);
    if(remaining<=0) {
      battle.floatingNumbers=(battle.floatingNumbers||[]).filter((entry)=>entry.id!==number.id);
      return;
    }
    const timerId=window.setTimeout(()=>{
      timers.delete(number.id);
      if(!state || state.battle!==battle) return;
      battle.floatingNumbers=(battle.floatingNumbers||[]).filter((entry)=>entry.id!==number.id);
      saveState();
      if(!campaign.hidden && state.tab==="battle") renderCampaign();
    },remaining);
    timers.set(number.id,timerId);
  }

  function resumeBattleFloatingNumbers() {
    const battle=state && state.battle;
    if(!battle || !Array.isArray(battle.floatingNumbers)) return;
    battle.floatingNumbers.slice().forEach((number)=>scheduleBattleFloatingNumberExpiry(battle,number));
  }

  function addBattleFloatingNumber(targetSide,targetId,amount,type) {
    const battle=state && state.battle;
    if(!battle || !Number.isFinite(amount) || amount<=0) return;
    if(!Array.isArray(battle.floatingNumbers)) battle.floatingNumbers=[];
    const id=battle.nextFloatingNumberId || 1;
    battle.nextFloatingNumberId=id+1;
    const entry={id,targetSide,targetId,amount:Math.round(amount),type,createdAt:Date.now()};
    battle.floatingNumbers.push(entry);
    battle.floatingNumbers=battle.floatingNumbers.slice(-18);
    const animation=battle.actionAnimation;
    if(animation && animation.frame>=2) {
      if(!Array.isArray(animation.targets)) animation.targets=[];
      if(!animation.targets.some((target)=>target.side===targetSide && target.id===targetId)) {
        animation.targets.push({side:targetSide,id:targetId});
      }
    }
    scheduleBattleFloatingNumberExpiry(battle,entry);
  }

  function getBattleAnimationFx(actionId,side,actorId) {
    if (side==="enemy") {
      const enemy=state.battle && state.battle.enemies.find((entry)=>entry.id===actorId);
      if (enemy && enemy.ai==="support") return "healing";
      if (enemy && enemy.ai==="hexer") return "curse";
      if (enemy && enemy.ai==="boss") return "heavy";
      if (enemy && enemy.ai==="bruiser") return "heavy";
      return "slash";
    }
    const effects={
      "basic-attack":"slash","arcane-bolt":"malefic-orb","burn-mark":"dark-beam","nova":"primordial-burst",
      "stab":"slash","multi-stab":"multi-slash","brothers":"summon",
      "antivirus":"healing","life-drain":"life-sip","reboot":"team-heal",
      "protective-shield":"single-hit-shield","knockdown":"knockdown","team-bastion":"team-guard",
      "balonazo":"impact","modo-mujer":"buff","field-finish":"poison"
    };
    return effects[actionId] || "magic";
  }

  function getHeroAnimationFrameUrl(heroId, actionId, frame) {
    const character=characters.find((entry)=>entry.id===heroId);
    if(!character) return "";
    const validAction=actionId==="idle" || actionId===BASIC_ATTACK.id || character.skills.some((skill)=>skill.id===actionId);
    const frameNumber=Math.floor(Number(frame));
    if(!validAction || ![1,2,3].includes(frameNumber)) return "";
    return "assets/battles/animations/heroes/"+heroId+"/"+actionId+"/frame-0"+frameNumber+".png";
  }

  function scheduleBattleActionStep(delay) {
    if (battleActionTimer!==null) window.clearTimeout(battleActionTimer);
    battleActionTimer=window.setTimeout(()=>{
      battleActionTimer=null;
      advanceBattleAction();
    },delay);
  }

  function startBattleAction(side,actorId,actionId,targetId,targetType) {
    const battle=state && state.battle;
    if (!battle || battle.status!=="active" || battle.actionAnimation) return;
    const targets=[];
    if (side==="ally") {
      const actor=characters.find((entry)=>entry.id===actorId);
      const skill=actionId===BASIC_ATTACK.id ? BASIC_ATTACK : actor && actor.skills.find((entry)=>entry.id===actionId);
      if (skill) {
        if (skill.target==="enemy") {
          if (targetId) targets.push({side:"enemy",id:targetId});
        } else if (skill.target==="ally") {
          if (targetId) targets.push({side:"ally",id:targetId});
        } else if (skill.target==="self") {
          targets.push({side:"ally",id:actorId});
        } else if (skill.target==="all-enemies") {
          battle.enemies.filter((enemy)=>enemy.hp>0).forEach((enemy)=>targets.push({side:"enemy",id:enemy.id}));
        } else if (skill.target==="all-allies") {
          getAliveParty().forEach((id)=>targets.push({side:"ally",id}));
        }
      }
    }
    battle.actionAnimation={
      side,actorId,actionId,targetId:targetId || null,targetType:targetType || null,
      frame:1,startedAt:Date.now(),phaseStartedAt:Date.now(),resolved:false,targets,fx:getBattleAnimationFx(actionId,side,actorId),
      freshShieldIds:[]
    };
    battle.pendingSkillId=null;
    battle.targetMode=null;
    state.notice=(side==="ally" ? characters.find((entry)=>entry.id===actorId).name : (battle.enemies.find((entry)=>entry.id===actorId)||{}).name)+" prepara una acción.";
    saveState();
    renderCampaign();
    scheduleBattleActionStep(getBattleActionRemainingDelay(battle.actionAnimation));
  }

  function resumeBattleAction() {
    const battle=state && state.battle;
    if (!battle || !battle.actionAnimation || battle.status!=="active") return false;
    if (battleActionTimer!==null) return true;
    scheduleBattleActionStep(getBattleActionRemainingDelay(battle.actionAnimation));
    return true;
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
        equipmentInventory:Array.isArray(saved.equipmentInventory) ? saved.equipmentInventory.filter((entry)=>entry && EQUIPMENT_ITEMS.some((item)=>item.id===entry.itemId) && entry.uid!==undefined) : [],
        equippedItems:Object.assign({},defaults.equippedItems,saved.equippedItems || {}),
        nextEquipmentUid:Math.max(1,Number(saved.nextEquipmentUid)||1),
        shopStock:Array.isArray(saved.shopStock) ? saved.shopStock.filter((id)=>EQUIPMENT_ITEMS.some((item)=>item.id===id && item.rarity!=="Hyperrara")) : [],
        shopRotation:Math.max(0,Number(saved.shopRotation)||0),lastGachaResult:saved.lastGachaResult || null,
        gachaAnimation:saved.gachaAnimation && typeof saved.gachaAnimation==="object" ? saved.gachaAnimation : null,
        hp,mp,levels,xp,characterDataVersion:8,
        battle:saved.battle && typeof saved.battle === "object" ? saved.battle : null,
        visitedSites:(saved.visitedSites || []).filter((siteId) => validSiteIds.includes(siteId))
      });
      if(merged.battle) {
        merged.battle.shields=Object.assign({},merged.battle.shields||{});
        merged.battle.shieldTurns=Object.assign({},merged.battle.shieldTurns||{});
        merged.battle.shieldHits=Object.assign({},merged.battle.shieldHits||{});
        merged.battle.shieldExpiresRound=Object.assign({},merged.battle.shieldExpiresRound||{});
        merged.battle.buffs=Object.assign({},merged.battle.buffs||{});
        merged.battle.debuffs=Object.assign({},merged.battle.debuffs||{});
        merged.battle.enemies=(Array.isArray(merged.battle.enemies)?merged.battle.enemies:[]).map((enemy)=>Object.assign({poison:0,poisonDamage:0},enemy));
      }
      const ownedUids=new Set(merged.equipmentInventory.map((entry)=>String(entry.uid)));
      const equippedUids=new Set();
      characters.forEach((character)=>{
        const valid=(Array.isArray(merged.equippedItems[character.id])?merged.equippedItems[character.id]:[]).filter((uid)=>{
          const owned=merged.equipmentInventory.find((entry)=>String(entry.uid)===String(uid));
          const item=owned && EQUIPMENT_ITEMS.find((entry)=>entry.id===owned.itemId);
          if(!owned||!item||equippedUids.has(String(uid))||(item.character&&item.character!==character.id)) return false;
          equippedUids.add(String(uid));return true;
        }).slice(0,MAX_EQUIPPED_ITEMS);
        merged.equippedItems[character.id]=valid;
      });
      merged.equipmentInventory=merged.equipmentInventory.filter((entry)=>ownedUids.has(String(entry.uid)));
      merged.equippedItems=Object.fromEntries(characters.map((character)=>[character.id,merged.equippedItems[character.id]]));
      merged.party = merged.party.filter((id) => characters.some((character) => character.id === id)).slice(0,4);
      if (merged.party.length === 0) merged.party = defaults.party;
      if (!characters.some((character) => character.id === merged.selectedCharacter)) merged.selectedCharacter = "duelist";
      const allSites = regions.flatMap((region) => region.sites);
      const battleSite = allSites.find((site) => site.id === merged.battleSiteId);
      const battleRegion = regions.find((region) => region.sites.some((site) => site.id === merged.battleSiteId));
      const battleSiteIndex = battleRegion ? battleRegion.sites.findIndex((site) => site.id === merged.battleSiteId) : -1;
      if (!battleSite || !isSiteUnlocked(battleRegion,battleSiteIndex,merged.visitedSites)) {
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
        const savedAt=Date.now();
        if (!Array.isArray(savedBattle.floatingNumbers)) savedBattle.floatingNumbers=[];
        savedBattle.floatingNumbers=savedBattle.floatingNumbers.filter((entry)=>savedAt-(Number(entry.createdAt)||0)<=BATTLE_FLOATING_NUMBER_DURATION);
        if (!Number.isFinite(savedBattle.nextFloatingNumberId)) savedBattle.nextFloatingNumberId=1;
        if (savedBattle.actionAnimation && typeof savedBattle.actionAnimation!=="object") savedBattle.actionAnimation=null;
        if (savedBattle.actionAnimation) {
          if (!Number.isFinite(savedBattle.actionAnimation.startedAt)) savedBattle.actionAnimation.startedAt=savedAt;
          if (!Number.isFinite(savedBattle.actionAnimation.phaseStartedAt)) savedBattle.actionAnimation.phaseStartedAt=savedAt;
          if (![1,2,3].includes(savedBattle.actionAnimation.frame)) savedBattle.actionAnimation.frame=1;
          if (typeof savedBattle.actionAnimation.resolved!=="boolean") savedBattle.actionAnimation.resolved=savedBattle.actionAnimation.frame>1;
        }
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
    state.characterDataVersion = 8;
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
    resumeBattleFloatingNumbers();
    saveState();
    renderCampaign();
    resumeGachaAnimation();
    if (state.tab === "battle" && state.battle && state.battle.status === "active") {
      if (state.battle.actionAnimation) {
        resumeBattleAction();
      } else {
        if (!Array.isArray(state.battle.order) || !state.battle.order.length) {
          state.battle.order=getBattleOrder();
          state.battle.turnIndex=0;
        }
        processBattleUntilPlayerTurn();
      }
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
      const maxHp = getEffectiveCharacterStats(character,state.levels[id] || 1).hp;
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
      state.tab === "rest" ? "CÁMARA DEL ÚLTIMO FAROL" : "MERCADO DEL BASTIÓN · MERCADER Y GACHAPÓN";
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
    const stats = getEffectiveCharacterStats(selected,level);
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
      const charMaxHp = getEffectiveCharacterStats(character,charLevel).hp;
      const charHp = Math.min(charMaxHp,Math.max(0,Number(state.hp[character.id]) || 0));
      const charHpPercent = Math.round(charHp/charMaxHp*100);
      const portrait = character.portrait ? '<img src="' + character.portrait + '" alt="" loading="lazy" onerror="this.remove()">' : "";
      return '<button class="character-nav-entry ' + (isSelected ? "is-selected" : "") + '" type="button" data-character-select="' + character.id + '" aria-pressed="' + isSelected + '">' +
        '<span class="character-nav-avatar"><b>' + character.sign + '</b>' + portrait + '</span>' +
        '<span class="character-nav-copy"><strong>' + character.name + '</strong><small>«' + character.title + '»</small><span class="character-nav-health"><i><b style="width:' + charHpPercent + '%"></b></i><em>' + charHp + '/' + charMaxHp + ' PV</em></span></span>' +
        '<span class="character-nav-state ' + (isActive ? "is-active" : "") + '">' + (isActive ? "●" : "○") + '</span></button>';
    }).join("");
    const portraitImage = selected.portrait ? '<img class="character-portrait-art" src="' + selected.portrait + '" alt="Retrato pixel art de ' + selected.name + ' ' + selected.title + '" loading="eager" onerror="this.remove()">' : "";
    const hasPngHeroAnimations=selected.id==="duelist"||selected.id==="guardian";
    const spriteMarkup = hasPngHeroAnimations
      ? '<div class="hero-png-preview'+(selected.id==="guardian"?" is-guardian-png":"")+'" aria-label="Animación pixel art de '+selected.name+'">'+[1,2,3].map((frame)=>'<img class="hero-preview-frame preview-frame-'+frame+'" src="assets/battles/animations/heroes/'+selected.id+'/idle/frame-0'+frame+'.png" alt="" draggable="false" onload="this.parentElement.parentElement.classList.add(&quot;has-png-sprite&quot;)" onerror="this.remove()">').join("")+'</div>'
      : selected.sprites ? '<img class="sprite-load-probe" src="' + selected.sprites + '" alt="" onload="this.parentElement.classList.add(&quot;has-sprite&quot;);this.remove()" onerror="this.parentElement.classList.add(&quot;no-sprite&quot;);this.remove()"><div class="character-sprite-animation" style="background-image:url(' + selected.sprites + ')"></div>' : "";
    const spriteNote = hasPngHeroAnimations ? "REPOSO PNG ×3 · ATAQUES PNG ×3" : "ANIMACIONES POR AÑADIR";
    const skills = selected.skills.map((skill) => {
      const unlocked = level >= skill.unlockLevel;
      return '<div class="character-skill ' + (unlocked ? "is-ready" : "is-locked") + '">' +
        '<span class="character-skill-icon">' + skill.icon + '</span><div><strong>' + skill.name + '</strong><small>' + skill.detail + '</small><em>' +
        (unlocked ? "DESBLOQUEADA · NIVEL " + skill.unlockLevel : "SE DESBLOQUEA EN NIVEL " + skill.unlockLevel) +
        '</em></div></div>';
    }).join("");
    const statLabels = [["hp","VIDA","♥"],["attack","ATAQUE","⚔"],["magic","MAGIA","✧"],["defense","DEFENSA","⬟"],["speed","VELOCIDAD","➤"],["agility","AGILIDAD","◇"]];
    const statMarkup = statLabels.map(([key,label,icon]) => '<div class="hero-stat"><span>' + icon + ' ' + label + '</span><strong>' + stats[key] + '</strong></div>').join("");
    const equippedIds=getCharacterEquipmentIds(selected.id);
    const equipmentSlots=Array.from({length:MAX_EQUIPPED_ITEMS},(_,index)=>{
      const uid=equippedIds[index],item=uid?getEquipmentDefinition(uid):null;
      return item
        ? '<div class="equipment-slot is-filled rarity-'+getRarityClass(item.rarity)+'"><span>'+item.icon+'</span><div><b>'+item.name+'</b><small>'+getEquipmentBonusText(item)+'</small></div><button type="button" data-action="unequip-item" data-character="'+selected.id+'" data-uid="'+uid+'">×</button></div>'
        : '<div class="equipment-slot is-empty"><span>'+(index+1)+'</span><div><b>Ranura vacía</b><small>Disponible para equipo</small></div></div>';
    }).join("");
    const equippedUidSet=new Set(equippedIds.map(String));
    const ownedMarkup=state.equipmentInventory.map((owned)=>{
      const item=EQUIPMENT_ITEMS.find((entry)=>entry.id===owned.itemId);
      if(!item) return "";
      const equippedBy=characters.find((character)=>getCharacterEquipmentIds(character.id).some((uid)=>String(uid)===String(owned.uid)));
      const locked=item.character && item.character!==selected.id;
      const alreadyEquipped=equippedUidSet.has(String(owned.uid));
      const full=equippedIds.length>=MAX_EQUIPPED_ITEMS;
      return '<article class="owned-equipment-card rarity-'+getRarityClass(item.rarity)+'"><span class="owned-equipment-icon">'+item.icon+'</span><div><b>'+item.name+'</b><small>'+item.rarity+' · '+getEquipmentBonusText(item)+'</small>'+(equippedBy?'<em>EQUIPADO POR '+equippedBy.name.toUpperCase()+'</em>':"")+'</div>'+(alreadyEquipped?'<span class="owned-state">EQUIPADO</span>':'<button type="button" data-action="equip-item" data-character="'+selected.id+'" data-uid="'+owned.uid+'" '+(locked||full||equippedBy?"disabled":"")+'>'+(locked?"VINCULADO A OTRO HÉROE":full?"5 / 5 OCUPADAS":"EQUIPAR")+'</button>')+'</article>';
    }).join("");
    const equipmentMarkup='<section class="character-equipment-panel"><div class="character-skill-heading"><span>EQUIPAMIENTO</span><small>'+equippedIds.length+' / '+MAX_EQUIPPED_ITEMS+' RANURAS</small></div><div class="equipment-slot-grid">'+equipmentSlots+'</div><div class="owned-equipment-heading"><b>OBJETOS EN LA COLECCIÓN</b><small>'+state.equipmentInventory.length+' PIEZAS</small></div><div class="owned-equipment-list">'+(ownedMarkup||'<div class="equipment-empty">Todavía no tienes objetos. Visita el Mercado y prueba suerte en el Gachapón.</div>')+'</div></section>';
    const levelSteps = Array.from({length:10},(_,index) => {
      const stepLevel=index+1, stepStats=getEffectiveCharacterStats(selected,stepLevel);
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
            '<div class="character-sprite-window'+(selected.id==="guardian"?" is-guardian-png":"")+'"><span>ANIMACIÓN DE CAMPO</span>' + spriteMarkup + '<div class="character-sprite-empty">SPRITE PENDIENTE</div></div></div>' +
          '<div class="character-profile">' +
            '<div class="character-profile-head"><div><span class="section-eyebrow">PERSONAJE ' + String(selectedIndex+1).padStart(2,"0") + ' · ' + selected.role + '</span><h3>' + selected.name + '</h3><div class="character-alias">«' + selected.title + '»</div>' +
              '<div class="character-quick-stats"><span>NIVEL ' + level + ' / 10</span><span>' + selected.role + '</span></div></div>' +
              '<button class="party-toggle ' + (active ? "is-selected" : "") + '" type="button" data-action="toggle-party" data-id="' + selected.id + '" ' + (disabled ? "disabled" : "") + '>' + (active ? "EN GRUPO" : "AÑADIR AL GRUPO") + '</button></div>' +
            '<div class="character-vitality"><div class="character-vitality-labels"><strong>VIDA ACTUAL</strong><b>' + hp + ' / ' + maxHp + ' PV</b></div><div class="character-health"><span style="width:' + hpPercent + '%"></span></div></div>' +
            '<div class="character-xp"><div><span>EXPERIENCIA</span><b>' + xp + (nextLevelXP===null ? " XP · NIVEL MÁXIMO" : " / " + nextLevelXP + " XP") + '</b></div><div class="character-xp-bar"><span style="width:' + xpProgress + '%"></span></div>' + (nextLevelXP===null ? "" : '<small>FALTAN ' + xpRemaining + ' XP PARA NIVEL ' + (level+1) + '</small>') + '</div>' +
            '<div class="hero-stat-grid">' + statMarkup + '</div>' +
            '<div class="hero-traits"><div><span>FORTALEZA</span><p>' + selected.strengths + '</p></div><div><span>DEBILIDAD</span><p>' + selected.weaknesses + '</p></div></div>' +
            equipmentMarkup+
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
    const routeCompanion = salimInParty ? '<div class="route-salim"><div class="route-salim-png" aria-hidden="true">'+[1,2,3].map((frame)=>'<img class="route-salim-frame route-frame-'+frame+'" src="assets/battles/animations/heroes/duelist/idle/frame-0'+frame+'.png" alt="" draggable="false" onerror="this.remove()">').join("")+'</div><span>SALIM <em>«EL MORO»</em></span></div>' : '';
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
    const pendingSkill=activeHero && battle.pendingSkillId
      ? (battle.pendingSkillId===BASIC_ATTACK.id ? BASIC_ATTACK : activeHero.skills.find((entry)=>entry.id===battle.pendingSkillId))
      : null;
    const isVictory=battle.status==="victory";
    const isDefeat=battle.status==="defeat";
    const sceneProps=region.id==="institute"
      ? '<div class="battle-window"><i></i><i></i><i></i><i></i></div><div class="battle-blackboard"><span>'+site.name.toUpperCase()+'</span><b>if (fear) { run(); }</b><small>// SISTEMA EN ESTADO CRÍTICO</small></div><div class="battle-wall-clock"><i></i></div><div class="battle-server-rack"><i></i><i></i><i></i><i></i><b>SYS</b></div><div class="battle-desk desk-one"><i></i><b></b></div><div class="battle-desk desk-two"><i></i><b></b></div>'
      : '<div class="battle-site-sign"><small>'+region.name.toUpperCase()+'</small><b>'+site.name.toUpperCase()+'</b><i>ÁREA DE ENCUENTRO</i></div><div class="battle-environment-prop prop-left"></div><div class="battle-environment-prop prop-right"></div><div class="battle-environment-glow"></div>';

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
      const stats=getEffectiveCharacterStats(character,state.levels[id]||1);
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
      const animation=battle.actionAnimation;
      const isPngHero=id==="duelist"||id==="guardian";
      const isAttacking=Boolean(animation && animation.side==="ally" && animation.actorId===id);
      const isWindingUp=Boolean(isAttacking && animation.frame===1);
      const isImpactFrame=Boolean(isAttacking && animation.frame===2);
      const isHit=Boolean(animation && animation.frame===2 && (animation.targets||[]).some((target)=>target.side==="ally" && target.id===id));
      const floatingMarkup=(battle.floatingNumbers||[]).filter((number)=>number.targetSide==="ally" && number.targetId===id).map((number,floatIndex)=>{
        const age=Math.max(0,Date.now()-(Number(number.createdAt)||Date.now()));
        const animationDelay=Math.min(BATTLE_FLOATING_NUMBER_DURATION,age);
        const offset=((floatIndex%3)-1)*18;
        return '<span class="battle-floating-number is-'+number.type+'" style="--float-offset:'+offset+'px;animation-delay:-'+animationDelay+'ms" data-float-id="'+number.id+'">'+(number.type==="heal"?"+":number.type==="shield"?"✦ ":"−")+number.amount+(number.type==="shield"?" ESCUDO":"")+'</span>';
      }).join("");
      const spriteMarkup=isAttacking ? '<img class="battle-action-sprite hero-action-sprite" src="'+getHeroAnimationFrameUrl(id,animation.actionId,animation.frame)+'" alt="" draggable="false" onload="this.parentElement.classList.add(&quot;has-action-sprite&quot;)" onerror="this.remove()">' : "";
      const idleMarkup=!isHit && currentHp>0
        ? '<div class="battle-idle-frames" aria-hidden="true">'+[1,2,3].map((frame)=>'<img class="battle-idle-frame idle-frame-'+frame+'" src="'+getHeroAnimationFrameUrl(id,"idle",frame)+'" alt="" draggable="false" onload="this.parentElement.dataset.loaded=String((Number(this.parentElement.dataset.loaded)||0)+1);if(Number(this.parentElement.dataset.loaded)>=3)this.parentElement.parentElement.classList.add(&quot;has-idle-sprite&quot;)" onerror="this.remove()">').join("")+'</div>'
        : "";
      const supportTargetsThisAlly=Boolean(animation && animation.side==="ally" && animation.frame<=2 && (animation.targets||[]).some((target)=>target.side==="ally" && target.id===id));
      let supportFxMarkup="";
      if(supportTargetsThisAlly && animation.actorId==="arcanist" && animation.actionId==="antivirus") supportFxMarkup='<div class="battle-support-vfx support-antivirus"><i></i><b></b></div>';
      if(supportTargetsThisAlly && animation.actorId==="arcanist" && animation.actionId==="reboot") supportFxMarkup='<div class="battle-support-vfx support-team-heal"><i></i><b></b></div>';
      if(supportTargetsThisAlly && animation.actorId==="tracker" && animation.actionId==="protective-shield") supportFxMarkup='<div class="battle-support-vfx support-single-shield"><i></i><b></b></div>';
      if(supportTargetsThisAlly && animation.actorId==="tracker" && animation.actionId==="team-bastion") supportFxMarkup='<div class="battle-support-vfx support-team-guard"><i></i><b></b></div>';
      const impactMarkup=isHit ? '<span class="battle-impact-burst effect-'+animation.fx+'"></span>' : "";
      return '<article class="battle-unit battle-ally battle-hero-'+id+(isActive?" is-active-turn":"")+(isAttacking?" is-attacking":"")+(isWindingUp?" is-winding-up":"")+(isImpactFrame?" is-impact-frame":"")+(isHit?" is-hit":"")+(currentHp<=0?" is-fallen":"")+(isTarget?" is-targetable":"")+'" '+targetAttrs+'>' +
        '<div class="battle-unit-art"><span class="battle-unit-index">0'+(index+1)+'</span>' +
          '<div class="battle-character-visual'+(isPngHero?" is-png-hero-sprite"+(id==="guardian"?" is-guardian-png":""):"")+'">'+(isPngHero?"":'<div class="battle-pixel-figure figure-'+id+'" style="'+(isAttacking?'animation-delay:-'+Math.min(1120,Math.max(0,Date.now()-(Number(animation.startedAt)||Date.now())))+'ms':'')+'" aria-hidden="true"><i class="figure-shadow"></i><i class="figure-legs"></i><i class="figure-body"></i><i class="figure-arm"></i><i class="figure-head"></i><i class="figure-hair"></i><i class="figure-weapon"></i><b class="figure-mark">'+character.sign+'</b></div>')+idleMarkup+spriteMarkup+'</div>'+supportFxMarkup+impactMarkup+floatingMarkup+
          '<span class="battle-unit-role">'+character.role+'</span>' +
        '</div>' +
        '<div class="battle-unit-info"><div class="battle-unit-name"><strong>'+character.name+'</strong><em>«'+character.title+'»</em></div>' +
          '<div class="battle-unit-life"><span>♥ PV</span><b>'+currentHp+'/'+maxHp+'</b></div><div class="battle-hp-track"><i style="width:'+hpRatio+'%"></i></div>' +
          '<div class="battle-unit-mana"><span>✦ PM</span><b>'+currentMp+'/'+maxMp+'</b></div><div class="battle-mp-track"><i style="width:'+mpRatio+'%"></i></div>' +
          (shield>0?'<small class="battle-shield-value">ESCUDO '+shield+' · '+((battle.shieldHits||{})[id]?"1 GOLPE":shieldTurns+"T")+'</small>':"")+
          (buff && buff.turns>0?'<small class="battle-buff-value">MEJORA '+buff.turns+'T · ATQ +'+Math.round(buff.attack*100)+'% · VEL +'+Math.round(buff.speed*100)+'%</small>':"")+
          (debuff && debuff.turns>0?'<small class="battle-curse-value">MALDICIÓN '+debuff.turns+'T · RECIBE +18% DAÑO</small>':"")+
        '</div></article>';
    }).join("");

    const enemyUnits=battle.enemies.map((enemy,index)=>{
      const ratio=Math.round(enemy.hp/enemy.maxHp*100);
      const activeEnemy=Boolean(currentActor && currentActor.side==="enemy" && currentActor.id===enemy.id);
      const isTarget=battle.targetMode==="enemy" && enemy.hp>0;
      const targetAttrs=isTarget?'data-action="battle-target" data-target-id="'+enemy.id+'" data-target-side="enemy" role="button" tabindex="0" aria-label="Atacar a '+enemy.name+'"':'';
      const animation=battle.actionAnimation;
      const isAttacking=Boolean(animation && animation.side==="enemy" && animation.actorId===enemy.id);
      const isWindingUp=Boolean(isAttacking && animation.frame===1);
      const isImpactFrame=Boolean(isAttacking && animation.frame===2);
      const isHit=Boolean(animation && animation.frame===2 && (animation.targets||[]).some((target)=>target.side==="enemy" && target.id===enemy.id));
      const floatingMarkup=(battle.floatingNumbers||[]).filter((number)=>number.targetSide==="enemy" && number.targetId===enemy.id).map((number,floatIndex)=>{
        const age=Math.max(0,Date.now()-(Number(number.createdAt)||Date.now()));
        const animationDelay=Math.min(BATTLE_FLOATING_NUMBER_DURATION,age);
        const offset=((floatIndex%3)-1)*18;
        return '<span class="battle-floating-number is-'+number.type+'" style="--float-offset:'+offset+'px;animation-delay:-'+animationDelay+'ms" data-float-id="'+number.id+'">'+(number.type==="heal"?"+":number.type==="shield"?"✦ ":"−")+number.amount+(number.type==="shield"?" ESCUDO":number.type==="poison"?" VENENO":"")+'</span>';
      }).join("");
      const spriteMarkup=isAttacking ? '<img class="battle-action-sprite enemy-action-sprite" src="assets/battles/animations/enemies/'+enemy.id+'/attack/frame-0'+animation.frame+'.png" alt="" onerror="this.remove()">' : "";
      const spellTargetsThisEnemy=Boolean(animation && animation.side==="ally" && animation.frame<=2 && (animation.targets||[]).some((target)=>target.side==="enemy" && target.id===enemy.id));
      let spellMarkup="";
      if(spellTargetsThisEnemy && animation.actorId==="guardian") {
        if(animation.actionId==="arcane-bolt") spellMarkup=animation.frame===1?'<div class="battle-spell-vfx spell-malefic-launch"><i></i><b></b></div>':'<div class="battle-spell-vfx spell-hit-burst spell-hit-malefic"><i></i><b></b></div>';
        if(animation.actionId==="burn-mark") spellMarkup=animation.frame===1?'<div class="battle-spell-vfx spell-dark-beam"><i></i><b></b></div>':'<div class="battle-spell-vfx spell-hit-burst spell-hit-dark"><i></i><b></b></div>';
      }
      if(spellTargetsThisEnemy && animation.actorId==="arcanist" && animation.actionId==="life-drain") spellMarkup=animation.frame===1?'<div class="battle-spell-vfx spell-life-sip"><i></i><b></b></div>':'<div class="battle-spell-vfx spell-hit-burst spell-hit-drain"><i></i><b></b></div>';
      if(spellTargetsThisEnemy && animation.actorId==="alchemist" && animation.actionId==="field-finish") spellMarkup=animation.frame===1?'<div class="battle-spell-vfx spell-poison-cloud"><i></i><b></b></div>':'<div class="battle-spell-vfx spell-hit-burst spell-hit-poison"><i></i><b></b></div>';
      const impactMarkup=isHit ? '<span class="battle-impact-burst effect-'+animation.fx+'"></span>' : "";
      return '<article class="battle-unit battle-enemy battle-enemy-'+enemy.id+(enemy.hp<=0?" is-fallen":"")+(isTarget?" is-targetable":"")+(activeEnemy?" is-active-turn":"")+(isAttacking?" is-attacking":"")+(isWindingUp?" is-winding-up":"")+(isImpactFrame?" is-impact-frame":"")+(isHit?" is-hit":"")+'" '+targetAttrs+'>' +
        '<div class="battle-unit-art"><span class="battle-unit-index">E0'+(index+1)+'</span>' +
          '<div class="battle-enemy-figure enemy-'+enemy.id+'" style="'+(isAttacking?'animation-delay:-'+Math.min(2200,Math.max(0,Date.now()-(Number(animation.startedAt)||Date.now())))+'ms':'')+'" aria-hidden="true"><img class="battle-enemy-art-image" src="assets/battles/enemies/'+enemy.asset+'.png" alt="" onerror="this.remove()"><i class="enemy-shadow"></i><i class="enemy-body"></i><i class="enemy-spikes"></i><i class="enemy-eyes"></i><b>'+enemy.mark+'</b></div>'+spellMarkup+spriteMarkup+impactMarkup+floatingMarkup+
          '<span class="battle-unit-role">'+enemy.role+'</span></div>' +
        '<div class="battle-unit-info"><div class="battle-unit-name"><strong>'+enemy.name+'</strong></div>' +
          '<div class="battle-unit-life"><span>♥ PV</span><b>'+enemy.hp+'/'+enemy.maxHp+'</b></div><div class="battle-hp-track enemy-hp-track"><i style="width:'+ratio+'%"></i></div>' +
          (enemy.burn>0?'<small class="battle-status-tag">QUEMADURA '+enemy.burn+'</small>':"")+
          (enemy.poison>0?'<small class="battle-poison-tag">VENENO '+enemy.poison+' TURNOS</small>':"")+
          (enemy.stun>0?'<small class="battle-stun-tag">DERRIBADO · PIERDE TURNO</small>':"")+
        '</div></article>';
    }).join("");

    const availableSkills=activeHero ? [BASIC_ATTACK].concat(activeHero.skills) : [];
    const skillsMarkup=activeHero ? availableSkills.map((skill)=>{
      const level=state.levels[activeHero.id]||1;
      const unlocked=level>=skill.unlockLevel;
      const enoughMana=(Number(state.mp[activeHero.id])||0)>=skill.manaCost;
      const disabled=!unlocked || !enoughMana || battle.status!=="active" || Boolean(battle.actionAnimation);
      const selected=battle.pendingSkillId===skill.id;
      const helpText=!unlocked ? "Se desbloquea en nivel "+skill.unlockLevel : !enoughMana ? "Necesitas "+skill.manaCost+" PM" : "Usar "+skill.name;
      return '<button class="battle-skill-button '+(unlocked?"is-unlocked":"is-locked")+(selected?" is-selected":"")+'" type="button" data-action="battle-skill" data-skill-id="'+skill.id+'" aria-pressed="'+selected+'" title="'+helpText+'" '+(disabled?"disabled":"")+'>' +
        '<span class="battle-skill-icon">'+skill.icon+'</span><span class="battle-skill-copy"><strong>'+skill.name+'</strong><small>'+skill.kind+' · NIVEL '+skill.unlockLevel+'</small><em>'+skill.detail+'</em></span>' +
        '<span class="battle-skill-cost">'+skill.manaCost+' PM</span></button>';
    }).join("") : '<div class="battle-waiting-message">'+(isVictory?"SALA DESPEJADA":isDefeat?"COMPAÑÍA DERROTADA":"Turno enemigo…")+'</div>';

    const logMarkup=battle.log.slice(0,3).map((line)=>'<li>'+line+'</li>').join("");
    const activeLabel=battle.actionAnimation ? (battle.actionAnimation.side==="ally" ? 'ACCIÓN DE '+activeHero?.name?.toUpperCase() : 'ATAQUE DE '+activeEnemy?.name?.toUpperCase()) : activeHero ? 'TURNO DE '+activeHero.name.toUpperCase() : activeEnemy ? 'TURNO ENEMIGO · '+activeEnemy.name.toUpperCase() : isVictory ? "VICTORIA" : isDefeat ? "DERROTA" : "RESOLVIENDO TURNO";
    const prompt=battle.actionAnimation
      ? battle.actionAnimation.side==="enemy"
        ? (battle.actionAnimation.frame===1?"⚠ EL ENEMIGO PREPARA EL GOLPE…":battle.actionAnimation.frame===2?"¡IMPACTO EN LA COMPAÑÍA!":"EL ENEMIGO RECUPERA POSICIÓN…")
        : (battle.actionAnimation.frame===1?"PREPARANDO ACCIÓN…":battle.actionAnimation.frame===2?"¡IMPACTO!":"RECUPERANDO POSICIÓN…")
      : pendingSkill ? (pendingSkill.target==="enemy" ? "ELIGE UN ENEMIGO" : "ELIGE UN COMPAÑERO") : activeHero ? "ELIGE UNA HABILIDAD" : "EL TURNO AVANZA AUTOMÁTICAMENTE";

    const commandPanel=isVictory
      ? '<div class="battle-result-panel is-victory"><span>✦</span><div><strong>VICTORIA</strong><small>La sala está despejada. +45 XP para la compañía.</small></div><button type="button" class="game-action" data-action="leave-battle">CONTINUAR →</button></div>'
      : isDefeat
        ? '<div class="battle-result-panel is-defeat"><span>☠</span><div><strong>DERROTA</strong><small>Puedes reintentar con la vida y el maná que tenías al entrar en la sala, o volver al bastión para descansar.</small></div><button type="button" class="game-action" data-action="retry-battle">REINTENTAR</button><button type="button" class="game-action secondary" data-action="leave-battle">VOLVER A RUTAS</button></div>'
        : '<div class="battle-command"><div class="battle-command-heading"><div><span class="section-eyebrow">'+activeLabel+'</span><h3>'+prompt+'</h3></div>' +
            (pendingSkill?'<button class="battle-cancel-target" type="button" data-action="cancel-battle-target">CANCELAR</button>':"")+
          '</div><div class="battle-skill-row">'+skillsMarkup+'</div></div>';

    const stageSpellMarkup=battle.actionAnimation && battle.actionAnimation.side==="ally" && battle.actionAnimation.actorId==="guardian" && battle.actionAnimation.actionId==="nova" && battle.actionAnimation.frame<=2
      ? '<div class="battle-spell-global spell-primordial-global is-frame-'+battle.actionAnimation.frame+'" aria-hidden="true"><i></i><b></b><span></span></div>'
      : "";
    return '<div class="campaign-page battle-page">'+
      '<div class="battle-topbar"><div><span class="section-eyebrow">'+region.name.toUpperCase()+' · '+site.name.toUpperCase()+'</span><h2>Campo de batalla</h2></div>' +
        '<div class="battle-round-mark"><small>RONDA</small><strong>'+String(battle.round).padStart(2,"0")+'</strong></div>' +
        '<div class="battle-turn-order"><span>ORDEN DE TURNO</span><div>'+orderMarkup+'</div></div></div>'+
      '<section class="battle-stage '+(battle.actionAnimation && battle.actionAnimation.frame===2?'is-impacting fx-'+battle.actionAnimation.fx:'')+'" aria-label="Campo de batalla por turnos">'+
        '<div class="battle-room-wall battle-room-'+site.id+'"><img class="battle-scene-image" src="assets/battles/backgrounds/'+site.id+'.jpg" alt="" onerror="this.remove()">'+sceneProps+'<div class="battle-room-fog"></div></div>'+stageSpellMarkup+
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
    const rests=Math.max(0,Number(state.rations)||0);
    const hurt=characters.filter((character)=>{
      const maxHp=getEffectiveCharacterStats(character,state.levels[character.id]||1).hp;
      return (Number(state.hp[character.id])||0)<maxHp;
    }).length;
    const members=characters.map((character)=>{
      const stats=getEffectiveCharacterStats(character,state.levels[character.id]||1);
      const maxHp=stats.hp,maxMp=stats.mp;
      const hp=Math.max(0,Math.min(maxHp,Number(state.hp[character.id])||0));
      const mp=Math.max(0,Math.min(maxMp,Number(state.mp[character.id])||0));
      const hpRatio=Math.round(hp/maxHp*100);
      const mpRatio=Math.round(mp/maxMp*100);
      const active=state.party.includes(character.id);
      return '<article class="rest-member-card '+(hpRatio<100?"is-wounded":"is-ready")+'"><div class="rest-member-top"><span class="rest-member-sigil">'+character.sign+'</span><div class="rest-member-name"><b>'+character.name+'</b></div><span class="rest-member-state '+(active?"is-active":"")+'">'+(active?"EN RUTA":"RESERVA")+'</span></div><div class="rest-member-stat"><span>VIDA</span><b>'+hp+' / '+maxHp+'</b></div><div class="rest-member-track hp"><i style="width:'+hpRatio+'%"></i></div><div class="rest-member-stat"><span>MANÁ</span><b>'+mp+' / '+maxMp+'</b></div><div class="rest-member-track mp"><i style="width:'+mpRatio+'%"></i></div></article>';
    }).join("");
    const action=rests>0
      ? '<button class="rest-main-button" type="button" data-action="rest"><span class="rest-button-icon">✦</span><span><b>DESCANSAR</b><small>−1 RACIÓN</small></span><span class="rest-button-arrow">→</span></button>'
      : '<button class="rest-main-button is-disabled" type="button" disabled><span class="rest-button-icon">×</span><span><b>SIN RACIONES</b></span></button><button class="rest-market-link" type="button" data-tab="shop">COMPRAR RACIONES →</button>';
    const notice=state.notice && state.notice!=="Elige una ruta y supera cada parada para avanzar."
      ? '<p class="campaign-notice rest-notice" role="status">'+state.notice+'</p>'
      : "";
    return '<div class="campaign-page rest-page">'+
      '<div class="page-heading rest-page-heading"><div><span class="section-eyebrow">REFUGIO SEGURO</span><h2>Descanso</h2><p>Recupera fuerzas antes de continuar.</p></div></div>'+
      '<section class="rest-campfire-scene" aria-label="Campamento nocturno de la compañía">'+
        '<aside class="rest-camp-controls" aria-labelledby="rest-controls-title">'+
          '<span class="rest-controls-eyebrow">✦ CAMPAMENTO · ÚLTIMO FAROL ✦</span>'+
          '<h3 id="rest-controls-title">Recupera fuerzas</h3>'+
          '<p>Toda la compañía recupera vida y maná.</p>'+
          '<div class="rest-uses-display"><span class="rest-uses-icon">✚</span><div><small>DESCANSOS DISPONIBLES</small><strong class="'+(rests===0?"is-empty":"")+'">'+rests+'</strong><b>1 RACIÓN = 1 DESCANSO</b></div></div>'+
          '<div class="rest-camp-action">'+action+'</div>'+
          '<div class="rest-recovery-badges"><span><b>+25%</b><small>VIDA</small></span><span><b>+25%</b><small>MANÁ</small></span><span><b>5</b><small>HÉROES</small></span></div>'+
        '</aside>'+
      '</section>'+
      '<section class="rest-party-zone"><div class="rest-party-heading"><div><span class="section-eyebrow">LA COMPAÑÍA</span><h3>Estado de los héroes</h3></div>'+(hurt?'<span class="rest-hurt-count">'+hurt+' <small>HERIDOS</small></span>':'')+'</div><div class="rest-party-grid">'+members+'</div></section>'+notice+
    '</div>';
  }
  function renderGachaMachine(modifier) {
    const lights=Array.from({length:16},(_,index)=>'<i class="gacha-pixel-lamp lamp-'+(index+1)+'"></i>').join("");
    return '<div class="gacha-pixel-machine '+(modifier||"")+'"><div class="gacha-machine-lights">'+lights+'</div><div class="gacha-machine-top"><span>PAIS CAPSULE</span><b>✦</b></div><div class="gacha-machine-glass"><div class="gacha-machine-rotor"><i></i><i></i><i></i><i></i></div><div class="gacha-orb orb-one"></div><div class="gacha-orb orb-two"></div><div class="gacha-orb orb-three"></div><div class="gacha-capsule"><i class="capsule-top"></i><i class="capsule-bottom"></i><b>✦</b></div></div><div class="gacha-machine-controls"><span>◈</span><b>GACHA · 01</b><span>◈</span></div><div class="gacha-machine-chute"><i></i></div><div class="gacha-machine-base"><span>CAPSULE SYSTEM</span></div></div>';
  }

  function renderGachaCeremony() {
    const animation=state.gachaAnimation;
    if(!animation) return "";
    const item=animation.itemId ? EQUIPMENT_ITEMS.find((entry)=>entry.id===animation.itemId) : null;
    const stage=animation.stage || "spin";
    const rarity=animation.rarity || (item?item.rarity:"Común");
    const copy={spin:["CARGANDO EL DESTINO","La máquina está buscando una reliquia..."],drop:["UNA CÁPSULA DESCIENDE","¡Algo está a punto de salir!"],open:["EL SELLO SE ROMPE","La cápsula está a punto de abrirse..."],reveal:["¡RECOMPENSA DESBLOQUEADA!","El objeto ya forma parte de tu colección."]};
    const text=copy[stage] || copy.reveal;
    const reward=animation.duplicate
      ? '<div class="gacha-reveal-reward is-refund"><div class="gacha-reveal-icon">↻</div><span class="gacha-reveal-rarity">COLECCIÓN COMPLETA</span><h3>Sin nuevas piezas</h3><p>Has recibido '+animation.refund+' monedas de compensación.</p></div>'
      : item ? '<div class="gacha-reveal-reward rarity-'+getRarityClass(rarity)+'"><div class="gacha-reveal-icon"><img src="assets/items/'+item.id+'.png" alt="" onerror="this.remove()"><span>'+item.icon+'</span></div><span class="gacha-reveal-rarity">'+rarity+'</span><h3>'+item.name+'</h3><p>'+item.description+'</p><strong>'+getEquipmentBonusText(item)+'</strong>'+(item.character?'<em>VINCULADO A '+(characters.find((entry)=>entry.id===item.character)?.name || "UN HÉROE").toUpperCase()+'</em>':"")+'</div>'
      : '<div class="gacha-reveal-reward"><h3>La cápsula está vacía</h3></div>';
    return '<div class="gacha-ceremony is-'+stage+' rarity-'+getRarityClass(rarity)+'" role="dialog" aria-modal="true" aria-label="Revelación del Gachapón"><div class="gacha-ceremony-backdrop"></div><section class="gacha-ceremony-card"><div class="gacha-ceremony-heading"><span>PAIS DUNGEON · GACHAPÓN</span><b>✦ ✦ ✦</b></div><div class="gacha-ceremony-copy"><small>'+text[0]+'</small><p>'+text[1]+'</p></div><div class="gacha-ceremony-machine-stage">'+renderGachaMachine("is-ceremony-machine")+'<div class="gacha-capsule-tray"><span></span><i></i></div><div class="gacha-pixel-burst"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div><div class="gacha-ceremony-reveal">'+reward+'</div>'+(stage==="reveal"?'<button class="game-action gacha-collect-button" type="button" data-action="close-gacha-reveal">CONTINUAR · RECOGER OBJETO →</button>':'<div class="gacha-ceremony-wait">NO CIERRES LA CÁPSULA · '+(stage==="spin"?"GIRANDO":stage==="drop"?"CAYENDO":"ABRIÉNDOSE")+'</div>')+'</section></div>';
  }

  function renderShop() {
    ensureShopStock();
    const stock=state.shopStock.map((id,index)=>{
      const item=EQUIPMENT_ITEMS.find((entry)=>entry.id===id);
      if(!item) return "";
      const rarityClass=getRarityClass(item.rarity);
      return '<article class="merchant-item-card rarity-'+rarityClass+'"><div class="merchant-item-display"><span class="merchant-display-number">0'+(index+1)+'</span><div class="merchant-item-art"><img src="assets/items/'+item.id+'.png" alt="" onerror="this.remove()"><span>'+item.icon+'</span></div><small>'+item.type+'</small></div><div class="merchant-item-copy"><span class="rarity-label">'+item.rarity+'</span><strong>'+item.name+'</strong><small>'+item.description+'</small><em>'+getEquipmentBonusText(item)+'</em></div><div class="merchant-item-buy"><b>'+item.price+' ◈</b><button class="buy-button" type="button" data-action="buy-equipment" data-item="'+item.id+'" '+(state.gold<item.price?"disabled":"")+'>COMPRAR</button></div></article>';
    }).join("");
    const supplyOffers=items.map((item)=>{
      const owned=item.kind==="rations" ? state.rations : (state.inventory[item.kind]||0);
      return '<div class="merchant-supply-row"><span class="supply-icon">'+item.icon+'</span><span><b>'+item.name+'</b><small>'+item.desc+'</small></span><em>'+item.price+' ◈</em><button type="button" data-action="buy" data-item="'+item.id+'" '+(state.gold<item.price?"disabled":"")+'>+</button><small class="supply-owned">×'+owned+'</small></div>';
    }).join("");
    const hyperItems=EQUIPMENT_ITEMS.filter((item)=>item.rarity==="Hyperrara").map((item)=>{
      const owner=characters.find((character)=>character.id===item.character);
      const owned=state.equipmentInventory.some((entry)=>entry.itemId===item.id);
      return '<div class="hyperrare-preview '+(owned?"is-owned":"")+'"><span>'+item.icon+'</span><div><b>'+item.name+'</b><small>'+owner.name+' · '+(owned?"CONSEGUIDO":"0,5% GLOBAL · REPARTIDO")+'</small></div></div>';
    }).join("");
    const animationActive=Boolean(state.gachaAnimation);
    const last=state.lastGachaResult;
    const lastItem=last && last.itemId ? EQUIPMENT_ITEMS.find((entry)=>entry.id===last.itemId) : null;
    const lastResult=last && !animationActive ? (last.duplicate
      ? '<div class="gacha-last-result is-refund"><span>↻</span><div><small>ÚLTIMA TIRADA</small><b>COLECCIÓN COMPLETA</b><em>+'+last.refund+' MONEDAS</em></div></div>'
      : lastItem ? '<div class="gacha-last-result rarity-'+getRarityClass(last.rarity)+'"><span>'+lastItem.icon+'</span><div><small>ÚLTIMO OBJETO · '+last.rarity+'</small><b>'+lastItem.name+'</b><em>'+getEquipmentBonusText(lastItem)+'</em></div></div>' : "") : "";
    return '<div class="campaign-page merchant-page"><div class="page-heading merchant-heading"><div><span class="section-eyebrow">PLAZA DEL ÚLTIMO FAROL</span><h2>El Mercado</h2><p>Armas, reliquias y objetos para preparar a la compañía antes de volver a las rutas.</p></div><span class="route-legend">◈ '+state.gold+' MONEDAS</span></div>'+
      '<div class="merchant-main-grid"><section class="merchant-stock-panel camp-panel"><div class="merchant-stall-header"><div class="merchant-awning"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="merchant-stall-name"><span>EL ÚLTIMO FAROL</span><b>EXPOSITORES DEL MERCADER</b></div><div class="merchant-stall-stock"><strong>04</strong><small>PIEZAS HOY</small></div></div><div class="merchant-stock-toolbar"><span>MERCANCÍA DISPONIBLE</span><small>ROTACIÓN '+String(state.shopRotation||0).padStart(2,"0")+'</small></div><div class="merchant-stock-grid">'+(stock||'<div class="merchant-empty">Los estantes están vacíos.</div>')+'</div><div class="merchant-stock-footer"><small>Las existencias cambian al superar una sala. También puedes pagar '+SHOP_REFRESH_COST+' monedas para renovar el puesto.</small><button class="game-action secondary" type="button" data-action="refresh-shop" '+(state.gold<SHOP_REFRESH_COST?"disabled":"")+'>↻ RENOVAR · '+SHOP_REFRESH_COST+' ◈</button></div><details class="merchant-supplies-details"><summary>SUMINISTROS DE VIAJE <span>RACIONES · VENDAS · TÓNICOS · ACEITE</span></summary><div class="merchant-supplies">'+supplyOffers+'</div></details></section>'+
      '<aside class="gacha-panel camp-panel"><div class="gacha-panel-heading"><div><span class="section-eyebrow">AZAR Y DESTINO</span><h3>El Gachapón</h3><p>Una cápsula. Un objeto. Una posibilidad entre muchas.</p></div><span class="gacha-cost-mark">'+GACHA_COST+' ◈</span></div><div class="gacha-showcase-frame"><div class="gacha-showcase-lights"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>'+renderGachaMachine("is-idle-machine")+'<div class="gacha-showcase-caption"><span>★ MÁQUINA DE CÁPSULAS ★</span><b>PREMIOS DE SEIS RAREZAS</b></div></div>'+lastResult+'<button class="game-action gacha-pull-button" type="button" data-action="gacha-roll" '+(state.gold<GACHA_COST||animationActive?"disabled":"")+'>'+(animationActive?"MÁQUINA EN FUNCIONAMIENTO":"TIRAR · "+GACHA_COST+" ◈")+'</button><div class="gacha-rates"><b>PROBABILIDADES DE OBTENCIÓN</b>'+GACHA_RARITY_RATES.map((entry)=>'<div><span>'+entry.rarity+'</span><strong>'+String(entry.chance).replace(".",",")+'%</strong></div>').join("")+'</div><details class="hyperrare-vault"><summary>COLECCIÓN HYPERRARA · 5 PIEZAS</summary>'+hyperItems+'</details></aside></div>'+
      '<section class="merchant-collection-strip"><div><b>COLECCIÓN DE LA COMPAÑÍA</b><small>'+state.equipmentInventory.length+' OBJETOS · MÁXIMO 5 EQUIPADOS POR PERSONAJE</small></div><button class="game-action secondary" type="button" data-tab="company">GESTIONAR OBJETOS →</button></section><p class="campaign-notice">'+state.notice+'</p>'+renderGachaCeremony()+'</div>';
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
      const maxHp=getEffectiveCharacterStats(character,level).hp;
      const currentHp=Number.isFinite(state.hp[character.id]) ? state.hp[character.id] : maxHp;
      state.hp[character.id]=Math.min(maxHp,currentHp+Math.ceil(maxHp*0.25));
      const maxMp=getEffectiveCharacterStats(character,level).mp;
      const currentMp=Number.isFinite(state.mp[character.id]) ? state.mp[character.id] : maxMp;
      state.mp[character.id]=Math.min(maxMp,currentMp+Math.ceil(maxMp*0.25));
    });
    showNotice("La compañía ha descansado. Todos recuperan un 25% de su vida y su maná máximos.");
  }

  function buyItem(itemId) {
    const item=items.find((entry)=>entry.id===itemId);
    if(!item) return;
    if(state.gold<item.price) return showNotice("No tienes oro suficiente para comprar "+item.name+".");
    state.gold-=item.price;
    if(item.kind==="rations") state.rations+=1;
    else state.inventory[item.kind]=(state.inventory[item.kind]||0)+1;
    state.notice="Has comprado: "+item.name+".";
    renderCampaign();saveState();
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
    if (action === "buy-equipment") return buyEquipment(target.dataset.item);
    if (action === "refresh-shop") return rotateShopStock();
    if (action === "gacha-roll") return rollGachapon();
    if (action === "close-gacha-reveal") return closeGachaReveal();
    if (action === "equip-item") return equipOwnedItem(target.dataset.character,target.dataset.uid);
    if (action === "unequip-item") return unequipItem(target.dataset.character,target.dataset.uid);
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
