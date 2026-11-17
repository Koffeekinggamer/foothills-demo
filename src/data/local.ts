/** New local landing pages (no live equivalent yet). Copy is written for the demo from facts on the live site:
 *  showroom address and hours, white glove delivery within about 100 miles (FAQ), typical 8–10 week build
 *  times (FAQ), the 10-year service promise (Our Story) and financing (Payments & Financing).
 *  Drive times are approximate and should be confirmed by the store before launch. */
export interface LocalPage {
  handle: string; city: string; region: string; crumb: string; h1: string; eyebrow: string; lede: string;
  seo: string; description: string; hero: [string, string]; drive: string;
  sections: { h: string; eyebrow?: string | null; paras: string[]; cards: { h: string; paras: string[] }[]; faq: { q: string; a: string[] }[] }[];
  options?: string[];
}
const S = (eyebrow: string, h: string, ...paras: string[]) => ({ eyebrow, h, paras, cards: [], faq: [] });

export const LOCAL: LocalPage[] = [
  {
    handle: 'amish-furniture-greenville-sc', city: 'Greenville', region: 'SC', crumb: 'Greenville, SC',
    eyebrow: 'Serving Greenville, South Carolina', h1: 'Amish Furniture for Greenville, SC',
    lede: 'Handcrafted solid wood furniture, about 40 minutes from downtown Greenville at our Landrum showroom.',
    seo: 'Amish Furniture Near Greenville, SC | Foothills Amish Furniture',
    description: 'Amish furniture for Greenville, SC homes: solid wood dining, bedroom, living and office furniture built to order, with white glove delivery from our Landrum showroom.',
    hero: ['main-street', 'Downtown Landrum, home of the Foothills Amish Furniture showroom'], drive: 'About 40 minutes from downtown Greenville',
    sections: [
      S('Worth the short drive', 'The Upstate’s largest Amish furniture showroom, close to Greenville',
        'Greenville families have been making the drive up to Landrum for years. Our showroom on E. Rutherford Street is the largest Amish furniture showroom in the Foothills, with dining rooms, bedrooms, living rooms, home offices and outdoor furniture set up the way they would look at home.',
        'Every piece is handcrafted by Amish woodworkers in Ohio, Pennsylvania and Indiana from solid American hardwoods. No particle board and no veneers.'),
      S('Built for your home', 'Made to fit Greenville homes, from downtown lofts to lake houses',
        'Most of what you see is built to order, so a table can be sized for a narrow dining room, a bed can be made in a different wood, and a cabinet can take the hardware you already have. Bring your measurements, a photo or a paint chip and we’ll help you choose.'),
      S('Delivery', 'White glove delivery to Greenville',
        'Greenville is well inside our white glove delivery area. Our own two-person team calls ahead to schedule, carries your furniture into the room you choose and sets it up: beds assembled, hutch tops placed.',
        'Custom orders typically ship in 8 to 10 weeks, and delivery from our warehouse is usually within about 10 days.'),
      S('Peace of mind', 'Looked after for ten years',
        'We service your furniture at no charge within ten years of delivery, whether it’s construction, finish, fabric or a part. Financing is available with approved credit.'),
    ],
  },
  {
    handle: 'amish-furniture-spartanburg-sc', city: 'Spartanburg', region: 'SC', crumb: 'Spartanburg, SC',
    eyebrow: 'Serving Spartanburg, South Carolina', h1: 'Amish Furniture for Spartanburg, SC',
    lede: 'Solid wood furniture built by Amish craftsmen, about 30 minutes from Spartanburg at our Landrum showroom.',
    seo: 'Amish Furniture Near Spartanburg, SC | Foothills Amish Furniture',
    description: 'Amish furniture for Spartanburg, SC: handcrafted solid wood dining, bedroom, living and outdoor furniture, built to order with white glove delivery from Landrum.',
    hero: ['storefront', 'The Foothills Amish Furniture storefront in Landrum, SC'], drive: 'About 30 minutes from Spartanburg',
    sections: [
      S('Close to home', 'A short drive up I-26 to the Foothills',
        'Our Landrum showroom is an easy trip from Spartanburg, Boiling Springs, Inman and Campobello. Walk the floor, sit at the tables and open the drawers. Photos can show what a piece looks like; only a visit shows how it’s built.'),
      S('Every room', 'Dining, bedroom, living, office and outdoor',
        'You’ll find furniture for every room, in styles from traditional and mission to rustic and contemporary. Our Amish-made poly outdoor furniture holds up to Upstate summers and cleans with soap and water.',
        'Every wood piece is solid American hardwood, and most can be built in your choice of wood, stain or paint, and size.'),
      S('Delivery', 'White glove delivery to Spartanburg',
        'Spartanburg is inside our white glove delivery area. Our team schedules a day and time with you, carries everything to the room you choose and handles the set-up.',
        'Custom orders typically ship in 8 to 10 weeks, and in-home delivery is usually within about 10 days after your piece reaches our warehouse.'),
      S('Family-owned', 'Real people, not a phone tree',
        'Foothills Amish Furniture is owned by Judson and Patricia Miller. When you call, you reach a furniture specialist, not voicemail. We service your furniture at no charge within ten years of delivery.'),
    ],
  },
  {
    handle: 'amish-furniture-asheville-nc', city: 'Asheville', region: 'NC', crumb: 'Asheville, NC',
    eyebrow: 'Serving Asheville & Western North Carolina', h1: 'Amish Furniture for Asheville, NC',
    lede: 'Handcrafted Amish furniture for mountain homes, about 45 minutes down I-26 at our Landrum, SC showroom.',
    seo: 'Amish Furniture Near Asheville, NC | Foothills Amish Furniture',
    description: 'Amish furniture for Asheville and Western North Carolina: live edge, reclaimed barnwood and solid hardwood furniture built to order, delivered white glove from Landrum, SC.',
    hero: ['showroom-floor', 'The Foothills Amish Furniture showroom floor in Landrum'], drive: 'About 45 minutes from Asheville',
    sections: [
      S('Just over the state line', 'From the mountains to the Foothills',
        'Asheville, Hendersonville and Tryon customers make the drive to Landrum for one reason: there is more Amish furniture under one roof here than anywhere else in the region. Plan an hour or two, and book a visit if you’d like a specialist’s full attention.'),
      S('Mountain style', 'Live edge, reclaimed and rustic, or clean and modern',
        'Live edge tables, reclaimed barnwood from century-old Ohio barns, and rustic cherry and hickory suit mountain homes. So do clean shaker lines in quarter sawn white oak. Every wood piece is solid American hardwood, built by Amish craftsmen in Ohio, Pennsylvania and Indiana.'),
      S('Delivery', 'Delivered to Western North Carolina',
        'Asheville is within our white glove delivery area of roughly 100 miles. Our team carries your furniture to the room you choose and sets it up. Farther out, we ship nationwide with professional furniture carriers.',
        'Custom orders typically ship in 8 to 10 weeks.'),
      S('Peace of mind', 'Service for ten years',
        'We service your furniture at no charge within ten years of delivery, whatever the issue: construction, finish, fabric or a part. Financing is available with approved credit.'),
    ],
  },
];
