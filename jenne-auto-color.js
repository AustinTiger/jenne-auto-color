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

// Curated Palette Definitions
const PALETTES = {
    rainbow: {
        name: "Vibrant Rainbow",
        getColor: (index, total) => {
            const hue = index / Math.max(1, total);
            return hslToHex(hue, 0.85, 0.45);
        },
        gradientEnd: [255, 255, 255]
    },
    pastel: {
        name: "Soft Pastel",
        getColor: (index, total) => {
            const hue = index / Math.max(1, total);
            return hslToHex(hue, 0.50, 0.65);
        },
        gradientEnd: [255, 250, 245]
    },
    darkFantasy: {
        name: "Dark Fantasy",
        colors: [
            "#5e1d1d", "#3b1a40", "#1c2d42", "#13382c", "#4a3814", 
            "#4a1c2e", "#2c1c4d", "#19333b", "#2a3d1c", "#472814",
            "#541818", "#33163b", "#14283d", "#103327", "#3d2d10",
            "#421526", "#261545", "#132c33", "#223315", "#3d220e",
            "#4f1818", "#2f1536", "#122538", "#0e2e22", "#38290e", "#3b1322"
        ],
        getColor: (index, total) => {
            const list = PALETTES.darkFantasy.colors;
            const idx = Math.floor((index / Math.max(1, total)) * list.length) % list.length;
            return list[idx];
        },
        gradientEnd: [40, 35, 30]
    },
    earth: {
        name: "Earth & Nature",
        colors: [
            "#2d4a22", "#4a5d23", "#706d28", "#8c6b2d", "#7a4e2d",
            "#5c341e", "#3e4224", "#204028", "#3d593b", "#636b46",
            "#8a774c", "#946843", "#7a462b", "#4a2a1a", "#2b402b",
            "#475431", "#6e663b", "#87663f", "#784b33", "#573220",
            "#304730", "#4c5938", "#706b43", "#826644", "#6e4835", "#4f3123"
        ],
        getColor: (index, total) => {
            const list = PALETTES.earth.colors;
            const idx = Math.floor((index / Math.max(1, total)) * list.length) % list.length;
            return list[idx];
        },
        gradientEnd: [245, 240, 230]
    },
    nordic: {
        name: "Nordic Frost",
        colors: [
            "#1c3144", "#204051", "#3b6978", "#518596", "#84a9ac",
            "#2b4162", "#385170", "#466b8c", "#608ca8", "#92b4c8",
            "#192a3e", "#253b52", "#34526b", "#496f8a", "#6990ab",
            "#1e3a5f", "#2c4c70", "#406485", "#5880a2", "#7fa2c0",
            "#162738", "#21364a", "#2f4c63", "#42657e", "#5f859f", "#88a9c2"
        ],
        getColor: (index, total) => {
            const list = PALETTES.nordic.colors;
            const idx = Math.floor((index / Math.max(1, total)) * list.length) % list.length;
            return list[idx];
        },
        gradientEnd: [230, 240, 248]
    },
    cyberpunk: {
        name: "Neon & Cyberpunk",
        colors: [
            "#ff0055", "#ff00aa", "#cc00ff", "#7700ff", "#0022ff",
            "#0088ff", "#00f0ff", "#00ffaa", "#00ff44", "#88ff00",
            "#ffee00", "#ff8800", "#ff3300", "#ff0077", "#bb00ff",
            "#0055ff", "#00d9ff", "#00ff88", "#55ff00", "#ffbb00",
            "#ff4400", "#ff0099", "#9900ff", "#0099ff", "#00ffc4", "#ffff00"
        ],
        getColor: (index, total) => {
            const list = PALETTES.cyberpunk.colors;
            const idx = Math.floor((index / Math.max(1, total)) * list.length) % list.length;
            return list[idx];
        },
        gradientEnd: [255, 255, 255]
    },
    beneos: {
        name: "Beneos Amber & Mahogany",
        colors: [
            "#591812", "#6e2517", "#85361b", "#9c4820", "#b35d24",
            "#c27529", "#cc8c31", "#cfa242", "#ba8934", "#a16d28",
            "#87531f", "#6e3b17", "#592712", "#731f17", "#8c2f1c",
            "#a34321", "#b85827", "#c7722e", "#d18d38", "#d1a547",
            "#b88b37", "#9c6f29", "#80521d", "#663814", "#52240f", "#6b1b14"
        ],
        getColor: (index, total) => {
            const list = PALETTES.beneos.colors;
            const idx = Math.floor((index / Math.max(1, total)) * list.length) % list.length;
            return list[idx];
        },
        gradientEnd: [250, 240, 220]
    },
    monochrome: {
        name: "Monochrome Slate",
        getColor: (index, total) => {
            const factor = index / Math.max(1, total);
            const val = Math.round(40 + factor * 130);
            return rgbToHex([val, val + 4, val + 8]);
        },
        gradientEnd: [220, 225, 230]
    }
};

function getActivePalette() {
    const key = game.settings?.get("jenne-auto-color", "colorPalette") || "darkFantasy";
    return PALETTES[key] || PALETTES.darkFantasy;
}

function getFolderOpacity() {
    const val = Number(game.settings?.get("jenne-auto-color", "folderOpacity"));
    return isNaN(val) ? 0.4 : Math.max(0.05, Math.min(1, val));
}

