import RogueTraderItemSheet from "./item.mjs";
import * as modifiers from "../../data/item/fields/_module.mjs";

export default class CharacterItemSheet extends RogueTraderItemSheet {
  static DEFAULT_OPTIONS = {
    actions: {
      addModifier: CharacterItemSheet.#addModifier,
      deleteModifier: CharacterItemSheet.#deleteModifier,
    }
  }

  static {
    const tabs = foundry.utils.deepClone(super.TABS);
    tabs.primary.tabs.push({
      id: "modifiers",
      group: "primary",
      label: "TAB.MODIFIERS",
      icon: "fa-solid fa-star",
      cssClass: "tab-abilities"
		});
    this.TABS = tabs;
  }

  /**
   * Handle adding a characteristic modifier.
   * @this {CharacterItemSheet}
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #addModifier(event, target) {
    event.preventDefault();
    const itemID = target.dataset.itemId;
    const modifierType = target.dataset.type;
    const className = target.dataset.class;
    const item = await fromUuid(itemID);
    const ModifierClass = modifiers[className];
    if (!ModifierClass) {
      ui.notifications.error(`Invalid modifier class name: ${className}`);
      return;
    }
    if (!item) {
      ui.notifications.error(`Invalid parent UUID: ${itemID}`);
      return;
    }
    const mods = item.system.modifiers[modifierType];
    if (!mods) {
      ui.notifications.error(`Invalid modifier type: ${modifierType}`);
    }
    mods.push(ModifierClass.DEFAULT_OBJECT);
    await item.update({ "system.modifiers": mods });
    item.sheet.render(true);
  }

  /**
   * Handle deleting a modifier.
   * @this {CharacterItemSheet}
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #deleteModifier(event, target) {
    event.preventDefault();
    const itemID = target.dataset.itemId;
    const index = parseInt(target.dataset.index, 10);
    const modifierType = target.dataset.type;
    const item = await fromUuid(itemID);
    if (!item) {
      ui.notifications.error(`Invalid parent UUID: ${itemID}`);
      return;
    }
    const mods = item.system.modifiers[modifierType];
    if (!mods) {
      ui.notifications.error(`Invalid modifier type: ${modifierType}`);
      return;
    }
    if (!Number.isInteger(index) || index < 0 || index >= mods.length) {
      ui.notifications.error(`Invalid modifier index: ${target.dataset.index}`);
      return;
    }
    mods.splice(index, 1);
    await item.update({ [`system.modifiers.${modifierType}`]: mods });
    item.sheet.render(true);
  }


  /** @inheritdoc */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.modifiers ??= {};
    context.modifiers.characteristic = this.document.system.modifiers.characteristic;
    context.modifiers.skill = this.document.system.modifiers.skill;
    return context;
  }
}