export default class ColonyRollData {
    static createGovernorRollData(colonyActor) {
        const governorData = colonyActor.system.governor;
        const rollData = {
            name: "DIALOG.GOVERNOR_SKILL_ROLL",
            actor: governorData.actor,
            baseTarget: governorData.skillBonus ?? 0,
            modifier: 0,
            ownerId: governorData.actor.id
            
        };
        return rollData;
    }

    static createResourceRollData(actor) {
        const actorData = actor.system;
        const colonySize = actorData.stats.size;
        let governorResourcePenalty = 0;
        if (actorData.governor.governorType === "relaxed") {
            governorResourcePenalty = Math.min(5, Math.ceil(colonySize / 3));
        }
        const rollData = {
            name: "DIALOG.CONSUME_RESOURCES_ROLL",
            ownerId: actor.uuid.split('.')[1],    
            resources: actorData.resources,
            actor: actor,
            requiredResources: colonySize + 1,
            consumedAmount: `1d10 + ${colonySize + governorResourcePenalty}`,
            burnedAmount: `${colonySize}d10 + ${5 * colonySize} + ${governorResourcePenalty}`,
            selectedResource: actorData.resources?.length > 0 ? actorData.resources[0] : null,
            burnResources: false,
            conserveResources: false,
            burnData: {
            burnType: "profitFactor",
            generated: 0
            }
        };
        return rollData;
    }

    static createEventRollData(actor) {
        const rollData = {
            positiveEventTarget: 9,
            negativeEventTarget: 3,
        };
        const representative = actor.system.governor.governorType;
        switch (representative) {
            case "administrative":
                rollData.negativeEventTarget = 1;
            break;
            case "faithful":
                rollData.negativeEventTarget = 2;
                rollData.positiveEventTarget = 8;
            break;
        }
        return rollData;
    }

    static createColonyGrowthRollData(actor, growthData) {
        growthData.requiredGrowth = actor.system.stats.requiredGrowth;
        growthData.shouldGrow = this.#hasEnoughGrowth(actor, growthData);
        growthData.shouldDecreaseSize = this.#shouldDecreaseSize(actor, growthData);
        growthData.actor = actor;
        return growthData;
    }

    static #hasEnoughGrowth(actor, growthData) {
        return (growthData.loyalty.updated >= growthData.requiredGrowth &&
                growthData.prosperity.updated >= growthData.requiredGrowth &&
                growthData.security.updated >= growthData.requiredGrowth);
    }

    static #shouldDecreaseSize(actor, growthData) {
        let negativeStatsCount = 0;
        if (growthData.loyalty.updated < 0)
            negativeStatsCount += 1;
        if (growthData.prosperity.updated < 0)
            negativeStatsCount += 1;
        if (growthData.security.updated < 0)
            negativeStatsCount += 1;
        return negativeStatsCount >= 2;
    }
}