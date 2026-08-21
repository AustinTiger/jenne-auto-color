const ColorMode = {
    PARENTTREE: 0,
    INITIALLETTER: 1,
    INITIALNUMBER: 2,
    DEPTHLEVEL: 3
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

function adjustLuminance(rgb, amount) {
    return rgb.map(channel => {
        if (amount > 0) {
            return channel + (255 - channel) * amount;
        } else {
            return channel * (1 + amount);
        }
    });
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

// Helper to extract color from an array palette evenly
function getIndexedColor(colorList, index, total) {
    const idx = Math.floor((index / Math.max(1, total)) * colorList.length) % colorList.length;
    return colorList[idx];
}

// Thematic Palettes (Party Campaigns, Fantasy Realms, D&D Classes, Aesthetics)
const PALETTES = {
    // Campaign Legends & Party Themes
    brokeSquad: {
        name: "Broke Squad (Phandelver & Storm King's Hoard)",
        colors: [
            "#d4af37", "#f39c12", "#e67e22", "#1e3d59", "#17b978", "#2ecc71",
            "#f1c40f", "#3498db", "#2980b9", "#27ae60", "#e74c3c", "#8e44ad",
            "#9b59b6", "#e5b82c", "#16a085", "#0f4c81", "#d35400", "#c0392b",
            "#1abc9c", "#34495e", "#ffb300", "#00bcd4", "#8bc34a", "#ff9800",
            "#ff5722", "#ffd700"
        ],
        getColor: (index, total) => getIndexedColor(PALETTES.brokeSquad.colors, index, total)
    },
    forgottenConsensus: {
        name: "Forgotten Consensus (Barovian Mists & Gothic Ravenloft)",
        colors: [
            "#4a1525", "#6b1426", "#8a1c32", "#a82840", "#3a1e36", "#522546",
            "#2c1d38", "#413253", "#2a2438", "#352f44", "#5c5470", "#718093",
            "#40739e", "#487eb0", "#8c1d40", "#631d38", "#381c30", "#241829",
            "#3b2c3d", "#514357", "#6d5d73", "#8f7e96", "#992233", "#4d1122",
            "#301e2c", "#581b2d"
        ],
        getColor: (index, total) => getIndexedColor(PALETTES.forgottenConsensus.colors, index, total)
    },

    // Fantasy Races & Realms (LoTR & D&D)
    elven: {
        name: "Elven Woodland (Lothlórien / Rivendell)",
        colors: [
            "#2d5a43", "#437c54", "#6fa369", "#a8c686", "#d4af37", "#b89758",
            "#3b6e68", "#5b8c85", "#88b7b5", "#3a6073", "#1b4d3e", "#2e6f40",
            "#52945d", "#82b37c", "#c9b037", "#a68a4d", "#335e58", "#4e7b75",
            "#78a6a4", "#2f5163", "#143f32", "#235e34", "#447f4f", "#6f9e69",
            "#bca532", "#977a42"
        ],
        getColor: (index, total) => getIndexedColor(PALETTES.elven.colors, index, total)
    },
    dwarven: {
        name: "Dwarven Forge (Moria / Mithril / Erebor)",
        colors: [
            "#8b2500", "#b23a00", "#d95f02", "#e67e22", "#d4af37", "#a67c1e",
            "#5c4033", "#704214", "#8b4513", "#3d5a80", "#293241", "#985277",
            "#7a1c00", "#9e3000", "#c45100", "#d16e17", "#c29e2f", "#936b17",
            "#4e3529", "#5e370f", "#793c0f", "#334c6e", "#202835", "#854566",
            "#6c1700", "#872700"
        ],
        getColor: (index, total) => getIndexedColor(PALETTES.dwarven.colors, index, total)
    },
    mordor: {
        name: "Mordor & Shadow (Mount Doom / Nazgûl)",
        colors: [
            "#4a0e17", "#73111b", "#9c1b1e", "#bd2a1e", "#d94723", "#8c2d19",
            "#3b1a20", "#24181b", "#1a1215", "#332211", "#4d3319", "#2e3b23",
            "#431c3b", "#3f0a12", "#630d16", "#871518", "#a62218", "#be3c1d",
            "#782414", "#301318", "#1c1114", "#120a0d", "#26180a", "#3b2611",
            "#222d18", "#33132d"
        ],
        getColor: (index, total) => getIndexedColor(PALETTES.mordor.colors, index, total)
    },
    underdark: {
        name: "Underdark & Drow (Menzoberranzan)",
        colors: [
            "#2e1a47", "#4a154b", "#6a1b9a", "#8e24aa", "#ab47bc", "#311b92",
            "#4527a0", "#512da8", "#006064", "#00838f", "#0097a7", "#00bcd4",
            "#1a237e", "#283593", "#303f9f", "#004d40", "#00695c", "#00796b",
            "#37474f", "#263238", "#3f205c", "#5a2066", "#7b26aa", "#9d33b8",
            "#b856c7", "#3b239e"
        ],
        getColor: (index, total) => getIndexedColor(PALETTES.underdark.colors, index, total)
    },
    dragon: {
        name: "Dragon's Hoard (Chromatic & Metallic)",
        colors: [
            "#9e1a1a", "#c62828", "#d32f2f", "#b78727", "#d4af37", "#f1c40f",
            "#0d47a1", "#1565c0", "#1976d2", "#1b5e20", "#2e7d32", "#388e3c",
            "#263238", "#37474f", "#455a64", "#6a1b9a", "#8e24aa", "#ab47bc",
            "#e65100", "#ef6c00", "#f57c00", "#006064", "#00838f", "#0097a7",
            "#8b0000", "#b8860b"
        ],
        getColor: (index, total) => getIndexedColor(PALETTES.dragon.colors, index, total)
    },

    // D&D Classes & Archetypes
    wizard: {
        name: "Arcane Wizard (Mystra & The Weave)",
        colors: [
            "#1a237e", "#283593", "#303f9f", "#3949ab", "#3f51b5", "#311b92",
            "#4527a0", "#512da8", "#5e35b1", "#673ab7", "#006064", "#00838f",
            "#0097a7", "#00acc1", "#00bcd4", "#4a148c", "#6a1b9a", "#7b1fa2",
            "#8e24aa", "#9c27b0", "#0d47a1", "#1565c0", "#1976d2", "#1e88e5",
            "#2196f3", "#121858"
        ],
        getColor: (index, total) => getIndexedColor(PALETTES.wizard.colors, index, total)
    },
    bard: {
        name: "Bardic Tale (College of Lore)",
        colors: [
            "#7b112d", "#9a1738", "#b81d43", "#c23a5b", "#8b4513", "#a0522d",
            "#b8860b", "#d4af37", "#176b6d", "#1e8c8e", "#25abab", "#5c1d4e",
            "#732461", "#8a2b75", "#a13289", "#6b1428", "#851731", "#9f1a3a",
            "#a82f4d", "#74380e", "#884424", "#9d7208", "#b8972e", "#125456",
            "#177274", "#1e8c8c"
        ],
        getColor: (index, total) => getIndexedColor(PALETTES.bard.colors, index, total)
    },
    paladin: {
        name: "Divine Paladin (Holy Radiance & Smite)",
        colors: [
            "#b8860b", "#d4af37", "#e6c35c", "#f3d98b", "#28527a", "#3b6978",
            "#518596", "#84a9ac", "#795548", "#8d6e63", "#a1887f", "#3f51b5",
            "#5c6bc0", "#7986cb", "#b29500", "#cca800", "#e6bd00", "#ffd200",
            "#1f4263", "#2f5663", "#426f7d", "#6f9194", "#614337", "#73574e",
            "#856d65", "#32408f"
        ],
        getColor: (index, total) => getIndexedColor(PALETTES.paladin.colors, index, total)
    },
    druid: {
        name: "Druidic Circle (Ancient Wilderness)",
        colors: [
            "#1b4332", "#2d6a4f", "#40916c", "#52b788", "#74c69d", "#2d4a22",
            "#4a5d23", "#706d28", "#8c6b2d", "#7a4e2d", "#386641", "#6a994e",
            "#a7c957", "#bc4749", "#5c341e", "#3e4224", "#143526", "#22533d",
            "#327254", "#40916a", "#5cb086", "#213919", "#394819", "#57541d",
            "#705321", "#5e3a21"
        ],
        getColor: (index, total) => getIndexedColor(PALETTES.druid.colors, index, total)
    },
    rogue: {
        name: "Shadow Rogue (Thieves' Guild & Poison)",
        colors: [
            "#212529", "#343a40", "#495057", "#6c757d", "#1a3a2a", "#24523b",
            "#2d6a4f", "#3d131d", "#541927", "#6a2031", "#1b263b", "#415a77",
            "#1a1d20", "#282d32", "#3b4147", "#545b62", "#132d20", "#1b3f2d",
            "#23523c", "#2d0d14", "#40121d", "#531826", "#141d2d", "#31445b",
            "#141719", "#1f2327"
        ],
        getColor: (index, total) => getIndexedColor(PALETTES.rogue.colors, index, total)
    },
    warlock: {
        name: "Warlock Pact (Eldritch & Hellfire)",
        colors: [
            "#00e5ff", "#00b0ff", "#2979ff", "#651fff", "#d500f9", "#f50057",
            "#ff1744", "#311b92", "#4a148c", "#880e4f", "#004d40", "#006064",
            "#00b8d4", "#0091ea", "#1565c0", "#4527a0", "#aa00ff", "#c51162",
            "#d50000", "#23126d", "#360e66", "#610937", "#00332a", "#004144",
            "#007a8c", "#00619c"
        ],
        getColor: (index, total) => getIndexedColor(PALETTES.warlock.colors, index, total)
    },

    // Atmospheric & Aesthetic Palettes
    beneos: {
        name: "Beneos Amber & Mahogany",
        colors: [
            "#591812", "#6e2517", "#85361b", "#9c4820", "#b35d24",
            "#c27529", "#cc8c31", "#cfa242", "#ba8934", "#a16d28",
            "#87531f", "#6e3b17", "#592712", "#731f17", "#8c2f1c",
            "#a34321", "#b85827", "#c7722e", "#d18d38", "#d1a547",
            "#b88b37", "#9c6f29", "#80521d", "#663814", "#52240f", "#6b1b14"
        ],
        getColor: (index, total) => getIndexedColor(PALETTES.beneos.colors, index, total)
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
        getColor: (index, total) => getIndexedColor(PALETTES.darkFantasy.colors, index, total)
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
        getColor: (index, total) => getIndexedColor(PALETTES.earth.colors, index, total)
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
        getColor: (index, total) => getIndexedColor(PALETTES.nordic.colors, index, total)
    },
    pastel: {
        name: "Soft Pastel",
        getColor: (index, total) => {
            const hue = index / Math.max(1, total);
            return hslToHex(hue, 0.50, 0.65);
        }
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
        getColor: (index, total) => getIndexedColor(PALETTES.cyberpunk.colors, index, total)
    },
    rainbow: {
        name: "Vibrant Rainbow",
        getColor: (index, total) => {
            const hue = index / Math.max(1, total);
            return hslToHex(hue, 0.85, 0.45);
        }
    },
    monochrome: {
        name: "Monochrome Slate",
        getColor: (index, total) => {
            const factor = index / Math.max(1, total);
            const val = Math.round(40 + factor * 130);
            return rgbToHex([val, val + 4, val + 8]);
        }
    }
};

function getActivePalette() {
    const key = game.settings?.get("jenne-auto-color", "colorPalette") || "brokeSquad";
    return PALETTES[key] || PALETTES.brokeSquad;
}

function getFolderOpacity() {
    const val = Number(game.settings?.get("jenne-auto-color", "folderOpacity"));
    return isNaN(val) ? 0.4 : Math.max(0.05, Math.min(1, val));
}

// Calculate folder nesting depth (0 = top root folder, 1 = subfolder, 2 = sub-subfolder)
function getFolderDepth(folderEl) {
    let depth = 0;
    let curr = folderEl.parentElement;
    while (curr && !curr.classList?.contains("directory-list") && !curr.classList?.contains("sidebar-tab")) {
        if (curr.classList?.contains("folder") || (curr.dataset && curr.dataset.folderId)) {
            depth++;
        }
        curr = curr.parentElement;
    }
    return depth;
}

// Locate the topmost root parent folder in the hierarchy
function getRootParentFolder(folderEl) {
    let root = folderEl;
    let curr = folderEl.parentElement;
    while (curr && !curr.classList?.contains("directory-list") && !curr.classList?.contains("sidebar-tab")) {
        if (curr.classList?.contains("folder") || (curr.dataset && curr.dataset.folderId)) {
            root = curr;
        }
        curr = curr.parentElement;
    }
    return root;
}

// Extract cleaned folder title text
function getFolderTitleText(folderEl) {
    const titleEl = folderEl.querySelector(".folder-name, .folder-title, h3, h4") || folderEl.querySelector(".folder-header") || folderEl;
    const raw = (titleEl ? titleEl.textContent : folderEl.textContent)?.trim() || "";
    return raw.replace(/^[^a-zA-Z0-9]+/, "");
}

function applyColorToFolder(folder, hex, depth = 0) {
    let rgb = hexToRgb(hex);

    // Apply progressive depth luminance shading
    const depthShading = game.settings?.get("jenne-auto-color", "depthLuminance") || "lighter";
    if (depth > 0) {
        if (depthShading === "lighter") {
            rgb = adjustLuminance(rgb, Math.min(0.55, depth * 0.18));
        } else if (depthShading === "darker") {
            rgb = adjustLuminance(rgb, -Math.min(0.55, depth * 0.18));
        }
    }

    const baseOpacity = getFolderOpacity();
    let opacity = baseOpacity;
    if (depthShading === "subtleFade" && depth > 0) {
        opacity = Math.max(0.15, baseOpacity - (depth * 0.08));
    }

    const shadedHex = rgbToHex(rgb);
    const rgba = `rgba(${Math.round(rgb[0])}, ${Math.round(rgb[1])}, ${Math.round(rgb[2])}, ${opacity})`;

    // Set CSS variable for Foundry V14 native folder styling & borders
    folder.style.setProperty("--folder-color", shadedHex);
    folder.dataset.folderDepth = depth;

    // Apply indentation and direct background styling
    const indentAmount = Number(game.settings?.get("jenne-auto-color", "subfolderIndent")) || 0;
    const header = folder.querySelector(".folder-header") || folder.querySelector("header") || folder.firstElementChild;
    if (header) {
        header.style.setProperty("background-color", rgba, "important");
        header.style.setProperty("--folder-color", shadedHex);

        if (indentAmount > 0 && depth > 0) {
            header.style.setProperty("margin-left", `${depth * indentAmount}px`, "important");
        } else {
            header.style.removeProperty("margin-left");
        }
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
            case ColorMode.PARENTTREE:
                this.colorFoldersByParentTree(folders);
                break;
            case ColorMode.INITIALLETTER:
                this.colorFoldersByInitialLetter(folders);
                break;
            case ColorMode.INITIALNUMBER:
                this.colorFoldersByInitialNumber(folders);
                break;
            case ColorMode.DEPTHLEVEL:
                this.colorFoldersByDepthLevel(folders);
                break;
        }
    }

    /**
     * Mode 0: Parent Family Tree (Subfolders inherit & shade root parent's color)
     */
    static colorFoldersByParentTree(folders) {
        const alphabet = "abcdefghijklmnopqrstuvwxyz";
        const palette = getActivePalette();
        const rootColorCache = new Map();

        // Pass 1: Compute root parent colors
        folders.forEach(folder => {
            const depth = getFolderDepth(folder);
            if (depth === 0) {
                const cleanText = getFolderTitleText(folder);
                const char = cleanText[0]?.toLowerCase();
                const index = alphabet.indexOf(char);
                const hex = index !== -1 ? palette.getColor(index, 26) : "#555555";
                rootColorCache.set(folder, hex);
            }
        });

        // Pass 2: Apply color with depth step
        folders.forEach(folder => {
            const depth = getFolderDepth(folder);
            const root = getRootParentFolder(folder);
            let baseHex = rootColorCache.get(root);

            if (!baseHex) {
                const cleanText = getFolderTitleText(root);
                const char = cleanText[0]?.toLowerCase();
                const index = alphabet.indexOf(char);
                baseHex = index !== -1 ? palette.getColor(index, 26) : "#555555";
                rootColorCache.set(root, baseHex);
            }

            applyColorToFolder(folder, baseHex, depth);
        });
    }

    /**
     * Mode 1: Initial Letter (A-Z palette mapping)
     */
    static colorFoldersByInitialLetter(folders) {
        const alphabet = "abcdefghijklmnopqrstuvwxyz";
        const palette = getActivePalette();

        folders.forEach(folder => {
            const depth = getFolderDepth(folder);
            const cleanText = getFolderTitleText(folder);
            const char = cleanText[0]?.toLowerCase();
            const index = alphabet.indexOf(char);

            let hex;
            if (index !== -1) {
                hex = palette.getColor(index, 26);
            } else {
                hex = "#555555";
            }

            applyColorToFolder(folder, hex, depth);
        });
    }

    /**
     * Mode 2: Initial Number (0-9 palette mapping)
     */
    static colorFoldersByInitialNumber(folders) {
        const numbers = "0123456789";
        const palette = getActivePalette();

        folders.forEach(folder => {
            const depth = getFolderDepth(folder);
            const cleanText = getFolderTitleText(folder);
            const char = cleanText[0]?.toLowerCase();
            const index = numbers.indexOf(char);

            let hex;
            if (index !== -1) {
                hex = palette.getColor(index, 10);
            } else {
                hex = "#555555";
            }

            applyColorToFolder(folder, hex, depth);
        });
    }

    /**
     * Mode 3: Folder Depth Level (All folders at depth 0 get color 0, depth 1 get color 1, etc.)
     */
    static colorFoldersByDepthLevel(folders) {
        const palette = getActivePalette();

        folders.forEach(folder => {
            const depth = getFolderDepth(folder);
            const hex = palette.getColor(depth * 3, 26);
            applyColorToFolder(folder, hex, depth);
        });
    }
}

// Dedicated Settings HUD Form Application in Jenne Design System
class JenneAutoColorConfig extends FormApplication {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: "jenne-auto-color-config",
            classes: ["jenne-auto-color-window"],
            title: "Jenne Auto Color - Settings",
            template: "modules/jenne-auto-color/templates/config.hbs",
            width: 580,
            height: "auto",
            closeOnSubmit: false,
            resizable: true
        });
    }

    getData() {
        const opacity = Number(game.settings.get("jenne-auto-color", "folderOpacity")) || 0.4;
        return {
            autoColorFolder: game.settings.get("jenne-auto-color", "autoColorFolder"),
            selectColorMode: Number(game.settings.get("jenne-auto-color", "selectColorMode")) || 0,
            colorPalette: game.settings.get("jenne-auto-color", "colorPalette") || "brokeSquad",
            folderOpacity: opacity,
            percentOpacity: `${Math.round(opacity * 100)}%`,
            subfolderIndent: Number(game.settings.get("jenne-auto-color", "subfolderIndent")) ?? 14,
            depthLuminance: game.settings.get("jenne-auto-color", "depthLuminance") || "lighter",
            depthTreeLines: game.settings.get("jenne-auto-color", "depthTreeLines") ?? true
        };
    }

    activateListeners(html) {
        super.activateListeners(html);
        const root = html[0];
        const form = root.querySelector("form") || root;

        // "Apply Settings" button (saves, applies live, keeps window open)
        html.find('[data-action="apply"]').click(async (ev) => {
            ev.preventDefault();
            await this._saveFormValues(form);
            ui.notifications.info("Jenne Auto Color settings applied!");
        });

        // "Close" button (closes window)
        html.find('[data-action="close"]').click((ev) => {
            ev.preventDefault();
            this.close();
        });

        // Live instant preview on dropdown / input / slider change
        form.querySelectorAll("select, input").forEach(input => {
            input.addEventListener("change", async () => {
                await this._saveFormValues(form);
            });
        });
    }

    async _saveFormValues(form) {
        const formData = new FormDataExtended(form).object;
        for (const [key, value] of Object.entries(formData)) {
            await game.settings.set("jenne-auto-color", key, value);
        }
        refreshDirectories();
    }

    async _updateObject(event, formData) {
        for (const [key, value] of Object.entries(formData)) {
            await game.settings.set("jenne-auto-color", key, value);
        }
        refreshDirectories();
    }
}

