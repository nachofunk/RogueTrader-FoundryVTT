import { EnumBase } from "./enum-base.mjs";

export default class Characteristics extends EnumBase {
    static DEFAULT = "strength";

    static DATA = Object.freeze({
        weaponSkill: { short: "WS", bonus: "WSB", label: "CHARACTERISTIC.WEAPON_SKILL" },
        ballisticSkill: { short: "BS", bonus: "BSB", label: "CHARACTERISTIC.BALLISTIC_SKILL" },
        strength: { short: "S", bonus: "SB", label: "CHARACTERISTIC.STRENGTH" },
        toughness: { short: "T", bonus: "TB", label: "CHARACTERISTIC.TOUGHNESS" },
        agility: { short: "Ag", bonus: "AB", label: "CHARACTERISTIC.AGILITY" },
        intelligence: { short: "Int", bonus: "IB", label: "CHARACTERISTIC.INTELLIGENCE" },
        perception: { short: "Per", bonus: "PB", label: "CHARACTERISTIC.PERCEPTION" },
        willpower: { short: "WP", bonus: "WB", label: "CHARACTERISTIC.WILLPOWER" },
        fellowship: { short: "Fel", bonus: "FB", label: "CHARACTERISTIC.FELLOWSHIP" }
    });
}