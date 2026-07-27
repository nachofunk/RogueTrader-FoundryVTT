import CharacterItemSheet from "./character-item.mjs";

export default class TraitSheet extends CharacterItemSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property
  static DEFAULT_OPTIONS = {
    classes: ["rogue-trader", "sheet", "trait"],
    position: {
      width: 500,
      height: 400
    }
  };

  static METADATA = {
    types: ["trait"],
    makeDefault: true,
  }

  static {
    const tabs = foundry.utils.deepClone(super.TABS);
    tabs.primary.tabs.unshift({
      id: "trait-data",
      group: "primary",
      label: "TAB.DATA",
      icon: "fa-solid fa-chart-bar",
      cssClass: "tab-data"
    });
    tabs.primary.initial = "trait-data";
    this.TABS = tabs;
  }
}
