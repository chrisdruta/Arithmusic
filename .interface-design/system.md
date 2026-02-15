# Arithmusic Design System

## Intent

**Who:** A curious tinkerer at the intersection of math and music. Someone who opens a graphing calculator for fun, hears a sine wave and thinks "what if I add harmonics?" Late night, headphones on, exploring.

**Task:** Write mathematical expressions that become sound. Arrange them into tracks. Hit play and hear the math. Tweak, re-listen, iterate.

**Feel:** A **Casio fx-6300G scientific calculator** — the dark injection-molded shell, LCD phosphor glow, beveled plastic keys, the solar panel stripe. Not retro as decoration — retro as *instrument*. The kind of object that felt powerful in your hands.

## Direction

**Domain:** Scientific calculators, LCD displays, phosphor screens, graphing calculator UI
**Metaphor:** The entire app is one calculator. The graph is the LCD screen. The editor is the keypad. The header is the model label strip.
**Signature elements:** Solar panel stripe, LCD scanlines + pixel grid, beveled `calc` button variants, phosphor glow on active states

---

## Palette

### Shell (calculator body)
| Token | Hex | Role |
|-------|-----|------|
| `background` | `#1c1c1e` | Outer shell, deepest surface |
| `surface` | `#222224` | Track rows, mid-level panels |
| `surface-alt` | `#2c2c2e` | Header, controls bar, accordion trigger |
| `secondary` | `#2a2a2c` | Button fills, hover states |
| `muted` | `#2a2a2c` | Input backgrounds, subdued fills |
| `border` | `#3a3a38` | Structural separators |
| `foreground` | `#c8c8c0` | Body text (warm gray, not pure white) |
| `muted-foreground` | `#808078` | Labels, secondary text |

### LCD Screen
| Token | Hex | Role |
|-------|-----|------|
| `lcd-bg` | `#0a1a0a` | Graph background, editor panel bg |
| `lcd-green` / `highlight` | `#33ff66` | Primary LCD phosphor — traces, selected states, active text |
| `lcd-grid` | `#0d2e0d` | Graph gridlines, slider tracks |
| `lcd-dim` | `#1a6633` | Muted LCD text (slider labels, domain toggle inactive) |

### Signal Colors
| Token | Hex | Role |
|-------|-----|------|
| `primary` | `#2255cc` | Play/pause buttons, focus rings, links |
| `accent` / `destructive` | `#cc3333` | Stop button, delete actions, math operators in syntax highlighting |
| `amber` | `#d4a017` | Track 2 trace, number literals in syntax highlighting |
| `func-blue` | `#66aaff` | Track 3 trace, function names in syntax highlighting |

