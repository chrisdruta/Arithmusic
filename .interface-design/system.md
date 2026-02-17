# Arithmusic Design System

## Intent

**Who:** A curious tinkerer at the intersection of math and music. Someone who opens a graphing calculator for fun, hears a sine wave and thinks "what if I add harmonics?" Late night, headphones on, exploring.

**Task:** Write mathematical expressions that become sound. Arrange them into tracks. Hit play and hear the math. Tweak, re-listen, iterate.

**Feel:** A **TI-92 landscape graphing calculator** — the dark injection-molded shell, LCD phosphor glow, beveled plastic keys. Not retro as decoration — retro as *instrument*. The kind of object that felt powerful in your hands. The landscape orientation, the dominant LCD screen, the function key strip along the side. One physical object, not a collection of floating panels.

## Direction

**Domain:** Scientific calculators, LCD displays, phosphor screens, graphing calculator UI
**Metaphor:** The entire app is one physical calculator sitting on a muted desk surface. The top bezel carries the brand name. The graph is the main LCD screen. The left column is the function key strip. The right panel is a secondary LCD display. The bottom timeline is the keyboard/keypad area. The rounded outer frame is the injection-molded body.
**Signature elements:** Calculator body frame with visible bezel, top branding strip, LCD scanlines + pixel grid, beveled `calc` button variants, phosphor glow on active states, flush zone separation via molded borders

---

## Responsive Scaling

The UI scales proportionally across display resolutions via a responsive root font-size:

```css
html {
  font-size: clamp(16px, 0.75vw, 22px);
}
```

| Resolution | Viewport width | Root font-size | Scale |
|------------|---------------|----------------|-------|
| 1080p | 1920px | 16px | 1× (base) |
| 1440p | 2560px | 19.2px | 1.2× |
| 4K | 3840px | 22px | 1.375× (cap) |

**Principle:** Use standard Tailwind classes (`text-xs`, `text-sm`, `text-base`, etc.) which are rem-based. Avoid hardcoded `text-[Npx]` values — they bypass the scaling system. The only px values should be decorative (borders, border-radius tokens, scanline patterns).

SVG elements (graph axes, margins) don't respond to CSS font-size, so the `Chart` component reads `getComputedStyle(document.documentElement).fontSize` and computes margin/font values as multiples of `rem`.

LCD slider thumb and track sizes use rem units in `index.css` so they scale with the root.

---

## Palette

### Shell (calculator body)
| Token | Hex | Role |
|-------|-----|------|
| `shell-bg` | `#2f2b38` | Page background — muted plum-slate "desk" surface. Lighter than the calculator body to create contrast and physical depth. Applied via `bg-[#2f2b38]` on the desk div (overrides the CSS variable) |
| `background` | `#1c1c1e` | Calculator body, deepest shell surface |
| `surface` | `#222224` | Track rows, mid-level panels, timeline body |
| `surface-alt` | `#2c2c2e` | Panel headers, controls bar, left control column gradient, top bezel fill |
| `secondary` | `#2a2a2c` | Button fills, hover states |
| `muted` | `#2a2a2c` | Input backgrounds, subdued fills |
| `border` | `#3a3a38` | Structural separators, zone borders |
| `foreground` | `#c8c8c0` | Body text (warm gray, not pure white) |
| `muted-foreground` | `#808078` | Labels, secondary text |

### LCD Screen
| Token | Hex | Role |
|-------|-----|------|
| `lcd-bg` | `#0a1a0a` | Graph background, LCD input fields, output display |
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

Track colors appear in five places: graph traces, graph legend, timeline LED indicators, segment editor accent strip, and panel header dots.

---

## Typography

