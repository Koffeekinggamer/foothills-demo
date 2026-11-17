// Hero photograph and alt text per collection. Room collections get a showroom/room photo; sub-collections
// get a specific photo where one exists, otherwise they rotate through their room's pool.
export const POOL: Record<string, [string, string][]> = {
  'amish-dining-room-furniture': [['dining-showroom', 'Amish dining tables and chairs on the Landrum showroom floor'], ['room-dining', 'A live-edge dining table set with upholstered chairs'], ['p-barrel-amish-solid-wood-dining-collection-0', 'A round pedestal dining set with barrel-back stools'], ['p-almanzo-amish-reclaimed-wood-dining-collection-0', 'A reclaimed wood dining table with bench and chairs'], ['tile-dining', 'A live-edge dining table in the showroom']],
  'amish-bedroom-furniture': [['bedroom-four-post', 'A solid wood four-poster bed with matching nightstand in the showroom'], ['bedroom-set', 'An Amish bedroom set with upholstered bench in the showroom'], ['room-bedroom', 'A solid wood bedroom set with dresser and mirror'], ['bedroom-showroom', 'Solid wood beds and dressers on the showroom floor'], ['tile-bedroom', 'A panel bed dressed in white linens']],
  'living-room-furniture': [['room-living', 'Living room furniture arranged on the Landrum showroom floor'], ['living-sofa', 'A sofa and armchair set with a solid wood coffee table'], ['showroom-living', 'Sofas, chairs and occasional tables in the showroom'], ['showroom-014', 'A grey sofa with throw pillows beside a solid wood end table'], ['showroom-012', 'An upholstered armchair beside a wood side table']],
  'amish-office-furniture': [['live-edge-desk', 'A live-edge walnut desk with a leather office chair'], ['tile-office', 'An Amish desk and office chair'], ['office-nook', 'A solid wood writing desk and chair in the showroom']],
  'amish-outdoor-furniture': [['outdoor-deck', 'Poly outdoor rockers, swings and chairs displayed on the showroom deck'], ['outdoor-rockers', 'Rows of poly outdoor rockers and Adirondack chairs'], ['tile-outdoor', 'A poly porch swing in a natural wood tone'], ['outdoor-colors', 'Poly outdoor chairs in several colors on the showroom patio']],
};
const SPECIFIC: Record<string, [string, string]> = {
  'dining-benches': ['collection-dining', 'A live-edge dining table with a matching bench and chairs in the showroom'],
  'dining-chairs': ['dining-chairs-room', 'Solid wood dining chairs around a farmhouse table'],
  'dining-tables': ['room-dining', 'A live-edge dining table set with upholstered chairs'],
  'reclaimed-wood-dining-furniture': ['p-amish-reclaimed-barnwood-1869-dining-collection-0', 'A reclaimed barnwood dining table with bench'],
  'dining-sets': ['p-barrel-amish-solid-wood-dining-collection-0', 'A round pedestal dining set with barrel-back stools'],
  'beds': ['bedroom-four-post', 'A solid wood four-poster bed with matching nightstand in the showroom'],
  'bedroom-sets': ['bedroom-set', 'An Amish bedroom set with upholstered bench in the showroom'],
  'dressers': ['room-bedroom', 'A solid wood bedroom set with dresser and mirror'],
  'sofas-loveseats': ['fabric-sofa', 'A tufted fabric sofa by Smith Brothers'],
  'living-room-chairs-recliners': ['leather-sofa', 'A dark leather sofa by Smith Brothers'],
  'living-room-collections': ['living-sofa', 'A sofa and armchair set with a solid wood coffee table'],
  'desks': ['live-edge-desk', 'A live-edge walnut desk with a leather office chair'],
  'office-chairs': ['tile-office', 'An Amish desk and office chair'],
  'poly-outdoor-swings': ['tile-outdoor', 'A poly porch swing in a natural wood tone'],
  'poly-outdoor-rockers-gliders': ['outdoor-rockers', 'Rows of poly outdoor rockers and Adirondack chairs'],
  'poly-outdoor-chairs': ['outdoor-colors', 'Poly outdoor chairs in several colors on the showroom patio'],
};
export function heroFor(handle: string, parent: string | null, index = 0): [string, string] {
  if (SPECIFIC[handle]) return SPECIFIC[handle];
  const pool = POOL[parent ?? handle];
  return pool[parent ? (index + 1) % pool.length : 0];
}
