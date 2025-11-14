import { NextRequest, NextResponse } from 'next/server';
import { generateAdImage } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    // --- This is the one and only declaration ---
    const { title } = await req.json();
    if (!title) {
      return NextResponse.json(
        { error: 'Post Title is required for image generation.' },
        { status: 400 }
      );
    }
    
    // --- The duplicate block from lines 29-34 has been removed ---

    const localImageUrl = await generateAdImage(title);

    // If we get here, it means either the AI worked OR the fallback worked.
    return NextResponse.json({ aiImageUrl: localImageUrl });

  } catch (error: any) {
    // This block now catches errors from generateAdImage
    console.error('AI Image Generation Error (API Route):', error);

    // Check for the known Google API errors
    if (
      error.message &&
      (error.message.includes('permission denied') ||
        error.message.includes('Billing') ||
        error.message.includes('API key'))
    ) {
      return NextResponse.json(
        {
          error:
            'AI image generation failed. This feature may require billing info to be enabled on your Google Cloud project.',
        },
        { status: 500 }
      );
    }

    if (
      error.message &&
      (error.message.includes('overloaded') ||
        error.message.includes('503 Service Unavailable'))
    ) {
      return NextResponse.json(
        {
          error:
            'The AI image model is currently overloaded. Please try again later.',
        },
        { status: 503 }
      );
    }

    // Generic error if fallback also failed
    return NextResponse.json(
      { error: 'Failed to generate image. Please try again later.' },
      { status: 500 }
    );
  }
}