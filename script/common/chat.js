import { commonRoll, combatRoll } from "./roll.js";
/**
 * This function is used to hook into the Chat Log context menu to add additional options to each message
 * These options make it easy to conveniently apply damage to controlled tokens based on the value of a Roll
 *
 * @param {HTMLElement} html    The Chat Message being rendered
 * @param {Array} options       The Array of Context Menu options
 *
 * @returns {Array}              The extended options Array including new context choices
 */
export const addChatMessageContextOptions = function(html, options) {
  let canApply = li => {
    const message = game.messages.get(li.data("messageId"));
    return message.getRollData()?.isCombatTest && message.isContentVisible && canvas.tokens.controlled.length;
  };
  options.push(
    {
      name: game.i18n.localize("CHAT.CONTEXT.APPLY_DAMAGE"),
      icon: '<i class="fas fa-user-minus"></i>',
      condition: canApply,
      callback: li => applyChatCardDamage(li)
    }
  );
  
  let canReroll = li => {
      const message = game.messages.get(li.data("messageId"));
      let actor = game.actors.get(message.getRollData()?.ownerId);
      return message.isRoll && message.isContentVisible && actor?.fate?.value > 0;
  };
  
  options.push(
      {
          name: game.i18n.localize("CHAT.CONTEXT.REROLL"),
          icon: '<i class="fa-solid fa-repeat"></i>',
          condition: canReroll,
          callback: li => {
              const message = game.messages.get(li.data("messageId"));              
              rerollTest(message.getRollData());
          } 
      }
  )
  return options;
};

/**
 * Apply rolled dice damage to the token or tokens which are currently controlled.
 * This allows for damage to be scaled by a multiplier to account for healing, critical hits, or resistance
 *
 * @param {HTMLElement} roll    The chat entry which contains the roll data
 * @param {number} multiplier   A damage multiplier to apply to the rolled damage.
 * @returns {Promise}
 */
function applyChatCardDamage(roll, multiplier) {
  // Get the damage data, get them as arrays in case of multiple hits
  const amount = roll.find(".damage-total");
  const location = roll.find(".damage-location");
  const penetration = roll.find(".damage-penetration");
  const type = roll.find(".damage-type");
  const righteousFury = roll.find(".damage-righteous-fury");

  // Put the data from different hits together
  const damages = [];
  for (let i = 0; i < amount.length; i++) {
    damages.push({
      amount: $(amount[i]).text(),
      location: $(location[i]).data("location"),
      penetration: $(penetration[i]).text(),
      type: $(type[i]).text(),
      righteousFury: $(righteousFury[i]).text()
    });
  }

  // Apply to any selected actors
  return Promise.all(canvas.tokens.controlled.map(t => {
    const a = t.actor;
    return a.applyDamage(damages);
  }));
}

function rerollTest(rollData) {
    let actor = game.actors.get(rollData.ownerId);    
    actor.update({ "system.fate.value" : actor.fate.value -1 });
    delete rollData.damages; //reset so no old data is shown on failure
    
    rollData.isReRoll = true;
    if(rollData.isCombatTest) {
        //All the regexes in this are broken once retrieved from the chatmessage
        //No idea why this happens so we need to fetch them again so the roll works correctly
        rollData.attributeBoni = actor.attributeBoni;
        return combatRoll(rollData);
    } else {
        return commonRoll(rollData);
    }
}

export const showRolls =html => {
  // Show dice rolls on click
  html.on("click", ".rogue-trader.chat.roll>.background.border", onChatRollClick);
};

/**
 * Show/hide dice rolls when a chat message is clicked.
 * @param {Event} event
 */
function onChatRollClick(event) {
  event.preventDefault();
  let roll = $(event.currentTarget.parentElement);
  let tip = roll.find(".dice-rolls");
  if ( !tip.is(":visible") ) tip.slideDown(200);
  else tip.slideUp(200);
}