| Role | Font | Size | Weight | Tracking | Extras |
|------|------|------|--------|----------|--------|
| **Body** | `Share Tech Mono` | `text-base` | normal | default | Monospace throughout |
| **Bezel brand** | `VT323` (`font-display`) | `text-base` | normal | `tracking-[0.3em]` | `uppercase text-muted-foreground` |
| **Bezel model name** | `VT323` (`font-display`) | `text-lg` | bold | `tracking-tight` | `text-foreground` |
| **Bezel tagline** | `VT323` (`font-display`) | `text-base` | normal | `tracking-widest` | `uppercase text-highlight/40` with phosphor text-shadow |
| **Labels** | `Share Tech Mono` | `text-sm` | normal | `tracking-wider` | `uppercase text-muted-foreground` |
| **Panel headers** | `Share Tech Mono` | `text-sm` | `font-semibold` | `tracking-widest` | `uppercase text-muted-foreground` |
| **Control column labels** | `Share Tech Mono` | `text-xs` | normal | `tracking-widest` | `uppercase text-muted-foreground` (e.g. "Domain", "Settings") |
| **Slider captions** | `VT323` (`font-display`) | `text-xs` | normal | `tracking-wide` | `italic text-lcd-dim` |
| **Code/data** | `font-mono` | `text-xs` | normal | default | Template expressions, JSON |
| **Buttons** | `TI92PlusPC` (`font-button`) | `text-sm` | `font-medium` | default | TI-92 Plus PC Unicode font. Local file at `/fonts/Ti92Pluspc-unicode.ttf`. Applied to `Button` and `Toggle` base classes. Falls back to Share Tech Mono → monospace |
| **KaTeX output** | `TICELarge` | `\normalsize` (KaTeX) | normal | default | TI calculator LCD font. Local file at `/fonts/TICELarge.ttf`. Overrides all KaTeX internal fonts via `.lcd-katex .katex .katex-html *` |

Body and labels remain monospace (Share Tech Mono). Buttons use the TI-92 Plus PC font — the actual typeface from the calculator's key labels. KaTeX math output uses TICELarge, the TI calculator LCD pixel font for the screen metaphor.

---

## Spacing

**Base unit:** 4px (Tailwind default), scales with root font-size since Tailwind units are rem-based.

### Common patterns
| Context | Values |
|---------|--------|
| **Shell padding** | `px-3 py-5` (desk space around the calculator assembly) |
| **Graph wrapper** | `p-4` (bezel margin — exposes `bg-background` around the LCD screen) |
| **Top bezel** | `px-5 py-2.5` |
| **Control column** | `px-2 py-4`, `gap-3` between groups |
| **Segment editor panel** | `px-4 py-5`, `gap-4` between fields |
| **Controls bar** | `px-2.5 py-2.5` |
| **Track row** | `px-2.5 py-1` (options), `p-2` (timeline) |
| **Panel headers** | `px-3 py-1.5` |
| **Gaps** | `gap-1` (tight groups), `gap-1.5` (playback buttons), `gap-3` (control column groups), `gap-4` (dialog sections, editor panel fields), `gap-6` (settings columns) |
| **Segment chips** | `px-2 py-1.5 ml-1` |
| **Zone dividers** | `w-12 border-t border-border/40` (control column), `border-r border-border/40` (inline separators) |

---

## Depth

### Elevation model
The app uses a **border + bevel** system. Shadows serve specific physical effects (raised plastic, recessed screen, device-on-desk), never generic elevation:

1. **`calc` variant bevel** — 3D pressed-plastic effect (defined in button.tsx + toggle.tsx cva variants):
   ```
   border-t-[#555] border-l-[#555] border-b-[#222] border-r-[#222]
   shadow-[1px_1px_0px_#111,inset_0_1px_0_rgba(255,255,255,0.08)]
   active: shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] translate-y-px
   ```

2. **LCD inset (small)** — recessed screen effect for small LCD elements (domain toggle, settings about panel, Input `surface="lcd"` variant, editor output display):
   ```
   shadow-[inset_0_1px_3px_rgba(0,0,0,0.5),0_0_6px_rgba(51,255,102,0.08)]
   ```

