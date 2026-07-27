import CharacterItemSheet from "./character-item.mjs";

export default class GearSheet extends CharacterItemSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property
  static DEFAULT_OPTIONS = {
    classes: ["rogue-trader", "sheet", "gear"],
  };

  static METADATA = {
    types: ["gear"],
    makeDefault: true,
  }

  static {
    const tabs = foundry.utils.deepClone(super.TABS);
    tabs.primary.tabs.unshift({
      id: "gear-data",
      group: "primary",
      label: "TAB.DATA",
      icon: "fa-solid fa-chart-bar",
      cssClass: "tab-data"
    });
    tabs.primary.initial = "gear-data";
    this.TABS = tabs;
  }
}
