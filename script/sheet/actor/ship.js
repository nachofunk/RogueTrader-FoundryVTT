import {prepareCommonRoll, prepareShipCombatRoll, preparePsychicPowerRoll} from "../../common/dialog.js";
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
    html.find(".roll-shipweapon").click(async ev => await this._prepareRollShipWeapon(ev));
  }

  async _prepareRollShipWeapon(event) {
    event.preventDefault();
    await this.selectTargetToken();
    if (this.selectedToken) {
      const div = $(event.currentTarget).parents(".item");
      const weapon = this.actor.items.get(div.data("itemId"));
      await prepareShipCombatRoll(
        RogueTraderUtil.createShipWeaponRollData(this.actor, weapon), 
        this.actor,
        this.selectedToken
      );
    }
  }

  async selectTargetToken() {
    // Minimize currently open character card
    this.minimize();
    this.selectedToken = null;
    ui.notifications.info("Choose a target on the board.");
    // Listen for the "mousedown" event on the board layer
    canvas.stage.on("mousedown", this.onCanvasClick.bind(this));
    // Wait for your destination to be selected
    while (!this.selectedToken) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    // Stop listening for the "mousedown" event after selecting a target
    canvas.stage.off("mousedown", this.onCanvasClick);
    // Bring back character cards and make a roll
    this.maximize();
    if (!this.selectedToken) {
      ui.notifications.error("No target selected on the board.");
    }
  }

  // Method to handle clicking on the board
  onCanvasClick(event) {
    // Get the clicked token (if any)
    const clickedToken = event.target;
    // Check that the clicked token does not belong to the player (ignore then)
    if (clickedToken && clickedToken.actor && clickedToken.actor.hasPlayerOwner) {
      return;
    }
    // Stop selecting a target if a token is clicked
    this.selectedToken = clickedToken;
  }

  async _onDrop(event)
  {
    this.side = event.target.dataset.shipside || "port";
    return await super._onDrop(event);
  }

  async _onDropActor(event, data)
  {
    console.log(event);
    console.log(data);
    console.log(this);
    const actorData = await this.getData();
    console.log(actorData);
    const droppedActor = game.actors.get(data.uuid.split(".")[1]);
    switch (event.target.dataset.crewrole) {
      case "captain":
        {
          actorData.system.namedCrew.lordCaptain = data.uuid.split(".")[1];
          break;
        }
      case "firstOfficer":
        {
          actorData.system.namedCrew.firstOfficer = data.uuid.split(".")[1];
          break;
        }
      case "enginseerPrime": 
        {
          actorData.system.namedCrew.enginseerPrime = data.uuid.split(".")[1];
          break;
        }
      case "highFactotum": 
        {
          actorData.system.namedCrew.highFactotum = data.uuid.split(".")[1];
          break;
        }
      case "masterArms": 
        {
          actorData.system.namedCrew.masterArms = data.uuid.split(".")[1];
          break;
        }
      case "masterHelmsman": 
        {
          actorData.system.namedCrew.masterHelmsman = data.uuid.split(".")[1];
          break;
        }
      case "masterEtherics": 
        {
          actorData.system.namedCrew.masterEtherics = data.uuid.split(".")[1];
          break;
        }
      case "masterChirurgeon":
        {
          actorData.system.namedCrew.masterChirurgeon = data.uuid.split(".")[1];
          break;
        }
      case "masterWhispers": 
        {
          actorData.system.namedCrew.masterWhispers = data.uuid.split(".")[1];
          break;
        }
      case "masterTelepathica":
        {
          actorData.system.namedCrew.masterTelepathica = data.uuid.split(".")[1];
          break;
        }
      case "masterWarp":
        {
          actorData.system.namedCrew.masterWarp = data.uuid.split(".")[1];
          break;
        }
      case "confessor":
        {
          actorData.system.namedCrew.confessor = data.uuid.split(".")[1];
          break;
        }
      case "drivesmaster":
        {
          actorData.system.namedCrew.drivesmaster = data.uuid.split(".")[1];
          break;
        }
      case "congregator":
        {
          actorData.system.namedCrew.congregator = data.uuid.split(".")[1];
          break;
        }
      case "bosun":
        {
          actorData.system.namedCrew.bosun = data.uuid.split(".")[1];
          break;
        }
      case "infernus":
        {
          actorData.system.namedCrew.infernus = data.uuid.split(".")[1];
          break;
        }
      case "twistcatcher":
        {
          actorData.system.namedCrew.twistcatcher = data.uuid.split(".")[1];
          break;
        }
      case "voxmaster":
        {
          actorData.system.namedCrew.voxmaster = data.uuid.split(".")[1];
          break;
        }
      case "purser":
        {
          actorData.system.namedCrew.purser = data.uuid.split(".")[1];
          break;
        }
      case "cartographer":
        {
          actorData.system.namedCrew.cartographer = data.uuid.split(".")[1];
          break;
        }
      case "steward":
        {
          actorData.system.namedCrew.steward = data.uuid.split(".")[1];
          break;
        }
      default:
        console.log(event.target.dataset.crewRole);
        break;
    }
    this._updateObject(event, actorData);
    console.log(droppedActor);
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
    ui.notifications.warn("Not enough weapon slots!");
  }

  sendEssentialComponentLimitReachedPopup()
  {
    ui.notifications.warn("That component is already installed!");
  }

  async _onDropItem(event, data)
  {
    const items = await super._onDropItem(event, data);
    let objectData = await this.getData();
    await this._updateObject(event, objectData);
    return items;
  }

  _getHeaderButtons() {
    let buttons = super._getHeaderButtons();
    buttons = [].concat(buttons);
    return buttons;
  }
}
