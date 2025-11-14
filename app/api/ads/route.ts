import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { writeFile } from 'fs/promises';
import path from 'path';
import { z } from 'zod';
import { categories, subCategories } from '@/lib/categories';
import { shareAdToSocials } from '@/lib/social'; // Import the social helper

// Zod schema to validate the form data
const adSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.preprocess((a) => parseFloat(a as string), z.number().min(0)),
  category: z.enum(categories),
  subCategory: z.string(),
  hashtags: z.string().optional().transform((val) => val ? val.split(' ') : []),
  aiImageUrl: z.string().optional(),
});


export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const formData = await req.formData();
  const files = formData.getAll('media') as File[];

  const validation = adSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    price: formData.get('price'),
    category: formData.get('category'),
    subCategory: formData.get('subCategory'),
    hashtags: formData.get('hashtags'),
    aiImageUrl: formData.get('aiImageUrl'),
  });

  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.issues[0].message },
      { status: 400 }
    );
  }

  const { title, description, price, category, subCategory, hashtags, aiImageUrl } = validation.data;

  // Validate sub-category
  if (!(subCategories[category] as readonly string[]).includes(subCategory)) {
    return NextResponse.json(
      { error: 'Invalid sub-category for selected category' },
      { status: 400 }
    );
  }

  const mediaUrls: string[] = [];
  
  if (files.length > 0 && files[0].size > 0) {
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
      const publicPath = path.join(process.cwd(), 'public/uploads', filename);
      await writeFile(publicPath, buffer);
      mediaUrls.push(`/uploads/${filename}`);
    }
  } else if (!aiImageUrl) {
    // Fail if no user images AND no AI image
    return NextResponse.json({ error: 'You must upload at least one image or generate an AI thumbnail.' }, { status: 400 });
  }

  try {
    // Save the ad to the database
    const ad = await prisma.ad.create({
      data: {
        title,
        description,
        price,
        category,
        subCategory: subCategory as any,
        mediaUrls, 
        authorId: session.user.id,
        aiHashtags: hashtags || [], 
        aiImageUrl: aiImageUrl || null,
      },
      include: { // Include author for the social share
        author: true,
      },
    });

    // Call the "fire-and-forget" social media function
    shareAdToSocials(ad);

    return NextResponse.json(ad, { status: 201 });
  } catch (error) {
    console.error('Ad creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create ad' },
      { status: 500 }
    );
  }
}