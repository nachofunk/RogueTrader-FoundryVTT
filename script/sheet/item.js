import {showAddCharacteristicModifierDialog, showAddSkillModifierDialog} from "../common/dialog.js";

export class RogueTraderItemSheet extends ItemSheet {
  activateListeners(html) {
    super.activateListeners(html);
    html.find("input").focusin(ev => this._onFocusIn(ev));
    html.find('.add-char-modifier').click(event => {
      const button = $(event.currentTarget);
      const modifierType = button.data('type');
      // Call a method to show a form or dialog to input new modifier details
      showAddCharacteristicModifierDialog(this, modifierType);
    });
    html.find('.add-skill-modifier').click(event => {
      const button = $(event.currentTarget);
      const modifierType = button.data('type');
      showAddSkillModifierDialog(this, modifierType);
    });
    html.find(".item-delete").click(ev => this._onModifierDelete(ev));

    const { modifiers } = this.object.system;
    for (const category in modifiers) {
      if (modifiers.hasOwnProperty(category)) {
        for (const key in modifiers[category]) {
          if (modifiers[category].hasOwnProperty(key)) {  
            // Determine which handler to use based on the category
            switch (category) {
              case 'characteristic':
                this._subscribeCharacteristicChange(html, category, key);
                break;
              case 'skill':
                // Attach skill-specific change handlers
                break;
              case 'other':
                // Attach other-specific change handlers
                break;
              // Add more cases as needed for additional categories
            }
          }
        }
      }
    }
  }

  _subscribeCharacteristicChange(html, category, key) {
    const charModInputField = html.find(`input[id='modifier-char-value-${key}']`);
    const unnaturalModInputField = html.find(`input[id='modifier-unnatural-value-${key}']`);
    charModInputField.change(() => this._onCharacteristicModifierChange(category, key, charModInputField, unnaturalModInputField));
    unnaturalModInputField.change(() => this._onCharacteristicModifierChange(category, key, charModInputField, unnaturalModInputField));
  }
  
  _onCharacteristicModifierChange(category, key, charValueField, unnaturalValueField) {
    const charValue = parseInt(charValueField.val(), 10);
    const unnaturalValue = parseInt(unnaturalValueField.val(), 10);
    const modifierData = {
      name: key,
      characteristicModifier: charValue,
      unnaturalModifier: unnaturalValue
    };
    this.addModifier(category, key, modifierData);
  }
  
  async getData(options) {
    let data = super.getData(options);
        // Item HTML enrichment
    data.item.descriptionHTML = await TextEditor.enrichHTML(
      data.item.description,
      {
        secrets: data.item.isOwner,
        rollData: data.rollData,
        async: true,
        relativeTo: this.item,
      }
    );
    // Component HTML enrichment
    data.data.system.essentialComponentsHTML = await TextEditor.enrichHTML(
      data.data.system.essentialComponents,
      {
        secrets: data.item.isOwner,
        rollData: data.rollData,
        async: true,
        relativeTo: this.item,
      }
    );
    data.data.system.supplementalComponentsHTML = await TextEditor.enrichHTML(
      data.data.system.supplementalComponents,
      {
        secrets: data.item.isOwner,
        rollData: data.rollData,
        async: true,
        relativeTo: this.item,
      }
    );
    data.data.system.complicationsHTML = await TextEditor.enrichHTML(
      data.data.system.complications,
      {
        secrets: data.item.isOwner,
        rollData: data.rollData,
        async: true,
        relativeTo: this.item,
      }
    );
    data.data.system.pastHistoryHTML = await TextEditor.enrichHTML(
      data.data.system.pastHistory,
      {
        secrets: data.item.isOwner,
        rollData: data.rollData,
        async: true,
        relativeTo: this.item,
      }
    );
    data.data.system.weaponsHTML = await TextEditor.enrichHTML(
      data.data.system.weapons,
      {
        secrets: data.item.isOwner,
        rollData: data.rollData,
        async: true,
        relativeTo: this.item,
      }
    );
    return {
      item: data.item,
      system: data.data.system
    };
  }

  _getHeaderButtons() {
    let buttons = super._getHeaderButtons();
    buttons = [
      {
        label: game.i18n.localize("BUTTON.POST_ITEM"),
        class: "item-post",
        icon: "fas fa-comment",
        onclick: ev => this.item.sendToChat()
      }
    ].concat(buttons);
    return buttons;
  }

  _onFocusIn(event) {
    $(event.currentTarget).select();
  }

  /**
   * Adds a new modifier to the item.
   * @param {string} modifierType - The type of the modifier ('characteristic', 'skill', 'other').
   * @param {string} attributeName - The name of the affected attribute.
   * @param {number} modifierData - The value of the modifier to add.
   */
  addModifier(modifierType, attributeName, modifierData) {
    // Ensure the modifier type is valid
    if (!['characteristic', 'skill', 'other'].includes(modifierType)) {
      console.error('Invalid modifier type. Must be "characteristic", "skill", or "other".');
      return;
    }
    // Directly access the item's data
    const itemData = this.object.system;
    // Initialize the modifiers object if it doesn't exist
    if (!itemData.modifiers) {
      itemData.modifiers = { characteristic: {}, skill: {}, other: {} };
    }
    // Set the new modifier value
    itemData.modifiers[modifierType][attributeName] = modifierData;
    // Update the item with the new modifier
    this.object.update({ 'system.modifiers': itemData.modifiers }).then(() => {
      console.log(`Modifier added: ${modifierType} - ${attributeName}: ${modifierData}`);
    }).catch(err => {
      console.error('Error updating item with new modifier:', err);
    });
  }

  _onModifierDelete(event) { 
    event.preventDefault();
    const div = $(event.currentTarget).parents(".modifier-item");
    const modId = div.data("modifierId");
    const modKey = div.data("modifierKey");
    let modifiers = this.object.system.modifiers;
    delete modifiers[modId][modKey];
    this.object.update({ 'system.modifiers': modifiers}).then(() => {
      console.log(`Modifier removed: ${modId} - ${modKey}`);
    }).catch(err => {
      console.error('Error updating item with deleted modifier:', err);
    });
    div.slideUp(200, () => this.render(false));
  }
}
