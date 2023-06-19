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
    const actorData = await this.getData();
    if (itemData.type === "shipWeapon") {
      itemData.system.side = this.side;
      return await this.validateShipWeapon(actorData, itemData);
    }
    else if (itemData.type === "shipComponent") {
      return await this.validateShipComponent(actorData, itemData);
    } 
    else {
      return await super._onDropItemCreate(itemData);
    }
  }

  async validateShipComponent(actorData, itemData)
  {
    console.log("validating ship component");
    console.log(itemData);
    console.log(actorData);
    const componentClasses = ["voidEngine", "warpEngine", "gellarField", "voidShield", "bridge", "lifeSupport", "crewQuarters", "augurArrays"];
    for (const componentClass of componentClasses) {
      if (itemData.system.class === componentClass && actorData.items[componentClass] !== undefined) {
        this.sendEssentialComponentLimitReachedPopup();
        return;
      }
    }

    return await super._onDropItemCreate(itemData);
  }

  async validateShipWeapon(actorData, itemData) {
    const weaponArrays = {
      port: actorData.items.portWeapons,
      star: actorData.items.starWeapons,
      dorsal: actorData.items.dorsalWeapons,
      keel: actorData.items.keelWeapons,
      prow: actorData.items.prowWeapons
    };
  
    const weaponCapacity = actorData.system.weaponCapacity[this.side];
    const weapons = weaponArrays[this.side];
  
    if (weapons.length >= weaponCapacity) {
      this.sendWeaponLimitReachedPopup();
      return;
    }
  
    return await super._onDropItemCreate(itemData);
  }

  sendWeaponLimitReachedPopup()
  {
    ui.notifications.warn("FOO");
  }

  sendEssentialComponentLimitReachedPopup()
  {
    ui.notifications.warn("BAR");
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
