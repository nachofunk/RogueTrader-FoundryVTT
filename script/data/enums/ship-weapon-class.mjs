import { EnumBase } from "./enum-base.mjs";

export default class ShipWeaponClass extends EnumBase {
  static DEFAULT = "macro";

  static DATA = Object.freeze({
    macro: { 
      label: "SHIP_WEAPON.MACRO",
      ignoreArmour: false, 
    },
    lance: { 
      label: "SHIP_WEAPON.LANCE",
      ignoreArmour: true,  
    },
    torpedo: { 
      label: "SHIP_WEAPON.TORPEDO",
      ignoreArmour: false,  
    },
    hangar: { 
      label: "SHIP_WEAPON.HANGAR",
      ignoreArmour: false,  
    }
  });
}
