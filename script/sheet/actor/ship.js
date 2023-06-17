import {prepareCommonRoll, prepareCombatRoll, preparePsychicPowerRoll} from "../../common/dialog.js";
import RogueTraderUtil from "../../common/util.js";
import { RogueTraderSheet } from "./actor.js";

export class ShipSheet extends RogueTraderSheet {
  side = "";

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["rogue-trader", "sheet", "actor"],
      template: "systems/rogue-trader/template/sheet/actor/ship.html",
      width: 775,
      height: 835,
      resizable: true,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "stats"
        }
      ]
    });
  }

  activateListeners(html) {
    super.activateListeners(html);
  }

  async _onDrop(event)
  {
    this.side = event.target.dataset.shipside || "port";
    return await super._onDrop(event);
  }

  async _onDropItemCreate(itemData) {
    console.log(itemData);
    if (itemData.type === "shipWeapon") {
      const actorData = await this.getData();
      itemData.system.side = this.side;
      console.log(actorData);
      switch (this.side) {
        case "port": {
          if (actorData.items.portWeapons.length >= actorData.system.weaponCapacity.port) {
            return;
          }
          break;
        }
        case "star": {
          if (actorData.items.starWeapons.length >= actorData.system.weaponCapacity.starboard) {
            return;
          }
          break;
        }
        case "dorsal": {
          if (actorData.items.dorsalWeapons.length >= actorData.system.weaponCapacity.dorsal) {
            return;
          }
          break;
        }
        case "keel": {
          if (actorData.items.keelWeapons.length >= actorData.system.weaponCapacity.keel) {
            return;
          }
          break;
        }
        case "prow": {
          if (actorData.items.prowWeapons.length >= actorData.system.weaponCapacity.prow) {
            return;
          }
          break;
        }
      }
    }
    return await super._onDropItemCreate(itemData);
  }

  async _onDropItem(event, data)
  {
    const items = await super._onDropItem(event, data);
    let objectData = await this.getData();
    console.log(objectData);
    await this._updateObject(event, objectData);
    return items;
  }

  _getHeaderButtons() {
    let buttons = super._getHeaderButtons();
    buttons = [].concat(buttons);
    return buttons;
  }
}
