import * as enums from "../../data/enums/_module.mjs";
import RogueTraderUtil from "../util.mjs";
import WeaponUtility from "../utility/weapon-utility.mjs";

export default class CharacterRollData {
    static createCharacteristicRollData(actor, characteristic) {
        const label = enums.Characteristics.DATA[characteristic].label;
        const char = actor.system.characteristics[characteristic];
        const baseTarget = char.value;
        const unnatural = char.unnatural.rollBonus;
        const result = {
            name: label,
            actor: actor,
            baseTarget: baseTarget,
            modifier: 0,
            ownerId: actor.id,
            unnatural: unnatural,
            characteristic: characteristic,
            hideCharacteristic: true,
            options: RogueTraderUtil.preapareDropdownOptions(),
        };
        return result;
    }

    static #createCommonAttackRollData(actor, item) {
        return {
            name: item.name,      
            attributeBoni: actor.attributeBoni,
            ownerId: actor.id,
            itemId: item.id,      
            damageBonus: 0,
            damageType: item.damage.type,
            unnatural: 0, 
            options: RogueTraderUtil.preapareDropdownOptions(),     
        };
    }

    static createWeaponRollData(actor, weapon) {
        let characteristic = actor.system.characteristics[weapon.system.characteristic];
        let rateOfFire;
        if (weapon.class === "melee") {
            rateOfFire = {burst: characteristic.bonus, full: characteristic.bonus};
        } else {
            rateOfFire = {burst: weapon.rateOfFire.burst, full: weapon.rateOfFire.full};
        }
        let isMelee = weapon.class === "melee";
        
        let rollData = CharacterRollData.#createCommonAttackRollData(actor, weapon);
        rollData.baseTarget = characteristic.value,
        rollData.unnatural = characteristic.unnatural.rollBonus;
        rollData.modifier = 0,
        rollData.attackBonus = weapon.attack,
        rollData.isMelee = isMelee;
        rollData.isRange = !isMelee;
        rollData.clip = weapon.clip;
        rollData.rateOfFire= rateOfFire;
        rollData.weaponSpecial = weapon.special;
        rollData.weaponTraits = WeaponUtility.extractWeaponTraits(weapon.special);
        rollData.damageFormula = weapon.damage.formula + (isMelee && !weapon.damage.formula.match(/SB/gi) ? "+SB" : "") + (rollData.weaponTraits.force ? "+PR" : "");
        if (rollData.weaponTraits.warp)
        {
            rollData.penetrationFormula = "Ignores armor.";
        }
        else
        {
            const basePen = weapon.damage.penetration || "0";
            const forceBonus = rollData.weaponTraits.force ? actor.psy.rating : 0;
            rollData.penetrationFormula = `${basePen}+${forceBonus}`;
        }
        rollData.special= weapon.special;
        rollData.psy = { value: actor.psy.rating, display: false};
        rollData.options = RogueTraderUtil.preapareDropdownOptions();
        return rollData;
    }

    static createForceFieldRollData(actor, forceField) {
        let rollData = {
            name: forceField.name, 
            ownerId: actor.id,
            itemId: forceField.id,    
            protectionRating: parseInt(forceField.protectionRating),
            overloadChance: parseInt(forceField.overloadChance),
            description: forceField.description,
        }
        return rollData;
    }

    static createPsychicRollData(actor, power) {       
        let rollData = CharacterRollData.#createCommonAttackRollData(actor, power); 
        rollData.baseTarget = this.#getFocusPowerTarget(actor, power);
        rollData.modifier = power.focusPower.difficulty;      
        rollData.damageFormula = power.damage.formula;      
        rollData.penetrationFormula = power.damage.penetration;
        rollData.attackType = { name: power.damage.zone, text: "" };
        rollData.weaponTraits = WeaponUtility.extractWeaponTraits(power.damage.special);
        rollData.special = power.damage.special;
        rollData.psy = {
            value: actor.psy.rating,
            rating: actor.psy.rating,
            psyStrength: enums.PsyStrength.DEFAULT,
            push: 1,
            maxPush: CharacterRollData.#getMaxPushPR(actor),
            warpConduit: false,
            disciplineMastery: false,
            display: true
        };
        rollData.options = RogueTraderUtil.preapareDropdownOptions();
        return rollData;
    }

    static #getFocusPowerTarget(actor, psychicPower) {
        const normalizeName = psychicPower.focusPower.test.toLowerCase();
        if (actor.characteristics.hasOwnProperty(normalizeName)) {
            return actor.characteristics[normalizeName].value;
        } else if (actor.skills.hasOwnProperty(normalizeName)) {
            return actor.skills[normalizeName].value;
        } else {
            return actor.characteristics.willpower.value;
        }
    }

    static #getMaxPushPR(actor) {
        return enums.PsyClass.DATA[actor.psy.class].maxPushPR;
    }
}