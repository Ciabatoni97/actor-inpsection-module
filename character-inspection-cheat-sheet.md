# PF2e Actor Inspection Cheat Sheet

This reference is based on `character_info.json`, exported from Foundry VTT 14 with PF2e 8.3.0. Use it as a starting point rather than a permanent schema: PF2e can change field names between system versions.

## Get an Actor

```js
const actor = token.actor;
if (!actor) return;
```

For a selected token:

```js
const token = canvas.tokens.controlled[0];
const actor = token?.actor;
```

Useful actor-level fields:

| Purpose | Path |
| --- | --- |
| ID | `actor.id` or `actor._id` |
| Name | `actor.name` |
| Image | `actor.img` |
| Actor type | `actor.type` (`"character"` in this export) |
| Raw system data | `actor.system` |
| Embedded items | `actor.items` |
| Active effects | `actor.effects` |
| Foundry/PF2e versions | `actor._stats.coreVersion`, `actor._stats.systemVersion` |

## Core Character Data

These values are present in the exported `actor.system` object:

| Information | Path | Sample value |
| --- | --- | --- |
| Level | `actor.system.details.level.value` | `2` |
| Key ability | `actor.system.details.keyability.value` | `"str"` |
| Hit points | `actor.system.attributes.hp.value` | `25` |
| Temporary HP | `actor.system.attributes.hp.temp` | `0` |
| Hero points | `actor.system.resources.heroPoints.value` | `1` |
| Maximum hero points | `actor.system.resources.heroPoints.max` | `3` |
| Initiative statistic | `actor.system.initiative.statistic` | `"perception"` |
| Languages | `actor.system.details.languages.value` | `[]` |
| Custom languages | `actor.system.details.languages.details` | `""` |
| Alliance | `actor.system.details.alliance` | `"party"` |
| XP | `actor.system.details.xp.value` | `0` |
| Age, height, weight | `actor.system.details.age.value`, etc. | `""` |

The export has empty objects or null values for some areas, such as `actor.system.skills`, `actor.system.abilities`, and `actor.system.exploration`. Always use optional chaining when reading data that may not exist.

## PF2e Convenience Values

PF2e prepares useful derived values on the live Actor. Prefer these for an inspection display when they exist, and use `actor.system` for raw stored data.

```js
const summary = {
  name: actor.name,
  level: actor.system.details.level.value,
  hp: actor.hitPoints?.value ?? actor.system.attributes.hp.value,
  maxHp: actor.hitPoints?.max,
  armorClass: actor.armorClass?.value,
  perception: actor.perception?.modifier,
  movement: actor.movement?.land?.value,
};
```

Depending on the PF2e version, a prepared statistic may expose `modifier`, `value`, or a statistic object with methods. Inspect the live object with `console.dir(actor.armorClass)` before depending on a specific shape.

Common prepared values to investigate:

```js
actor.armorClass
actor.perception
actor.saves.fortitude
actor.saves.reflex
actor.saves.will
actor.skills
actor.movement
actor.hitPoints
actor.attributes
```

## Finding Ancestry, Class, Background, and Deity

Items are embedded documents. The item `type` identifies the category:

```js
const ancestry = actor.items.find(item => item.type === "ancestry");
const heritage = actor.items.find(item => item.type === "heritage");
const background = actor.items.find(item => item.type === "background");
const characterClass = actor.items.find(item => item.type === "class");
const deity = actor.items.find(item => item.type === "deity");
```

Useful item fields:

| Purpose | Path |
| --- | --- |
| Display name | `item.name` |
| Item ID | `item.id` |
| Item category | `item.type` |
| Slug | `item.system.slug` |
| Traits | `item.system.traits.value` |
| Description HTML | `item.system.description.value` |
| Item image | `item.img` |
| Source UUID | `item._stats.compendiumSource` |
| Level | `item.system.level.value` |

Class-specific data in this sample includes `characterClass.system.hp`, `characterClass.system.keyAbility`, `characterClass.system.attacks`, `characterClass.system.defenses`, and `characterClass.system.trainedSkills`.

The deity item includes `deity.system.domains`, `deity.system.font`, `deity.system.attribute`, `deity.system.skill`, and `deity.system.weapons`.

## Items by Type

```js
const weapons = actor.items.filter(item => item.type === "weapon");
const armor = actor.items.filter(item => item.type === "armor");
const feats = actor.items.filter(item => item.type === "feat");
const actions = actor.items.filter(item => item.type === "action");
const spells = actor.items.filter(item => item.type === "spell");
```

The sample contains these item types: `ancestry`, `feat`, `weapon`, `heritage`, `action`, `background`, `class`, and `deity`. Other characters may also contain `armor`, `equipment`, `spell`, `lore`, `melee`, `consumable`, `treasure`, and more.

### Weapon fields

```js
const weaponInfo = weapons.map(item => ({
  name: item.name,
  quantity: item.system.quantity,
  category: item.system.category,
  group: item.system.group,
  damage: item.system.damage,
  traits: item.system.traits.value,
  equipped: item.system.equipped,
  runes: item.system.runes,
}));
```

The sample clan dagger has `damage.dice`, `damage.die`, `damage.damageType`, `bonus.value`, `runes.potency`, and `runes.striking`.

### Actions and feats

```js
const abilities = actor.items
  .filter(item => ["action", "feat"].includes(item.type))
  .map(item => ({
    name: item.name,
    type: item.type,
    actionType: item.system.actionType?.value,
    actions: item.system.actions?.value,
    level: item.system.level?.value,
    traits: item.system.traits?.value ?? [],
    description: item.system.description?.value ?? "",
  }));
```

`actionType.value` may be `action`, `reaction`, `free`, or `passive`. The number of actions is separate and may be `null` for reactions and passives.

## Safe Inspection Patterns

Use optional chaining and nullish coalescing for incomplete character data:

```js
const getItem = type => actor.items.find(item => item.type === type);
const getValue = (object, fallback = null) => object?.value ?? fallback;

const character = {
  name: actor.name,
  level: actor.system.details.level.value,
  className: getItem("class")?.name ?? "Unknown",
  ancestryName: getItem("ancestry")?.name ?? "Unknown",
  hp: getValue(actor.hitPoints, actor.system.attributes.hp.value),
  armorClass: getValue(actor.armorClass),
};

console.table(character);
```

For a development pass, log the live prepared data once:

```js
console.dir(actor, { depth: 4 });
console.dir(actor.system, { depth: 6 });
```

Avoid displaying GM-only biography fields unless the viewer has permission. The export includes `actor.system.details.biography` with visibility flags such as `backstory`, `personality`, and `campaign`.

## Suggested First Inspection Panel

Start with a small, dependable summary:

```js
{
  name,
  level,
  ancestry,
  heritage,
  background,
  className,
  hp,
  armorClass,
  perception,
  saves,
  movement,
  heroPoints,
  weapons,
  actions,
  feats,
  conditions: actor.conditions,
}
```

Treat this as a presentation model rather than passing the complete Actor document to a sheet. It keeps the UI stable and avoids accidentally exposing descriptions, ownership data, or private biography content.