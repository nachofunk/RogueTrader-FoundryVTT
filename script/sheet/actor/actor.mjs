import RogueTraderUtil from "../../common/util.mjs";
import BaseItemModel from "../../data/item/base-item.mjs";

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

// ActorSheetV2 provides DocumentSheetV2 base with automatic form submission
// for inputs with name="system.*" attributes
export default class RogueTraderSheet extends HandlebarsApplicationMixin(ActorSheetV2) {

  static DEFAULT_OPTIONS = {
    classes: ["rogue-trader", "sheet", "actor"],
    tag: "form",
    form: {
      handler: RogueTraderSheet._onSubmitForm,
      closeOnSubmit: false,
      submitOnChange: true
    },
    window: {
      resizable: true
    },
    position: {
      width: 720,
      height: 905
    },
    actions: {
      itemCreate: RogueTraderSheet.#itemCreate,
      itemEdit: RogueTraderSheet.#itemEdit,
      itemDelete: RogueTraderSheet.#itemDelete,
    }
  };

  /** @typedef {import("@client/applications/api/handlebars-application.mjs").HandlebarsTemplatePart} HandlebarsTemplatePart */
  /** @type {Record<string, HandlebarsTemplatePart>} */
  static PARTS = {
    sheet: {
      template: "systems/rogue-trader/template/sheet/actor/actor.html",
      scrollable: [''],
    }
  };

  static METADATA = { 
    types: [],
    makeDefault: true,
  }

  /**
   * Handle form submission for the actor sheet.
   * @this {RogueTraderSheet}
   * @param {SubmitEvent} event
   * @param {HTMLFormElement} form
   * @param {FormDataExtended} formData
   */
  static async _onSubmitForm(event, form, formData) {
    event.preventDefault();
    const data = formData.object;
    const itemUpdates = [];
    // Handle updating embedded items from actor sheet input fields
    for (const [key, value] of Object.entries(data)) {
      if (!key.startsWith("items.")) continue;
      // key: "items.<id>.system.cost"
      const [, id, ...pathParts] = key.split(".");
      const path = pathParts.join(".");   // "system.cost"
      const item = this.document.items.get(id);
      if (!item) continue;
      // Find or create update object for this item
      let update = itemUpdates.find(u => u._id === id);
      if (!update) {
        update = { _id: id };
        itemUpdates.push(update);
      }
      foundry.utils.setProperty(update, path, value);
      delete data[key];
    }
    await this.document.update(data);
    if (itemUpdates.length) {
      await this.document.updateEmbeddedDocuments("Item", itemUpdates);
    }
  }


  /**
   * Handle item creation.
   * @this {RogueTraderSheet}
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #itemCreate(event, target) {
    event.preventDefault();
    let header = target.dataset;
    let data = {
      name: `New ${game.i18n.localize(`TYPES.Item.${this.camelCase(header.type)}`)}`,
      type: header.type
    };
    this.document.createEmbeddedDocuments("Item", [data], { renderSheet: true });
  }

  /**
   * Handle item edit.
   * @this {RogueTraderSheet}
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #itemEdit(event, target) {
    event.preventDefault();
    const div = target.closest(".item");
    let item = this.document.items.get(div.dataset.itemId);
    item.sheet.render({ force: true });
  }

  /**
   * Handle item deletion.
   * @this {RogueTraderSheet}
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #itemDelete(event, target) {
    event.preventDefault();
    let itemId = target.dataset.itemId;
    if (!itemId)
      itemId = target.closest(".item")?.dataset.itemId;
    this.document.deleteEmbeddedDocuments("Item", [itemId]);
  }

  async _updateObject(event, formData) {
    const expanded = foundry.utils.expandObject(formData);
    const itemUpdates = [];
    if (expanded.items) {
      for (const [key, data] of Object.entries(expanded.items)) {
        const item = await fromUuid(key);
        if (!item || item.parent !== this.document) continue;
        itemUpdates.push({
          _id: item.id,
          ...data
        });
      }
      delete expanded.items;
    }
    if (itemUpdates.length) {
      await this.actor.updateEmbeddedDocuments("Item", itemUpdates);
    }
    const flattened = foundry.utils.flattenObject(expanded);
    return super._updateObject(event, flattened);
  }

  _getHeaderButtons() {
    let buttons = super._getHeaderButtons();
    if (this.document.isOwner) {
      buttons = [
        {
          label: game.i18n.localize("BUTTON.ROLL"),
          class: "custom-roll",
          icon: "fas fa-dice",
          onclick: async ev => await this._prepareCustomRoll()
        }
      ].concat(buttons);
    }
    return buttons;
  }

  camelCase(str) {
    // Using replace method with regEx
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index == 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }

  _onFocusIn(event) {
    event.currentTarget.select();
  }

  async _prepareCustomRoll() {
    const rollData = {
      name: "DIALOG.CUSTOM_ROLL",
      baseTarget: 50,
      modifier: 0,
      ownerId: this.document.id
    };
    await prepareCommonRoll(rollData);
  }

  _getCharacteristicOptions(selected) {
    const characteristics = [];
    for (let char of Object.values(this.document.characteristics)) {
      characteristics.push({
        label: char.label,
        target: char.total,
        selected: char.short === selected,
        unnatural: char.unnatural
      });
    }
    return characteristics;
  }

  _getMaxPsyRating() {
    let base = this.document.psy.rating;
    switch (this.document.psy.class) {
      case "bound":
        return base + 2;
      case "unbound":
        return base + 4;
      case "daemonic":
        return base + 3;
    }
  }

  _prepareTabs(key) {
    const tabs = super._prepareTabs(key);
    for (const [key, tab] of Object.entries(tabs)) {
      tab.partial = `systems/rogue-trader/template/sheet/actor/tab/${tab.id}.html`;
      tab.system = this.document.system;
      tab.items = this.document.items;
      tab.actor = this.document;
    }
    return tabs;
  }

  // This method prepares the context object passed to the Handlebars template
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.actor = this.document;
    context.system = this.document.system;
    context.items = this._constructItemLists();
    context.tabs = this._prepareTabs("primary");
    context.notesHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
      context.system.bio.notes,
      {
        secrets: context.document.isOwner,
        rollData: context.rollData,
        async: true,
        relativeTo: context.document,
      }
    );
    const optionsData = RogueTraderUtil.preapareDropdownOptions();

    // Merge options with any existing options and attach to context
    context.options = {
      ...(context.options || {}),
      ...optionsData
    };

    return context;
  }

  _constructItemLists() {
      let items = {}
      this._sortItemLists(items)
      return items;
  }

  _sortItemLists(items, visited = new WeakSet()) {
      if (visited.has(items)) return;
      visited.add(items);
      for (const key in items) {
          const value = items[key];
          if (Array.isArray(value)) {
              items[key] = value.sort((a, b) => a.sort - b.sort);
          }
          else if (value && !value?.system instanceof BaseItemModel) {
              this._sortItemLists(value, visited);
          }
      }
  }
}
