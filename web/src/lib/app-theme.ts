import type { CSSProperties } from "react";
import type { ThemeConfig } from "antd";
import { theme as antdTheme } from "antd";

const neon = {
    light: {
        primary: "#00b84a",
        primaryHover: "#009a3f",
        primaryText: "#04150a",
        menuBg: "#f4f4f4",
        menuText: "#171717",
        selectActiveBg: "#f4f4f4",
        selectSelectedBg: "#e8f7ee",
        selectText: "#0a5c2b",
        tableSelectedBg: "rgba(0, 184, 74, 0.07)",
        tableSelectedHoverBg: "rgba(0, 184, 74, 0.12)",
    },
    dark: {
        primary: "#00ff66",
        primaryHover: "#33ff85",
        primaryText: "#03150a",
        menuBg: "#0d0d0d",
        menuText: "#f0f0f0",
        selectActiveBg: "#0d0d0d",
        selectSelectedBg: "rgba(0, 255, 102, 0.14)",
        selectText: "#00ff66",
        tableSelectedBg: "rgba(0, 255, 102, 0.08)",
        tableSelectedHoverBg: "rgba(0, 255, 102, 0.14)",
    },
};

export const adminLayoutStyle = {
    siderWidth: 232,
    headerHeight: 56,
    brandHeight: 64,
    menu: { borderInlineEnd: 0, padding: "18px 12px", fontSize: 15 } satisfies CSSProperties,
    menuItem: { height: 44, lineHeight: "44px", marginBlock: 4, borderRadius: 8 } satisfies CSSProperties,
};

export function getAntThemeConfig(dark: boolean): ThemeConfig {
    const color = dark ? neon.dark : neon.light;

    return {
        algorithm: dark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        cssVar: { key: dark ? "neocanvas-dark" : "neocanvas-light" },
        token: {
            colorPrimary: color.primary,
            colorInfo: color.primary,
            colorLink: color.primary,
            colorLinkHover: color.primaryHover,
            colorLinkActive: color.primary,
            colorTextLightSolid: color.primaryText,
        },
        components: {
            Button: {
                primaryShadow: "none",
            },
            Menu: {
                itemActiveBg: color.menuBg,
                itemHoverBg: color.menuBg,
                itemSelectedBg: color.menuBg,
                itemSelectedColor: color.menuText,
                darkItemHoverBg: neon.dark.menuBg,
                darkItemSelectedBg: neon.dark.menuBg,
                darkItemSelectedColor: neon.dark.menuText,
            },
            Select: {
                optionActiveBg: color.selectActiveBg,
                optionSelectedBg: color.selectSelectedBg,
                optionSelectedColor: color.selectText,
            },
            Table: {
                rowSelectedBg: color.tableSelectedBg,
                rowSelectedHoverBg: color.tableSelectedHoverBg,
            },
        },
    };
}
