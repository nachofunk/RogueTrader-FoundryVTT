export class RogueTraderActor extends Actor {

  async _preCreate(data, options, user) {
    let initData;
    if (this.type === 'ship') {
      initData = {
        "prototypeToken.bar1": { attribute: "hullIntegrity" },
        "prototypeToken.bar2": { attribute: "crewCount" },
        "prototypeToken.name": data.name,
        "prototypeToken.displayName" : CONST.TOKEN_DISPLAY_MODES.ALWAYS,
        "prototypeToken.displayBars" : CONST.TOKEN_DISPLAY_MODES.ALWAYS,           
      };
    } else {
      initData = {
        "prototypeToken.bar1": { attribute: "wounds" },
        "prototypeToken.bar2": { attribute: "fatigue" },
        "prototypeToken.name": data.name,
        "prototypeToken.displayName" : CONST.TOKEN_DISPLAY_MODES.HOVER,
        "prototypeToken.displayBars" : CONST.TOKEN_DISPLAY_MODES.HOVER,            
      };
      if (this.type === "explorer") {
        initData["prototypeToken.actorLink"] = true;      
        initData["prototypeToken.disposition"] = CONST.TOKEN_DISPOSITIONS.FRIENDLY
      }
    }
    this.updateSource(initData);
  }

  prepareData() {
    super.prepareData();
    if (this.type === 'ship') 
    {
      this._computePower();
      this._computeSpace();
      this._computePoints();
    } 
    else if (this.type === 'colony')
    {
      this._computeProfitFactor();
      this._computerYearlyGains();
    }
    else
    {
      this._computeCharacteristics();
      this._computeSkills();
      this._computeItems();
      this._computeExperience();
      if (this.type === 'explorer') {
        this._computeRank();
      }
      this._computeArmour();
      this._computeMovement();
    }
  }

  _computeProfitFactor() {
    const colonySize = this.system.stats.size;
    if (colonySize < 0) {
      this.system.stats.profitFactor = 0;
      return;
    }
    if (colonySize < 10) {
      this.system.stats.profitFactor = Math.min(colonySize, 4) + (Math.max(0, colonySize - 4) * 2);
    } else {
      this.system.stats.profitFactor = 18 + ((colonySize - 10) * 2);
    }
  }

  _computeYearlyGains() {
    const items = this.items;
    const yearlyGains = items.reduce((totals, item) => {
      return {
        yearlyLoyalty: totals.yearlyLoyalty + (item.system.yearlyLoyalty || 0),
        yearlyProsperity: totals.yearlyProsperity + (item.system.yearlyProsperity || 0),
        yearlySecurity: totals.yearlySecurity + (item.system.yearlySecurity || 0),
      };
    }, { yearlyLoyalty: 0, yearlyProsperity: 0, yearlySecurity: 0 });
    this.system.yearlyGains.yearlyLoyalty = yearlyGains.yearlyLoyalty;
    this.system.yearlyGains.yearlyProsperity = yearlyGains.yearlyProsperity;
    this.system.yearlyGains.yearlySecurity = yearlyGains.yearlySecurity;
  }

  _computePower() {
    const voidEngine = this.items.find(item => item.system.class === "voidEngine");
    const otherItems = this.items.filter(item => (item.isShipWeapon || item.isShipComponent) && item.system.class !== "voidEngine");
    this.system.power.max = voidEngine?.system.power | 0;
    this.system.power.value = otherItems?.reduce((total, item) => total + item.system.power, 0) | 0;
    this.system.power.avail = this.system.power.max - this.system.power.value;
  }

  _computeSpace() {
    const shipItems = this.items.filter(item => item.isShipWeapon || item.isShipComponent);
    const spaceTaken = shipItems.reduce((total, item) => total + item.system.space, 0) | 0;
    this.system.space.value = spaceTaken;
    this.system.space.avail = this.system.space.max - spaceTaken;
  }

  _computePoints() {
    const shipItems = this.items.filter(item => item.isShipWeapon || item.isShipComponent);
    const componentsValue = shipItems.reduce((total, item) => total + item.system.shipPoints, 0) | 0;
    this.system.points.components = componentsValue;
    this.system.points.total = componentsValue + this.system.points.base;
  }

  _computeCharacteristics() {
    let middle = Object.values(this.characteristics).length / 2;
    let i = 0;
    for (const key in this.characteristics) {
      const characteristic = this.characteristics[key];
      const characteristicBonuses = this._getCharacteristicsBonuses(key);
      characteristic.total = characteristic.base + characteristic.advance + characteristicBonuses.characteristicModifier;
      characteristic.bonus = Math.floor(characteristic.total / 10) + characteristic.unnatural + characteristicBonuses.unnaturalModifier;
      if (this.fatigue.value > characteristic.bonus) {
        characteristic.total = Math.ceil(characteristic.total / 2);
        characteristic.bonus = Math.floor(characteristic.total / 10) + characteristic.unnatural + characteristicBonuses.unnaturalModifier;
      }
      characteristic.isLeft = i < middle;
      characteristic.isRight = i >= middle;
      characteristic.advanceCharacteristic = this._getAdvanceCharacteristic(characteristic.advance);
      i++;
    };
    this.system.insanityBonus = Math.floor(this.insanity / 10);
    this.system.corruptionBonus = Math.floor(this.corruption / 10);
    this.psy.currentRating = this.psy.rating - this.psy.sustained;
    this.initiative.bonus = this.characteristics[this.initiative.characteristic].bonus;
    // Done as variables to make it easier to read & understand
    let tb = Math.floor(
      ( this.characteristics.toughness.base
            + this.characteristics.toughness.advance) / 10);

    let wb = Math.floor(
      ( this.characteristics.willpower.base
            + this.characteristics.willpower.advance) / 10);

    // The only thing not affected by itself
    this.fatigue.max = tb + wb;

  }

  _getCharacteristicsBonuses(characteristic) {
    const items = this.items;
    const result = {
      characteristicModifier: 0,
      unnaturalModifier: 0,
    };
    items.forEach((value, key) => {
      const charMods = value.characteristicModifiers;
      if (charMods !== null && charMods !== undefined) {
        if (charMods.hasOwnProperty(characteristic)) {
          const mod = charMods[characteristic];
          result.characteristicModifier += mod.characteristicModifier;
          result.unnaturalModifier += mod.unnaturalModifier;
        }
      }
    });
    console.log(`Modifier ${characteristic}: ${JSON.stringify(result)}`);
    return result;
  }

  _computeSkills() {
    const skillMods = this._getSkillBonuses();
    for (const key in this.skills) {
      const skill = this.skills[key];
      let short = skill.characteristics[0];
      let characteristic = this._findCharacteristic(short);
      const skillMod = skillMods[key];
      if (skill.advance === -20) {
        skill.total = Math.floor(characteristic.total / 2) + (skill.isSpecialist ? 0 : skillMod.skillModifier);
      } else {
        skill.total = characteristic.total + skill.advance + (skill.isSpecialist ? 0 : skillMod.skillModifier);
      }
      skill.advanceSkill = this._getAdvanceSkill(skill.advance);
      if (skill.isSpecialist) {
        for (const specKey of Object.keys(skill.specialities)) {
          const speciality = skill.specialities[specKey];
          const specMod = skillMods[key][specKey];
          if (speciality.advance === -20) {
            speciality.total = Math.floor(characteristic.total / 2) + specMod.skillModifier;
          } else {
            speciality.total = characteristic.total + speciality.advance + specMod.skillModifier;
          }
          speciality.isKnown = speciality.advance >= 0;
          speciality.advanceSpec = this._getAdvanceSkill(speciality.advance);
        }
      }
    }
  }

  _getSkillBonuses() {
    const skillSchema = game.system.model.Actor.explorer.skills;
    const result = {};
    for (const entry in skillSchema) {
      if (skillSchema.hasOwnProperty(entry)) {
        const entryObject = skillSchema[entry];
        if (entryObject.isSpecialist) {
          result[entry] = {};
          const specialities = skillSchema[entry].specialities;
          for (const specialty in specialities) {
            if (specialities.hasOwnProperty(specialty)) {
              result[entry][specialty] = { 
                skillModifier: 0
              };
            }
          }
        } else {
          result[entry] = {
            skillModifier : 0
          };
        }
      }
    }
    const items = this.items;
    items.forEach((value, key) => {
      const skillMods = value.skillModifiers;
      if (skillMods !== null && skillMods !== undefined) {
        for (const skillMod in skillMods ) {
          const split = skillMod.split(":");
          if (split.length > 1)
            result[split[0]][split[1]].skillModifier += skillMods[skillMod].skillModifier;
          else
            result[split[0]].skillModifier += skillMods[skillMod].skillModifier;
        }
      }
    });
    console.log(result);
    return result;
  }

  _computeItems() {
    let encumbrance = 0;
    for (let item of this.items) {

      if (item.weight) {
        encumbrance = encumbrance + item.weight;
      }
    }
    this._computeEncumbrance(encumbrance);
  }

  _computeExperience() {
    this.experience.spentCharacteristics = 0;
    this.experience.spentSkills = 0;
    this.experience.spentTalents = 0;
    this.experience.spentPsychicPowers = this.psy.cost;
    for (let characteristic of Object.values(this.characteristics)) {
      this.experience.spentCharacteristics += parseInt(characteristic.cost, 10);
    }
    for (let skill of Object.values(this.skills)) {
      if (skill.isSpecialist) {
        for (let speciality of Object.values(skill.specialities)) {
          this.experience.spentSkills += parseInt(speciality.cost, 10);
        }
      } else {
        this.experience.spentSkills += parseInt(skill.cost, 10);
      }
    }
    for (let item of this.items) {
      if (item.isTalent) {
        this.experience.spentTalents += parseInt(item.cost, 10);
      } else if (item.isPsychicPower) {
        this.experience.spentPsychicPowers += parseInt(item.cost, 10);
      }
    }
    this.experience.totalSpent = 4500
      + this.experience.spentCharacteristics
      + this.experience.spentSkills
      + this.experience.spentTalents
      + this.experience.spentPsychicPowers;
    if (this.experience.value < 5000) {
      this.experience.value = 5000;
    }
    this.experience.remaining = this.experience.value - this.experience.totalSpent;
  }

  _computeRank() {
    const expSpent = this.experience.totalSpent;
    let rank = "";
    if (expSpent < 7000) {
      rank = "1";
    } else if (expSpent < 10000) {
      rank = "2";
    } else if (expSpent < 13000) {
      rank = "3";
    } else if (expSpent < 17000) {
      rank = "4";
    } else if (expSpent < 21000) {
      rank = "5";
    } else if (expSpent < 25000) {
      rank = "6";
    } else if (expSpent < 30000) {
      rank = "7";
    } else if (expSpent < 35000) {
      rank = "8";
    } else {
      rank = "Retired";
    }
    this.system.bio.rank = rank;
  }

  _computeArmour() {
    let locations = Object.keys(game.system.template.Item.armour.part);

    let toughness = this.characteristics.toughness;

    this.system.armour = locations
              .reduce((accumulator, location) =>
                Object.assign(accumulator,
                  {
                    [location]: {
                      total: toughness.bonus,
                      toughnessBonus: toughness.bonus,
                      value: 0
                    }
                  }), {});

    // Object for storing the max armour
    let maxArmour = locations
      .reduce((acc, location) =>
        Object.assign(acc, { [location]: 0 }), {});

    // For each item, find the maximum armour val per location
    this.items
      .filter(item => item.isArmour && !item.isAdditive)
      .reduce((acc, armour) => {
        locations.forEach(location => {
            let armourVal = armour.part[location] || 0;
            if (armourVal > acc[location]) {
              acc[location] = armourVal;
            }
          });
        return acc;
      }, maxArmour);

    this.items
      .filter(item => item.isArmour && item.isAdditive)
      .forEach(armour => {
         locations.forEach(location =>{
            let armourVal = armour.part[location] || 0;
            maxArmour[location] += armourVal;
         });
      });  

    this.armour.head.value = maxArmour.head;
    this.armour.leftArm.value = maxArmour.leftArm;
    this.armour.rightArm.value = maxArmour.rightArm;
    this.armour.body.value = maxArmour.body;
    this.armour.leftLeg.value = maxArmour.leftLeg;
    this.armour.rightLeg.value = maxArmour.rightLeg;

    this.armour.head.total += this.armour.head.value;
    this.armour.leftArm.total += this.armour.leftArm.value;
    this.armour.rightArm.total += this.armour.rightArm.value;
    this.armour.body.total += this.armour.body.value;
    this.armour.leftLeg.total += this.armour.leftLeg.value;
    this.armour.rightLeg.total += this.armour.rightLeg.value;
  }

  _computeMovement() {
    let agility = this.characteristics.agility;
    let size = this.size;
    this.system.movement = {
      half: agility.bonus + size - 4,
      full: (agility.bonus + size - 4) * 2,
      charge: (agility.bonus + size - 4) * 3,
      run: (agility.bonus + size - 4) * 6
    };
  }

  _findCharacteristic(short) {
    for (let characteristic of Object.values(this.characteristics)) {
      if (characteristic.short === short) {
        return characteristic;
      }
    }
    return { total: 0 };
  }

  _computeEncumbrance(encumbrance) {
    const attributeBonus = this.characteristics.strength.bonus + this.characteristics.toughness.bonus;
    this.system.encumbrance = {
      max: 0,
      value: encumbrance
    };
    switch (attributeBonus) {
      case 0:
        this.encumbrance.max = 0.9;
        break;
      case 1:
        this.encumbrance.max = 2.25;
        break;
      case 2:
        this.encumbrance.max = 4.5;
        break;
      case 3:
        this.encumbrance.max = 9;
        break;
      case 4:
        this.encumbrance.max = 18;
        break;
      case 5:
        this.encumbrance.max = 27;
        break;
      case 6:
        this.encumbrance.max = 36;
        break;
      case 7:
        this.encumbrance.max = 45;
        break;
      case 8:
        this.encumbrance.max = 56;
        break;
      case 9:
        this.encumbrance.max = 67;
        break;
      case 10:
        this.encumbrance.max = 78;
        break;
      case 11:
        this.encumbrance.max = 90;
        break;
      case 12:
        this.encumbrance.max = 112;
        break;
      case 13:
        this.encumbrance.max = 225;
        break;
      case 14:
        this.encumbrance.max = 337;
        break;
      case 15:
        this.encumbrance.max = 450;
        break;
      case 16:
        this.encumbrance.max = 675;
        break;
      case 17:
        this.encumbrance.max = 900;
        break;
      case 18:
        this.encumbrance.max = 1350;
        break;
      case 19:
        this.encumbrance.max = 1800;
        break;
      case 20:
        this.encumbrance.max = 2250;
        break;
      default:
        this.encumbrance.max = 2250;
        break;
    }
  }


  _getAdvanceCharacteristic(characteristic)
  {
    switch (characteristic || 0) {
      case 0:
        return "N";
      case 5:
        return "S";
      case 10:
        return "I";
      case 15:
        return "T";
      case 20:
        return "P";
      case 25:
        return "E";
      default:
        return "N";
    }
  }

  _getAdvanceSkill(skill)
  {
    switch (skill || 0) {
      case -20:
        return "U";
      case 0:
        return "T";
      case 10:
        return "E";
      case 20:
        return "V";
      default:
        return "U";
    }
  }

  /**
   * Apply wounds to the actor, takes into account the armour value
   * and the area of the hit.
   * @param {object[]} damages            Array of damage objects to apply to the Actor
   * @param {number} damages.amount       An amount of damage to sustain
   * @param {string} damages.location     Localised location of the body part taking damage
   * @param {number} damages.penetration  Amount of penetration from the attack
   * @param {string} damages.type         Type of damage
   * @param {number} damages.righteousFury Amount rolled on the righteous fury die, defaults to 0
   * @returns {Promise<Actor>}             A Promise which resolves once the damage has been applied
   */
  async applyDamage(damages) {
    let wounds = this.wounds.value;
    let criticalWounds = this.wounds.critical;
    const damageTaken = [];
    const maxWounds = this.wounds.max;

    // Apply damage from multiple hits
    for (const damage of damages) {
      // Get the armour for the location and minus penetration, no negatives
      let armour = Math.max(this._getArmour(damage.location) - Number(damage.penetration), 0);
      // Reduce damage by toughness bonus
      const damageMinusToughness = Math.max(Number(damage.amount) - this.system.characteristics.toughness.bonus, 0);

      // Calculate wounds to add, reducing damage by armour after pen
      let woundsToAdd = Math.max(damageMinusToughness - armour, 0);

      // If no wounds inflicted and righteous fury was rolled, attack causes one wound
      if (damage.righteousFury && woundsToAdd === 0) {
        woundsToAdd = 1;
      } else if (damage.righteousFury) {
        // Roll on crit table but don't add critical wounds
        this._recordDamage(damageTaken, damage.righteousFury, damage, "Critical Effect (RF)");
      }

      // Check for critical wounds
      if (wounds === maxWounds) {
        // All new wounds are critical
        criticalWounds += woundsToAdd;
        this._recordDamage(damageTaken, woundsToAdd, damage, "Critical");

      } else if (wounds + woundsToAdd > maxWounds) {
        // Will bring wounds to max and add left overs as crits
        this._recordDamage(damageTaken, maxWounds - wounds, damage, "Wounds");

        woundsToAdd = (wounds + woundsToAdd) - maxWounds;
        criticalWounds += woundsToAdd;
        wounds = maxWounds;
        this._recordDamage(damageTaken, woundsToAdd, damage, "Critical");
      } else {
        this._recordDamage(damageTaken, woundsToAdd, damage, "Wounds");
        wounds += woundsToAdd;
      }
    }

    // Update the Actor
    const updates = {
      "system.wounds.value": wounds,
      "system.wounds.critical": criticalWounds
    };

    // Delegate damage application to a hook
    const allowed = Hooks.call("modifyTokenAttribute", {
      attribute: "wounds.value",
      value: this.wounds.value,
      isDelta: false,
      isBar: true
    }, updates);

    await this._showCritMessage(damageTaken, this.name, wounds, criticalWounds);
    return allowed !== false ? this.update(updates) : this;
  }

  /**
   * Records damage to be shown as in chat
   * @param {object[]} damageRolls array to record damages
   * @param {number} damageRolls.damage amount of damage dealt
   * @param {string} damageRolls.source source of the damage e.g. Critical
   * @param {string} damageRolls.location location taking the damage
   * @param {string} damageRolls.type type of the damage
   * @param {number} damage amount of damage dealt
   * @param {object} damageObject damage object containing location and type
   * @param {string} damageObject.location damage location
   * @param {string} damageObject.type damage type
   * @param {string} source source of the damage
   */
  _recordDamage(damageRolls, damage, damageObject, source) {
    damageRolls.push({
      damage,
      source,
      location: damageObject.location,
      type: damageObject.type
    });
  }

  /**
   * Gets the armour value not including toughness bonus for a non-localized location string
   * @param {string} location
   * @returns {number} armour value for the location
   */
  _getArmour(location) {
    switch (location) {
      case "ARMOUR.HEAD":
        return this.armour.head.value;
      case "ARMOUR.LEFT_ARM":
        return this.armour.leftArm.value;
      case "ARMOUR.RIGHT_ARM":
        return this.armour.rightArm.value;
      case "ARMOUR.BODY":
        return this.armour.body.value;
      case "ARMOUR.LEFT_LEG":
        return this.armour.leftLeg.value;
      case "ARMOUR.RIGHT_LEG":
        return this.armour.rightLeg.value;
      default:
        return 0;
    }
  }

  /**
   * Helper to show that an effect from the critical table needs to be applied.
   * TODO: This needs styling, rewording and ideally would roll on the crit tables for you
   * @param {object[]} rolls Array of critical rolls
   * @param {number} rolls.damage Damage applied
   * @param {string} rolls.type Letter representing the damage type
   * @param {string} rolls.source What kind of damage represented
   * @param {string} rolls.location Where this damage applied against for armor and AP considerations
   * @param {number} target
   * @param {number} totalWounds
   * @param {number} totalCritWounds
   */
  async _showCritMessage(rolls, target, totalWounds, totalCritWounds) {
    if (rolls.length === 0) return;
    const html = await renderTemplate("systems/rogue-trader/template/chat/critical.html", {
      rolls,
      target,
      totalWounds,
      totalCritWounds
    });
    ChatMessage.create({ content: html });
  }

  get growthAcquisitionBase() {
    const colonySize = this.system.stats.size;
    switch (colonySize) {
      case 1:
      case 2:
      case 3:
        return 20;
      case 4:
      case 5:
        return 0;
      case 6:
      case 7:
        return -10;
      case 8:
        return -20;
      case 9:
        return -40;
      case 10:
      default:
        return -60;
    }
  }

  get growthPointRequirementBase() {
    const colonySize = this.system.stats.size;
    switch (colonySize) {
      case 1:
      case 2:
      case 3:
        return colonySize;
      case 4:
      case 5:
        return colonySize + 1;
      case 6:
      case 7:
        return colonySize + 2;
      case 8:
      case 9:
        return colonySize + 3;
      case 10:
      default:
        return colonySize + 4;
    }
  }
  
  get attributeBoni() {
    let boni = [];
    for (let characteristic of Object.values(this.characteristics)) {
      boni.push( {regex: new RegExp(`${characteristic.short}B`, "gi"), value: characteristic.bonus} );
    }
    return boni;
  }

  get characteristics() { return this.system.characteristics; }

  get skills() { return this.system.skills; }

  get initiative() { return this.system.initiative; }

  get wounds() { return this.system.wounds; }

  get fatigue() { return this.system.fatigue; }

  get fate() { return this.system.fate; }

  get psy() { return this.system.psy; }

  get bio() { return this.system.bio; }

  get experience() { return this.system.experience; }

  get insanity() { return this.system.insanity; }

  get corruption() { return this.system.corruption; }

  get aptitudes() { return this.system.aptitudes; }

  get size() { return this.system.size; }

  get faction() { return this.system.faction; }

  get subfaction() { return this.system.subfaction; }

  get subtype() { return this.system.type; }

  get threatLevel() { return this.system.threatLevel; }

  get armour() { return this.system.armour; }

  get encumbrance() { return this.system.encumbrance; }

  get movement() { return this.system.movement; }

  get crewSkillValue() {
    switch(this.system.crewSkill) {
      case "incompetent":
        return 20;
      case "competent":
        return 30;
      case "crack":
        return 40;
      case "veteran":
        return 50;
      case "elite":
        return 60;
      default:
        return 0;
    }
  }

  // Rank 1
  get lordCaptain() {
    return game.actors.get(this.system.namedCrew.lordCaptain);
  }

  // Rank 2
  get firstOfficer() {
    return game.actors.get(this.system.namedCrew.firstOfficer);
  }

  get enginseerPrime() {
    return game.actors.get(this.system.namedCrew.enginseerPrime);
  }

  get highFactotum() {
    return game.actors.get(this.system.namedCrew.highFactotum);
  }

  // Rank 3
  get masterArms() {
    return game.actors.get(this.system.namedCrew.masterArms);
  }

  get masterHelmsman() {
    return game.actors.get(this.system.namedCrew.masterHelmsman);
  }

  get masterOrdnance() {
    return game.actors.get(this.system.namedCrew.masterOrdnance);
  }

  get masterEtherics() {
    return game.actors.get(this.system.namedCrew.masterEtherics);
  }

  get masterChirurgeon() {
    return game.actors.get(this.system.namedCrew.masterChirurgeon);
  }

  get masterWhispers() {
    return game.actors.get(this.system.namedCrew.masterWhispers);
  }

  get masterTelepathica() {
    return game.actors.get(this.system.namedCrew.masterTelepathica);
  }

  get masterWarp() {
    return game.actors.get(this.system.namedCrew.masterWarp);
  }

  // Rank 4
  get confessor() {
    return game.actors.get(this.system.namedCrew.confessor);
  }

  get drivesmaster() {
    return game.actors.get(this.system.namedCrew.drivesmaster);
  }

  get congregator() {
    return game.actors.get(this.system.namedCrew.congregator);
  }

  get bosun() {
    return game.actors.get(this.system.namedCrew.bosun);
  }

  get infernus() {
    return game.actors.get(this.system.namedCrew.infernus);
  }

  get twistcatcher() {
    return game.actors.get(this.system.namedCrew.twistcatcher);
  }

  get voxmaster() {
    return game.actors.get(this.system.namedCrew.voxmaster);
  }

  get purser() {
    return game.actors.get(this.system.namedCrew.purser);
  }

  get cartographer() {
    return game.actors.get(this.system.namedCrew.cartographer);
  }

  get steward() {
    return game.actors.get(this.system.namedCrew.steward);
  }

  get namedCrewMembers() {
    let shipCrewObject = this.system.namedCrew;
    let crewRoster = {};
    let crewId = "";
    for (let crewMember in shipCrewObject) {
      crewId = shipCrewObject[crewMember];
      if (crewId !== "") {
        crewRoster[crewMember] = game.actors.get(crewId); 
      }
    }
    return crewRoster;
  }
}