globalThis.JenneAutoColorConfig = JenneAutoColorConfig;

// Function to refresh sidebar directories immediately when settings change
const refreshDirectories = () => {
    // Update body class for tree lines
    const showTreeLines = game.settings?.get("jenne-auto-color", "depthTreeLines");
    if (typeof document !== "undefined" && document.body) {
        document.body.classList.toggle("jenne-tree-lines", !!showTreeLines);
    }

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
    // Register Settings Menu
    game.settings.registerMenu("jenne-auto-color", "configMenu", {
        name: "Jenne Auto Color Settings HUD",
        label: "Configure Jenne Auto Color",
        hint: "Open the complete Jenne Auto Color settings dashboard",
        icon: "fas fa-palette",
        type: JenneAutoColorConfig,
        restricted: false
    });

    // Mode Selection (Default to Parent Family Tree)
    game.settings.register("jenne-auto-color", "selectColorMode", {
        name: game.i18n.localize("JENNEAUTOCOLOR.selectColorMode"),
        hint: game.i18n.localize("JENNEAUTOCOLOR.selectColorModeHint"),
        scope: "client",
        config: true,
        default: 0, // Parent Family Tree
        type: Number,
        choices: {
            0: "JENNEAUTOCOLOR.options.colormode.choices.0",
            1: "JENNEAUTOCOLOR.options.colormode.choices.1",
            2: "JENNEAUTOCOLOR.options.colormode.choices.2",
            3: "JENNEAUTOCOLOR.options.colormode.choices.3"
        },
        onChange: refreshDirectories
    });

    // Palette Selection (Default to Broke Squad)
    game.settings.register("jenne-auto-color", "colorPalette", {
        name: game.i18n.localize("JENNEAUTOCOLOR.colorPalette"),
        hint: game.i18n.localize("JENNEAUTOCOLOR.colorPaletteHint"),
        scope: "client",
        config: true,
        default: "brokeSquad",
        type: String,
        choices: {
            "brokeSquad": "JENNEAUTOCOLOR.options.palette.brokeSquad",
            "forgottenConsensus": "JENNEAUTOCOLOR.options.palette.forgottenConsensus",
            "elven": "JENNEAUTOCOLOR.options.palette.elven",
            "dwarven": "JENNEAUTOCOLOR.options.palette.dwarven",
            "mordor": "JENNEAUTOCOLOR.options.palette.mordor",
            "underdark": "JENNEAUTOCOLOR.options.palette.underdark",
            "dragon": "JENNEAUTOCOLOR.options.palette.dragon",
            "wizard": "JENNEAUTOCOLOR.options.palette.wizard",
            "bard": "JENNEAUTOCOLOR.options.palette.bard",
            "paladin": "JENNEAUTOCOLOR.options.palette.paladin",
            "druid": "JENNEAUTOCOLOR.options.palette.druid",
            "rogue": "JENNEAUTOCOLOR.options.palette.rogue",
            "warlock": "JENNEAUTOCOLOR.options.palette.warlock",
            "beneos": "JENNEAUTOCOLOR.options.palette.beneos",
            "darkFantasy": "JENNEAUTOCOLOR.options.palette.darkFantasy",
            "earth": "JENNEAUTOCOLOR.options.palette.earth",
            "nordic": "JENNEAUTOCOLOR.options.palette.nordic",
            "pastel": "JENNEAUTOCOLOR.options.palette.pastel",
            "cyberpunk": "JENNEAUTOCOLOR.options.palette.cyberpunk",
            "rainbow": "JENNEAUTOCOLOR.options.palette.rainbow",
            "monochrome": "JENNEAUTOCOLOR.options.palette.monochrome"
        },
        onChange: refreshDirectories
    });

    // Subfolder Extra Indentation
    game.settings.register("jenne-auto-color", "subfolderIndent", {
        name: game.i18n.localize("JENNEAUTOCOLOR.subfolderIndent"),
        hint: game.i18n.localize("JENNEAUTOCOLOR.subfolderIndentHint"),
        scope: "client",
        config: true,
        type: Number,
        default: 14,
        range: {
            min: 0,
            max: 30,
            step: 2
        },
        onChange: refreshDirectories
    });

    // Depth Luminance Tone
    game.settings.register("jenne-auto-color", "depthLuminance", {
        name: game.i18n.localize("JENNEAUTOCOLOR.depthLuminance"),
        hint: game.i18n.localize("JENNEAUTOCOLOR.depthLuminanceHint"),
        scope: "client",
        config: true,
        default: "lighter",
        type: String,
        choices: {
            "lighter": "JENNEAUTOCOLOR.options.depthLuminance.lighter",
            "darker": "JENNEAUTOCOLOR.options.depthLuminance.darker",
            "subtleFade": "JENNEAUTOCOLOR.options.depthLuminance.subtleFade",
            "none": "JENNEAUTOCOLOR.options.depthLuminance.none"
        },
        onChange: refreshDirectories
    });

    // Tree Guide Lines
    game.settings.register("jenne-auto-color", "depthTreeLines", {
        name: game.i18n.localize("JENNEAUTOCOLOR.depthTreeLines"),
        hint: game.i18n.localize("JENNEAUTOCOLOR.depthTreeLinesHint"),
        scope: "client",
        config: true,
        type: Boolean,
        default: true,
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
});

Hooks.once("ready", () => {
    // Apply initial tree line class
    if (game.settings?.get("jenne-auto-color", "depthTreeLines") && document.body) {
        document.body.classList.add("jenne-tree-lines");
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
