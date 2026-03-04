# Arithmusic

Make music with math!

https://chrisdruta.github.io/arithmusic <= try me

Web synth where you write math expressions as frequency functions of time, arrange them on a multi-track timeline, and play them back as audio.

## Getting Started

```sh
bun install  # or npm install
bun dev      # or npm run dev
```

`bun run build` for production, `bun run typecheck` for type checking.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 + shadcn/ui
- visx for graphing
- KaTeX for math rendering
- Web Audio API for playback
- Rust/WASM for custom audio synthesis engine

## Features & Bugs

| #  | Item | Priority | Status |
|----|------|----------|--------|
| 1  | "What is x?" — universal confusion | Critical | Fixed |
| 2  | No equation cheat sheet or syntax hints | Critical | Fixed |
| 3  | Graph has no legend linking colors to tracks | Critical | Fixed |
| 4  | Wave type selector has zero click affordance | High | Fixed |
| 5  | Timeline chips are uniform width regardless of segment duration | High | Fixed |
| 6  | "Infini-Slide" label communicates nothing | High | Open |
| 7  | Volume 0-200% is unexplained | High | Open |
| 8  | Output field feels redundant when valid | Medium | Open |
| 9  | No segment boundary markers on the graph | Medium | Open |
| 10 | BEAT domain toggle does nothing | Medium | Open |
| 11 | No keyboard shortcuts | Medium | Fixed |
| 12 | "New Tab" as a default segment name | Medium | Open |
| 13 | No amplitude envelopes per segment | Low | Open |
| 14 | Wave type is per-track, not per-segment | Low | Open |
| 15 | Volume as static percentage, not a function | Low | Open |
| 16 | No stereo / panning | Low | Open |
| 17 | The `multiplier` setting is mysterious | Low | Open |
| 18 | No cross-segment continuity for x | Low | Open |
| 19 | No spectrogram mode | Low | Open |
| 20 | Graph is not interactive | Low | Open |
| 21 | No per-segment preview / audition | Low | Open |
| 22 | No looping per track | Low | Open |
| 23 | Timeline needs zoom | Low | Open |
