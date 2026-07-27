import CharacterItemSheet from "./character-item.mjs";

export default class WeaponModificationSheet extends CharacterItemSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property
  static DEFAULT_OPTIONS = {
    classes: ["rogue-trader", "sheet", "weapon-modification"],
    position: {
      width: 500,
      height: 400
    }
  };

  static METADATA = {
    types: ["weaponModification"],
    makeDefault: true,
  }

  static {
    const tabs = foundry.utils.deepClone(super.TABS);
    tabs.primary.tabs.unshift({
      id: "weapon-modification-data",
      group: "primary",
      label: "TAB.DATA",
      icon: "fa-solid fa-chart-bar",
      cssClass: "tab-data"
    });
    tabs.primary.initial = "weapon-modification-data";
    this.TABS = tabs;
  }
}
