# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

- **`bun dev`** — Start Vite dev server with hot reload
- **`bun run build`** — Production build
- **`bun run preview`** — Preview production build
- **`bun run typecheck`** — TypeScript type checking (no emit)

**Important:** Only bun is installed (no node/npm). Use `bun` for packages and `bunx` instead of `npx`.

## Architecture

Arithmusic is a web-based music synthesizer where users compose music using mathematical frequency expressions (e.g., `440 + 100 * x`).

### State Management

Redux-style reducer via React Context in `src/context/CompositionContext.tsx`. The `useComposition()` hook provides `{ state, dispatch }` to all components. This file also contains composition validation logic and JSON import/export helpers.

### Data Model (`src/types.ts`)

- **AppState** — Root state: selected segment, settings, modal visibility, timelines, revision counter
- **Timeline** — A track with options (title, wave type, mute) and an array of Segments
- **Segment** — Musical element with title, frequency expression, length (ms), volume (%)
- **ValidatedField\<T\>** — Wrapper that pairs a value with its validation error state

### Audio Synthesis Pipeline

1. User clicks Play → `App.tsx` creates Web Audio `AudioContext`
2. Composition is validated for errors
3. WASM engine (`web-assembly/pkg/`) synthesizes audio via `synthesize_composition(json, settings_json) → Float32Array`
4. If WASM fails to load, falls back to identical JS implementation in `src/lib/synthesize.ts`
5. Result is played through `AudioBuffer` → `BufferSource`

WASM is loaded dynamically in `App.tsx` via `import('synthesis')` with a `useEffect`.

### WASM Engine (`web-assembly/`)

Rust source using wasm-bindgen 0.2.46 (old format). Pre-compiled binaries live in `web-assembly/pkg/`. The Rust code uses `meval` for expression parsing while the JS fallback uses `mathjs`.

### Vite Configuration

- Alias: `synthesis` resolves to `web-assembly/pkg/` (also mirrored in tsconfig.json paths)
- WASM plugin enabled via `vite-plugin-wasm`
- Base path: `/arithmusic/` (GitHub Pages deployment)
- Build target: esnext

### UI Stack

Tailwind CSS v4 + shadcn/ui components (`src/components/ui/`). Use `bunx shadcn@latest add <component>` to add new ones. `cn()` utility from `src/lib/utils.ts` for class merging. Drag-and-drop via `@hello-pangea/dnd`. Math expressions rendered with KaTeX (`react-katex`). Charts use visx.

### Key Components

- `src/App.tsx` — Top-level layout, audio playback controls, WASM loading
- `src/components/editor.tsx` — Main editor UI with accordion per track
- `src/components/editor/` — Sub-components: segment property editor, timeline drag-and-drop, track options, expression output
- `src/components/graph.tsx` — visx frequency visualization with playhead overlay
- `src/components/modals/` — Settings, save/load (JSON files), alerts
- `src/lib/synthesize.ts` — JS synthesis fallback + `SampleTrackGraph()` for plotting
- `src/initial-state.ts` — Default composition (arpeggio)

### Known Bugs

- Aliasing/sampling artifacts on triangle & sawtooth waves
- Graph resets and lags when opening/closing editor
