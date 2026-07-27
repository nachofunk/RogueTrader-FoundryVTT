import BaseDocumentMixin from "./base-document-mixin.mjs";

const Properties = foundry.utils;
export class RogueTraderActor extends BaseDocumentMixin(foundry.documents.Actor) {
	static metadata = {
		...super.metadata,
		label: "Rogue Trader Actor",
		types: ["explorer", "npc", "ship", "colony"]
	};

  static migrateData(source) {
    if (!source) return super.migrateData(source);
    if (source.type === "voidship") {
      Properties.setProperty(source, `type`, "ship");
    }
    return super.migrateData(source);
  }

  async _preCreate(data, options, user) {
    let initData;
    if (this.type === 'voidship') {
      initData = {
        "prototypeToken.bar1": { attribute: "hull.integrity" },
        "prototypeToken.bar2": { attribute: "crew.count" },
        "prototypeToken.name": data.name,
        "prototypeToken.displayName": CONST.TOKEN_DISPLAY_MODES.ALWAYS,
        "prototypeToken.displayBars": CONST.TOKEN_DISPLAY_MODES.ALWAYS,
      };
    } else {
      initData = {
        "prototypeToken.bar1": { attribute: "wounds" },
        "prototypeToken.bar2": { attribute: "fatigue" },
        "prototypeToken.name": data.name,
        "prototypeToken.displayName": CONST.TOKEN_DISPLAY_MODES.HOVER,
        "prototypeToken.displayBars": CONST.TOKEN_DISPLAY_MODES.HOVER,
      };
      if (this.type === "explorer") {
        initData["prototypeToken.actorLink"] = true;
        initData["prototypeToken.disposition"] = CONST.TOKEN_DISPOSITIONS.FRIENDLY
      }
    }
    this.updateSource(initData);
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
      case 0:
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

  get colonyUpgrades() {
    return this.system.upgrades || [];
  }

  get currentColonySize() {
    return this.system.stats.size || 0;
  }

  get colonyBaseSlots() {
    return this.system.development.baseSlots || 0;
  }

  get colonyTotalSlots() {
    return this.system.development.slotsTotal || 0; 
  }

  get colonyOccupiedSlots() {
    return this.system.development.occupiedSlots || 0;
  }

  get colonyProfitFactor() { return this.system.stats.profitFactor || 0; }

  get governor() {
    return this.system.governor.actor;
  }

  get governorTypeBonus() {
    const i18n = game?.i18n; // Cache the reference to game.i18n
    if (!i18n) return "Localization unavailable"; // Fallback if i18n is undefined

    const governorType = this.system.governor.governorType || "default";
    switch (governorType) {
      case "administrative":
        return i18n.localize("COLONY.GOV_BONUS.ADMINISTRATIVE");
      case "faithful":
        return i18n.localize("COLONY.GOV_BONUS.FAITHFUL");
      case "lawful":
        return i18n.localize("COLONY.GOV_BONUS.LAWFUL");
      case "accounting":
        return i18n.localize("COLONY.GOV_BONUS.ACCOUNTING");
      case "local":
        return i18n.localize("COLONY.GOV_BONUS.LOCAL");
      case "relaxed":
        return i18n.localize("COLONY.GOV_BONUS.RELAXED");
      case "warlike":
        return i18n.localize("COLONY.GOV_BONUS.WARLIKE");
      default:
        return "ERROR!";
    }
  }

  get governorTypeSideEffect() {
    const i18n = game?.i18n; // Cache the reference to game.i18n
    if (!i18n) return "Localization unavailable"; // Fallback if i18n is undefined

    const governorType = this.system.governor.governorType || "administrative";
    switch (governorType) {
      case "administrative":
        return i18n.localize("COLONY.GOV_SIDE_EFFECT.ADMINISTRATIVE");
      case "faithful":
        return i18n.localize("COLONY.GOV_SIDE_EFFECT.FAITHFUL");
      case "lawful":
        return i18n.localize("COLONY.GOV_SIDE_EFFECT.LAWFUL");
      case "accounting":
        return i18n.localize("COLONY.GOV_SIDE_EFFECT.ACCOUNTING");
      case "local":
        return i18n.localize("COLONY.GOV_SIDE_EFFECT.LOCAL");
      case "relaxed":
        return i18n.localize("COLONY.GOV_SIDE_EFFECT.RELAXED");
      case "warlike":
        return i18n.localize("COLONY.GOV_SIDE_EFFECT.WARLIKE");
      default:
        return "ERROR!";
    }
  }

  get colonyTypes() {
    return [
      "research",
      "mining",
      "ecclesiastical",
      "agricultural",
      "pleasure",
      "war"
    ];
  }

  get colonyTypeUpgradeBonus() {
    const colonyType = this.system.colonyType;
    const i18n = game.i18n;
    switch (colonyType) {
      case "research":
        return i18n.localize("COLONY.UPGRADE_BONUS.RESEARCH");
      case "mining":
        return i18n.localize("COLONY.UPGRADE_BONUS.MINING");
      case "ecclesiastical":
        return i18n.localize("COLONY.UPGRADE_BONUS.ECCLESIASTICAL");
      case "agricultural":
        return i18n.localize("COLONY.UPGRADE_BONUS.AGRICULTURAL");
      case "pleasure":
        return i18n.localize("COLONY.UPGRADE_BONUS.PLEASURE");
      case "war":
        return i18n.localize("COLONY.UPGRADE_BONUS.WAR");
      default:
        return "";
    }
  }

  get colonyTypeSideEffect() {
    const colonyType = this.system.colonyType;
    const i18n = game.i18n;
    switch (colonyType) {
      case "research":
        return i18n.localize("COLONY.SIDE_EFFECT.RESEARCH");
      case "mining":
        return i18n.localize("COLONY.SIDE_EFFECT.MINING");
      case "ecclesiastical":
        return i18n.localize("COLONY.SIDE_EFFECT.ECCLESIASTICAL");
      case "agricultural":
        return i18n.localize("COLONY.SIDE_EFFECT.AGRICULTURAL");
      case "pleasure":
        return i18n.localize("COLONY.SIDE_EFFECT.PLEASURE");
      case "war":
        return i18n.localize("COLONY.SIDE_EFFECT.WAR");
      default:
        return "";
    }
  }

  get colonyTypeExplorerBonus() {
    const colonyType = this.system.colonyType;
    const i18n = game.i18n;
    switch (colonyType) {
      case "research":
        return i18n.localize("COLONY.BONUS.RESEARCH");
      case "mining":
        return i18n.localize("COLONY.BONUS.MINING");
      case "ecclesiastical":
        return i18n.localize("COLONY.BONUS.ECCLESIASTICAL");
      case "agricultural":
        return i18n.localize("COLONY.BONUS.AGRICULTURAL");
      case "pleasure":
        return i18n.localize("COLONY.BONUS.PLEASURE");
      case "war":
        return i18n.localize("COLONY.BONUS.WAR");
      default:
        return "";
    }
  }

  get attributeBoni() {
    let boni = [];
    for (let characteristic of Object.values(this.characteristics)) {
      boni.push({ regex: new RegExp(`${characteristic.short}B`, "gi"), value: characteristic.bonus });
    }
    return boni;
  }

  get characteristics() { return this.system.characteristics; }

  get skills() { return this.system.skills; }

  get initiative() { return this.system.initiative; }

  set initiative(value) { this.system.initiative = value; }

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
    switch (this.system.crewSkill) {
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
