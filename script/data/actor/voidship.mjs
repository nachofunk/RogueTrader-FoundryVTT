import BaseActorModel from "./base-actor.mjs";
import { requiredInteger, immutableIntegerField } from "../helpers.mjs";
import { ActorReferenceField, ItemReferenceField } from "../fields/_module.mjs";
import { CrewRoles, CrewSkill, HullClass, ShipComponentClass, ShipFacing } from "../enums/_module.mjs";
import { VoidshipItemModel, VoidshipComponentModel, VoidshipWeaponModel } from "../item/_module.mjs";
import { RogueTraderActor, RogueTraderItem } from "../../documents/_module.mjs";
import { ValidateSchemaVersion } from "../../../utils/migration.mjs";
import { toCamelCase } from "../../utils/string-utility.mjs";
const { StringField, SchemaField, HTMLField, NumberField, ForeignDocumentField, DocumentUUIDField } = foundry.data.fields;

const Migration = foundry.abstract.Document;
const Properties = foundry.utils;
export default class VoidshipModel extends BaseActorModel {
    static migrateData(source) {
        if (!source) return super.migrateData(source);
        if (source.initiative) {
            Properties.deleteProperty(source, `initiative`);
        }
        VoidshipModel.#migrateCrewData(source);
        VoidshipModel.#migrateHullData(source);
        VoidshipModel.#migrateEngineeringData(source);
        VoidshipModel.#migrateBioData(source);
        return super.migrateData(source);
    }

