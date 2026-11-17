/** Team records taken from the live Our Team page
 *  (https://foothillsamishfurniture.com/pages/our-team), fetched 2026-11-17.
 *  Names, titles, bios and photo crops use only what that page shows. Nothing is invented.
 */
export type TeamMember = {
  slug: string;
  name: string;
  title: string;
  bio: string;
  photo: string;
  alt: string;
  /** People a visitor can book on /pages/book. */
  booking?: 'cabinetry' | 'furniture';
};

export const TEAM: TeamMember[] = [
  {
    slug: 'judson-patricia-miller',
    name: 'Judson & Patricia Miller',
    title: 'Owners – Foothills Amish Furniture & MillerBilt Cabinetry',
    bio: 'Judson is the owner of Foothills Amish Furniture and of MillerBilt Cabinetry in both Landrum and Charleston. He leads with a passion for quality, integrity, and exceptional service, and focuses on building a team and experience that exceed customer expectations and create lasting relationships. Judson & Patricia are dedicated to ensuring every guest feels welcomed, informed, and confident throughout their furniture and cabinetry journey.',
    photo: 'judson-patricia-miller',
    alt: 'Judson and Patricia Miller with their children, seated on a bench under a tree',
  },
  {
    slug: 'travis-campbell',
    name: 'Travis Campbell',
    title: 'General Manager – Foothills Amish Furniture & MillerBilt Cabinetry',
    bio: 'Travis brings strong leadership and operational expertise as General Manager of both Foothills Amish Furniture and MillerBilt Cabinetry. He oversees day-to-day activities to make sure every part of the showroom and customer experience runs smoothly. Travis values teamwork, efficiency, and creating a welcoming space where guests feel supported in finding furniture and cabinetry that fit their home.',
    photo: 'travis-campbell',
    alt: 'Travis Campbell, General Manager of Foothills Amish Furniture and MillerBilt Cabinetry',
  },
  {
    slug: 'michael-holladay',
    name: 'Michael Holladay',
    title: 'Sales Manager & Director of Cabinetry – Landrum',
    bio: 'Michael serves as Sales Manager and as Director of Cabinetry for MillerBilt in Landrum. He brings deep product knowledge and a keen eye for craftsmanship to every interaction. With over 25 years of experience, he helps customers confidently select pieces that reflect their style and needs. Michael is committed to delivering a high-quality experience through thoughtful guidance and personalized support.',
    photo: 'michael-holladay',
    alt: 'Michael Holladay, Sales Manager and Director of Cabinetry in Landrum',
    booking: 'cabinetry',
  },
  {
    slug: 'savannah-russel',
    name: 'Savannah Russel',
    title: 'Furniture Specialist',
    bio: 'Savannah is passionate about helping guests customize and choose furniture that brings their vision to life. She combines design insight with genuine enthusiasm to ensure each customer’s needs are met with care and expertise. Outside the showroom, Savannah enjoys caring for her horses and embracing the outdoors.',
    photo: 'savannah-russel',
    alt: 'Savannah Russel, Furniture Specialist',
    booking: 'furniture',
  },
  {
    slug: 'lexi-wertheim',
    name: 'Lexi Wertheim',
    title: 'Furniture Specialist',
    bio: 'Lexi brings energy, creativity, and a warm personality to the sales floor. As a Furniture Specialist, she supports customers through every step of the selection process to ensure a positive and stress-free experience. Her enthusiasm and attention to detail make her a trusted partner for guests finding their perfect furniture pieces.',
    photo: 'lexi-wertheim',
    alt: 'Lexi Wertheim, Furniture Specialist',
    booking: 'furniture',
  },
  {
    slug: 'kyra-yoder',
    name: 'Kyra Yoder',
    title: 'Furniture Specialist',
    bio: 'Kyra is dedicated to helping each customer find and design furniture they truly love. Before joining the sales team, she worked as an assistant to our store’s decorator, growing a passion for design and the little details. Away from the showroom, Kyra loves baking and sharing with those around her.',
    photo: 'kyra-yoder',
    alt: 'Kyra Yoder, Furniture Specialist',
    booking: 'furniture',
  },
  {
    slug: 'lauren-manzin',
    name: 'Lauren Manzin',
    title: 'Director of Cabinetry – Charleston',
    bio: 'Lauren leads MillerBilt Cabinetry in Charleston. She has a background in home design, and it shows in the thoughtful way she guides guests through the custom cabinet process. In her free time, she enjoys family time with her husband and two children.',
    photo: 'lauren-manzin',
    alt: 'Lauren Manzin, Director of Cabinetry in Charleston',
    booking: 'cabinetry',
  },
  {
    slug: 'joy-davenport',
    name: 'Joy Davenport',
    title: 'Merchandising & Decor Designer',
    bio: 'Joy uses her eye for design to elevate the showroom and showcase furniture with complementary decor that inspires customers. She enhances the shopping experience with thoughtful styling and creative displays. Joy cherishes time with her family and brings that warmth into her work.',
    photo: 'joy-davenport',
    alt: 'Joy Davenport, Merchandising and Decor Designer',
  },
  {
    slug: 'leigh-nodine',
    name: 'Leigh Nodine',
    title: 'Office Administrator',
    bio: 'Leigh keeps our office and customer service operations organized and efficient. She manages administrative tasks with precision and care, helping ensure every guest interaction is handled professionally. Leigh loves to travel and brings that curiosity and attention to detail into everything she does.',
    photo: 'leigh-nodine',
    alt: 'Leigh Nodine, Office Administrator',
  },
  {
    slug: 'felica-miller',
    name: 'Felica Miller',
    title: 'Administrative',
    bio: 'Felica supports the administrative team with focus and efficiency, helping maintain smooth backend operations. Whether assisting customers or supporting office workflows, she contributes with reliability and a positive approach.',
    photo: 'felica-miller',
    alt: 'Felica Miller, Administrative',
  },
  {
    slug: 'levi-cable',
    name: 'Levi Cable',
    title: 'Warehouse Manager',
    bio: 'Levi leads warehouse and logistics with precision and care. He ensures products are stored, handled, and delivered with excellence, making sure each piece reaches customers safely and on schedule. His commitment to service is reflected in every delivery.',
    photo: 'levi-cable',
    alt: 'Levi Cable, Warehouse Manager',
  },
  {
    slug: 'zachary-davis',
    name: 'Zachary Davis',
    title: 'Warehouse & Delivery',
    bio: 'Zachary supports our warehouse and delivery operations with attention to detail and professionalism. He takes pride in moving and delivering furniture carefully, ensuring the best possible experience for every guest.',
    photo: 'zachary-davis',
    alt: 'Zachary Davis, Warehouse and Delivery',
  },
  {
    slug: 'seth-swartz',
    name: 'Seth Swartz',
    title: 'Warehouse & Delivery',
    bio: 'Seth plays a vital role in our delivery team, bringing furniture into customers’ homes with respect and skill. His dedication to service and attention to safety make every delivery dependable and welcoming.',
    photo: 'seth-swartz',
    alt: 'Seth Swartz, Warehouse and Delivery',
  },
  {
    slug: 'gilligan',
    name: 'Gilligan',
    title: 'Store Mascot',
    bio: 'Gilligan is our store mascot and a fan favorite. Come see her when you visit the Landrum showroom — she’d love to meet you.',
    photo: 'gilligan',
    alt: 'Gilligan, the Foothills Amish Furniture store mascot, a blue and white parakeet',
  },
];