3. **LCD inset (deep)** — recessed screen effect for large LCD surfaces (graph). Heavier depth + subtle green phosphor bleed:
   ```
   shadow-[inset_0_2px_6px_rgba(0,0,0,0.6),inset_0_0_1px_rgba(0,0,0,0.8),0_0_8px_rgba(51,255,102,0.06)]
   ```

4. **Dropdown menus** — minimal pixel shadow:
   ```
   shadow-[1px_1px_0px_#111]
   ```

5. **`glow-lcd`** — drag feedback:
   ```
   shadow-[0_0_8px_rgba(51,255,102,0.3)]
   ```

6. **Calculator assembly frame** — beveled plastic lip + multi-layer depth (`.calc-frame` in index.css):
   ```
   border: 3px solid; border-color: #444 #1a1a1a #111 #333;
   box-shadow: inset 0 1px 0 rgba(255,255,255,0.08),  /* top-edge highlight */
               0 0 0 1px rgba(0,0,0,0.6),              /* crisp outline */
               0 2px 6px rgba(0,0,0,0.5),              /* near shadow */
               0 8px 40px rgba(0,0,0,0.7);             /* ambient shadow */
   ```

7. **Track rows recess** — subtle inset on the track list container:
   ```
   shadow-[inset_0_2px_4px_rgba(0,0,0,0.25)]
   ```

### Surface stacking (bottom to top)
`shell-bg` (desk) → `grip-ribs` (side strips) → `background` (calculator body) → `surface-alt/50` (top bezel) → `surface` (panels, editor panel) → `surface-alt` (headers) → `lcd-bg` (recessed into surface — graph, individual input fields, output display)

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
| `rounded-[0.75rem]` | scales with root | Calculator assembly outer frame (the one exception — scales with viewport) |

---

## Components

### Grip Strips (ribbed side panels)
Decorative elements flanking the calculator body inside the assembly wrapper. Mimic the TI-92's textured side grips. CSS class `grip-ribs` uses a `repeating-linear-gradient` with a 4px cycle (2px trough `#1a1a1c` + 1px ridge `#252527` + 1px highlight `#2e2e30`). `w-3.5` (14px, scales with root font-size). Inset box-shadow on the body-facing edge creates a seam:
- Left: `shadow-[inset_-2px_0_3px_rgba(0,0,0,0.5)]`
- Right: `shadow-[inset_2px_0_3px_rgba(0,0,0,0.5)]`

The assembly's `overflow-hidden rounded-[0.75rem]` clips the grip strips into the body's corner curvature automatically.

### Buttons (calc variants)
Beveled 3D button styles are proper `cva` variants in `button.tsx`, not CSS utilities. Each variant bundles the bevel effect (border-t/l `#555`, border-b/r `#222`, inset highlight, active press) with its color scheme.

| Variant | Color | Usage |
|---------|-------|-------|
| `calc` | `bg-primary` | Play, Pause, modal primary actions (Close, Load) |
| `calc-secondary` | `bg-secondary` | Track controls, Save, Load, template dropdowns, Settings |
| `calc-accent` | `bg-accent` | Stop button (spans full control column width) |
| `ghost` | transparent | Add segment (no bevel) |
| `ghost-destructive` | `text-muted-foreground` → `hover:text-destructive` | Delete segment (no bevel, red on hover) |

Sizes: `size="icon"` for control column and toolbar buttons, `size="sm"` for editor controls bar and modals.

### Inputs
Input has cva `size` and `surface` variants:

| Size | Height | Text | Usage |
|------|--------|------|-------|
| `default` | `h-9` | `text-base` | Fallback (rarely used directly) |
| `sm` | `h-8` | `text-sm` | Track options (compact rows) |
| `lg` | `h-11` | `text-base` | Segment editor panel, form fields, equations |

