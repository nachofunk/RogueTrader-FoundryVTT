import RogueTraderItemSheet from "./item.mjs";

export default class ColonyUpgradeSheet extends RogueTraderItemSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property
  static DEFAULT_OPTIONS = {
    classes: ["rogue-trader", "sheet", "colony-upgrade"],
  };

  static METADATA = {
    types: ["colonyUpgrade"],
    makeDefault: true,
  }

  static {
    const tabs = foundry.utils.deepClone(super.TABS);
    tabs.primary.tabs.unshift({
      id: "colony-upgrade-data",
      group: "primary",
      label: "TAB.DATA",
      icon: "fa-solid fa-star",
      cssClass: "tab-data"
		});
    tabs.primary.initial = "colony-upgrade-data";
    this.TABS = tabs;
  }
}
