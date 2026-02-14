# Arithmusic Design System

Theme: **Retro Calculator / Casio fx-6300G**
Dark-only. Monospace. Boxy. LCD phosphor aesthetic.

---

## Color Palette

### Semantic Tokens (CSS custom properties)

| Token | Hex | Usage |
|---|---|---|
| `background` | `#1c1c1e` | App background (calculator body) |
| `foreground` | `#c8c8c0` | Default text |
| `surface` | `#222224` | Panel backgrounds (editor rows, droppable areas) |
| `surface-alt` | `#2c2c2e` | Toolbar / accordion header backgrounds |
| `card` / `lcd-bg` | `#0a1a0a` | LCD screen areas (graph, editor panel) |
| `card-foreground` / `lcd-green` | `#33ff66` | LCD phosphor green — primary display color |
| `lcd-grid` | `#0d2e0d` | LCD grid lines, slider tracks |
| `lcd-dim` | `#1a6633` | Dim LCD text, inactive labels |
| `primary` | `#2255cc` | Primary actions (Play, Close, Load) |
| `primary-foreground` | `#ffffff` | Text on primary |
| `secondary` | `#2a2a2c` | Secondary actions (Track+, Save, Load, Defaults) |
| `secondary-foreground` | `#d0d0c8` | Text on secondary |
| `accent` / `destructive` | `#cc3333` | Red — Stop button, errors, operators in syntax |
| `muted` | `#2a2a2c` | Muted backgrounds |
| `muted-foreground` | `#808078` | Labels, secondary text |
| `border` / `input` | `#3a3a38` | Default borders |
| `amber` | `#d4a017` | Numbers in syntax highlighting |

### Syntax Highlighting Colors

| Token | Hex | Usage |
|---|---|---|
| func | `#66aaff` | Math functions (sin, cos, etc.) — **orphan, not in theme** |
| const / var | `#33ff66` | Constants (pi, e) and variable (x) |
| num | `#d4a017` | Numeric literals |
| op | `#cc3333` | Operators (+, -, *, /) |
| paren | `#808078` | Parentheses |
| other | `#c8c8c0` | Fallback |

---

## Typography

| Token | Value |
|---|---|
| `--font-sans` | `"Share Tech Mono", "Courier New", monospace` |
| `--font-display` | `"VT323", "Share Tech Mono", monospace` |

- All UI text uses monospace (`--font-sans`)
- Display/decorative text (header branding, slider labels) uses `--font-display`
- Label pattern: `text-sm uppercase tracking-wider text-muted-foreground`
- Sub-label pattern: `font-display text-xs italic text-lcd-dim tracking-wide`

---

## Spacing

**Base unit: 4px (Tailwind default)**

Observed scale: `1` (4px), `1.5` (6px), `2` (8px), `2.5` (10px), `3` (12px), `4` (16px), `5` (20px), `6` (24px)

Common patterns:
- Component internal gap: `gap-2` (8px)
- Section gap: `gap-4` (16px) to `gap-6` (24px)
- Container padding: `px-4 py-2` (header), `px-2.5 pb-2.5` (toolbar), `px-6 py-5` (editor panel)
- Toolbar item spacing: `gap-2.5` (10px)
- Timeline item margin: should be `ml-1` (4px) — currently 5px (violation)

---

## Radii

| Token | Value | Usage |
|---|---|---|
| `--radius` | `2px` | Default — calculator-boxy feel |
| `--radius-sm` | `2px` | Small elements |
| `--radius-md` | `3px` | Medium elements |
| `--radius-lg` | `4px` | Larger containers |
| `--radius-xl` | `6px` | Dialogs |

All radii are intentionally tight for the retro calculator aesthetic. `.calc-button` forces `border-radius: 2px`.

---

## Depth Strategy: **Embossed Borders**

The system uses a calculator-button embossing approach, not drop shadows or flat borders.

### `.calc-button` — The Core Pattern
```css
border: 1px solid #444;
border-top-color: #555;      /* light from top-left */
border-left-color: #555;
border-bottom-color: #222;   /* shadow on bottom-right */
border-right-color: #222;
box-shadow: 1px 1px 0px #111, inset 0 1px 0 rgba(255,255,255,0.08);
```

Active state depresses:
```css
box-shadow: 0 0 0 #111, inset 0 1px 2px rgba(0,0,0,0.3);
transform: translateY(1px);
```