| Surface | Style | Usage |
|---------|-------|-------|
| `default` | `bg-transparent` | Inputs on LCD or dark surfaces |
| `lcd` | `bg-lcd-bg border-border` + LCD inset (small) shadow | Segment editor fields — individual recessed LCD screens |

- Error state: `border-destructive` via `className`
- Paired with `<Label>` using `htmlFor`/`id` association
- Native `size` attribute is omitted from props to avoid conflict with the variant

### Form Fields
Reusable `<FormField>` wraps `Label` + `Input` + error message. Defaults to `size="lg"`. Passes through `surface` prop:
```
<FormField label="Title" value={...} error={...} surface="lcd" onChange={...} />
```
Renders:
```
<div className="flex flex-col gap-2">
  <Label htmlFor={id} className="text-sm text-muted-foreground uppercase tracking-wider">
  <Input id={id} size="lg" surface="lcd" />
  {error && <p className="text-sm text-destructive">}
</div>
```

### Toggle Groups (wave type selector)
Items use `variant="calc"` (defined as a toggle cva variant in `toggle.tsx`) + LCD highlight for active state:
```
variant="calc" → bevel borders + shadow
data-[state=on]:bg-highlight/12 data-[state=on]:text-highlight
```
Collapsed state shows a single `calc-secondary` button with the active wave icon + `ChevronRight` (`size-3 text-muted-foreground`) to signal expandability. `gap-0.5` keeps the chevron tight against the icon. Clicking expands to the full `ToggleGroup`.

### Segment Chips (track timeline)
Draggable segments styled as small calculator keys with inline bevel styles (not a Button component — these are `<div>` elements within drag-and-drop):
```
rounded-sm px-2 py-1.5 text-sm + inline bevel borders/shadow
Selected: bg-secondary text-highlight border-b-2 border-b-highlight
Default: bg-surface text-foreground border-b-2 border-b-transparent
Dragging (over track): glow-lcd
Dragging (outside tracks — delete zone): border-destructive! bg-destructive/20! text-destructive! opacity-60
```

See **Undo / Redo → Deletion UX** for full drag-to-delete and keyboard delete behavior.

**Proportional width:** Chips use `flexGrow` proportional to `segment.length.value` (ms), with `flexShrink: 0, flexBasis: 0, minWidth: '3rem'`. Longer segments appear visually wider. When one track is shorter than the longest track, a trailing spacer div fills the remainder so all tracks share the same time scale. DnD `provided.draggableProps.style` must be spread **after** custom styles so drag positioning overrides during drag.

### Panel Headers
Thin label bars at the top of major zones. Pattern:
```
groove-bottom flex items-center gap-2 bg-surface-alt px-3 py-1.5
<span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
```
- **Segment Editor** header includes a track color dot (`size-1.5 rounded-full`) when a segment is selected — creates a visual thread between the timeline and the editor.
- **Timeline** label is merged inline into the EditorControls bar, followed by track color dots showing active tracks.

### Track Color Indicators
Colored elements that identify which track a panel or row belongs to:
- **Segment editor**: `h-1` absolute strip at top of panel, colored by track
- **Timeline LED indicators**: `<Led>` component (`components/ui/led.tsx`). Props: `color` (CSS color string), `on` (boolean). Renders a `size-2 rounded-[1px]` square. On: full opacity + `box-shadow: 0 0 6px` colored glow. Off: `opacity-20`, no glow. Centered inside a `w-6` container in the timeline row.
- **Panel header dots**: `size-1.5 rounded-full` inline dots colored per track

### Dialogs (modals)
- Standard shadcn Dialog with `bg-background`
- Default max width: `sm:max-w-lg` or `sm:max-w-xl`
- Padding: `p-6`, `gap-4`
- Close button hidden via `showCloseButton={false}`; explicit footer buttons instead

