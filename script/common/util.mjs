import * as enums from "../data/enums/_module.mjs";

export default class RogueTraderUtil {
  static preapareDropdownOptions() {
    // TODO: Convert this to iterator over enums
    const result = {
      craftsmanshipOptions: enums.Craftsmanship.options(),
      availabilityOptions: enums.Availability.options(),
      damageTypeOptions: enums.DamageType.options(),
      shipWeaponClassOptions: enums.ShipWeaponClass.options(),
      shipFacingOptions: enums.ShipFacing.options(),
      shipComponentClassOptions: enums.ShipComponentClass.options(),
      armourTypeOptions: enums.ArmourType.options(),
      criticalInjuryPartOptions: enums.HitLocations.options(),
      crewSkillOptions: enums.CrewSkill.options(),
      characteristicOptions: enums.Characteristics.options(),
      characteristicAdvanceOptions: enums.CharacteristicAdvance.options(),
      npcTypeOptions: enums.NPCType.options(),
      skillAdvanceOptions: enums.SkillAdvance.options(),
      psyClassOptions: enums.PsyClass.options(),
      psyStrengthOptions: enums.PsyStrength.options(),
      psyZoneOptions: enums.PsyZone.options(),
      initiativeOptions: enums.Characteristics.options(),
      governorTypeOptions: enums.GovernorType.options(),
      colonyTypeOptions: enums.ColonyType.options(),
      hullClassOptions: enums.HullClass.options(),
      hullClassOptions: enums.HullClass.options(),
      skillsOptions: enums.Skills.options(),
      weaponClassOptions: enums.WeaponClass.options(),
      weaponTypeOptions: enums.WeaponType.options()
    };
    return result;
  }

  static createCommonShipRollData(actor, item) {
    return {
      name: item.name,
      ownerId: actor.id,
      itemId: item.id,
      actor: actor,
    };
  }

  static createShipWeaponRollData(actor, weapon) {
    let rollData = this.createCommonShipRollData(actor, weapon)
    const actorData = actor.system;
    const weaponData = weapon.system;
    const masterOrdnance = actorData.crew.namedCrew.masterOrdnance;
    if (masterOrdnance.actor) {
      rollData.performer = masterOrdnance.actor.id;
      rollData.baseTarget = masterOrdnance.characteristics[enums.Characteristics.KEYS.ballisticSkill].value;
    }
    else {
      rollData.performer = "crew";
      rollData.baseTarget = enums.CrewSkill.DATA[actorData.crew.skill].rating ?? 0;
    }
    rollData.characteristicSource = actor;
    rollData.modifier = 0;
    rollData.damageBonus = 0;
    rollData.damageFormula = weaponData.damage;
    rollData.weaponType = weaponData.class;
    rollData.weaponStrength = weaponData.strength;
    rollData.critRating = weaponData.critRating;
    rollData.side = weaponData.side;
    rollData.ignoreArmor = weaponData.ignoreArmour;
    rollData.ignoreShields = weaponData.ignoreShields;
    rollData.dosPerHit = weaponData.rof;
    return rollData;
  }

  static createCrewSkillRollData(actor) {
    const rollData = {
      name: actor.name,
      ownerId: actor.id,
      actor: actor,
      baseTarget: enums.CrewSkill.DATA[actor.system.crew.skill]?.rating ?? 0,
      modifier: 0
    }
    return rollData;
  }
  
  static getWeaponCharacteristic(actor, weapon) {
    if (weapon.class === "melee") {
      return actor.characteristics.weaponSkill;
    } else {
      return actor.characteristics.ballisticSkill;
    }
  }

  static getMaxEncumbrance(attributeBonus) {
    switch (attributeBonus) {
      case 0:  return 0.9;
      case 1:  return 2.25;
      case 2:  return 4.5;
      case 3:  return 9;
      case 4:  return 18;
      case 5:  return 27;
      case 6:  return 36;
      case 7:  return 45;
      case 8:  return 56;
      case 9:  return 67;
      case 10: return 78;
      case 11: return 90;
      case 12: return 112;
      case 13: return 225;
      case 14: return 337;
      case 15: return 450;
      case 16: return 675;
      case 17: return 900;
      case 18: return 1350;
      case 19: return 1800;
      case 20: return 2250;
      default: return 2250;
    }
  }

  /**
   * Compute the characteristic bonus.
   *
   * @param {number} value      The characteristic's total value.
   * @param {number} unnatural  The unnatural bonus applied to the characteristic.
   * @returns {number}          The computed bonus.
   */
  static getCharacteristicBonus(value, unnatural) {
    return Math.floor(value / 10) + unnatural;
  }
}

