/// <reference types="vite/client" />

declare module 'synthesis' {
  export function synthesize_composition(
    composition_json: string,
    settings_json: string
  ): Float32Array;
  export function greet(name: string): void;
}