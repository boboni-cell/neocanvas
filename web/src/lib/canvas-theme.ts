export type CanvasColorTheme = "light" | "dark";
export type CanvasBackgroundMode = "dots" | "lines" | "blank";

export const canvasThemes = {
    light: {
        canvas: {
            background: "#f4f2ed",
            dot: "rgba(68,64,60,.28)",
            line: "rgba(68,64,60,.12)",
            selectionStroke: "#1c1917",
            selectionFill: "rgba(28,25,23,.06)",
        },
        node: {
            label: "#57534e",
            fill: "#e7e5df",
            panel: "#fbfaf7",
            stroke: "#d6d3ca",
            activeStroke: "#1c1917",
            placeholder: "#8a8479",
            text: "#292524",
            muted: "#78716c",
            faint: "#a8a29e",
        },
        toolbar: {
            panel: "rgba(251,250,247,.96)",
            border: "#d6d3ca",
            item: "#57534e",
            itemHover: "#e7e5df",
            activeBg: "#e7e5df",
            activeText: "#292524",
        },
    },
    dark: {
        canvas: {
            background: "#050505",
            dot: "rgba(0,255,102,.30)",
            line: "rgba(255,255,255,.08)",
            selectionStroke: "#00ff66",
            selectionFill: "rgba(0,255,102,.10)",
        },
        node: {
            label: "#a3a3a3",
            fill: "#131313",
            panel: "#0d0d0d",
            stroke: "#262626",
            activeStroke: "#00ff66",
            placeholder: "#525252",
            text: "#f2f2f2",
            muted: "#a3a3a3",
            faint: "#525252",
        },
        toolbar: {
            panel: "rgba(10,10,10,.96)",
            border: "#222222",
            item: "#d4d4d4",
            itemHover: "#181818",
            activeBg: "rgba(0,255,102,.12)",
            activeText: "#00ff66",
        },
    },
} as const;

export type CanvasTheme = (typeof canvasThemes)[CanvasColorTheme];
