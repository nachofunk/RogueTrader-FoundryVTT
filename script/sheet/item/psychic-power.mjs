import CharacterItemSheet from "./character-item.mjs";

export default class PsychicPowerSheet extends CharacterItemSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property
  static DEFAULT_OPTIONS = {
    classes: ["rogue-trader", "sheet", "psychic-power"],
  };

  static METADATA = {
    types: ["psychicPower"],
    makeDefault: true,
  }

  static {
    const tabs = foundry.utils.deepClone(super.TABS);
    tabs.primary.tabs.unshift({
      id: "psychic-power-data",
      group: "primary",
      label: "TAB.DATA",
      icon: "fa-solid fa-chart-bar",
      cssClass: "tab-data"
    },
    {
      id: "psychic-power-effect",
      group: "primary",
      label: "TAB.EFFECT",
      icon: "fa-solid fa-chart-bar",
      cssClass: "tab-notes"
    });
    tabs.primary.initial = "psychic-power-data";
    this.TABS = tabs;
  }

  /** @inheritdoc */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.effectHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
			context.document.effect,
			{
				secrets: context.document.isOwner,
				rollData: context.rollData,
				async: true,
				relativeTo: this.document,
			}
		);
    return context;
  }
}