export const TEAM_BY_SLUG = Object.fromEntries(TEAM.map((m) => [m.slug, m]));

/** Cabinetry first (Lauren, then Michael), then Landrum furniture sales (Lexi, Savannah, Kyra), as directed. */
export const BOOKING_CATEGORIES = [
  {
    id: 'cabinetry' as const,
    label: 'Cabinetry',
    blurb: 'Custom cabinets for the kitchen, bath or built-ins, in Landrum or Charleston.',
    people: TEAM.filter((m) => m.booking === 'cabinetry').sort((a, b) => (a.slug === 'lauren-manzin' ? -1 : b.slug === 'lauren-manzin' ? 1 : 0)),
  },
  {
    id: 'furniture' as const,
    label: 'Furniture',
    blurb: 'Furniture sales at the Landrum showroom, from design help to the pieces on the floor.',
    people: TEAM.filter((m) => m.booking === 'furniture').sort((a, b) => {
      const order = ['lexi-wertheim', 'savannah-russel', 'kyra-yoder'];
      return order.indexOf(a.slug) - order.indexOf(b.slug);
    }),
  },
];

/** Home teaser: the five bookable specialists, then Gilligan. Official names and titles only. */
export const TEAM_TEASER = [
  ...BOOKING_CATEGORIES.flatMap((c) => c.people),
  TEAM_BY_SLUG['gilligan'],
];
