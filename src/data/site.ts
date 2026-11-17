import { withBase } from './url';

export const SITE = {
  name: 'Foothills Amish Furniture',
  origin: 'https://foothillsamishfurniture.com',
  street: '106 E. Rutherford St',
  city: 'Landrum', region: 'SC', zip: '29356',
  address: '106 E. Rutherford St, Landrum, SC 29356',
  tel: '+18644572400', telDisplay: '(864) 457-2400',
  sms: 'sms:+18644572400',
  // GTM trigger "Directions": Click URL starts with https://maps.google.com/ AND Click Text equals DIRECTIONS
  directions: 'https://maps.google.com/?daddr=106+E.+Rutherford+St,+Landrum,+SC+29356',
  mapEmbed: 'https://www.google.com/maps?q=106+E.+Rutherford+St,+Landrum,+SC+29356&output=embed',
  book: withBase('/pages/book'),
  geo: { lat: 35.1751, lng: -82.1890 },
};

// Booking rules (Judson, Nov 2026). Confirmations go to the specialist who was booked;
// no other recipient has been named.
export const BOOKING = {
  durationMinutes: 60,
  noticeHours: 24,
  bufferMinutes: 60,
  hoursLabel: 'Monday–Saturday, 10 a.m. to 5 p.m. Eastern',
};

// LIVE LEAD ROUTING (inert in the demo: forms never submit).
// On the live site, contact and product-inquiry leads are emailed to
// travis@foothillsamish.com and a text is sent to the store phone, (864) 457-2400.
export const LEAD = {
  email: 'travis@foothillsamish.com',
  smsDisplay: '(864) 457-2400',
};
// 0 = Sunday. [open, close] in minutes after midnight, America/New_York.
export const HOURS: Record<number, [number, number] | null> = {
  0: null, 1: [600, 1020], 2: [600, 1020], 3: [600, 1020], 4: [600, 1020], 5: [600, 1020], 6: [600, 1020],
};
export const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

export const REVIEWS = [
  { name: 'Terra V.', text: 'Their store is beautifully laid out, they have incredible customer service, and their delivery team is top-tier. We found unique, high-quality pieces. We will definitely be back.' },
  { name: 'Bonnie', text: 'We could not be happier with our dining table and chairs. The workmanship is solid and beautiful. We chose our wood and stain and the edge on the table so that it is very personally our choice.' },
  { name: 'Alex', text: 'I live in Savannah and ordered our bedroom furniture and kitchen table set without seeing it in person. The delivery guys were so gentle with my furniture, very fast and professional.' },
  { name: 'Tom', text: 'The whole staff is friendly and customer focused. We have returned to Foothills several times and added a couple more smaller Amish pieces, as well as outdoor tables for our deck.' },
];

export const BUILDERS = [
  { name: 'Urban Barnwood', where: 'Ohio', text: 'Amish woodworkers in Ohio build each piece from local century-old barns: rough-sawn oak barnwood, hand-worn corners and a finish that lasts as long as the barns did.' },
  { name: 'A&J Woodworking', where: 'Amish workshop', text: 'Straight lines, mortise-and-tenon supports and peg joinery. Nearly every A&J piece is built to order in your choice of wood, stain or paint, and size.' },
  { name: 'RH Yoder', where: 'Amish workshop', text: 'Solid oak bases paired with true reclaimed barnwood tops, in sizes made to fit your table and your room.' },
];
