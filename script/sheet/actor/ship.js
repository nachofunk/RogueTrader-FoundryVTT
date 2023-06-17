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

  async _onDropItemCreate(itemData) 
  {
    console.log(itemData);
    if (itemData.type === "shipWeapon")
    {
      itemData.system.side = this.side;
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
