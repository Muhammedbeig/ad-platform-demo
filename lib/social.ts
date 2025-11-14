import { Ad, User } from '@prisma/client';

// Get the base URL from your environment variables
const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

/**
 * Simulates sending ad data to social media webhooks.
 * This is a "fire-and-forget" function. We log errors
 * but don't stop the user's request.
 */
export async function shareAdToSocials(ad: Ad & { author: User | null }) {
  
  // Create a clean payload to send
  const payload = {
    id: ad.id,
    title: ad.title,
    description: ad.description,
    price: ad.price,
    category: ad.category,
    imageUrl: ad.aiImageUrl || ad.mediaUrls[0] || null,
    hashtags: ad.aiHashtags,
    authorName: ad.author?.name,
  };

  const whatsappUrl = `${BASE_URL}/api/webhooks/whatsapp`;
  const facebookUrl = `${BASE_URL}/api/webhooks/facebook`;

  // We use Promise.allSettled to send both requests in parallel
  // We don't care if they fail, we just want to log the result.
  const results = await Promise.allSettled([
    fetch(whatsappUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
    fetch(facebookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  ]);

  // Log the results to the server console
  results.forEach((result, index) => {
    const platform = index === 0 ? 'WhatsApp' : 'Facebook';
    if (result.status === 'fulfilled') {
      console.log(`✅ Successfully sent ad ${ad.id} to ${platform} webhook.`);
    } else {
      console.error(`❌ Failed to send ad to ${platform}:`, result.reason);
    }
  });
}