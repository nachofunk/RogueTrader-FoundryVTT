import CharacterItemSheet from "./character-item.mjs";

export default class AmmunitionSheet extends CharacterItemSheet {
  static {
    const tabs = foundry.utils.deepClone(super.TABS);
    tabs.primary.tabs.unshift({
      id: "ammunition-data",
      group: "primary",
      label: "TAB.DATA",
      icon: "fa-solid fa-chart-bar",
      cssClass: "tab-data"
    });
    tabs.primary.initial = "ammunition-data";
    this.TABS = tabs;
  }

  static DEFAULT_OPTIONS = {
    classes: ["rogue-trader", "sheet", "ammunition"],
  };

  static METADATA = {
    types: ["ammunition"],
    makeDefault: true,
  }
}
