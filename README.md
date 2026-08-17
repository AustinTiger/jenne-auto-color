# Jenne Auto Color Folder

A modern, fast, and dependency-free auto-coloring module for Foundry VTT v14.

Automatically colors folders and subfolders in your sidebar directories using a customizable gradient, or by their initial letter or number.

## Features

- **No Dependencies:** Relies entirely on Foundry VTT's built-in `Color` class and `<color-picker>` elements, eliminating the need for bulky third-party color settings libraries.
- **Recursive Subfolder Support:** Automatically styles top-level folders and all nested subfolders alike.
- **Multiple Coloring Modes:**
  - **Gradient:** Pick a starting color, and folders will cascade down in a beautiful gradient.
  - **Initial Letter:** Colors folders dynamically based on the first letter of their name.
  - **Initial Number:** Colors folders dynamically based on the first number of their name.
- **Instant Updates:** Settings save and apply instantly without requiring a full browser reload.

## Compatibility

- **Foundry VTT:** Verified for v14.

## Installation

1. Clone or download this repository into your Foundry VTT `Data/modules/` directory.
2. The folder name should be `jenne-auto-color`.
3. Enable the module in your world settings.

## Configuration

Navigate to your Foundry Settings -> Module Settings to select your desired color mode and pick your starting colors for each directory tab (Actors, Scenes, Items, etc.).
