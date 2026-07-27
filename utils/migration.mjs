const expectedVersion = 6;

export function ValidateSchemaVersion() {
    return false;
    const currentVersion = game.settings.get("rogue-trader", "worldSchemaVersion");
    return currentVersion === expectedVersion;
}

export function UpdateWorldSchemaVersion() {
    game.settings.set("rogue-trader", "worldSchemaVersion", expectedVersion);
}

export async function MigrateWorld() {
    ui.notifications.info("Upgrading the world, please wait...");
    for (const actor of game.actors.contents) {
        const source = actor.toObject();
        const migrated = await actor.constructor.migrateData(source);
        if (!foundry.utils.isEmpty(migrated)) {
            await actor.update(migrated, { enforceTypes: false });
        }
    }
    ui.notifications.info("Upgrade complete!");
}