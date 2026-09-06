# Actor Inspection

Actor Inspection is a small Foundry Virtual Tabletop module for quickly viewing a compact summary of a Pathfinder 2e character from the Token HUD.

## Current Features

- Adds an **Inspect Character** button to the left side of a token's HUD.
- Opens a reusable **Character Inspector** window for the token's actor.
- Displays the actor's:
  - Name
  - Level
  - Current and maximum HP
  - Armor Class
  - Perception modifier
  - Land Speed
- Refreshes the existing inspector window when another actor is inspected.

The module currently reads prepared PF2e actor values from the live Actor document. It is intentionally a focused summary rather than a replacement for the full character sheet.

## Requirements

- Foundry Virtual Tabletop 14
- Pathfinder 2e system
- A token with an associated actor

The module manifest currently declares compatibility with Foundry VTT 14 and a relationship with the `pf2e` system.

## Installation

### Local installation

1. Clone or download this repository into the Foundry `Data/modules` directory.
2. Make sure the module folder is named `actor-inspection-module`.
3. Start Foundry VTT and enable **Actor Inspection** in the world's **Manage Modules** menu.

### Git installation

From the Foundry modules directory:

```bash
git clone https://github.com/Ciabatoni97/actor-inpsection-module.git actor-inspection-module
```

## Usage

1. Open a world using the Pathfinder 2e system.
2. Select or target a token with an actor.
3. Open the token HUD.
4. Click the magnifying-glass **Inspect Character** button.

The inspector opens as a small, non-resizable window. Closing it clears the current inspector instance; the next inspection creates a fresh window.

## Project Structure

```text
module.json                         Foundry module manifest
scripts/module.js                   Token HUD hook and inspector application
templates/actor-inspector.hbs       Inspector window markup
styles/actor-inspector.css          Inspector window styling
```

## Current Limitations

- The display is limited to the six summary values listed above.
- The module is currently designed for Pathfinder 2e actors and is not system-agnostic.
- It assumes the prepared PF2e actor exposes the fields used by `scripts/module.js`.
- It does not yet display ancestry, class, saves, skills, items, actions, conditions, or biography data.
- There is currently no automated test suite or build step; the module runs directly from its JavaScript, Handlebars, and CSS files.

## License

No license has been declared yet.