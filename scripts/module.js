const MODULE_ID = "actor-inspection-module";

let inspectorApp = null;

Hooks.once("init", () => {
  console.log(`${MODULE_ID} | Initializing`);
});

Hooks.once("ready", () => {
  console.log(`${MODULE_ID} | Ready`);
});

Hooks.on("renderTokenHUD", (hud, html) => {
  if (html.querySelector(".actor-inspection-button")) {
    return;
  }

  const actor = hud.token?.actor ?? hud.object?.actor;

  if (!actor) {
    return;
  }

  const button = document.createElement("button");

  button.type = "button";
  button.className = "control-icon actor-inspection-button";
  button.dataset.tooltip = "";
  button.ariaLabel = "Inspect Character";
  button.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>';

  button.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();

    openInspector(actor);
  });

  const leftControls = html.querySelector(".left");

  if (leftControls) {
    leftControls.appendChild(button);
  }
});

function openInspector(actor) {
  const characterData = getCharacterData(actor);

  if (inspectorApp) {
    inspectorApp.actor = actor;
    inspectorApp.characterData = characterData;

    inspectorApp.render({
      force: true
    });

    return;
  }

  inspectorApp = new ActorInspectorApplication(actor, characterData);

  inspectorApp.render({
    force: true
  });
}

function getCharacterData(actor) {
  return {
    name: actor.name,
    level: actor.level,

    hp: {
      current: actor.hitPoints.value,
      max: actor.hitPoints.max
    },

    armorClass: actor.armorClass.value,

    perception: actor.perception.mod,

    speed: actor.movement.speeds.land?.value ?? 0
  };
}

class ActorInspectorApplication extends foundry.applications.api.HandlebarsApplicationMixin(
  foundry.applications.api.ApplicationV2
) {
  constructor(actor, characterData) {
    super();

    this.actor = actor;
    this.characterData = characterData;
  }

  static DEFAULT_OPTIONS = {
    id: "actor-inspector",

    classes: [
      "actor-inspector-window"
    ],

    window: {
      title: "Character Inspector",
      resizable: false
    },

    position: {
      width: 300,
      height: "auto"
    }
  };

  static PARTS = {
    inspector: {
      template: "modules/actor-inspection-module/templates/actor-inspector.hbs"
    }
  };

  async _prepareContext() {
    return {
      actor: this.characterData
    };
  }

  _onClose(options) {
    super._onClose(options);

    inspectorApp = null;
  }
}