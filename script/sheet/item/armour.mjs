import CharacterItemSheet from "./character-item.mjs";

export default class ArmourSheet extends CharacterItemSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property
  static DEFAULT_OPTIONS = {
    classes: ["rogue-trader", "sheet", "armour"],
  };

  static METADATA = {
    types: ["armour"],
    makeDefault: true,
  }

  static {
    const tabs = foundry.utils.deepClone(super.TABS);
    tabs.primary.tabs.unshift({
      id: "armour-data",
      group: "primary",
      label: "TAB.DATA",
      icon: "fa-solid fa-chart-bar",
      cssClass: "tab-data"
    });
    tabs.primary.initial = "armour-data";
    this.TABS = tabs;
  }
}
