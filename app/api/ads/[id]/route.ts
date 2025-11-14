import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { unlink } from 'fs/promises';
import path from 'path';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // This line was causing the error because the file was old.
  // We will get the ID from the URL to be safe.
  const adId = req.nextUrl.pathname.split('/').pop();
  
  if (!adId) {
    return NextResponse.json({ error: 'Ad ID not found in URL' }, { status: 400 });
  }

  try {
    // Find the ad
    const ad = await prisma.ad.findUnique({
      where: { id: adId },
    });

    if (!ad) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 });
    }

    // Check if user owns this ad
    if (ad.authorId !== session.user.id) {
      return NextResponse.json(
        { error: 'Not authorized to delete this ad' },
        { status: 403 }
      );
    }

    // Delete associated media files
    const filesToDelete = [...ad.mediaUrls];
    if (ad.aiImageUrl) {
      filesToDelete.push(ad.aiImageUrl);
    }

    for (const fileUrl of filesToDelete) {
      try {
        const filename = fileUrl.split('/').pop();
        if (filename) {
          const filePath = path.join(process.cwd(), 'public/uploads', filename);
          await unlink(filePath);
        }
      } catch (err) {
        console.error('Error deleting file (may already be gone):', err);
      }
    }

    // Delete the ad from database
    await prisma.ad.delete({
      where: { id: adId },
    });

    // This time, res.ok will be true
    return NextResponse.json({ message: 'Ad deleted successfully' });
  } catch (error) {
    console.error('Delete ad error:', error);
    return NextResponse.json(
      { error: 'Failed to delete ad' },
      { status: 500 }
    );
  }
}