### Graph (LCD screen)
Container: `lcd-scanlines lcd-pixel-grid relative border-[3px] border-border border-t-[#555]/20 bg-lcd-bg rounded-sm`
- Wrapped in a `p-4` parent that exposes `bg-background` as a bezel frame around the screen
- Scanline overlay via `::after` pseudo-element
- Optional pixel grid overlay composited with scanlines
- Visx SVG with phosphor-colored traces
- SVG margins and axis font sizes are computed from `rem` (scale with root font-size)
- Playhead: dashed green line with gaussian blur glow filter
- Takes `flex-1` within its column to fill all available vertical space
- **Legend:** SVG-native `<Group>` in top-right corner. Colored line swatches (20px) + track titles in `fontFamily` at `tickFontSize`. Semi-transparent `bgColor` background rect at 0.75 opacity. Selected track at full opacity, others at `dimOpacity`. Reads from `state.timelines[idx].options.title`.

### Popovers (LCD reference cards)
Radix Popover primitives used inline — no shadcn wrapper component. Import pattern: `import { Popover as PopoverPrimitive } from 'radix-ui'` (v1.4.3 installed). Styled as LCD-recessed cards:
```
z-50 rounded-sm border border-lcd-dim bg-lcd-bg p-3
shadow-[inset_0_1px_3px_rgba(0,0,0,0.4),0_4px_16px_rgba(0,0,0,0.5)]
animate-in fade-in-0 zoom-in-95
```
Content uses `font-mono text-xs` with section headers in `uppercase tracking-widest text-muted-foreground`. Triggered by `CircleHelp` icon button (`size="icon-xs"`, `text-muted-foreground hover:text-highlight`).

### Hint Text
Contextual hints below labels use the same style as slider captions: `font-display text-xs italic text-lcd-dim tracking-wide`. Used for `x = time (s)` below the equation label, `Infini-Slide` below the length slider. Provides context without cluttering the label itself.

### Domain Toggle
Custom segmented control styled as LCD sub-display. **Vertical orientation** in the left control column:
- `flex-col` layout with stacked TIME / BEAT buttons
- `bg-lcd-bg border-lcd-dim`
- Active state: `text-highlight` with text-shadow glow `0_0_8px_rgba(51,255,102,0.6)`
- Sliding indicator: `h-[calc(50%-1px)] w-[calc(100%-2px)]`, vertical `translate-y-full` for beat mode
- Labeled with "Domain" text above (`text-xs uppercase tracking-widest text-muted-foreground`)

---

## Transitions

| Context | Duration | Properties |
|---------|----------|------------|
| Button press | `75ms` | `all` (via `transition-all`) |
| Segment hover/select | `75ms` | `background, color, border-color, box-shadow` |
| Domain toggle slide | `200ms` | `transform` with `cubic-bezier(0.4, 0, 0.2, 1)` |
| Domain toggle text | `150ms` | `colors` |
| Dialog | `200ms` | `fade + zoom (95%)` |

---

## Undo / Redo

### Scope

Undo/redo covers **structural composition changes** only — operations that alter the shape of the timeline. Text field edits (`TRACK_DATA_CHANGE`, `TRACK_OPTION_CHANGE`, `SETTINGS_CHANGE`) are excluded and rely on native browser undo (Ctrl+Z within inputs).

**Undoable actions:** `DELETE_SEGMENT`, `ADD_SEGMENT`, `INSERT_SEGMENT`, `SEGMENT_REARRANGE`, `SEGMENT_MOVE_CROSS_TRACK`, `ADD_TRACK`, `DELETE_TRACK`, `LOAD_COMPOSITION`.

### Keyboard shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` / `Cmd+Z` | Undo |
| `Ctrl+Y` / `Ctrl+Shift+Z` / `Cmd+Shift+Z` | Redo |

All shortcuts are **suppressed when focus is in `<input>`, `<textarea>`, or `contentEditable`** — this is the boundary that prevents conflation with text-level undo.

### Snapshot

