/** Presentation settings for the content pages. All copy comes from src/data/pages.json
 *  (the live pages, captured read-only 2026-11-17, via tools/build_pages.py). This file only
 *  picks the layout, hero photo, which theme boilerplate to drop, and fills lists that the live
 *  theme renders empty. */
export type Kind = 'content' | 'local' | 'legal' | 'faq';
export type Group = 'About' | 'Customize' | 'Help';
export interface PageCfg {
  kind: Kind; group: Group; nav?: string; crumb: string;
  h1?: string; eyebrow?: string; lede?: string; seo?: string; description: string;
  hero?: [string, string]; images?: [string, string][];
  drop?: string[]; // section headings to drop (exact match on the start)
  lists?: Record<string, string[]>; // section heading -> list rendered after the paragraph that ends in ":"
  cardsAs?: 'grid' | 'trio' | 'specs' | 'steps';
  rooms?: boolean; visit?: boolean;
}

export const PAGES: Record<string, PageCfg> = {
  // ---------------- About ----------------
  'our-story': { kind: 'content', group: 'About', crumb: 'Our story', eyebrow: 'About us', h1: 'Our story',
    lede: 'One of the largest collections of handcrafted, American-made solid wood furniture in the Foothills of South Carolina.',
    description: 'Foothills Amish Furniture is family-owned by Judson and Patricia Miller in Landrum, SC: handcrafted Amish solid wood furniture from Ohio, Pennsylvania and Indiana.',
    hero: ['storefront', 'The Foothills Amish Furniture storefront on E. Rutherford Street in Landrum'],
    images: [['judson-patricia-miller', 'Judson and Patricia Miller with their children, seated on a bench under a tree'], ['associate-counter', 'A Foothills sales associate at the showroom counter'], ['wood-closeup', 'Close-up of a hand-finished solid wood tabletop']],
    drop: ['Experience the style, prestige'], visit: true },
  'why-foothills-amish-furniture': { kind: 'content', group: 'About', crumb: 'Our difference', eyebrow: 'Our difference', h1: 'The Foothills Amish Furniture difference',
    lede: 'You have more choice when it comes to buying furniture. Here is what you get when you choose us.',
    description: 'Why Foothills Amish Furniture: master craftsmanship, any size, wood, finish, hardware and upholstery, a 10-year service promise and sustainably sourced American hardwoods.',
    hero: ['showroom-floor', 'The Landrum showroom floor with dining and living furniture'], images: [['design-consult', 'A Foothills specialist helping a couple choose furniture'], ['wood-closeup', 'Close-up of a hand-finished solid wood tabletop']], cardsAs: 'grid', visit: true },
  'our-services': { kind: 'content', group: 'About', crumb: 'Our services', eyebrow: 'Our services', h1: 'Our services',
    description: 'Complimentary furniture design help, white glove delivery and commercial furniture sales from Foothills Amish Furniture in Landrum, SC.',
    hero: ['design-consult', 'A Foothills specialist helping a couple choose furniture at a showroom table'], images: [['associate-counter', 'A Foothills sales associate at the showroom counter'], ['showroom-floor-2', 'Dining sets on the showroom floor']], visit: true },
  'craftsmanship': { kind: 'content', group: 'About', crumb: 'Craftsmanship', eyebrow: 'Craftsmanship', h1: 'Craftsmanship',
    description: 'Integrity, simplicity and hard work: how Foothills Amish Furniture selects and inspects the Amish workshops that build our furniture.',
    hero: ['wood-closeup', 'Close-up of a hand-finished solid wood tabletop'], images: [['craft-kitchen', 'Amish-built cabinetry and dining furniture']], visit: true },
  'reviews-testimonials': { kind: 'content', group: 'About', crumb: 'Customer reviews', eyebrow: 'Customer reviews', h1: 'Customer reviews & testimonials',
    description: 'Read what customers say about Foothills Amish Furniture in Landrum, SC: 150+ positive reviews on our furniture, service and delivery.',
    hero: ['showroom-living', 'Sofas and occasional tables in the Landrum showroom'], drop: ['Customer Reviews on Facebook'], visit: false },
  'careers': { kind: 'content', group: 'About', crumb: 'Careers', eyebrow: 'Careers', h1: 'Careers',
    description: 'Work at Foothills Amish Furniture in Landrum, SC: full-time and part-time roles, flexible schedules and employee discounts.',
    hero: ['associate-counter', 'A Foothills sales associate at the showroom counter'], visit: true },

  // ---------------- Customize ----------------
  'customize': { kind: 'content', group: 'Customize', crumb: 'Customize', eyebrow: 'Customize', h1: 'Customization options',
    lede: 'Meet with a furniture design expert in Landrum to choose your wood, finish, hardware, fabric and size.',
    description: 'Customize Amish furniture at Foothills: choose the size, features, hardwood, stain or paint, hardware, fabric or leather, and poly outdoor colors.',
    hero: ['stain-samples', 'Wood and stain sample blocks in the Foothills showroom'], images: [['design-consult', 'A Foothills specialist reviewing options with customers'], ['hardware-knobs', 'Black knobs on a glass-front solid wood cabinet']],
    drop: ['America’s best furniture designed'], cardsAs: 'trio', visit: true },
  'wood-species-guide': { kind: 'content', group: 'Customize', crumb: 'Wood species', eyebrow: 'Customize', h1: 'Wood species guide',
    description: 'Compare the solid American hardwoods for Amish furniture: brown maple, cherry, quarter sawn white oak, reclaimed barnwood, elm, hard maple, hickory, oak and walnut.',
    hero: ['stain-samples', 'Wood species and stain sample blocks in the Foothills showroom'], cardsAs: 'specs', drop: ['Select a Wood'], visit: true },
  'wood-finishes': { kind: 'content', group: 'Customize', crumb: 'Wood finishes', eyebrow: 'Customize', h1: 'Amish furniture finishes',
    description: 'Choose any stain or paint color for your Amish furniture, or bring a sample from Farrow & Ball, Benjamin Moore or Sherwin-Williams and we will match it.',
    hero: ['stain-samples', 'Stain sample blocks in the Foothills showroom'], cardsAs: 'trio', visit: true },
  'hardware': { kind: 'content', group: 'Customize', crumb: 'Hardware', eyebrow: 'Customize', h1: 'Hardware options',
    description: 'Knobs, pulls, glass and crystal hardware in solid metal for your Amish furniture, in satin nickel, black, bronze and more.',
    hero: ['hardware-knobs', 'Black knobs on a glass-front solid wood cabinet'], cardsAs: 'grid', visit: true },
  'leather-fabric-upholstery-options': { kind: 'content', group: 'Customize', crumb: 'Fabrics & leathers', eyebrow: 'Customize', h1: 'Fabric & leather options',
    description: 'Over 1,000 fabric and top grain leather options for Amish and Smith Brothers upholstery at Foothills Amish Furniture.',
    hero: ['fabric-sofa', 'A tufted fabric sofa by Smith Brothers'], images: [['leather-sofa', 'A dark leather sofa by Smith Brothers']],
    drop: ['Select a Builder', '25 Most Popular'], cardsAs: 'grid', visit: true },
  'poly-outdoor-furniture-colors': { kind: 'content', group: 'Customize', crumb: 'Outdoor colors & fabrics', eyebrow: 'Customize', h1: 'Amish poly outdoor furniture',
    description: 'Amish-made poly outdoor furniture: weather-resistant, low maintenance, made from recycled HDPE, in over 50 colors with Sunbrella cushion fabrics.',
    hero: ['outdoor-colors', 'Poly outdoor chairs in several colors on the showroom patio'], images: [['outdoor-rockers', 'Rows of poly rockers and Adirondack chairs']], cardsAs: 'grid', visit: true },
  'live-edge-furniture': { kind: 'content', group: 'Customize', nav: 'Dining', crumb: 'Live edge furniture', eyebrow: 'Live edge', h1: 'Live edge furniture',
    description: 'One-of-a-kind live edge dining tables, desks and occasional tables, with glass inlays, epoxy colors and charred surfaces. Built to order by Amish craftsmen.',
    hero: ['live-edge-dining', 'A live edge dining table with a natural slab top'], images: [['live-edge-slabs', 'Live edge slabs and tables in the showroom'], ['live-edge-desk', 'A live edge walnut desk']], cardsAs: 'grid', visit: true },

  // ---------------- Help ----------------
  'faq': { kind: 'faq', group: 'Help', crumb: 'FAQ', eyebrow: 'Help', h1: 'Frequently asked questions',
    lede: 'Every question deserves an answer. If you have more, our furniture specialists are glad to help.',
    description: 'Answers about Foothills Amish Furniture: showroom location and hours, where the furniture is made, lead times, delivery, warranty, financing and poly furniture.', visit: true },
  'shipping-delivery': { kind: 'content', group: 'Help', crumb: 'Shipping & delivery', eyebrow: 'Nationwide shipping', h1: 'Shipping & delivery',
    description: 'White glove delivery near our Landrum, SC showroom and professional furniture carriers nationwide. Inspection, pickup, packaging and freight details.',
    hero: ['showroom-wide', 'The Landrum showroom floor'], cardsAs: 'grid', visit: true },
  'payments-financing': { kind: 'content', group: 'Help', crumb: 'Payments & financing', eyebrow: 'Payments & financing', h1: 'Payment options',
    description: 'Cash, checks, credit cards and special financing with the Foothills Amish Furniture credit card, issued with approved credit by Wells Fargo Bank, N.A.',
    hero: ['financing', 'Financing available at Foothills Amish Furniture'], cardsAs: 'trio', visit: true },
  'furniture-care': { kind: 'content', group: 'Help', crumb: 'Furniture care', eyebrow: 'Help', h1: 'Furniture care',
    description: 'How to dust, polish and care for solid hardwood Amish furniture, and how heat and humidity affect wood.',
    hero: ['wood-closeup', 'Close-up of a hand-finished solid wood tabletop'], visit: true },
  'our-policies': { kind: 'legal', group: 'Help', crumb: 'Store policies', eyebrow: 'In-store & order policies', h1: 'Store policies',
    description: 'Foothills Amish Furniture store policies: special orders, sales tax, payment, warranty, returns, delivery inspection and more.', drop: ['Privacy Policy'] },
  'privacy-policy': { kind: 'legal', group: 'Help', crumb: 'Privacy policy', eyebrow: 'Legal', h1: 'Privacy policy',
    description: 'How Foothills Amish Furniture collects, uses and protects your information.' },
  'terms-of-service': { kind: 'legal', group: 'Help', crumb: 'Terms of service', eyebrow: 'Legal', h1: 'Terms of service',
    description: 'The terms that govern use of the Foothills Amish Furniture website and services.' },

  // ---------------- Local / SEO landing pages ----------------
  'amish-furniture-showroom-landrum-sc': { kind: 'local', group: 'About', crumb: 'Our showroom', nav: 'Visit',
    description: 'Visit the largest Amish furniture showroom in the Foothills at 106 E. Rutherford St, Landrum, SC. Dining, bedroom, living, office and outdoor furniture, built to order.',
    hero: ['showroom-interior', 'Dining and living furniture on the Landrum showroom floor'],
    lists: { 'Customize Every Detail In-Store': ['Wood species', 'Stains & paints', 'Hardware', 'Fabrics & leathers', 'Sizes & configurations', 'Live-edge slabs'] }, rooms: true },
  'custom-amish-furniture-landrum-sc': { kind: 'local', group: 'Customize', crumb: 'Custom Amish furniture',
    description: 'Custom Amish furniture built to order in your choice of size, wood, finish and features. Visit our Landrum, SC showroom.',
    hero: ['design-consult', 'A Foothills specialist planning a custom piece with customers'],
    lists: { 'Custom Furniture for Every Room': ['Dining room', 'Bedroom', 'Living room', 'Home office', 'Outdoor (poly)', 'Kitchen islands'] }, rooms: true },
  'american-made-solid-wood-furniture-landrum-sc': { kind: 'local', group: 'Customize', crumb: 'American made furniture',
    description: 'American made, solid wood Amish furniture with no veneers or particleboard. White glove delivery from our Landrum, SC showroom.',
    hero: ['dining-showroom', 'Solid wood dining tables and chairs in the showroom'], rooms: true },
  'solid-hardwood-furniture-guide-landrum-sc': { kind: 'local', group: 'Customize', crumb: 'Solid hardwood guide',
    description: 'A guide to solid hardwood furniture: wood species, finishes, benefits and customization, from Foothills Amish Furniture in Landrum, SC.',
    hero: ['stain-samples', 'Wood species and stain sample blocks'],
    lists: { 'Choosing the Right Wood Species': ['Brown maple', 'Cherry & rustic cherry', 'Quarter sawn white oak', 'Hard maple', 'Hickory', 'Red oak', 'Elm', 'Walnut', 'Reclaimed barnwood'] }, rooms: true },
  'rustic-wood-furniture-landrum-sc': { kind: 'local', group: 'Customize', nav: 'Dining', crumb: 'Rustic wood furniture',
    description: 'Rustic wood furniture in Landrum, SC: reclaimed barnwood, rustic cherry and hickory, and live edge pieces, built to order by Amish craftsmen.',
    hero: ['p-amish-reclaimed-barnwood-1869-dining-collection-0', 'A reclaimed barnwood dining table with bench'],
    lists: { 'Rustic Wood Styles We Offer': ['Reclaimed barnwood', 'Rustic cherry', 'Rustic hickory', 'Elm', 'Live edge tops', 'Rustic dining sets'] }, rooms: true },
  'handcrafted-furniture-in-landrum-sc': { kind: 'local', group: 'Customize', crumb: 'Handcrafted furniture',
    description: 'Handcrafted furniture in Landrum, SC, built from solid American hardwoods by Amish craftsmen and delivered white glove.',
    hero: ['bedroom-four-post', 'A handcrafted four-poster bed in the showroom'], rooms: true },
};

