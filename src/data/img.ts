import type { ImageMetadata } from 'astro';
const all = import.meta.glob<{ default: ImageMetadata }>('/src/assets/**/*.{jpg,jpeg,png}', { eager: true });
export function img(name: string): ImageMetadata {
  const key = Object.keys(all).find((k) => k.endsWith('/' + name) || k.endsWith('/' + name + '.jpg') || k.endsWith('/' + name + '.png'));
  if (!key) throw new Error('Missing image ' + name);
  return all[key].default;
}
