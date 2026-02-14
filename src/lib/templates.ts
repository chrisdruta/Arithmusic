export interface SegmentTemplate {
  id: string;
  title: string;
  expression: string;
  length: number;
  volume: number;
  category: TemplateCategory;
}

export type TemplateCategory = 'notes' | 'functions' | 'patterns';

export const TEMPLATE_CATEGORIES: { key: TemplateCategory; label: string }[] = [
  { key: 'notes', label: 'Notes' },
  { key: 'functions', label: 'Functions' },
  { key: 'patterns', label: 'Patterns' },
];

export const TEMPLATES: SegmentTemplate[] = [
  // Notes
  { id: 'tpl-a4', title: 'A4', expression: '440', length: 500, volume: 100, category: 'notes' },
  { id: 'tpl-c4', title: 'C4', expression: '261.63', length: 500, volume: 100, category: 'notes' },
  { id: 'tpl-d4', title: 'D4', expression: '293.66', length: 500, volume: 100, category: 'notes' },
  { id: 'tpl-e4', title: 'E4', expression: '329.63', length: 500, volume: 100, category: 'notes' },
  { id: 'tpl-f4', title: 'F4', expression: '349.23', length: 500, volume: 100, category: 'notes' },
  { id: 'tpl-g4', title: 'G4', expression: '392', length: 500, volume: 100, category: 'notes' },
  { id: 'tpl-a3', title: 'A3', expression: '220', length: 500, volume: 100, category: 'notes' },
  { id: 'tpl-b4', title: 'B4', expression: '493.88', length: 500, volume: 100, category: 'notes' },
  { id: 'tpl-c5', title: 'C5', expression: '523.25', length: 500, volume: 100, category: 'notes' },

  // Functions
  { id: 'tpl-sin', title: 'sin(440x)', expression: 'sin(440*x)', length: 500, volume: 100, category: 'functions' },
  { id: 'tpl-cos', title: 'cos(440x)', expression: 'cos(440*x)', length: 500, volume: 100, category: 'functions' },
  { id: 'tpl-exp', title: 'e^x', expression: 'e^x', length: 500, volume: 100, category: 'functions' },
  { id: 'tpl-x2', title: 'x²', expression: 'x^2', length: 500, volume: 100, category: 'functions' },
  { id: 'tpl-sqrt', title: 'sqrt(x)', expression: 'sqrt(x)', length: 500, volume: 100, category: 'functions' },
  { id: 'tpl-abssin', title: '440|sin(x)|', expression: '440*abs(sin(x))', length: 500, volume: 100, category: 'functions' },

  // Patterns
  { id: 'tpl-sweep', title: 'Linear sweep', expression: '220 + 220 * x', length: 1000, volume: 100, category: 'patterns' },
  { id: 'tpl-vibrato', title: 'Vibrato', expression: '440 + 20 * sin(50 * x)', length: 1000, volume: 100, category: 'patterns' },
  { id: 'tpl-octdrop', title: 'Octave drop', expression: '880 - 440 * x', length: 1000, volume: 100, category: 'patterns' },
  { id: 'tpl-trill', title: 'Trill', expression: '440 + 50 * sin(100 * x)', length: 1000, volume: 100, category: 'patterns' },
];

export function getTemplatesByCategory(category: TemplateCategory): SegmentTemplate[] {
  return TEMPLATES.filter((t) => t.category === category);
}

export function getTemplateById(id: string): SegmentTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