### Drag glow (LCD phosphor effect)
```css
box-shadow: 0 0 8px rgba(51,255,102,0.3), 1px 1px 0px #111;
```
Used on: dragged timeline segments, dragged template items.

### Allowed shadows
- `.calc-button` emboss shadow (standard)
- Drag glow (`rgba(51,255,102,0.3)`) for interactive feedback
- `shadow-xs` on shadcn inputs (framework default, acceptable)
- No floating/elevation shadows — depth is communicated through borders and color

---

## Component Patterns

### Button

Uses shadcn `<Button>` with `class-variance-authority`.

| Size | Height | Padding | Usage |
|---|---|---|---|
| `default` | `h-9` (36px) | `px-4 py-2` | Dialog actions |
| `sm` | `h-8` (32px) | `px-3` | Toolbar buttons |
| `xs` | `h-6` (24px) | `px-2` | Compact |
| `icon` | `size-9` (36px) | — | Header icon buttons |
| `icon-sm` | `size-8` (32px) | — | Inline icon buttons |

Most buttons also get `className="calc-button"` for the embossed border effect.

### Input

Uses shadcn `<Input>`.

| Context | Height | Class |
|---|---|---|
| Form fields (editor panel) | `h-11` (44px) | `text-base` |
| Compact (toolbar/track options) | `h-8` (32px) | `text-sm` |

Standard: `h-9` from shadcn default. The app overrides to `h-11` in form contexts for touch-friendly sizing.

### FormField

Reusable `<FormField>` component (`src/components/ui/form-field.tsx`):
- Label + Input + error message
- Label style: `text-sm text-muted-foreground uppercase tracking-wider`
- Input: `h-11 text-base`
- Error: `text-sm text-destructive`
- Wrapper: `flex flex-col gap-2`

### Dialog / Modal

Uses shadcn `<Dialog>`.
- Max width: `sm:max-w-xl` (settings, save, load) or `sm:max-w-lg` (alert)
- `showCloseButton={false}` — all modals use explicit footer buttons
- Footer pattern: secondary "Cancel/Close/Defaults" left, primary action right
- Standard structure: `DialogHeader` > `DialogTitle` > content > `DialogFooter`

### Accordion (Editor)

Single collapsible accordion wrapping the timeline editor.
- Trigger: `bg-surface-alt px-4 py-2 text-sm font-semibold uppercase tracking-widest`
- Content: `p-0` (manages own padding internally)

### Timeline Segment (Drag Item)

Inline-styled (legacy — should migrate to Tailwind):
- Background: `surface` / `surface` selected variant
- Selected indicator: `2px solid lcd-green` bottom border
- Font: `0.875rem` (14px) monospace
- Embossed borders matching `.calc-button` pattern

### Template Dropdown

Custom dropdown (not shadcn Popover):
- Trigger: `calc-button` styled `<button>` with chevron
- Panel: absolute positioned, `bg-[#1a1a1e]` with embossed border
- Items: draggable, highlight to `lcd-green` on hover/drag

### Domain Toggle

Custom CSS toggle (`index.css`):
- LCD-style inset container
- Active state: `lcd-green` text with glow
- Inactive: `lcd-dim` text

### Range Slider

Custom CSS (`index.css .infinite-slider`):
- Track: `6px` height, `lcd-grid` background
- Thumb: `14px` square, `lcd-green`, `2px` radius, green glow
- Label below: `font-display text-xs italic text-lcd-dim`

---

## LCD Screen Pattern

Applied via `.lcd-screen` class:
- `background-color: lcd-bg`
- Scanline overlay via `::after` pseudo-element
- Optional `.lcd-pixel-grid` adds cross-hatch pattern (used on graph)

Used on: Graph container, Editor panel

---

## Layout

- Full viewport height: `h-screen flex flex-col overflow-hidden`
- Top: solar panel (8px decorative stripe)
- Header: `border-b border-border bg-surface-alt px-4 py-2`
- Main area: `flex-1 flex-col justify-end overflow-hidden`
  - Graph: `flex-1 min-h-0` (fills available space)
  - Editor: `flex-none` (accordion, collapses)

---

## Icon System

- **Lucide React** for UI icons (Play, Pause, Plus, Trash2, etc.)
- **MDI paths** (`@mdi/js`) for wave type icons (sine, triangle, sawtooth)
- Standard icon size: `size-4` (16px) in buttons, `size-5` (20px) in header
- MDI icons rendered via inline `<svg viewBox="0 0 24 24" className="size-5 fill-current">`
