import { RogueTraderSheet } from "./actor.js";

export class ColonySheet extends RogueTraderSheet { 

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["rogue-trader", "sheet", "actor"],
            template: "systems/rogue-trader/template/sheet/actor/colony.html",
            width: 720,
            height: 881,
            resizable: true,
            // tabs: [
            // {
            //     navSelector: ".sheet-tabs",
            //     contentSelector: ".sheet-body",
            //     initial: "stats"
            // }
            // ]
        });
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find(".roll-growth").click(ev => this._onRollColonyGrowth(ev));
    }
    
    /** @override */
    async getData(options) {
        const data = await super.getData(options);
        return data;
    }

    _onRollColonyGrowth(event) {
        event.preventDefault();
        const growthTableID = game.settings.get("rogue-trader", "colonyGrowth");
        let growthTable = game.tables.get(growthTableID);
        console.log(growthTable);
        growthTable.roll();
    }
}
