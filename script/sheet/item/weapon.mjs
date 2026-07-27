import CharacterItemSheet from "./character-item.mjs";

export default class WeaponSheet extends CharacterItemSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property
  static DEFAULT_OPTIONS = {
    classes: ["rogue-trader", "sheet", "weapon"],
    position: {
      width: 600,
      height: 500
    }
  };

  static METADATA = {
    types: ["weapon"],
    makeDefault: true,
  }

  static {
    const tabs = foundry.utils.deepClone(super.TABS);
    tabs.primary.tabs.unshift({
      id: "weapon-data",
      group: "primary",
      label: "TAB.DATA",
      icon: "fa-solid fa-chart-bar",
      cssClass: "tab-data"
    });
    tabs.primary.initial = "weapon-data";
    this.TABS = tabs;
  }
}
