import CharacterItemSheet from "./character-item.mjs";

export default class MentalDisorderSheet extends CharacterItemSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property
  static DEFAULT_OPTIONS = {
    classes: ["rogue-trader", "sheet", "mental-disorder"],
  };

  static METADATA = {
    types: ["mentalDisorder"],
    makeDefault: true,
  }
}
