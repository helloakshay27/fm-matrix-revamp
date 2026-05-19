/**
 * colorPatch.ts — Runtime color patcher for Lockated brand consistency
 *
 * Purpose: Override legacy red colors (#C72030, #C62828, #B71C1C and their
 * rgb equivalents) that are baked into MUI sx-generated inline styles or
 * other component-level inline style="" attributes that CSS class selectors
 * cannot reach.
 *
 * Strategy:
 *  1. On DOMContentLoaded inject a high-priority <style> tag that covers
 *     [style*="…"] attribute selectors for known inline color patterns.
 *  2. Set up a MutationObserver so dynamically rendered elements (modals,
 *     drawers, tooltips rendered in portals) are also patched.
 *  3. Never mutate className — only inject/refresh the <style> block and
 *     patch element.style properties directly to avoid React reconciliation
 *     conflicts.
 */

const BRAND_PRIMARY = "#da7756";
const BRAND_HOVER = "#c9664a";
const BRAND_LIGHT = "rgba(218,119,86,0.08)";

// Legacy colours to replace (as they appear in inline style="" attributes)
const OLD_HEX = ["#C72030", "#c72030", "#C62828", "#c62828", "#B71C1C", "#b71c1c", "#A01020", "#a01020"];
// MUI converts hex → rgb at runtime; these are the corresponding rgb() values
const OLD_RGB = [
    "rgb(199, 32, 48)",   // #C72030
    "rgb(198, 40, 40)",   // #C62828
    "rgb(183, 28, 28)",   // #B71C1C
    "rgb(160, 16, 32)",   // #A01020
];

const STYLE_TAG_ID = "lockated-color-patch";

