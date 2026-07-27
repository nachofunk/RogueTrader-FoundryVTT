import { RogueTraderActor, RogueTraderItem } from "../documents/_module.mjs";
import { initializeHandlebars } from "./handlebars.js";
import { migrateWorld } from "./migration.js";
import { prepareCommonRoll, prepareCombatRoll, preparePsychicPowerRoll, showAddCharacteristicModifierDialog } from "./dialog.js";
import { commonRoll, combatRoll } from "./roll.js";
import RtMacroUtil from "./macro.js";
import * as data from "../data/_module.mjs";
import * as sheet from "../sheet/_module.mjs";
import { ValidateSchemaVersion, UpdateWorldSchemaVersion, MigrateWorld } from "../../utils/migration.mjs";

// Import Helpers
import * as chat from "./chat.js";

Hooks.once("init", () => {
  console.log("INIT HOOK");
  CONFIG.Actor.documentClass = RogueTraderActor;
  CONFIG.Item.documentClass = RogueTraderItem;
  CONFIG.Combat.initiative = { formula: "@initiative.base + @initiative.bonus", decimals: 0 };
  CONFIG.fontDefinitions["Caslon Antique"] = {editor: true, fonts: []};
  CONFIG.HBS_SKIP_ESCAPE = true;
  registerSettings();
  game.rogueTrader = {
    testInit: {
      prepareCommonRoll,
      prepareCombatRoll,
      preparePsychicPowerRoll,
      showAddCharacteristicModifierDialog,
    },
    tests:{
      commonRoll,
      combatRoll
    }
  };
  game.macro = RtMacroUtil;

  // Assign data models & setup templates
  for (const [doc, models] of Object.entries(data)) {
    if (!CONST.ALL_DOCUMENT_TYPES.includes(doc)) continue;
    for (const modelCls of Object.values(models)) {
      if (modelCls.metadata?.type) CONFIG[doc].dataModels[modelCls.metadata.type] = modelCls;
      if (modelCls.metadata?.icon) CONFIG[doc].typeIcons[modelCls.metadata.type] = modelCls.metadata.icon;
      if (modelCls.metadata?.detailsPartial) templates.push(...modelCls.metadata.detailsPartial);
    }
  }

  // Register actor sheets
  const Actors = foundry.documents.collections.Actors;
  for (const SheetClass of Object.values(sheet.Actor)) {
    const meta = SheetClass.METADATA;
    if (!meta || !Array.isArray(meta.types) || meta.types.length === 0) continue;
    Actors.registerSheet("rogue-trader", SheetClass, {
      types: meta.types,
      makeDefault: meta.makeDefault ?? false
    });
  }
  // Register item sheets
  const Items = foundry.documents.collections.Items;
  for (const SheetClass of Object.values(sheet.Item)) {
    const meta = SheetClass.METADATA;
    if (!meta || !Array.isArray(meta.types) || meta.types.length === 0) continue;
    Items.registerSheet("rogue-trader", SheetClass, {
      types: meta.types,
      makeDefault: meta.makeDefault ?? false
    });
  }

  // Initialize handlebars templates (will use global loadTemplates)
  initializeHandlebars();
});

Hooks.once("setup", () => {
  
});

Hooks.once("ready", () => {
  const ChatMessageClass = CONFIG.ChatMessage.documentClass || game.messages.documentClass;
  if (ChatMessageClass && ChatMessageClass.prototype) {
    ChatMessageClass.prototype.getRollData = function() {
      return this.getFlag("rogue-trader", "rollData") 
    }
  }
});


/* -------------------------------------------- */
/*  Other Hooks                                 */
/* -------------------------------------------- */

Hooks.on("getChatMessageContextOptions", chat.addChatMessageContextOptions);
Hooks.on("getChatMessageContextOptions", chat.showRolls);
/**
 * Create a macro when dropping an entity on the hotbar
 * Item      - open roll dialog for item
 */
Hooks.on("hotbarDrop", (bar, data, slot) => {
  if (data.type == "Item" || data.type == "Actor")
  {
      RtMacroUtil.createMacro(data, slot)
      return false
  }
});

function registerSettings() {
  registerWorldVersion();
  registerColonyGrowthModifier();
  registerColonyCalamityTable();
  registerColonyFortuneTable();
  registerArmourAgilityCapToggle();
  registerSkillModifiersBonusToggle();
}

function registerWorldVersion() {
  game.settings.register("rogue-trader", "worldSchemaVersion", {
    name: "World Version",
    hint: "Used to automatically upgrade worlds data when the system is upgraded.",
    scope: "world",
    config: true,
    default: 0,
    type: Number
  });
}

function registerColonyGrowthModifier() {
  game.settings.register("rogue-trader", "colonyGrowthModifier", {
    name: "Colony Growth Modifier",
    hint: "Adjusts growth point requirements for colony to increase in size.",
    scope: "world",
    config: true,
    default: 0,
    type: Number
  });
}

function registerColonyCalamityTable() {
  game.settings.register("rogue-trader", "colonyCalamity", {
    name: "Colony Calamity Table",
    hint: "Used by colony sheet to handle Calamity events.",
    scope: "world",
    config: true,
    default: "",
    type: String
  });
}

function registerColonyFortuneTable() {
  game.settings.register("rogue-trader", "colonyFortune", {
    name: "Colony Fortune Table",
    hint: "Used by colony sheet to handle Fortune events.",
    scope: "world",
    config: true,
    default: "",
    type: String
  });
}

function registerArmourAgilityCapToggle() {
  game.settings.register("rogue-trader", "enableArmourAgilityCap", {
    name: "Enable Armour Agility Cap",
    hint: "When enabled, character's Agility is capped based on worn armour's Max Agi value.",
    scope: "world",
    config: true,
    default: true,
    type: Boolean,
  })
}

function registerSkillModifiersBonusToggle() {
  game.settings.register("rogue-trader", "skillModifiersAddValue", {
    name: "Direct Skill Modifiers",
    hint: "When enabled, skill modifiers from items will directly increase given skill value, same as skill advances. Otherwise they provide a roll modifier, subject to +/-60 modifier cap.",
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  })
}