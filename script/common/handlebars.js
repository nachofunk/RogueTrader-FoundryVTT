export const initializeHandlebars = () => {
  registerHandlebarsHelpers();
  preloadHandlebarsTemplates();
};

/**
 * Define a set of template paths to pre-load. Pre-loaded templates are compiled and cached for fast access when
 * rendering. These paths will also be available as Handlebars partials by using the file name.
 * @returns {Promise}
 */
function preloadHandlebarsTemplates() {
  const templatePaths = [
    "systems/rogue-trader/template/sheet/actor/acolyte.html",
    "systems/rogue-trader/template/sheet/actor/npc.html",
    "systems/rogue-trader/template/sheet/actor/limited-sheet.html",

    "systems/rogue-trader/template/sheet/actor/tab/abilities.html",
    "systems/rogue-trader/template/sheet/actor/tab/combat.html",
    "systems/rogue-trader/template/sheet/actor/tab/gear.html",
    "systems/rogue-trader/template/sheet/actor/tab/notes.html",
    "systems/rogue-trader/template/sheet/actor/tab/npc-notes.html",
    "systems/rogue-trader/template/sheet/actor/tab/npc-stats.html",
    "systems/rogue-trader/template/sheet/actor/tab/progression.html",
    "systems/rogue-trader/template/sheet/actor/tab/psychic-powers.html",
    "systems/rogue-trader/template/sheet/actor/tab/stats.html",

    "systems/rogue-trader/template/sheet/mental-disorder.html",
    "systems/rogue-trader/template/sheet/aptitude.html",
    "systems/rogue-trader/template/sheet/malignancy.html",
    "systems/rogue-trader/template/sheet/mutation.html",
    "systems/rogue-trader/template/sheet/talent.html",
    "systems/rogue-trader/template/sheet/trait.html",
    "systems/rogue-trader/template/sheet/special-ability.html",
    "systems/rogue-trader/template/sheet/psychic-power.html",
    "systems/rogue-trader/template/sheet/critical-injury.html",
    "systems/rogue-trader/template/sheet/weapon.html",
    "systems/rogue-trader/template/sheet/armour.html",
    "systems/rogue-trader/template/sheet/gear.html",
    "systems/rogue-trader/template/sheet/drug.html",
    "systems/rogue-trader/template/sheet/tool.html",
    "systems/rogue-trader/template/sheet/cybernetic.html",
    "systems/rogue-trader/template/sheet/weapon-modification.html",
    "systems/rogue-trader/template/sheet/ammunition.html",
    "systems/rogue-trader/template/sheet/force-field.html",
    "systems/rogue-trader/template/sheet/characteristics/information.html",
    "systems/rogue-trader/template/sheet/characteristics/left.html",
    "systems/rogue-trader/template/sheet/characteristics/name.html",
    "systems/rogue-trader/template/sheet/characteristics/right.html",
    "systems/rogue-trader/template/sheet/characteristics/total.html",
    "systems/rogue-trader/template/chat/item.html",
    "systems/rogue-trader/template/chat/roll.html",
    "systems/rogue-trader/template/chat/critical.html",
    "systems/rogue-trader/template/dialog/common-roll.html",
    "systems/rogue-trader/template/dialog/combat-roll.html",
    "systems/rogue-trader/template/dialog/psychic-power-roll.html"
  ];
  return loadTemplates(templatePaths);
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
    return TextEditor.enrichHTML(string, {async: false});
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

}

