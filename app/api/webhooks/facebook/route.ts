import { NextRequest, NextResponse } from 'next/server';

/**
 * MOCK WEBHOOK for Facebook/Instagram
 * It receives the ad data and logs it to the console.
 */
export async function POST(req: NextRequest) {
  try {
    const adData = await req.json();

    // You can see this log in your 'npm run dev' terminal
    console.log('--- 🔵 FACEBOOK WEBHOOK RECEIVED ---');
    console.log(`Title: ${adData.title}`);
    console.log(`Image URL: ${adData.imageUrl}`);
    console.log('-----------------------------------');
    
    return NextResponse.json({ status: 'received' });
  } catch (error) {
    console.error('Facebook Webhook Error:', error);
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
  }
}