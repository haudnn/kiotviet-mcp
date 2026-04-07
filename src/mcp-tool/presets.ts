import { PRESETS } from './registry';

/**
 * Resolves a comma-separated tool filter string into a list of tool names.
 * Supports:
 *  - preset names: "preset.default", "preset.readonly"
 *  - project names: "products", "customers"
 *  - individual tool names: "kiotviet_products_list"
 */
export function resolveToolFilter(filter: string): string[] {
  const parts = filter.split(',').map((p) => p.trim()).filter(Boolean);
  const resolved = new Set<string>();

  for (const part of parts) {
    if (PRESETS[part]) {
      for (const t of PRESETS[part]) resolved.add(t);
    } else {
      resolved.add(part);
    }
  }

  return Array.from(resolved);
}

export function listPresets(): Array<{ name: string; tools: string[] }> {
  return Object.entries(PRESETS).map(([name, tools]) => ({ name, tools }));
}