Each undo entry captures `timelines`, `selectedSegment`, and `nextId`. UI-ephemeral state (`showingModals`, `compositionErrors`, `settings`, `revision`) is preserved as-is on restore — undoing won't close a dialog or revert settings.

### Implementation

Dispatch wrapper in `CompositionProvider` intercepts `UNDO`/`REDO` actions before they reach the reducer. Stacks stored in `useRef` (no re-renders on push/pop). Max depth: 50 entries (FIFO eviction). A new undoable action clears the redo stack.

### Deletion UX

Segment deletion has two input paths, both feeding the same `DELETE_SEGMENT` action (which is undoable):

1. **Drag-to-delete:** Drag a segment chip outside all track droppables. Visual feedback: chip turns red/faded (`border-destructive! bg-destructive/20! text-destructive! opacity-60`) when `snapshot.draggingOver == null`. Deletion fires on drop.
2. **Keyboard:** `Delete` / `Backspace` removes the selected segment. Suppressed when focus is in text fields.

No confirmation dialog — undo via Ctrl+Z is the recovery path.

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

TI-92-inspired landscape layout. The entire app is a single calculator body sitting on a dark desk. Branding lives on a top bezel. Controls are in a vertical function key strip. Zones meet flush — borders, not gaps.

```
┌─ px-3 py-5 desk padding (bg-shell-bg) ───────────────────────────────┐
│                                                                        │
│  ┌─ assembly (rounded-[0.75rem] overflow-hidden + shadow) ──────────┐ │
│  │▓│ ARITHMUSIC   fx-AM1                    ALGORITHMIC AUDIO     │▓│ │
│  │▓│ ─────────────── top bezel (bg-surface-alt/50) ─────────────  │▓│ │
│  │▓│ ┌─ ctrl ─┐┌──── graph (flex-1) ──────┐┌─ segment panel ──┐  │▓│ │
│  │▓│ │ [▶] [⏸]││                           ││ SEGMENT EDITOR ● │  │▓│ │
│  │▓│ │ [■ STOP]││  lcd-scanlines            ││─────────────────│  │▓│ │
│  │▓│ │─────────││  lcd-pixel-grid           ││ Title           │  │▓│ │
│  │▓│ │ DOMAIN  ││  Visx SVG + playhead      ││ Equation f(x)  │  │▓│ │
│  │▓│ │ [TIME]  ││                           ││ Length slider   │  │▓│ │
│  │▓│ │ [BEAT]  ││                           ││ Volume slider   │  │▓│ │
│  │▓│ │         ││                           ││─────────────────│  │▓│ │
│  │▓│ │─────────││                           ││ Output (KaTeX)  │  │▓│ │
│  │▓│ │SETTINGS ││                           ││            [🗑] │  │▓│ │
│  │▓│ │  [⚙]   │└───────────────────────────┘└─────────────────┘  │▓│ │
│  │▓│ └─────────┘─────────── border-t ──────────────────────────── │▓│ │
│  │▓│ │ Timeline ●●● │ Track+ │ Notes▾ … │ Load │ Save           │▓│ │
│  │▓│ │ ■ track rows with drag-and-drop segment chips              │▓│ │
│  │▓│ │ □ ...                   (■ = LED on, □ = LED off)          │▓│ │
│  │▓└─└────────────────────────────────────────────────────────────┘▓│ │
│  └──────────────────────────────────────────────────────────────────┘ │
│     ▓ = grip-ribs (ribbed grip strips, w-3.5)                          │
└───────────────────────────────────────────────────────────────────────┘
```

