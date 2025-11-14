import { NextRequest, NextResponse } from 'next/server';
import { generateAdContent } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const { title, description } = await req.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required for AI generation.' }, { status: 400 });
    }

    const aiContent = await generateAdContent(title, description || 'No description provided.');

    return NextResponse.json(aiContent);

  } catch (error: any) {
    console.error('AI Content Generation Error:', error);

    // --- THIS IS THE FIX ---
    // Check for the Google AI "overloaded" error
    if (error.message && error.message.includes('503 Service Unavailable')) {
      return NextResponse.json({ error: 'The AI model is currently overloaded. Please try again in a moment.' }, { status: 503 });
    }
    
    // Send a generic error for other issues
    return NextResponse.json({ error: 'Failed to generate content. Please try again later.' }, { status: 500 });
  }
}