/** Nav groups for the mega menu and footer (labels exactly as the live menu). */
export const CUSTOMIZE_MENU: [string, string][] = [
  ['Wood Species', '/pages/wood-species-guide'], ['Wood Finishes', '/pages/wood-finishes'], ['Hardware', '/pages/hardware'],
  ['Fabrics & Leathers', '/pages/leather-fabric-upholstery-options'], ['Outdoor Colors & Fabrics', '/pages/poly-outdoor-furniture-colors'],
  ['Custom Amish Furniture', '/pages/custom-amish-furniture-landrum-sc'], ['American Made Solid Wood Furniture', '/pages/american-made-solid-wood-furniture-landrum-sc'],
  ['Solid Hardwood Furniture Guide', '/pages/solid-hardwood-furniture-guide-landrum-sc'],
];
export const ABOUT_MENU: [string, string][] = [
  ['About Us', '/pages/our-story'], ['Our Team', '/pages/our-team'], ['Our Difference', '/pages/why-foothills-amish-furniture'],
  ['Our Services', '/pages/our-services'], ['Customer Reviews', '/pages/reviews-testimonials'], ['Careers', '/pages/careers'],
  ['Contact Us', '/pages/contact-us'], ['Our Showroom', '/pages/amish-furniture-showroom-landrum-sc'],
];
