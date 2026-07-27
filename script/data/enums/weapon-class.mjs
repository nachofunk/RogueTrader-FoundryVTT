import Characteristics from "./characteristics.mjs";
import { EnumBase } from "./enum-base.mjs";

export default class WeaponClass extends EnumBase {
  static DEFAULT = "melee";

  static DATA = Object.freeze({
    melee: { 
      label: "WEAPON.MELEE",
      characteristic: Characteristics.KEYS.weaponSkill,
    },
    thrown: { 
      label: "WEAPON.THROWN",
      characteristic: Characteristics.KEYS.ballisticSkill, 
    },
    pistol: { 
      label: "WEAPON.PISTOL",
      characteristic: Characteristics.KEYS.ballisticSkill, 
    },
    basic: { 
      label: "WEAPON.BASIC",
      characteristic: Characteristics.KEYS.ballisticSkill, 
    },
    heavy: { 
      label: "WEAPON.HEAVY",
      characteristic: Characteristics.KEYS.ballisticSkill, 
    },
    launched: { 
      label: "WEAPON.LAUNCHED",
      characteristic: Characteristics.KEYS.ballisticSkill, 
    },
    placed: { 
      label: "WEAPON.PLACED",
      characteristic: Characteristics.KEYS.ballisticSkill, 
    },
    vehicle: { 
      label: "WEAPON.VEHICLE",
      characteristic: Characteristics.KEYS.ballisticSkill, 
    }
  });
}