    static #migrateCrewData(source) {
        if (source.namedCrew) {
            for (const [key, crewMember] of Object.entries(source.namedCrew)) {
                const oldPath = `namedCrew.${key}`;
                const newPath = `crew.namedCrew.${key}.actor`;
                Migration._addDataFieldMigration(source, oldPath, newPath);
            }
            Properties.deleteProperty(source, `namedCrew`);
        }
        Migration._addDataFieldMigration(source, `crewMorale`, `crew.morale`);
        Migration._addDataFieldMigration(source, `crewCount`, `crew.count`);
        Migration._addDataFieldMigration(source, `crewSkill`, `crew.skill`);
    }

    static #migrateHullData(source) {
        Migration._addDataFieldMigration(source, `hullClass`, `hull.class`, (data) => toCamelCase(data.hullClass));
        Migration._addDataFieldMigration(source, `hullName`, `hull.name`);
        Migration._addDataFieldMigration(source, `hullIntegrity`, `hull.integrity`);
    }

    static #migrateEngineeringData(source) {
        const newPath = (key) => `engineering.${key}`;
        Migration._addDataFieldMigration(source, `speed`, newPath(`speed`));
        // Fixed naming typo here
        Migration._addDataFieldMigration(source, `manoeuvrability`, newPath(`maneuverability`));
        Migration._addDataFieldMigration(source, `detection`, newPath(`detection`));
        Migration._addDataFieldMigration(source, `turretRating`, newPath(`turretRating`));
        Migration._addDataFieldMigration(source, `shields`, newPath(`shields`));
        Migration._addDataFieldMigration(source, `armour`, newPath(`armour`));
        Migration._addDataFieldMigration(source, `space`, newPath(`space`));
        Migration._addDataFieldMigration(source, `power`, newPath(`power`));
        Migration._addDataFieldMigration(source, `points`, newPath(`points`));
        Migration._addDataFieldMigration(source, `weaponCapacity`, newPath(`weaponCapacity`));
    }

    static #migrateBioData(source) {
        Migration._addDataFieldMigration(source, `complications`, `bio.complications`);
        Migration._addDataFieldMigration(source, `pastHistory`, `bio.pastHistory`);
        if (source.complicationsHTML)
            Properties.deleteProperty(source, `pastHistoryHTML`);
        if (source.pastHistoryHTML)
            Properties.deleteProperty(source, `complicationsHTML`);
    }

    /** @inheritdoc */
    static get metadata() {
        return {
            ...super.metadata,
            type: "ship",
        };
    }

    static defineSchema() {
        const schema = super.defineSchema();
        schema.bio.extendFields({
            complications: new HTMLField(),
            pastHistory: new HTMLField(),
        });
        schema.crew = new SchemaField({
            count: new SchemaField({
                max: requiredInteger({ initial: 100 }),
                value: requiredInteger(),
            }),
            morale: new SchemaField({
                max: requiredInteger({ initial: 100 }),
                value: requiredInteger(),
            }),
            skill: CrewSkill.schema(),
            namedCrew: new SchemaField(VoidshipModel.#defineCrewRoles()),
        });
        schema.hull = new SchemaField({
            class: HullClass.schema(),
            name: new StringField({ blank: true }),
            integrity: new SchemaField({
                max: requiredInteger(),
                value: requiredInteger(),
            }),
        });
        schema.engineering = new SchemaField({
            speed: requiredInteger(),
            maneuverability: requiredInteger(),
            detection: requiredInteger(),
            turretRating: requiredInteger(),
            shields: requiredInteger(),
            armour: requiredInteger(),
            space: new SchemaField({
                max: requiredInteger(),
                value: requiredInteger(),
                avail: requiredInteger(),
            }),
            power: new SchemaField({
                max: requiredInteger(),
                value: requiredInteger(),
                avail: requiredInteger(),
            }),
            points: new SchemaField({
                base: requiredInteger(),
                components: requiredInteger(),
                total: requiredInteger(),
            }),
            weaponCapacity: new SchemaField(VoidshipModel.#shipFacings()),
        });
        const componentClass = ShipComponentClass.DATA;
        schema.components = new SchemaField({
            essential: new SchemaField(VoidshipModel.#essentialComponentsSchema()),
        });
        return schema;
    }

    static #defineCrewRoles() {
        const roles = {};
        for (const [key, role] of Object.entries(CrewRoles.DATA)) {
            roles[key] = VoidshipModel.#crewRole(role.rank);
        }
        return roles;
    }

    /** Private helper for creating a crew role schema */
    static #crewRole(rank) {
        return new SchemaField({
            actor: new ForeignDocumentField(RogueTraderActor),
            rank: new NumberField({
                initial: rank,
                readonly: true,
                persisted: false
            })
        });
    }

    static #essentialComponentsSchema() {
        const essentials = {};
        for (const [key, value] of Object.entries(ShipComponentClass.DATA)) {
            if (!value.isEssential) continue;
            essentials[key] = VoidshipModel.#shipComponent(key);
        }
        return essentials;
    }

    static #shipComponent(category) {
        return new SchemaField({
            uuid: new DocumentUUIDField(),
            class: new StringField({ initial: category, blank: false, readonly: true, persisted: false}),
        });
    }

    static #shipFacings() {
        const facings = {};
        for (const key of Object.keys(ShipFacing.DATA)) {
            facings[key] = requiredInteger();
        }
        return facings;
    }

    prepareBaseData() {
        super.prepareBaseData();
    }

    prepareDerivedData() {
        super.prepareDerivedData();
        this.#prepareVoidshipCrew();
        this.#prepareVoidshipComponents();
        this.#computePower();
        this.#computeSpace();
        this.#computePoints();
        this.#computeShipInitiative();
    }

    #prepareVoidshipCrew() {
        for (const [key, data] of Object.entries(this.crew.namedCrew)) {
            const crewMemberData = this.crew.namedCrew[key];
            const actor = crewMemberData.actor;
            crewMemberData.name = actor?.name ?? game.i18n.localize(CrewRoles.DATA[key].label);
            crewMemberData.img = actor?.img ?? "icons/svg/mystery-man.svg";
            crewMemberData.characteristics = actor?.system?.characteristics ?? {};
        }
    }

    #prepareVoidshipComponents() {
        const items = Array.from(this.parent.items ?? []);
        const shipComponents = ShipComponentClass.KEYS;
        const isWeapon = (item) => item.system instanceof VoidshipWeaponModel;
        const isEssential = (item) => {
            return item.system instanceof VoidshipComponentModel && ShipComponentClass.DATA[item.system.class].isEssential;
        }
        // Everything that's not a weapon or essential component goes here
        this.components.supplemental = items.filter(item => 
            !isWeapon(item) && !isEssential(item)
        );
        this.components.weapons = items.filter(item => isWeapon(item));
        for (const item of items) {
            if (!isEssential(item)) continue;
            const data = item.system;
            const existing = this.components.essential[data.class];
            if (existing && existing.uuid && existing.uuid !== item.uuid) {
                console.warn(`Multiple essential components of class ${data.class} found on ship ${this.parent.name}. This is not allowed and may cause issues.`, { existing, duplicate: item });
                this.components.supplemental.push(item);
                continue;
            }
            this.components.essential[data.class].uuid = item.uuid;
            this.components.essential[data.class].item = item;
        }
    }

    #computePower() {
        const items = this.parent.items ?? [];
        const voidEngine = this.components.essential.voidEngine.item;
        this.power ??= {};
        this.power.max = voidEngine?.system?.power ?? 0;
        this.power.value = items.filter(item => item !== voidEngine && item.system instanceof VoidshipItemModel)
                                .reduce((total, item) => total + item.system.power, 0);
        this.power.avail = this.power.max - this.power.value;
    }

    #computeSpace() {
        const items = this.parent.items ?? [];
        const spaceTaken = items.filter(item => item.system instanceof VoidshipItemModel)
                                .reduce((total, item) => total + item.system.space, 0);
        this.space ??= {};
        this.space.value = spaceTaken;
        this.space.avail = this.space.max - spaceTaken;
    }

    #computePoints() {
        const items = this.parent.items ?? [];
        const componentsValue = items.filter(item => item.system instanceof VoidshipItemModel)
                                     .reduce((total, item) => total + item.system.shipPoints, 0);
        this.points ??= {};
        this.points.components = componentsValue;
        this.points.total = componentsValue + this.points.base;
    }

    #computeShipInitiative() {
        this.initiative = {
            base: "1d10",
            bonus: this.detection / 10,
        };
    }

    #prepareCrewData() {
        const namedCrew = this.crew.namedCrew;
        for (const [key, crewData] of Object.entries(namedCrew)) {
            const actor = game.actors.get(crewData.id) ?? null;
            namedCrew[key].actor = actor;
            if (actor) {
                namedCrew[key].name = actor.name;
                namedCrew[key].img = actor.img;
            }
        }
    }
}
