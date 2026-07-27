import { prepareCommonRoll, prepareShipCombatRoll, prepareCrewSkillRoll } from "../../common/dialog.js";
import RogueTraderUtil from "../../common/util.mjs";
import RogueTraderSheet from "./actor.mjs";
import { CharacterModel } from "../../data/actor/_module.mjs";
import CrewRoles from "../../data/enums/crew-roles.mjs";

export default class VoidshipSheet extends RogueTraderSheet {
  side = "";

  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property
  static DEFAULT_OPTIONS = {
    classes: ["rogue-trader", "sheet", "actor", "voidship"],
    position: {
      width: 775,
      height: 835
    },
    actions: {
      rollShipWeapon: VoidshipSheet.#rollShipWeapon,
      rollCrewSkill: VoidshipSheet.#rollCrewSkill,
      removeCrewMember: VoidshipSheet.#removeCrewMember,
    }
  };

  static METADATA = {
    types: ["ship"],
    makeDefault: true,
  }


  // v13 MIGRATION: V2 Tab System Definition
  // TABS must have 'tabs' as an ARRAY (not object) with 'initial' property
  static TABS = {
    primary: {
      tabs: [
        {
          id: "ship-data",
          group: "primary",
          label: "TAB.DATA",
          icon: "fa-solid fa-database",
          cssClass: "flex tab-data"
        },
        {
          id: "ship-combat",
          group: "primary",
          label: "TAB.COMBAT",
          icon: "fa-solid fa-shield",
          cssClass: "flex tab-combat"
        },
        {
          id: "ship-crew",
          group: "primary",
          label: "TAB.CREW",
          icon: "fa-solid fa-people-group",
          cssClass: "flex tab-crew"
        },
        {
          id: "ship-essential",
          group: "primary",
          label: "TAB.ESSENTIAL_COMPONENTS",
          icon: "fa-solid fa-cogs",
          cssClass: "flex tab-essential"
        },
        {
          id: "ship-supplemental",
          group: "primary",
          label: "TAB.SUPPLEMENTAL_COMPONENTS",
          icon: "fa-solid fa-wrench",
          cssClass: "flex tab-supplemental"
        },
        {
          id: "ship-weapons",
          group: "primary",
          label: "TAB.WEAPONS",
          icon: "fa-solid fa-gun",
          cssClass: "flex tab-weapons"
        },
        {
          id: "ship-complications",
          group: "primary",
          label: "TAB.COMPLICATIONS",
          icon: "fa-solid fa-exclamation-triangle",
          cssClass: "flex tab-complications"
        },
        {
          id: "ship-notes",
          group: "primary",
          label: "TAB.NOTES",
          icon: "fa-solid fa-note-sticky",
          cssClass: "flex tab-notes"
        }
      ],
      initial: "ship-data"
    }
  };

  // v13 MIGRATION: PARTS defines the template structure
  // DocumentSheetV2 automatically renders PARTS and handles form submission
  static PARTS = {
    sheet: {
      template: "systems/rogue-trader/template/sheet/actor/voidship.html",
      classes: ['voidship-content', 'actor-sheet'],
      scrollable: [''],
    }
  };