### Zone proportions
| Zone | Sizing | Notes |
|------|--------|-------|
| **Calculator assembly** | `flex-1` within `h-screen px-3 py-5` | `rounded-[0.75rem] overflow-hidden` + assembly frame shadow. Contains left grip + body + right grip |
| **Calculator body** | `flex-1` within assembly | `bg-background overflow-hidden` (no rounding — clipped by assembly) |
| **Grip strips** | `w-3.5 shrink-0` | `grip-ribs` CSS class. Inset shadow creates seam against body |
| **Top bezel** | auto height | `bg-surface-alt/50 border-b border-border/40 px-5 py-2.5` |
| **Left control column** | `w-28` fixed | `border-r border-border/50`, flush with bezel and timeline |
| **Graph** | `flex-1` (fills remaining width) | Dominant element, ~70% of width |
| **Segment editor** | `w-80` fixed | `border-l border-border/50`, flush with body edge |
| **Upper region** | `flex-[5]` | Graph + panels, ~71% of height |
| **Lower timeline** | `flex-[2]` | `border-t border-border/50`, ~29% of height |
| **Between zones** | flush (no gap) | Borders handle separation — zones read as molded sections of one body |

### Top bezel
Horizontal branding strip at the top of the calculator body. Mirrors TI-92 placement of "TEXAS INSTRUMENTS" / "TI-92 II":
- Left: "ARITHMUSIC" (`text-base uppercase tracking-[0.3em] text-muted-foreground`) + "fx-AM1" (`text-lg font-bold`)
- Right: Random tagline (`text-base uppercase tracking-widest text-highlight/40` with phosphor text-shadow)
- `justify-between` layout, `items-baseline` for left group

### Left control column
Vertical function key strip (`bg-gradient-to-b from-surface-alt to-surface`). Groups separated by `w-12 border-t border-border/40` dividers:
1. **Playback** — Play + Pause side-by-side, Stop spanning full width below
2. **Domain toggle** — Vertical TIME/BEAT with "Domain" label
3. **Spacer** (`flex-1`)
4. **Settings** — "Settings" label + gear icon button

### Segment editor panel (right)
Wrapped in `SegmentPanel` which provides the header and empty state. Uses `bg-gradient-to-b from-surface-alt to-surface` (matching the left control column for depth symmetry). Separated from graph by `border-l border-border/50`. Two states:
- **Selected**: `EditorPanel` — vertical `flex-col gap-4` layout. Individual input fields use `surface="lcd"` for recessed LCD styling. Output display has its own LCD container. Fields stack: Title → Equation → Length → Volume → divider → Output → delete button. Track color accent strip (`h-1`) at top.
- **Empty**: Gradient placeholder with "SELECT A SEGMENT TO EDIT" centered in `text-muted-foreground/40`.

### Editor Output Display
KaTeX math output wrapped in an LCD-recessed container:
```
rounded-sm border border-border bg-lcd-bg px-3 py-2
shadow-[inset_0_1px_3px_rgba(0,0,0,0.5),0_0_6px_rgba(51,255,102,0.08)]
```
Uses the same LCD inset (small) shadow as `surface="lcd"` inputs, creating a consistent "embedded screen" look across all data display elements in the editor.

### Timeline (bottom)
`TimelinePanel` contains the `DragDropContext` wrapping `EditorControls` + scrollable track rows. Separated from upper region by `groove border-t border-border/50` (plastic mold seam + border). The "Timeline" label and track color dots are merged into the `EditorControls` bar — no separate header row.

---

## shadcn/ui Conventions

