const ColorMode = {
    DEFINED: 0,
    INITIALLETTER: 1,
    INITIALNUMBER: 2,
};

class JenneAutoColor {
    /**
     * Entry point to style a sidebar directory or compendium view.
     * Selects all folders recursively and styles them according to user configuration.
     */
    static colorDirectory(html, category) {
        if (!game.settings.get("jenne-auto-color", "autoColorFolder")) return;

        // Safely extract the raw HTML element
        const el = html.jquery ? html[0] : html;
        if (!el) return;

        // Query all folder elements recursively
        const folders = Array.from(el.querySelectorAll("li.folder"));
        if (folders.length === 0) return;

        const mode = Number(game.settings.get("jenne-auto-color", "selectColorMode"));

        switch (mode) {
            case ColorMode.DEFINED:
                this.colorFoldersByGradient(folders, category);
                break;
            case ColorMode.INITIALLETTER:
                this.colorFoldersByInitialLetter(folders);
                break;
            case ColorMode.INITIALNUMBER:
                this.colorFoldersByInitialNumber(folders);
                break;
        }
    }

    /**
     * Mode 0: Colors all folders in the directory using a gradient starting from a custom color to white.
     */
    static colorFoldersByGradient(folders, category) {
        const startColorHex = game.settings.get("jenne-auto-color", `${category}DirectoryMainColor`);
        if (!startColorHex) return;

        // Leverage modern built-in Color class for clean color interpolation
        const startColor = Color.fromString(startColorHex);
        const endColor = Color.fromString("#ffffff");
        const count = folders.length;

        folders.forEach((folder, index) => {
            const header = folder.querySelector(".folder-header");
            if (!header) return;

            const factor = count > 1 ? index / (count - 1) : 0;
            const color = startColor.mix(endColor, 1 - factor);

            // Apply style with a subtle opacity
            header.style.backgroundColor = color.toRGBA(0.5);
        });
    }

    /**
     * Mode 1: Colors folders dynamically using HSL based on their initial letter.
     */
    static colorFoldersByInitialLetter(folders) {
        const alphabet = "abcdefghijklmnopqrstuvwxyz";
        folders.forEach(folder => {
            const header = folder.querySelector(".folder-header");
            if (!header) return;

            const text = header.querySelector("h3")?.textContent?.trim() || "";
            const char = text[0]?.toLowerCase();
            const index = alphabet.indexOf(char);

            let color;
            if (index !== -1) {
                // Distribute hue evenly across the alphabet
                const hue = index / 26;
                color = Color.fromHSL([hue, 0.6, 0.5]);
            } else {
                color = Color.fromString("#808080");
            }
            header.style.backgroundColor = color.toRGBA(0.5);
        });
    }

    /**
     * Mode 2: Colors folders dynamically using HSL based on their initial number.
     */
    static colorFoldersByInitialNumber(folders) {
        const numbers = "0123456789";
        folders.forEach(folder => {
            const header = folder.querySelector(".folder-header");
            if (!header) return;

            const text = header.querySelector("h3")?.textContent?.trim() || "";
            const char = text[0]?.toLowerCase();
            const index = numbers.indexOf(char);

            let color;
            if (index !== -1) {
                // Distribute hue evenly across numbers
                const hue = index / 10;
                color = Color.fromHSL([hue, 0.8, 0.4]);
            } else {
                color = Color.fromString("#808080");
            }
            header.style.backgroundColor = color.toRGBA(0.4);
        });
    }
}

// Function to refresh sidebar directories and open compendiums immediately when settings change
const refreshDirectories = () => {
    for (const tab of Object.values(ui.sidebar.tabs)) {
        tab.render();
    }
    for (const app of Object.values(ui.windows)) {
        if (app.metadata?.type === "Compendium" || app.constructor.name === "Compendium") {
            app.render();
        }
    }
};

Hooks.once("init", () => {
    game.settings.register("jenne-auto-color", "selectColorMode", {
        name: game.i18n.localize("JENNEAUTOCOLOR.selectColorMode"),
        hint: game.i18n.localize("JENNEAUTOCOLOR.selectColorModeHint"),
        scope: "client",
        config: true,
        default: 0,
        type: Number,
        choices: {
            0: "JENNEAUTOCOLOR.options.colormode.choices.0",
            1: "JENNEAUTOCOLOR.options.colormode.choices.1",
            2: "JENNEAUTOCOLOR.options.colormode.choices.2"
        },
        onChange: refreshDirectories
    });

    game.settings.register("jenne-auto-color", "autoColorFolder", {
        name: game.i18n.localize("JENNEAUTOCOLOR.autocolorfolder"),
        hint: game.i18n.localize("JENNEAUTOCOLOR.autocolorfolderHint"),
        scope: "client",
        type: Boolean,
        default: true,
        config: true,
        onChange: refreshDirectories
    });

    const colorSettings = {
        scene: "#000000",
        actor: "#640000",
        item: "#000032",
        journal: "#003399",
        compendium: "#003399",
        rollTable: "#003399",
        playlist: "#003399",
        cards: "#003399"
    };

    for (const [key, defaultVal] of Object.entries(colorSettings)) {
        game.settings.register("jenne-auto-color", `${key}DirectoryMainColor`, {
            name: game.i18n.localize(`JENNEAUTOCOLOR.options.colorselector.${key}Title`),
            hint: game.i18n.localize(`JENNEAUTOCOLOR.options.colorselector.${key}Description`),
            scope: "client",
            config: true,
            type: String,
            default: defaultVal,
            onChange: refreshDirectories
        });
    }
});

// Hook to inject modern native <color-picker> HTML elements into the configuration sheet
Hooks.on("renderSettingsConfig", (app, html, data) => {
    const el = html.jquery ? html[0] : html;
    if (!el) return;

    const colorKeys = [
        "sceneDirectoryMainColor",
        "actorDirectoryMainColor",
        "itemDirectoryMainColor",
        "journalDirectoryMainColor",
        "compendiumDirectoryMainColor",
        "rollTableDirectoryMainColor",
        "playlistDirectoryMainColor",
        "cardsDirectoryMainColor"
    ];

    for (const key of colorKeys) {
        const input = el.querySelector(`[name="jenne-auto-color.${key}"]`);
        if (!input) continue;

        // Create the native color-picker custom element
        const picker = document.createElement("color-picker");
        picker.setAttribute("name", `jenne-auto-color.${key}`);
        picker.setAttribute("value", input.value);

        // Replace the plain text input with the modern color-picker
        input.replaceWith(picker);
    }
});

// Set up hooks to style each directory tab
const HOOK_MAP = {
    renderActorDirectory: "actor",
    renderSceneDirectory: "scene",
    renderJournalDirectory: "journal",
    renderItemDirectory: "item",
    renderCompendiumDirectory: "compendium",
    renderCompendium: "compendium",
    renderPlaylistDirectory: "playlist",
    renderRollTableDirectory: "rollTable",
    renderCardsDirectory: "cards"
};

for (const [hookName, category] of Object.entries(HOOK_MAP)) {
    Hooks.on(hookName, (app, html, data) => {
        JenneAutoColor.colorDirectory(html, category);
    });
}
