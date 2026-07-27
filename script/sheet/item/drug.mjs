import CharacterItemSheet from "./character-item.mjs";

export default class DrugSheet extends CharacterItemSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property
  static DEFAULT_OPTIONS = {
    classes: ["rogue-trader", "sheet", "drug"],
  };

  static METADATA = {
    types: ["drug"],
    makeDefault: true,
  }

  static {
    const tabs = foundry.utils.deepClone(super.TABS);
    tabs.primary.tabs.unshift({
      id: "drug-data",
      group: "primary",
      label: "TAB.DATA",
      icon: "fa-solid fa-chart-bar",
      cssClass: "tab-data"
    });
    tabs.primary.initial = "drug-data";
    this.TABS = tabs;
  }
}
