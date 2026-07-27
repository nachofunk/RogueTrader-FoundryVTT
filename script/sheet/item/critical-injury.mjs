import CharacterItemSheet from "./character-item.mjs";

export default class CriticalInjurySheet extends CharacterItemSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property
  static DEFAULT_OPTIONS = {
    classes: ["rogue-trader", "sheet", "critical-injury"],
    position: {
      width: 500,
      height: 400
    }
  };

  static METADATA = {
    types: ["criticalInjury"],
    makeDefault: true,
  }
}