/** Build CSS that overrides inline style attributes containing old colours */
function buildPatchCSS(): string {
    const rules: string[] = [];

    const allOldColours = [...OLD_HEX, ...OLD_RGB];

    allOldColours.forEach((old) => {
        const escaped = old.replace(/[#(),. ]/g, (c) => `\\${c}`);

        // Elements whose inline style sets background-color / border-color
        // NOTE: do NOT set `color` here — buttons and text elements manage their
        // own text colour. Setting it globally causes white-on-orange to become
        // orange-on-orange (invisible text).
        rules.push(`
[style*="${old}"] {
  background-color: transparent !important;
  border-color: ${BRAND_PRIMARY} !important;
}`);

        // Elements that ARE a solid-fill button (they keep bg)
        rules.push(`
button[style*="${old}"],
[role="button"][style*="${old}"],
a[style*="${old}"] {
  background-color: ${BRAND_PRIMARY} !important;
  border-color: ${BRAND_PRIMARY} !important;
  color: #ffffff !important;
}`);
    });

    // MUI Switch thumb/track
    OLD_RGB.forEach((old) => {
        rules.push(`
.MuiSwitch-colorPrimary.Mui-checked + .MuiSwitch-track,
.MuiSwitch-colorSecondary.Mui-checked + .MuiSwitch-track {
  background-color: ${BRAND_PRIMARY} !important;
  opacity: 0.5 !important;
}
.MuiSwitch-colorPrimary.Mui-checked .MuiSwitch-thumb,
.MuiSwitch-colorSecondary.Mui-checked .MuiSwitch-thumb {
  color: ${BRAND_PRIMARY} !important;
}`);
    });

    // MUI Checkbox / Radio checked state
    rules.push(`
.MuiCheckbox-colorPrimary.Mui-checked,
.MuiRadio-colorPrimary.Mui-checked {
  color: ${BRAND_PRIMARY} !important;
}
.MuiCheckbox-colorSecondary.Mui-checked,
.MuiRadio-colorSecondary.Mui-checked {
  color: ${BRAND_PRIMARY} !important;
}`);

    // MUI Button contained primary
    rules.push(`
.MuiButton-containedPrimary,
.MuiButton-contained[class*="primary"] {
  background-color: ${BRAND_PRIMARY} !important;
  border-color: ${BRAND_PRIMARY} !important;
}
.MuiButton-containedPrimary:hover,
.MuiButton-contained[class*="primary"]:hover {
  background-color: ${BRAND_HOVER} !important;
}`);

    // MUI OutlinedInput focused border
    rules.push(`
.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline,
.MuiInput-underline.Mui-focused:after,
.MuiFilledInput-underline.Mui-focused:after {
  border-color: ${BRAND_PRIMARY} !important;
}
.MuiFormLabel-root.Mui-focused,
.MuiInputLabel-root.Mui-focused {
  color: ${BRAND_PRIMARY} !important;
}`);

    // MUI Tabs indicator
    rules.push(`
.MuiTabs-indicator {
  background-color: ${BRAND_PRIMARY} !important;
}
.MuiTab-root.Mui-selected {
  color: ${BRAND_PRIMARY} !important;
}`);

    return rules.join("\n");
}

/** Inject (or refresh) the <style> patch tag */
function injectPatchStyle(): void {
    let tag = document.getElementById(STYLE_TAG_ID) as HTMLStyleElement | null;
    if (!tag) {
        tag = document.createElement("style");
        tag.id = STYLE_TAG_ID;
        // Append to end of <head> so it has highest cascade position
        document.head.appendChild(tag);
    }
    tag.textContent = buildPatchCSS();
}

/** Walk existing DOM elements and patch inline style attributes directly */
function patchExistingElements(): void {
    const elements = document.querySelectorAll<HTMLElement>("[style]");
    elements.forEach(patchElement);
}

function patchElement(el: HTMLElement): void {
    const style = el.getAttribute("style") || "";
    if (!containsOldColour(style)) return;

    OLD_HEX.forEach((old) => {
        const lc = old.toLowerCase();
        if (el.style.color.toLowerCase() === lc) el.style.color = BRAND_PRIMARY;
        if (el.style.backgroundColor.toLowerCase() === lc) el.style.backgroundColor = BRAND_PRIMARY;
        if (el.style.borderColor.toLowerCase() === lc) el.style.borderColor = BRAND_PRIMARY;
    });

    OLD_RGB.forEach((old) => {
        if (el.style.color === old) el.style.color = BRAND_PRIMARY;
        if (el.style.backgroundColor === old) el.style.backgroundColor = BRAND_PRIMARY;
        if (el.style.borderColor === old) el.style.borderColor = BRAND_PRIMARY;
    });
}

function containsOldColour(str: string): boolean {
    const s = str.toLowerCase();
    return (
        OLD_HEX.some((c) => s.includes(c.toLowerCase())) ||
        OLD_RGB.some((c) => s.includes(c.toLowerCase()))
    );
}

/** Patch SVG fill/stroke/color attributes (Recharts cells, paths, Lucide icons, etc.) */
function patchSvgElement(el: SVGElement): void {
    const fill = el.getAttribute("fill") || "";
    const stroke = el.getAttribute("stroke") || "";
    const color = el.getAttribute("color") || "";
    if (OLD_HEX.some((c) => fill.toLowerCase() === c.toLowerCase())) {
        el.setAttribute("fill", BRAND_PRIMARY);
    }
    if (OLD_HEX.some((c) => stroke.toLowerCase() === c.toLowerCase())) {
        el.setAttribute("stroke", BRAND_PRIMARY);
    }
    if (OLD_HEX.some((c) => color.toLowerCase() === c.toLowerCase())) {
        el.setAttribute("color", BRAND_PRIMARY);
    }
}

function patchSvgFills(): void {
    OLD_HEX.forEach((old) => {
        document
            .querySelectorAll<SVGElement>(`[fill="${old}"], [fill="${old.toLowerCase()}"], [fill="${old.toUpperCase()}"]`)
            .forEach((el) => el.setAttribute("fill", BRAND_PRIMARY));
        document
            .querySelectorAll<SVGElement>(`[stroke="${old}"], [stroke="${old.toLowerCase()}"], [stroke="${old.toUpperCase()}"]`)
            .forEach((el) => el.setAttribute("stroke", BRAND_PRIMARY));
        // Lucide icons use the HTML `color` attribute
        document
            .querySelectorAll<SVGElement>(`[color="${old}"], [color="${old.toLowerCase()}"], [color="${old.toUpperCase()}"]`)
            .forEach((el) => el.setAttribute("color", BRAND_PRIMARY));
    });
}

/** Public init — call once in main.tsx */
export function initColorPatch(): void {
    // 1. Inject the CSS <style> block immediately (even before DOM ready)
    if (document.head) {
        injectPatchStyle();
    }

    const run = () => {
        injectPatchStyle();
        patchExistingElements();
        patchSvgFills();
    };

    // 2. Run after initial paint
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", run);
    } else {
        run();
    }

    // 3. Watch for dynamic mutations (modals, drawers, portals)
    const observer = new MutationObserver((mutations) => {
        let needsSvgPatch = false;
        mutations.forEach((m) => {
            m.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const el = node as HTMLElement;
                    patchElement(el);
                    el.querySelectorAll<HTMLElement>("[style]").forEach(patchElement);
                    needsSvgPatch = true;
                }
            });
            // Also catch attribute mutations where style is updated
            if (m.type === "attributes" && m.attributeName === "style") {
                patchElement(m.target as HTMLElement);
            }
            if (m.type === "attributes" && m.attributeName === "fill") {
                patchSvgElement(m.target as SVGElement);
            }
            if (m.type === "attributes" && m.attributeName === "color") {
                patchSvgElement(m.target as SVGElement);
            }
        });
        if (needsSvgPatch) patchSvgFills();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["style", "fill", "stroke", "color"],
    });
}
