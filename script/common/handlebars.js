export const initializeHandlebars = () => {
  registerHandlebarsHelpers();
  preloadHandlebarsTemplates();
  // const original = Handlebars.helpers.selectOptions;
  // Handlebars.unregisterHelper("selectOptions");
  // Handlebars.registerHelper("selectOptions", function(...args) {
  // return new Handlebars.SafeString(original.apply(this, args));
// });
};

/**
 * Define a set of template paths to pre-load. Pre-loaded templates are compiled and cached for fast access when
 * rendering. These paths will also be available as Handlebars partials by using the file name.
 * @returns {Promise}
 */
function preloadHandlebarsTemplates() {
  const templatePaths = [
    "systems/rogue-trader/template/sheet/actor/explorer.html",
    "systems/rogue-trader/template/sheet/actor/npc.html",
    "systems/rogue-trader/template/sheet/actor/limited-sheet.html",
    "systems/rogue-trader/template/sheet/actor/voidship.html",
    "systems/rogue-trader/template/sheet/actor/colony.html",

    "systems/rogue-trader/template/sheet/actor/tab/abilities.html",
    "systems/rogue-trader/template/sheet/actor/tab/combat.html",
    "systems/rogue-trader/template/sheet/actor/tab/gear.html",
    "systems/rogue-trader/template/sheet/actor/tab/notes.html",
    "systems/rogue-trader/template/sheet/actor/tab/npc-notes.html",
    "systems/rogue-trader/template/sheet/actor/tab/npc-stats.html",
    "systems/rogue-trader/template/sheet/actor/tab/progression.html",
    "systems/rogue-trader/template/sheet/actor/tab/psychic-powers.html",
    "systems/rogue-trader/template/sheet/actor/tab/stats.html",
    "systems/rogue-trader/template/sheet/actor/tab/ship-complications.html",
    "systems/rogue-trader/template/sheet/actor/tab/ship-combat.html",
    "systems/rogue-trader/template/sheet/actor/tab/ship-crew.html",
    "systems/rogue-trader/template/sheet/actor/tab/ship-essential.html",
    "systems/rogue-trader/template/sheet/actor/tab/ship-supplemental.html",
    "systems/rogue-trader/template/sheet/actor/tab/ship-data.html",
    "systems/rogue-trader/template/sheet/actor/tab/ship-notes.html",
    "systems/rogue-trader/template/sheet/actor/tab/ship-weapons.html",
    "systems/rogue-trader/template/sheet/actor/tab/colony-core.html",
    "systems/rogue-trader/template/sheet/actor/tab/colony-upgrades.html",
    "systems/rogue-trader/template/sheet/actor/tab/colony-notes.html",

    "systems/rogue-trader/template/sheet/characteristics/information.html",
    "systems/rogue-trader/template/sheet/characteristics/left.html",
    "systems/rogue-trader/template/sheet/characteristics/name.html",
    "systems/rogue-trader/template/sheet/characteristics/right.html",
    "systems/rogue-trader/template/sheet/characteristics/total.html",
    "systems/rogue-trader/template/chat/item.html",
    "systems/rogue-trader/template/chat/roll.html",
    "systems/rogue-trader/template/chat/critical.html",
    "systems/rogue-trader/template/chat/colony-growth.html",
    "systems/rogue-trader/template/chat/colony-no-event.html",
    "systems/rogue-trader/template/dialog/common-roll.html",
    "systems/rogue-trader/template/dialog/combat-roll.html",
    "systems/rogue-trader/template/dialog/add-characteristic-modifier.html",
    "systems/rogue-trader/template/dialog/add-skill-modifier.html",
    "systems/rogue-trader/template/dialog/psychic-power-roll.html",

    // ITEM PARTS
    "systems/rogue-trader/template/sheet/item/item.html",
    "systems/rogue-trader/template/sheet/item/tab/ammunition-data.html",
    "systems/rogue-trader/template/sheet/item/tab/armour-data.html",
    "systems/rogue-trader/template/sheet/item/tab/cybernetic-data.html",
    "systems/rogue-trader/template/sheet/item/tab/drug-data.html",
    "systems/rogue-trader/template/sheet/item/tab/force-field-data.html",
    "systems/rogue-trader/template/sheet/item/tab/gear-data.html",
    "systems/rogue-trader/template/sheet/item/tab/modifiers.html",
    "systems/rogue-trader/template/sheet/item/tab/notes.html",
    "systems/rogue-trader/template/sheet/item/tab/psychic-power-data.html",
    "systems/rogue-trader/template/sheet/item/tab/psychic-power-effect.html",
    "systems/rogue-trader/template/sheet/item/tab/special-ability-data.html",
    "systems/rogue-trader/template/sheet/item/tab/talent-data.html",
    "systems/rogue-trader/template/sheet/item/tab/tool-data.html",
    "systems/rogue-trader/template/sheet/item/tab/trait-data.html",
    "systems/rogue-trader/template/sheet/item/tab/weapon-data.html",
    "systems/rogue-trader/template/sheet/item/tab/weapon-modification-data.html",
    "systems/rogue-trader/template/sheet/item/tab/ship-weapon-data.html",
    "systems/rogue-trader/template/sheet/item/tab/ship-component-data.html",
    "systems/rogue-trader/template/sheet/item/tab/colony-event-data.html",
    "systems/rogue-trader/template/sheet/item/tab/colony-event-effect.html",
    "systems/rogue-trader/template/sheet/item/tab/colony-upgrade-data.html",
    "systems/rogue-trader/template/sheet/item/tab/colony-resource-data.html",
  ];
  // v13: Use global loadTemplates() function instead of foundry.utils.loadTemplates
  return foundry.applications.handlebars.loadTemplates(templatePaths);
}

