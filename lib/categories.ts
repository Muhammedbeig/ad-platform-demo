// These match your Prisma schema enums
export const categories = [
  'ELECTRONICS',
  'VEHICLES',
  'PROPERTY',
  'JOBS',
] as const;

export const subCategories = {
  ELECTRONICS: ['PHONES', 'LAPTOPS', 'CAMERAS'],
  VEHICLES: ['CARS', 'MOTORCYCLES'],
  PROPERTY: ['HOUSE_FOR_RENT', 'HOUSE_FOR_SALE'],
  JOBS: ['FULL_TIME', 'PART_TIME'],
} as const;

export type Category = (typeof categories)[number];
export type SubCategory = (typeof subCategories)[Category][number];