> **Note:** `accent` and `destructive` are intentionally the same color (`#cc3333`). In this calculator theme, red means "stop/danger" universally — there's no need to distinguish "hover highlight" (shadcn's `accent`) from "danger" (shadcn's `destructive`). Use either token interchangeably for red elements.

### Track Colors (graph traces, ordered)
1. `lcd-green` (`#33ff66`)
2. `amber` (`#d4a017`)
3. `func-blue` (`#66aaff`)
4. `accent` (`#cc3333`)

Unselected tracks render at `0.3` opacity. Selected track renders at full opacity, `strokeWidth: 2`.

---

## Typography

| Role | Font | Size | Weight | Tracking | Extras |
|------|------|------|--------|----------|--------|
| **Body** | `Share Tech Mono` | `text-base` | normal | default | Monospace throughout |
| **Display/branding** | `VT323` | varies | bold | `tracking-tight` | Header title |
| **Labels** | `Share Tech Mono` | `text-sm` | normal | `tracking-wider` | `uppercase text-muted-foreground` |
| **Tagline** | `Share Tech Mono` | `text-[10px]` | normal | `tracking-[0.3em]` | `uppercase text-muted-foreground` |
| **Slider captions** | `VT323` (`font-display`) | `text-xs` | normal | `tracking-wide` | `italic text-lcd-dim` |
| **Code/data** | `font-mono` | `text-xs` | normal | default | Template expressions, JSON |
| **Accordion trigger** | `Share Tech Mono` | `text-sm` | `font-semibold` | `tracking-widest` | `uppercase` |

All fonts are monospace. No sans-serif anywhere.

---

## Spacing

**Base unit:** 4px (Tailwind default)

### Common patterns
| Context | Values |
|---------|--------|
| **Section padding** | `px-4 py-2` (header), `px-6 py-5` (editor panel), `p-6` (dialogs) |
| **Controls bar** | `px-2.5 pb-2.5` |
| **Track row** | `px-2.5 py-1` (options), `p-2` (timeline) |
| **Gaps** | `gap-1` (tight groups), `gap-2` (form fields), `gap-4` (dialog sections), `gap-5` (editor panel items), `gap-6` (settings columns) |
| **Segment chips** | `px-2 py-1.5 ml-1` |

---

## Depth

### Elevation model
The app uses a **border + bevel** system, not box-shadows for elevation. Shadows are reserved for two specific uses:

1. **`calc` variant bevel** — 3D pressed-plastic effect (defined in button.tsx + toggle.tsx cva variants):
   ```
   border-t-[#555] border-l-[#555] border-b-[#222] border-r-[#222]
   shadow-[1px_1px_0px_#111,inset_0_1px_0_rgba(255,255,255,0.08)]
   active: shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] translate-y-px
   ```

2. **LCD inset** — recessed screen effect (domain toggle, graph container):
   ```
   shadow-[inset_0_1px_3px_rgba(0,0,0,0.5),0_0_6px_rgba(51,255,102,0.08)]
   ```

3. **Dropdown menus** — minimal pixel shadow:
   ```
   shadow-[1px_1px_0px_#111]
   ```

4. **`glow-lcd`** — drag feedback:
   ```
   shadow-[0_0_8px_rgba(51,255,102,0.3)]
   ```

### Surface stacking (bottom to top)
`background` → `surface` → `surface-alt` → `lcd-bg` (recessed into surface)

---

## Corners

Boxy. This is a calculator, not a phone app.

| Token | Value | Use |
|-------|-------|-----|
| `--radius` | `2px` | Default, buttons |
| `--radius-sm` | `2px` | Small elements |
| `--radius-md` | `3px` | Inputs, dialogs |
| `--radius-lg` | `4px` | Containers |
| `--radius-xl` | `6px` | Outer wrappers (rare) |

---

## Components

### Buttons (calc variants)
Beveled 3D button styles are proper `cva` variants in `button.tsx`, not CSS utilities. Each variant bundles the bevel effect (border-t/l `#555`, border-b/r `#222`, inset highlight, active press) with its color scheme.

| Variant | Color | Usage |
|---------|-------|-------|
| `calc` | `bg-primary` | Play, Pause, modal primary actions (Close, Load) |
| `calc-secondary` | `bg-secondary` | Track controls, Save, Load, template dropdowns |
| `calc-accent` | `bg-accent` | Stop button |
| `ghost` | transparent | Add segment (no bevel) |
| `ghost-destructive` | `text-muted-foreground` → `hover:text-destructive` | Delete segment (no bevel, red on hover) |

Sizes: `size="icon"` for header toolbar, `size="sm"` for editor controls and modals.

### Inputs
Input has cva `size` variants (like Button):

| Size | Height | Text | Usage |
|------|--------|------|-------|
| `default` | `h-9` | `text-base` | Fallback (rarely used directly) |
| `sm` | `h-8` | `text-sm` | Track options (compact rows) |
| `lg` | `h-11` | `text-base` | Editor panel, form fields, equations |

- Error state: `border-destructive` via `className`
- Paired with `<Label>` using `htmlFor`/`id` association
- Native `size` attribute is omitted from props to avoid conflict with the variant

### Form Fields
Reusable `<FormField>` wraps `Label` + `Input` + error message. Defaults to `size="lg"`:
```
<FormField label="Title" value={...} error={...} onChange={...} />
```
Renders:
```
<div className="flex flex-col gap-2">
  <Label htmlFor={id} className="text-sm text-muted-foreground uppercase tracking-wider">
  <Input id={id} size="lg" />
  {error && <p className="text-sm text-destructive">}
</div>
```

### Toggle Groups (wave type selector)
Items use `variant="calc"` (defined as a toggle cva variant in `toggle.tsx`) + LCD highlight for active state:
```
variant="calc" → bevel borders + shadow
data-[state=on]:bg-highlight/12 data-[state=on]:text-highlight
```

### Segment Chips (track timeline)
Draggable segments styled as small calculator keys with inline bevel styles (not a Button component — these are `<div>` elements within drag-and-drop):
```
rounded-sm px-2 py-1.5 text-sm + inline bevel borders/shadow
Selected: bg-secondary text-highlight border-b-2 border-b-highlight
Default: bg-surface text-foreground border-b-2 border-b-transparent
Dragging: glow-lcd
```

### Dialogs (modals)
- Standard shadcn Dialog with `bg-background`
- Default max width: `sm:max-w-lg` or `sm:max-w-xl`
- Padding: `p-6`, `gap-4`
- Close button hidden via `showCloseButton={false}`; explicit footer buttons instead

### Graph (LCD screen)
Container: `lcd-scanlines lcd-pixel-grid relative border-2 border-border bg-lcd-bg`
- Scanline overlay via `::after` pseudo-element
- Optional pixel grid overlay composited with scanlines
- Visx SVG with phosphor-colored traces
- Playhead: dashed green line with gaussian blur glow filter

### Domain Toggle
Custom segmented control styled as LCD sub-display:
- `bg-lcd-bg border-lcd-dim`
- Active state: `text-highlight` with text-shadow glow `0_0_8px_rgba(51,255,102,0.6)`
- Sliding indicator: `bg-highlight/8 border-highlight/15`

### Solar Panel
Decorative header stripe:
```
h-2 bg-[repeating-linear-gradient(to_right,#1a1a1e_0px,#1a1a1e_3px,#0e0e12_3px,#0e0e12_4px)]
```

---

## Transitions

| Context | Duration | Properties |
|---------|----------|------------|
| Button press | `75ms` | `all` (via `transition-all`) |
| Segment hover/select | `75ms` | `background, color, border-color, box-shadow` |
| Domain toggle slide | `200ms` | `transform` with `cubic-bezier(0.4, 0, 0.2, 1)` |
| Domain toggle text | `150ms` | `colors` |
| Accordion | `200ms` | `transform` (chevron), built-in radix animation |
| Dialog | `200ms` | `fade + zoom (95%)` |

---

## Syntax Highlighting

Math expressions are colorized consistently in both the equation input (CSS overlay) and KaTeX output (LaTeX `\textcolor`):

| Token type | Color | Token |
|------------|-------|-------|
| Functions (`sin`, `cos`, etc.) | `#66aaff` | `func-blue` |
| Constants (`pi`, `e`) | `#33ff66` | `lcd-green` |
| Variable (`x`) | `#33ff66` | `lcd-green` |
| Numbers | `#d4a017` | `amber` |
| Operators (`+`, `-`, `*`, `/`) | `#cc3333` | `accent` |
| Parentheses | `#808078` | `muted-foreground` |

---

## Layout Structure

```
┌─ solar-panel (decorative 2px stripe) ─────────────────────┐
├─ header (surface-alt, border-b) ──────────────────────────┤
│  Logo/title  │  spacer  │  Play │ Pause │ Stop │ Settings │
├─ graph (lcd-bg, flex-1, lcd-scanlines) ───────────────────┤
│  Visx SVG with traces + playhead                          │
├─ accordion trigger (surface-alt) ─────────────────────────┤
├─ editor controls (surface-alt) ───────────────────────────┤
│  +Track │ Templates... │ Domain │ Load │ Save              │
├─ track rows ──────────────────────────────────────────────┤
│  TrackOptions │ TrackTimeline (droppable segment chips)    │
├─ editor panel (lcd-bg, lcd-scanlines) ────────────────────┤
│  Title │ Equation │ Length │ Volume │ Output │ Delete      │
└───────────────────────────────────────────────────────────┘
```

Graph takes `flex-1` and fills available space. Editor is `flex-none` at the bottom.

---

## shadcn/ui Conventions

- **Variants over className.** Repeated style patterns must be cva variants, not `className` overrides. If you're passing `className="bg-X text-X-foreground hover:bg-X/90"` to override a variant, create a new variant instead.
- **No raw `<button>` elements.** Always use the `<Button>` component with the appropriate variant.
- **Component-specific styles in components.** The `@layer utilities` in `index.css` is reserved for genuinely generic utilities (`glow-lcd`, `solar-panel`) and pseudo-element effects that Tailwind can't express. Button/toggle bevel styles live in their respective cva definitions.
- **`className` is for one-off tweaks only.** Acceptable: `className="self-center"` (layout), `className="w-32"` (width). Not acceptable: overriding colors or interactive states that should be a variant.
- **Custom CSS lives in `index.css` only when Tailwind can't express it:** vendor-prefixed sliders, pseudo-element overlays (`::after`), third-party class overrides (`.katex`).
- **Strip all `dark:` classes from new components.** The app is permanently dark-themed (rule #10). When adding components via `bunx shadcn@latest add`, remove all `dark:` prefixed classes — they're dead code here.
- **Replace `rounded-md` with `rounded-sm`** in any newly added shadcn component. Official defaults use `rounded-md`; our calculator aesthetic uses `rounded-sm` (2px) everywhere.
- **No `"use client"` directives.** This is a Vite project, not Next.js. Strip `"use client"` from all components for consistency.
- **Focus ring pattern.** All interactive elements use the same v4 pattern: `outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]`. Do not use the old `focus:ring-2 focus:ring-offset-2` pattern.
- **Bevel duplication trade-off.** The calc bevel string is duplicated across `calc`, `calc-secondary`, `calc-accent` variants (and in `toggle.tsx`). This is a known trade-off since cva doesn't support composing variant fragments. If the bevel values change, update all 4 locations.

---

## Rules

1. **Everything is monospace.** No sans-serif fonts.
2. **Buttons get beveled.** Any clickable rectangle uses a `calc` / `calc-secondary` / `calc-accent` variant unless it's a ghost/link. Bevel styles live in component cva variants, never in CSS utilities.
3. **LCD surfaces are recessed.** Graph and editor panel use `lcd-bg` with scanline overlays.
4. **Shell surfaces stack by brightness.** `background` < `surface` < `surface-alt`.
5. **Green means active/selected.** `highlight` (`#33ff66`) is the primary signal color within LCD contexts.
6. **Shadows serve physics, not aesthetics.** Bevel = raised plastic. Inset = recessed screen. Glow = phosphor bleed.
7. **Corners stay tight.** 2-4px. No pill shapes except Switch.
8. **Labels are ALL CAPS.** `text-sm uppercase tracking-wider text-muted-foreground`.
9. **Transitions are fast.** 75ms for direct interaction, 150-200ms for position/transform.
10. **No dark mode toggle.** The app is permanently dark — it's a calculator, not a website.
