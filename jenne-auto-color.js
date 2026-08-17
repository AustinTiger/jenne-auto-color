const ColorMode = {
    DEFINED: 0,
    INITIALLETTER: 1,
    INITIALNUMBER: 2,
};

// Pure JavaScript Color Utilities (Zero Dependencies)
function hexToRgb(hex) {
    if (!hex || typeof hex !== "string") return [100, 100, 100];
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const num = parseInt(hex, 16);
    if (isNaN(num)) return [100, 100, 100];
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function rgbToHex([r, g, b]) {
    return "#" + [r, g, b].map(x => {
        const h = Math.round(Math.max(0, Math.min(255, x))).toString(16);
        return h.length === 1 ? "0" + h : h;
    }).join('');
}

function interpolateRgb(rgb1, rgb2, factor) {
    return [
        rgb1[0] + factor * (rgb2[0] - rgb1[0]),
        rgb1[1] + factor * (rgb2[1] - rgb1[1]),
        rgb1[2] + factor * (rgb2[2] - rgb1[2])
    ];
}

function hslToHex(h, s, l) {
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    return rgbToHex([r * 255, g * 255, b * 255]);
}

function applyColorToFolder(folder, hex) {
    const [r, g, b] = hexToRgb(hex);
    const rgba = `rgba(${r}, ${g}, ${b}, 0.4)`;

    // Set CSS variable for Foundry V14 native folder styling & borders
    folder.style.setProperty("--folder-color", hex);

    // Apply direct background-color with !important to folder header
    const header = folder.querySelector(".folder-header") || folder.querySelector("header") || folder.firstElementChild;
    if (header) {
        header.style.setProperty("background-color", rgba, "important");
        header.style.setProperty("--folder-color", hex);
    }
}

class JenneAutoColor {
    /**
     * Entry point to style a sidebar directory or compendium view.
     */
    static colorDirectory(target, category) {
        if (!game.settings?.get("jenne-auto-color", "autoColorFolder")) return;

        // Safely resolve the HTML container element
        let el = null;
        if (target instanceof HTMLElement) el = target;
        else if (target?.jquery) el = target[0];
        else if (target?.element instanceof HTMLElement) el = target.element;
        else if (target?.element?.jquery) el = target.element[0];

        if (!el && typeof document !== "undefined") {
            el = document.querySelector(`.sidebar-tab[data-tab="${category}"]`) || 
                 document.querySelector(`#${category}`) || 
                 document.querySelector(".sidebar-tab.active");
        }
        if (!el) return;

        // Query all folder elements recursively
        const folders = Array.from(el.querySelectorAll(".folder, [data-folder-id]"));
        if (folders.length === 0) return;

        const mode = Number(game.settings.get("jenne-auto-color", "selectColorMode")) || 0;

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
        const startColorHex = game.settings.get("jenne-auto-color", `${category}DirectoryMainColor`) || "#003399";
        const startRgb = hexToRgb(startColorHex);
        const endRgb = [240, 240, 240];
        const count = folders.length;

        folders.forEach((folder, index) => {
            const factor = count > 1 ? index / (count - 1) : 0;
            const currentRgb = interpolateRgb(startRgb, endRgb, factor);
            const hex = rgbToHex(currentRgb);
            applyColorToFolder(folder, hex);
        });
    }

    /**
     * Mode 1: Colors folders dynamically using HSL based on their initial letter.
     */
    static colorFoldersByInitialLetter(folders) {
        const alphabet = "abcdefghijklmnopqrstuvwxyz";
        folders.forEach(folder => {
            const titleEl = folder.querySelector(".folder-name, .folder-title, h3, h4") || folder.querySelector(".folder-header") || folder;
            const text = (titleEl ? titleEl.textContent : folder.textContent)?.trim() || "";
            const cleanText = text.replace(/^[^a-zA-Z0-9]+/, "");
            const char = cleanText[0]?.toLowerCase();
            const index = alphabet.indexOf(char);

            let hex;
            if (index !== -1) {
                const hue = index / 26;
                hex = hslToHex(hue, 0.75, 0.45);
            } else {
                hex = "#555555";
            }

            applyColorToFolder(folder, hex);
        });
    }

    /**
     * Mode 2: Colors folders dynamically using HSL based on their initial number.
     */
    static colorFoldersByInitialNumber(folders) {
        const numbers = "0123456789";
        folders.forEach(folder => {
            const titleEl = folder.querySelector(".folder-name, .folder-title, h3, h4") || folder.querySelector(".folder-header") || folder;
            const text = (titleEl ? titleEl.textContent : folder.textContent)?.trim() || "";
            const cleanText = text.replace(/^[^a-zA-Z0-9]+/, "");
            const char = cleanText[0]?.toLowerCase();
            const index = numbers.indexOf(char);

            let hex;
            if (index !== -1) {
                const hue = index / 10;
                hex = hslToHex(hue, 0.85, 0.42);
            } else {
                hex = "#555555";
            }

            applyColorToFolder(folder, hex);
        });
    }
}

// Function to refresh sidebar directories immediately when settings change
const refreshDirectories = () => {
    if (ui?.sidebar?.tabs) {
        for (const tab of Object.values(ui.sidebar.tabs)) {
            if (typeof tab?.render === "function") tab.render();
        }
    } else if (ui?.sidebar && typeof ui.sidebar.render === "function") {
        ui.sidebar.render();
    }

    if (ui?.windows) {
        for (const app of Object.values(ui.windows)) {
            if (app.metadata?.type === "Compendium" || app.constructor.name === "Compendium") {
                if (typeof app.render === "function") app.render();
            }
        }
    }

    // Direct DOM pass on all folders currently in document
    for (const [hookName, category] of Object.entries(HOOK_MAP)) {
        const el = document.querySelector(`.sidebar-tab[data-tab="${category}"]`) || document.querySelector(`#${category}`);
        if (el) JenneAutoColor.colorDirectory(el, category);
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

        const picker = document.createElement("color-picker");
        picker.setAttribute("name", `jenne-auto-color.${key}`);
        picker.setAttribute("value", input.value);
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
        JenneAutoColor.colorDirectory(html || app, category);
    });
}

Hooks.on("changeSidebarTab", (tab) => {
    const tabName = tab?.tabName || tab?.id;
    const category = HOOK_MAP[`render${tabName?.charAt(0).toUpperCase() + tabName?.slice(1)}Directory`] || tabName;
    if (category) {
        JenneAutoColor.colorDirectory(tab?.element || document, category);
    }
});
