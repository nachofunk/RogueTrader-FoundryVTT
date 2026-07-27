import { EnumBase } from "./enum-base.mjs";

export default class WeaponType extends EnumBase {
  static DEFAULT = "las";

  static DATA = Object.freeze({
    las: { label: "WEAPON.LAS" },
    solidprojectile: { label: "WEAPON.SOLIDPROJECTILE" },
    bolt: { label: "WEAPON.BOLT" },
    melta: { label: "WEAPON.MELTA" },
    plasma: { label: "WEAPON.PLASMA" },
    flame: { label: "WEAPON.FLAME" },
    lowtech: { label: "WEAPON.LOWTECH" },
    launcher: { label: "WEAPON.LAUNCHER" },
    explosive: { label: "WEAPON.EXPLOSIVE" },
    exotic: { label: "WEAPON.EXOTIC" },
    chain: { label: "WEAPON.CHAIN" },
    power: { label: "WEAPON.POWER" },
    shock: { label: "WEAPON.SHOCK" },
    force: { label: "WEAPON.FORCE" }
  });
}