/**
 * Add custom Handlerbars helpers.
 */
function registerHandlebarsHelpers() {
  Handlebars.registerHelper("removeMarkup", function(text) {
    const markup = /<(.*?)>/gi;
    return text.replace(markup, "");
  });

  Handlebars.registerHelper("enrich", function(string) {
    return foundry.applications.ux.TextEditor.implementation.enrichHTML(string, {async: false});
  });

  Handlebars.registerHelper("damageTypeLong", function(damageType) {
    damageType = (damageType || "i").toLowerCase();
    switch (damageType) {
      case "e":
        return game.i18n.localize("DAMAGE_TYPE.ENERGY");
      case "i":
        return game.i18n.localize("DAMAGE_TYPE.IMPACT");
      case "r":
        return game.i18n.localize("DAMAGE_TYPE.RENDING");
      case "x":
        return game.i18n.localize("DAMAGE_TYPE.EXPLOSIVE");
      default:
        return game.i18n.localize("DAMAGE_TYPE.IMPACT");
    }
  });


  Handlebars.registerHelper("damageTypeShort", function(damageType) {
    switch (damageType) {
      case "energy":
        return game.i18n.localize("DAMAGE_TYPE.ENERGY_SHORT");
      case "impact":
        return game.i18n.localize("DAMAGE_TYPE.IMPACT_SHORT");
      case "rending":
        return game.i18n.localize("DAMAGE_TYPE.RENDING_SHORT");
      case "explosive":
        return game.i18n.localize("DAMAGE_TYPE.EXPLOSIVE_SHORT");
      default:
        return game.i18n.localize("DAMAGE_TYPE.IMPACT_SHORT");
    }
  });

  Handlebars.registerHelper('log', function(context) {
    console.log(context);
  });

  Handlebars.registerHelper('getCharacteristics', function() {
    const characteristics = {
      weaponSkill: "CHARACTERISTIC.WEAPON_SKILL",
      ballisticSkill: "CHARACTERISTIC.BALLISTIC_SKILL",
      strength: "CHARACTERISTIC.STRENGTH",
      toughness: "CHARACTERISTIC.TOUGHNESS",
      agility: "CHARACTERISTIC.AGILITY",
      intelligence: "CHARACTERISTIC.INTELLIGENCE",
      perception: "CHARACTERISTIC.PERCEPTION",
      willpower: "CHARACTERISTIC.WILLPOWER",
      fellowship: "CHARACTERISTIC.FELLOWSHIP"
    };
    return characteristics;
  });

  Handlebars.registerHelper('getSkills', function() {
    // v13: game.system.model.Actor is no longer available
    // Build skills from CONFIG or template configuration
    let skillSchema = {};
    
    // Try to get skills from system config
    if (CONFIG.rogue && CONFIG.rogue.skills) {
      skillSchema = CONFIG.rogue.skills;
    } else if (game.system.documentTypes && game.system.documentTypes.Actor) {
      // Fallback: build complete skills object from template
      skillSchema = {
        advAg: {
          label: "SKILL.ADVANCED-AG",
          isSpecialist: true,
          specialities: {
            acrobatics: { label: "SKILL.ACROBATICS" },
            security: { label: "SKILL.SECURITY" },
            shadowing: { label: "SKILL.SHADOWING" },
            sleightOfHand: { label: "SKILL.SLEIGHT_OF_HAND" }
          }
        },
        advInt: {
          label: "SKILL.ADVANCED-INT",
          isSpecialist: true,
          specialities: {
            chemUse: { label: "SKILL.CHEM-USE" },
            demolition: { label: "SKILL.DEMOLITION" },
            evaluate: { label: "SKILL.EVALUATE" },
            gamble: { label: "SKILL.GAMBLE" },
            literacy: { label: "SKILL.LITERACY" },
            medicae: { label: "SKILL.MEDICAE" },
            survival: { label: "SKILL.SURVIVAL" },
            tracking: { label: "SKILL.TRACKING" },
            wrangler: { label: "SKILL.WRANGLER" }
          }
        },
        advPer: {
          label: "SKILL.ADVANCED-PER",
          isSpecialist: true,
          specialities: {
            psyniscience: { label: "SKILL.PSYNISCIENCE" }
          }
        },
        advWP: {
          label: "SKILL.ADVANCED-WP",
          isSpecialist: true,
          specialities: {
            interrogation: { label: "SKILL.INTERROGATION" },
            invocation: { label: "SKILL.INVOCATION" }
          }
        },
        advFel: {
          label: "SKILL.ADVANCED-FEL",
          isSpecialist: true,
          specialities: {
            blather: { label: "SKILL.BLATHER" },
            charm: { label: "SKILL.CHARM" },
            commerce: { label: "SKILL.COMMERCE" }
          }
        },
        awareness: { label: "SKILL.AWARENESS", isSpecialist: false },
        barter: { label: "SKILL.BARTER", isSpecialist: false },
        carouse: { label: "SKILL.CAROUSE", isSpecialist: false },
        ciphers: {
          label: "SKILL.CIPHERS",
          isSpecialist: true,
          specialities: {
            rogueTraders: { label: "SKILL.ROGUE-TRADERS" },
            mercenaryCant: { label: "SKILL.MERCENARY-CANT" },
            nobiliteFamily: { label: "SKILL.NOBILITE-FAMILY" },
            astropathSign: { label: "SKILL.ASTROPATH-SIGN" },
            underworld: { label: "SKILL.UNDERWORLD" }
          }
        },
        climb: { label: "SKILL.CLIMB", isSpecialist: false },
        command: { label: "SKILL.COMMAND", isSpecialist: false },
        commonLore: {
          label: "SKILL.COMMON_LORE",
          isSpecialist: true,
          specialities: {
            adeptaSororitas: { label: "SKILL.ADEPTA-SORORITAS" },
            adeptusArbites: { label: "SKILL.ADEPTUS-ARBITES" },
            adeptusAstartes: { label: "SKILL.ADEPTUS-ASTARTES" },
            adeptusAstraTelepathica: { label: "SKILL.ADEPTUS-ASTRATELEPATHICA" },
            adeptusMechanicus: { label: "SKILL.ADEPTUS-MECHANICUS" },
            administratum: { label: "SKILL.ADMINISTRATUM" },
            ecclesiarchy: { label: "SKILL.ECCLESIARCHY" },
            imperialCreed: { label: "SKILL.IMPERIAL-CREED" },
            imperialGuard: { label: "SKILL.IMPERIAL-GUARD" },
            imperialNavy: { label: "SKILL.IMPERIAL-NAVY" },
            imperium: { label: "SKILL.IMPERIUM" },
            koronousExpanse: { label: "SKILL.KORONOUS-EXPANSE" },
            machineCult: { label: "SKILL.MACHINE-CULT" },
            navisNobilite: { label: "SKILL.NAVIS-NOBILITE" },
            rogueTraders: { label: "SKILL.ROGUE-TRADERS" },
            tech: { label: "SKILL.TECH" },
            war: { label: "SKILL.WAR" },
            underworld: { label: "SKILL.UNDERWORLD" }
          }
        },
        deceive: { label: "SKILL.DECEIVE", isSpecialist: false },
        disguise: { label: "SKILL.DISGUISE", isSpecialist: false },
        dodge: { label: "SKILL.DODGE", isSpecialist: false },
        drive: {
          label: "SKILL.DRIVE",
          isSpecialist: true,
          specialities: {
            groundVehicle: { label: "SKILL.GROUND-VEHICLE" },
            skimmerHover: { label: "SKILL.SKIMMER-HOVER" },
            walker: { label: "SKILL.WALKER" }
          }
        },
        forbiddenLore: {
          label: "SKILL.FORBIDDEN_LORE",
          isSpecialist: true,
          specialities: {
            adeptusMechanicus: { label: "SKILL.ADEPTUS-MECHANICUS" },
            archaeotech: { label: "SKILL.ARCHAEOTECH" },
            daemonology: { label: "SKILL.DAEMONOLOGY" },
            heresy: { label: "SKILL.HERESY" },
            inquisition: { label: "SKILL.INQUISITION" },
            mutants: { label: "SKILL.MUTANTS" },
            navigators: { label: "SKILL.NAVIGATORS" },
            pirates: { label: "SKILL.PIRATES" },
            psykers: { label: "SKILL.PSYKERS" },
            theWarp: { label: "SKILL.THE-WARP" },
            xenos: { label: "SKILL.XENOS" }
          }
        },
        inquiry: { label: "SKILL.INQUIRY", isSpecialist: false },
        intimidate: { label: "SKILL.INTIMIDATE", isSpecialist: false },
        logic: { label: "SKILL.LOGIC", isSpecialist: false },
        navigate: {
          label: "SKILL.NAVIGATE",
          isSpecialist: true,
          specialities: {
            surface: { label: "SKILL.SURFACE" },
            stellar: { label: "SKILL.STELLAR" },
            warp: { label: "SKILL.WARP" }
          }
        },
        performer: {
          label: "SKILL.PERFORMER",
          isSpecialist: true,
          specialities: {
            dancer: { label: "SKILL.DANCER" },
            musician: { label: "SKILL.MUSICIAN" },
            singer: { label: "SKILL.SINGER" },
            storyteller: { label: "SKILL.STORYTELLER" }
          }
        },
        pilot: {
          label: "SKILL.PILOT",
          isSpecialist: true,
          specialities: {
            personal: { label: "SKILL.PERSONAL" },
            flyers: { label: "SKILL.FLYERS" },
            spaceCraft: { label: "SKILL.SPACE-CRAFT" }
          }
        },
        scholasticLore: {
          label: "SKILL.SCHOLASTIC_LORE",
          isSpecialist: true,
          specialities: {
            archaic: { label: "SKILL.ARCHAIC" },
            astromancy: { label: "SKILL.ASTROMANCY" },
            beasts: { label: "SKILL.BEASTS" },
            bureaucracy: { label: "SKILL.BUREAUCRACY" },
            chymistry: { label: "SKILL.CHYMISTRY" },
            cryptology: { label: "SKILL.CRYPTOLOGY" },
            heraldry: { label: "SKILL.HERALDRY" },
            imperialWarrants: { label: "SKILL.IMPERIAL-WARRANTS" },
            imperialCreed: { label: "SKILL.IMPERIAL-CREED" },
            judgement: { label: "SKILL.JUDGEMENT" },
            legend: { label: "SKILL.LEGEND" },
            navisNobilite: { label: "SKILL.NAVIS-NOBILITE" },
            numerology: { label: "SKILL.NUMEROLOGY" },
            occult: { label: "SKILL.OCCULT" },
            philosophy: { label: "SKILL.PHILOSOPHY" },
            tacticaImperialis: { label: "SKILL.TACTICA-IMPERIALIS" }
          }
        },
        scrutiny: { label: "SKILL.SCRUTINY", isSpecialist: false },
        search: { label: "SKILL.SEARCH", isSpecialist: false },
        secretTongue: {
          label: "SKILL.SECRET-TONGUE",
          isSpecialist: true,
          specialities: {
            administratum: { label: "SKILL.ADMINISTRATUM" },
            ecclesiarchy: { label: "SKILL.ECCLESIARCHY" },
            military: { label: "SKILL.MILITARY" },
            navigators: { label: "SKILL.NAVIGATORS" },
            rogueTrader: { label: "SKILL.ROGUE-TRADERS" },
            tech: { label: "SKILL.TECH" },
            underdeck: { label: "SKILL.UNDERDECK" }
          }
        },
        silentMove: { label: "SKILL.SILENT-MOVE", isSpecialist: false },
        speakLanguage: {
          label: "SKILL.SPEAK-LANGUAGE",
          isSpecialist: true,
          specialities: {
            eldar: { label: "SKILL.ELDAR" },
            exploratorBinary: { label: "SKILL.EXPLORATOR-BINARY" },
            highGothic: { label: "SKILL.HIGH-GOTHIC" },
            hiveDialect: { label: "SKILL.HIVE-DIALECT" },
            lowGothic: { label: "SKILL.LOW-GOTHIC" },
            ork: { label: "SKILL.ORK" },
            shipDialect: { label: "SKILL.SHIP-DIALECT" },
            technaLingua: { label: "SKILL.TECHNA-LINGUA" },
            tradersCant: { label: "SKILL.TRADERS-CANT" }
          }
        },
        swim: { label: "SKILL.SWIM", isSpecialist: false },
        techUse: { label: "SKILL.TECH_USE", isSpecialist: false },
        trade: {
          label: "SKILL.TRADE",
          isSpecialist: true,
          specialities: {
            agri: { label: "SKILL.AGRI" },
            archaeologist: { label: "SKILL.ARCHAEOLOGIST" },
            armourer: { label: "SKILL.ARMOURER" },
            astrographer: { label: "SKILL.ASTROGRAPHER" },
            chymist: { label: "SKILL.CHYMIST" },
            cryptographer: { label: "SKILL.CRYPTOGRAPHER" },
            cook: { label: "SKILL.COOK" },
            explorator: { label: "SKILL.EXPLORATOR" },
            linguist: { label: "SKILL.LINGUIST" },
            remembrancer: { label: "SKILL.REMEMBRANCER" },
            shipwright: { label: "SKILL.SHIPWRIGHT" },
            soothsayer: { label: "SKILL.SOOTHSAYER" },
            technomat: { label: "SKILL.TECHNOMAT" },
            trader: { label: "SKILL.TRADER" },
            voidfarer: { label: "SKILL.VOIDFARER" }
          }
        }
      };
    }
    
    const advSkillRegex = /^adv/;
    const skills = {};
  
    for (const entry in skillSchema) {
      if (skillSchema.hasOwnProperty(entry)) {
        const entryObject = skillSchema[entry];
        if (entryObject.isSpecialist && entryObject.specialities) {
          const specialities = entryObject.specialities;
          for (const specialty in specialities) {
            if (specialities.hasOwnProperty(specialty)) {
              if (advSkillRegex.test(entry))
                skills[`${entry}:${specialty}`] = specialities[specialty].label;
              else
                skills[`${entry}:${specialty}`] = `${entryObject.label} ${specialities[specialty].label}`;
            }
          }
        } else {
          skills[entry] = entryObject.label || entry;
        }
      }
    }

    const sortedKeys = Object.keys(skills).sort((a, b) => {
      return skills[a].localeCompare(skills[b]);
    });
    
    const result = {};
    sortedKeys.forEach(function(key) { 
      result[key] = skills[key];
    });
    
    return result;
  });

  Handlebars.registerHelper('localizeMultiple', function(text) {
    const parts = text.split(' '); // Split the string by spaces
    const localizedParts = parts.map(part => game.i18n.localize(part)); // Localize each part
    const result = localizedParts.join(': '); // Join the localized parts with spaces
    return result;
  });

  Handlebars.registerHelper('getShipRangeBrackets', function(range) {
    let rangeValue = parseInt(range);
    let short = Math.floor(rangeValue / 2);
    let long = rangeValue * 2;
    return `${short}/${rangeValue}/${long}`;
  });

  Handlebars.registerHelper('getExplorerRangeBrackets', function(range) {
    let rangeValue = parseInt(range);
    if (rangeValue <= 0)
      return 0;
    let short = Math.floor(rangeValue / 2);
    let pointBlank = Math.min(short - 1, 2);
    let long = rangeValue * 2;
    let extreme = rangeValue * 3;
    let maximal = rangeValue * 5;
    return `${pointBlank}/${short}/${long}/${extreme}/${maximal}`;
  });

  Handlebars.registerHelper('localizeShipSide', function(side) {
    let result = "";
    let localizer = game.i18n;
    switch (side) {
      case "port": {
        result = localizer.localize("SHIP.SIDE.PORT");
        break;
      }
      case "star": {
        result = localizer.localize("SHIP.SIDE.STARBOARD");
        break;
      }
      case "dorsal": {
        result = localizer.localize("SHIP.SIDE.DORSAL");
        break;
      }
      case "prow": {
        result = localizer.localize("SHIP.SIDE.PROW");
        break;
      }
      case "keel": {
        result = localizer.localize("SHIP.SIDE.KEEL");
        break;
      }
    }
    return result;
  });

  Handlebars.registerHelper('localizeColonySize', function(colonySize) {
    let result = "";
    let localizer = game.i18n;
    switch (colonySize) {
      case 0:
        result = localizer.localize("COLONY.SIZE.GHOST_TOWN");
        break;
      case 1:
        result = localizer.localize("COLONY.SIZE.SETTLEMENT");
        break;
      case 2:
        result = localizer.localize("COLONY.SIZE.OUTPOST");
        break;
      case 3:
        result = localizer.localize("COLONY.SIZE.FREEHOLD");
        break;
      case 4:
        result = localizer.localize("COLONY.SIZE.DEMESNE");
        break;
      case 5:
        result = localizer.localize("COLONY.SIZE.HOLDING");
        break;
      case 6:
        result = localizer.localize("COLONY.SIZE.DOMINION");
        break;
      case 7:
        result = localizer.localize("COLONY.SIZE.TERRITORY");
        break;
      case 8:
        result = localizer.localize("COLONY.SIZE.CITY");
        break;
      case 9:
        result = localizer.localize("COLONY.SIZE.METROPOLIS");
        break;
      case 10:
        result = localizer.localize("COLONY.SIZE.HIVE");
        break;
      default:
        result = localizer.localize("COLONY.SIZE.HIVE");
        break;
    }
    return result;
  });

  Handlebars.registerHelper('localizeColonyType', function(colonyType) {
    let result = "";
    let i18n = game.i18n;
    switch (colonyType) {
      case "research":
        result = i18n.localize("COLONY.TYPE.RESEARCH");
        break;
      case "mining":
        result = i18n.localize("COLONY.TYPE.MINING");
        break;
      case "ecclesiastical":
        result = i18n.localize("COLONY.TYPE.ECCLESIASTICAL");
        break;
      case "agricultural":
        result = i18n.localize("COLONY.TYPE.AGRICULTURAL");
        break;
      case "pleasure":
        result = i18n.localize("COLONY.TYPE.PLEASURE");
        break;
      case "war":
        result = i18n.localize("COLONY.TYPE.WAR");
        break;
      default:
        result = "Unknown Colony Type";
        break;
    }
    return result;
  });

  Handlebars.registerHelper('localizeBurnType', function(burnType) {
    let result = "";
    let i18n = game.i18n;
    switch (burnType) {
      case "profitFactor":
        result = i18n.localize("COLONY.CHAT.BURN_TYPE.PROFIT");
        break;
      case "growthPoints":
        result = i18n.localize("COLONY.CHAT.BURN_TYPE.GROWTH");
        break;
      default:
        result = "INVALID BURN TYPE!";
        break;
    }
    return result;
  });

  // // Helper to render option tags from an array of {value, label} objects.
  // // Usage in templates: {{{selectOptions options.weaponClassOptions selected=system.class}}}
  // Handlebars.registerHelper('selectOptions', function(optionArray, opts) {
  //   const selected = (opts && opts.hash && opts.hash.selected) ? String(opts.hash.selected) : null;
  //   if (!Array.isArray(optionArray)) return '';
  //   return optionArray.map(opt => {
  //     const val = String(opt.value);
  //     const lbl = opt.label || opt.value;
  //     const isSelected = selected !== null && val === String(selected) ? ' selected' : '';
  //     return `<option value="${val}"${isSelected}>${lbl}</option>`;
  //   }).join('');
  // });
}