function applyColorToFolder(folder, hex) {
    const [r, g, b] = hexToRgb(hex);
    const opacity = getFolderOpacity();
    const rgba = `rgba(${r}, ${g}, ${b}, ${opacity})`;

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
     * Mode 0: Colors all folders in the directory using a gradient starting from a custom color.
     */
    static colorFoldersByGradient(folders, category) {
        const startColorHex = game.settings.get("jenne-auto-color", `${category}DirectoryMainColor`) || "#003399";
        const startRgb = hexToRgb(startColorHex);
        const palette = getActivePalette();
        const endRgb = palette.gradientEnd || [240, 240, 240];
        const count = folders.length;

        folders.forEach((folder, index) => {
            const factor = count > 1 ? index / (count - 1) : 0;
            const currentRgb = interpolateRgb(startRgb, endRgb, factor);
            const hex = rgbToHex(currentRgb);
            applyColorToFolder(folder, hex);
        });
    }

    /**
     * Mode 1: Colors folders dynamically using the active palette based on their initial letter.
     */
    static colorFoldersByInitialLetter(folders) {
        const alphabet = "abcdefghijklmnopqrstuvwxyz";
        const palette = getActivePalette();

        folders.forEach(folder => {
            const titleEl = folder.querySelector(".folder-name, .folder-title, h3, h4") || folder.querySelector(".folder-header") || folder;
            const text = (titleEl ? titleEl.textContent : folder.textContent)?.trim() || "";
            const cleanText = text.replace(/^[^a-zA-Z0-9]+/, "");
            const char = cleanText[0]?.toLowerCase();
            const index = alphabet.indexOf(char);

            let hex;
            if (index !== -1) {
                hex = palette.getColor(index, 26);
            } else {
                hex = "#555555";
            }

            applyColorToFolder(folder, hex);
        });
    }

    /**
     * Mode 2: Colors folders dynamically using the active palette based on their initial number.
     */
    static colorFoldersByInitialNumber(folders) {
        const numbers = "0123456789";
        const palette = getActivePalette();

        folders.forEach(folder => {
            const titleEl = folder.querySelector(".folder-name, .folder-title, h3, h4") || folder.querySelector(".folder-header") || folder;
            const text = (titleEl ? titleEl.textContent : folder.textContent)?.trim() || "";
            const cleanText = text.replace(/^[^a-zA-Z0-9]+/, "");
            const char = cleanText[0]?.toLowerCase();
            const index = numbers.indexOf(char);

            let hex;
            if (index !== -1) {
                hex = palette.getColor(index, 10);
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
    // Mode Selection
    game.settings.register("jenne-auto-color", "selectColorMode", {
        name: game.i18n.localize("JENNEAUTOCOLOR.selectColorMode"),
        hint: game.i18n.localize("JENNEAUTOCOLOR.selectColorModeHint"),
        scope: "client",
        config: true,
        default: 1, // Default to Letter
        type: Number,
        choices: {
            0: "JENNEAUTOCOLOR.options.colormode.choices.0",
            1: "JENNEAUTOCOLOR.options.colormode.choices.1",
            2: "JENNEAUTOCOLOR.options.colormode.choices.2"
        },
        onChange: refreshDirectories
    });

    // Palette Selection
    game.settings.register("jenne-auto-color", "colorPalette", {
        name: game.i18n.localize("JENNEAUTOCOLOR.colorPalette"),
        hint: game.i18n.localize("JENNEAUTOCOLOR.colorPaletteHint"),
        scope: "client",
        config: true,
        default: "darkFantasy",
        type: String,
        choices: {
            "darkFantasy": "JENNEAUTOCOLOR.options.palette.darkFantasy",
            "earth": "JENNEAUTOCOLOR.options.palette.earth",
            "nordic": "JENNEAUTOCOLOR.options.palette.nordic",
            "beneos": "JENNEAUTOCOLOR.options.palette.beneos",
            "pastel": "JENNEAUTOCOLOR.options.palette.pastel",
            "rainbow": "JENNEAUTOCOLOR.options.palette.rainbow",
            "cyberpunk": "JENNEAUTOCOLOR.options.palette.cyberpunk",
            "monochrome": "JENNEAUTOCOLOR.options.palette.monochrome"
        },
        onChange: refreshDirectories
    });

    // Master Enable Toggle
    game.settings.register("jenne-auto-color", "autoColorFolder", {
        name: game.i18n.localize("JENNEAUTOCOLOR.autocolorfolder"),
        hint: game.i18n.localize("JENNEAUTOCOLOR.autocolorfolderHint"),
        scope: "client",
        type: Boolean,
        default: true,
        config: true,
        onChange: refreshDirectories
    });

    // Opacity
    game.settings.register("jenne-auto-color", "folderOpacity", {
        name: game.i18n.localize("JENNEAUTOCOLOR.folderOpacity"),
        hint: game.i18n.localize("JENNEAUTOCOLOR.folderOpacityHint"),
        scope: "client",
        type: Number,
        default: 0.4,
        config: true,
        range: {
            min: 0.1,
            max: 0.9,
            step: 0.05
        },
        onChange: refreshDirectories
    });

    // Gradient start colors per category
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
    renderCardsDirectory: "cards",
    renderPlaceableDirectory: "placeable"
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
