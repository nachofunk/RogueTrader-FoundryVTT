export default class RogueTraderUtil {
  
  static createCommonAttackRollData(actor, item) {
      return {
        name: item.name,      
        attributeBoni: actor.attributeBoni,
        ownerId: actor.id,
        itemId: item.id,      
        damageBonus: 0,
        damageType: item.damageType,
        unnatural: 0,      
    };
  }
  
  static createWeaponRollData(actor, weapon) {
    let characteristic = this.getWeaponCharacteristic(actor, weapon);
    let rateOfFire;
    if (weapon.class === "melee") {
      rateOfFire = {burst: characteristic.bonus, full: characteristic.bonus};
    } else {
      rateOfFire = {burst: weapon.rateOfFire.burst, full: weapon.rateOfFire.full};
    }
    let isMelee = weapon.class === "melee";
    
    let rollData = this.createCommonAttackRollData(actor, weapon);
    rollData.baseTarget= characteristic.total + weapon.attack,
    rollData.unnatural = characteristic.unnatural;
    rollData.modifier= 0,
    rollData.isMelee= isMelee;
    rollData.isRange= !isMelee;
    rollData.clip= weapon.clip;
    rollData.rateOfFire= rateOfFire;
    rollData.weaponTraits= this.extractWeaponTraits(weapon.special);  
    rollData.damageFormula = weapon.damage + (isMelee && !weapon.damage.match(/SB/gi) ? "+SB" : "") + (rollData.weaponTraits.force ? "+PR" : "");
    if (rollData.weaponTraits.warp)
      rollData.penetrationFormula = "Ignores armor.";
    else
      rollData.penetrationFormula = parseInt(weapon.penetration, 10) + parseInt(rollData.weaponTraits.force ? actor.psy.rating : 0, 10);  
    rollData.special= weapon.special;
    rollData.psy= { value: actor.psy.rating, display: false};
    return rollData;
  }

  static createCommonShipRollData(actor, item) {
    return {
      name: item.name,
      ownerId: actor.id,
      itemId: item.id,
    };
  }

  static createShipWeaponRollData(actor, weapon) {
    let rollData = this.createCommonShipRollData(actor, weapon)
    if (actor.masterOrdnance)
      rollData.baseTarget = actor.masterOrdnance.characteristics.ballisticSkill;
    else
      rollData.baseTarget = actor.crewSkillValue;
    rollData.characteristicSource = actor;
    rollData.modifier = 0;
    rollData.damageBonus = 0;
    rollData.damageFormula = weapon.damage;
    rollData.weaponType = weapon.ShipWeaponClass;
    rollData.weaponStrength = weapon.strength;
    rollData.critRating = weapon.critRating;
    rollData.side = weapon.side;
    rollData.ignoreArmor = weapon.ignoreArmor;
    rollData.ignoreShields = weapon.ignoreShields;
    rollData.dosPerHit = weapon.dosPerHit;
    return rollData;
  }
  
  static createPsychicRollData(actor, power) {
    let focusPowerTarget = this.getFocusPowerTarget(actor, power);
    
    let rollData = this.createCommonAttackRollData(actor, power); 
    rollData.baseTarget= focusPowerTarget.total;
    rollData.modifier= power.focusPower.difficulty;      
    rollData.damageFormula= power.damage.formula;      
    rollData.penetrationFormula= power.damage.penetration;
    rollData.attackType= { name: power.damage.zone, text: "" };
    rollData.weaponTraits= this.extractWeaponTraits(power.damage.special);
    rollData.special= power.damage.special;
    rollData.psy = {
        value: actor.psy.rating,
        rating: actor.psy.rating,
        psyStrength: "fettered",
        push: 1,
        maxPush: this.getMaxPsyRating(actor) - actor.psy.rating,
        warpConduit: false,
        disciplineMastery: false,
        display: true
    };
    return rollData;
  }
  
  static extractWeaponTraits(traits) {
    // These weapon traits never go above 9 or below 2
    return {
      accurate: this.hasNamedTrait(/Accurate/gi, traits),
      rfFace: this.extractNumberedTrait(/Vengeful\s*\(?\s*\d+\s*\)?/gi, traits), // The alternativ die face Righteous Fury is triggered on
      proven: this.extractNumberedTrait(/Proven\s*\(?\s*\d+\s*\)?/gi, traits),
      primitive: this.extractNumberedTrait(/Primitive\s*\(?\s*\d+\s*\)?/gi, traits),
      razorSharp: this.hasNamedTrait(/Razor *Sharp/gi, traits),
      skipAttackRoll: this.hasNamedTrait(/Spray/gi, traits),
      tearing: this.hasNamedTrait(/Tearing/gi, traits),
      force: this.hasNamedTrait(/Force/gi, traits),
      warp: this.hasNamedTrait(/Warp/gi, traits),
      scatter: this.hasNamedTrait(/Scatter/gi, traits),
      melta: this.hasNamedTrait(/Melta/gi, traits),
      maximal: this.hasNamedTrait(/Maximal/gi, traits),
    };
  }

  static getMaxPsyRating(actor) {
    let base = actor.psy.rating;
    switch (actor.psy.class) {
      case "bound":
        return base + 3;
      case "unbound":
        return base + 4;
      case "daemonic":
        return base + 4;
    }
  }

  static extractNumberedTrait(regex, traits) {
    let rfMatch = traits.match(regex);
    if (rfMatch) {
      regex = /\d+/gi;
      return parseInt(rfMatch[0].match(regex)[0]);
    }
    return undefined;
  }

  static hasNamedTrait(regex, traits) {
    let rfMatch = traits.match(regex);
    if (rfMatch) {
      return true;
    } else {
      return false;
    }
  }
  
  static getWeaponCharacteristic(actor, weapon) {
    if (weapon.class === "melee") {
      return actor.characteristics.weaponSkill;
    } else {
      return actor.characteristics.ballisticSkill;
    }
  }

  static getFocusPowerTarget(actor, psychicPower) {
    const normalizeName = psychicPower.focusPower.test.toLowerCase();
    if (actor.characteristics.hasOwnProperty(normalizeName)) {
      return actor.characteristics[normalizeName];
    } else if (actor.skills.hasOwnProperty(normalizeName)) {
      return actor.skills[normalizeName];
    } else {
      return actor.characteristics.willpower;
    }
  }
    
}