- **Variants over className.** Repeated style patterns must be cva variants, not `className` overrides. If you're passing `className="bg-X text-X-foreground hover:bg-X/90"` to override a variant, create a new variant instead.
- **No raw `<button>` elements.** Always use the `<Button>` component with the appropriate variant.
- **Component-specific styles in components.** The `@layer utilities` in `index.css` is reserved for genuinely generic utilities (`glow-lcd`) and pseudo-element effects that Tailwind can't express. Button/toggle bevel styles live in their respective cva definitions.
- **`className` is for one-off tweaks only.** Acceptable: `className="self-center"` (layout), `className="w-32"` (width). Not acceptable: overriding colors or interactive states that should be a variant.
- **Custom CSS lives in `index.css` only when Tailwind can't express it:** vendor-prefixed sliders (rem-based), pseudo-element overlays (`::after`), third-party class overrides (`.katex`).
- **Strip all `dark:` classes from new components.** The app is permanently dark-themed (rule #10). When adding components via `bunx shadcn@latest add`, remove all `dark:` prefixed classes — they're dead code here.
- **Replace `rounded-md` with `rounded-sm`** in any newly added shadcn component. Official defaults use `rounded-md`; our calculator aesthetic uses `rounded-sm` (2px) everywhere.
- **No `"use client"` directives.** This is a Vite project, not Next.js. Strip `"use client"` from all components for consistency.
- **Focus ring pattern.** All interactive elements use the same v4 pattern: `outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]`. Do not use the old `focus:ring-2 focus:ring-offset-2` pattern.
- **Bevel duplication trade-off.** The calc bevel string is duplicated across `calc`, `calc-secondary`, `calc-accent` variants (and in `toggle.tsx`). This is a known trade-off since cva doesn't support composing variant fragments. If the bevel values change, update all 4 locations.
- **Use standard Tailwind text sizes.** Prefer `text-xs`, `text-sm`, `text-base`, `text-lg` etc. over arbitrary `text-[Npx]` values. Arbitrary px values bypass the responsive scaling system.

---

## Rules

1. **Body text is monospace.** Buttons use TI-92 Plus PC font (the actual calculator key typeface). KaTeX output uses TICELarge (TI calculator LCD font). Everything else is Share Tech Mono or VT323.
2. **Buttons get beveled.** Any clickable rectangle uses a `calc` / `calc-secondary` / `calc-accent` variant unless it's a ghost/link. Bevel styles live in component cva variants, never in CSS utilities.
3. **LCD surfaces are recessed.** Graph uses `lcd-bg` with scanline overlays. Segment editor uses `bg-surface` with individual `surface="lcd"` inputs and an LCD output container.
4. **Shell surfaces stack by brightness.** `background` < `surface` < `surface-alt`.
5. **Green means active/selected.** `highlight` (`#33ff66`) is the primary signal color within LCD contexts.
6. **Shadows serve physics, not aesthetics.** Bevel = raised plastic. Inset = recessed screen. Glow = phosphor bleed. Body frame = device on desk.
7. **Corners stay tight.** 2-4px. No pill shapes except Switch. Calculator assembly uses `rounded-[0.75rem]` (the one exception — scales with viewport).
8. **Labels are ALL CAPS.** `text-xs uppercase tracking-widest text-muted-foreground` (panel headers, control column labels).
9. **Transitions are fast.** 75ms for direct interaction, 150-200ms for position/transform.
10. **No dark mode toggle.** The app is permanently dark — it's a calculator, not a website.
11. **One physical object.** Zones are flush — no gaps between sections. Borders (`border-r`, `border-l`, `border-t`, `border-border/50`) handle visual separation. Each zone reads as a molded section of the calculator body, not a floating card.
12. **Track colors thread through.** The same track color (green/amber/blue/red) appears on graph traces, graph legend, timeline LED indicators, segment editor accent strip, and panel header dots — creating a visual connection across zones.
13. **Sizes scale with viewport.** Use rem-based values (standard Tailwind classes). The responsive root font-size handles display adaptation automatically. No hardcoded px for text, spacing, or interactive element sizes.
14. **Expandable controls use chevrons.** Collapsed controls that expand on click include a small directional chevron (`size-3 text-muted-foreground`) indicating the expansion direction. `ChevronRight` for horizontal, `ChevronDown` for vertical/dropdown.

---

## UX Audit

Simulated user testing results tracked in `.interface-design/ux-audit-2026-02-16.md`. 23 findings prioritized Critical → Low with fix status tracking. Consult before building new features to avoid re-introducing addressed friction.