  /**
   * Handle ship weapon roll.
   * @this {VoidshipSheet}
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #rollShipWeapon(event, target) {
    event.preventDefault();
    const uuid = target.dataset.itemUuid;
    if (!foundry.utils.parseUuid(uuid)) {
      ui.notifications.error(`Error when generating roll! Invalid item UUID: ${uuid}`);
      return;
    }
    const weapon = await fromUuid(uuid);
    await prepareShipCombatRoll(
      RogueTraderUtil.createShipWeaponRollData(this.document, weapon), 
      this.document
    );
    target.blur();
  }

  /**
   * Handle ship weapon roll.
   * @this {VoidshipSheet}
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #rollCrewSkill(event, target) {
    event.preventDefault();
    await prepareCrewSkillRoll(
      RogueTraderUtil.createCrewSkillRollData(this.document),
      this.document
    );
    target.blur();
  }

  /**
   * Handle ship weapon roll.
   * @this {VoidshipSheet}
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #removeCrewMember(event, target) {
    event.preventDefault();
    const actor = this.document;
    const roleToRemove = target.dataset.crewrole;
    if (!roleToRemove && !CrewRoles.KEYS[roleToRemove]) {
      console.error(`Tried to remove invalid role! ${roleToRemove}`);
      return;
    }
    await actor.update({[
      `system.crew.namedCrew.${roleToRemove}.actor`]: null
    });
  }

  async selectTargetToken() {
    this.minimize();
    this.selectedToken = null;
    ui.notifications.info("Choose a target on the board.");
    Hooks.on("targetToken", this.onTokenSelected.bind(this));
    while (!this.selectedToken) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    Hooks.off("targetToken", this.onTokenSelected);
    console.log("selected token");
    console.log(this.selectedToken);
    this.maximize();
    if (!this.selectedToken) {
      ui.notifications.error("No target selected on the board.");
    }
  }

  onTokenSelected(user, token, targeted) {
    if (targeted)
      this.selectedToken = token;
  }

  async _onDrop(event) {
    this.side = event.target.dataset.shipside || "port";
    return await super._onDrop(event);
  }

  async _onDropActor(event, data) {
    if (!foundry.utils.parseUuid(data.uuid)) {
      ui.notifications.error("Dropped actor has invalid UUID!");
    }
    const actor = await fromUuid(data.uuid);
    if (actor === this.document) return;
    if (!(actor.system instanceof CharacterModel)) return;
    const role = event.target.dataset.crewrole;
    if (!role) {
      console.warn("Dropped foreign actor on area with no crew role.");
      return;
    }
    await this.actor.update({
      [`system.crew.namedCrew.${role}.actor`]: actor
    });
    event.preventDefault();
  }


  async _onDropItemCreate(itemData) {
    const context = await this._prepareContext();
    if (itemData.type === "shipWeapon") {
      itemData.system.side = this.side;
      return await this.validateShipWeapon(context, itemData);
    }
    else if (itemData.type === "shipComponent") {
      return await this.validateShipComponent(context, itemData);
    } 
    else {
      return await super._onDropItemCreate(itemData);
    }
  }

  async validateShipComponent(context, itemData) {
    const componentClasses = ["voidEngine", "warpEngine", "gellarField", "voidShield", "bridge", "lifeSupport", "crewQuarters", "augurArrays"];
    for (const componentClass of componentClasses) {
      if (itemData.system.class === componentClass && context.items[componentClass] !== undefined) {
        this.sendEssentialComponentLimitReachedPopup();
        return;
      }
    }
    return await super._onDropItemCreate(itemData);
  }

  async validateShipWeapon(context, itemData) {
    const weaponArrays = {
      port: context.items.portWeapons,
      star: context.items.starWeapons,
      dorsal: context.items.dorsalWeapons,
      keel: context.items.keelWeapons,
      prow: context.items.prowWeapons
    };
    const weaponCapacity = context.system.weaponCapacity[this.side];
    const weapons = weaponArrays[this.side];
    if (weapons.length >= weaponCapacity) {
      this.sendWeaponLimitReachedPopup();
      return;
    }
    return await super._onDropItemCreate(itemData);
  }

  sendWeaponLimitReachedPopup() {
    ui.notifications.warn("Not enough weapon slots!");
  }

  sendEssentialComponentLimitReachedPopup() {
    ui.notifications.warn("That component is already installed!");
  }

  async _onDropItem(event, data) {
    const items = await super._onDropItem(event, data);
    let context = await this._prepareContext();
    await this.document.update(context.system);
    return items;
  }

  // v13 MIGRATION: appv2 uses _prepareContext() instead of getData()
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.items = this._constructItemLists();
    context.system.pastHistoryHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
      context.system.pastHistory,
      {
        secrets: context.document.isOwner,
        rollData: context.rollData,
        async: true,
        relativeTo: context.document,
      }
    );
    context.system.complicationsHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
      context.system.complications,
      {
        secrets: context.document.isOwner,
        rollData: context.rollData,
        async: true,
        relativeTo: context.document,
      }
    );

    return context;
  }

  _constructItemLists() {
      const items = super._constructItemLists();
      const actorData = this.document.system;
      let itemTypes = this.document.itemTypes;
      items.shipWeapons = itemTypes["shipWeapon"];
      items.portWeapons = [];
      items.starWeapons = [];
      items.dorsalWeapons = [];
      items.keelWeapons = [];
      items.prowWeapons = [];
      items.shipWeapons.forEach(wp => {
        items[`${wp.system.side}Weapons`].push(wp)
      });
      items.shipComponents = itemTypes["shipComponent"];
      for (const [key, value] of Object.entries(actorData.components.essential)) {
        items[key] = value.item;
      }
      const componentClasses = ["voidEngine", "warpEngine", "gellarField", "voidShield", "bridge", "lifeSupport", "crewQuarters", "augurArrays"];
      const itemsByClass = {};
      for (const componentClass of componentClasses) {
        itemsByClass[componentClass] = items.shipComponents.find(cp => cp.system.class === componentClass);
      }
      items.supplemental = actorData.components.supplemental;  
      this._sortItemLists(items)
      return items;  
  }
}
