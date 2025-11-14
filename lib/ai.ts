import { writeFile } from 'fs/promises';
import path from 'path';
import { z } from 'zod';
import { google } from '@ai-sdk/google';
import {
  experimental_generateImage as generateImage,
  generateText,
} from 'ai';

// --- Schema for AI text response ---
const adContentSchema = z.object({
  enhancedTitle: z.string(),
  description: z.string(),
  hashtags: z.string(),
});

/**
 * Generates an enhanced title, ad description, and hashtags using Gemini.
 * (This function is correct and unchanged)
 */
export async function generateAdContent(title: string, userDescription: string) {
  // ... (code for generateAdContent is unchanged)
  const prompt = `
      You are a professional marketing copywriter. 
      A user is creating an ad with the current title: "${title}" and provided this description: "${userDescription}".
      
      Your task is to:
      1. Enhance the provided title to be more attractive and compelling (2-8 words).
      2. Generate an attractive, promotional description (around 2-3 sentences).
      3. Generate 5 relevant hashtags, separated by spaces (e.g., #tag1 #tag2).
      
      Respond *only* with a valid JSON object in this exact format: 
      {
        "enhancedTitle": "Your enhanced title.",
        "description": "Your generated description here.",
        "hashtags": "Your generated hashtags (space separated)."
      }
    `;

  const { text } = await generateText({
    model: google('models/gemini-2.5-flash'),
    prompt: prompt,
  });

  const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
  const data = JSON.parse(jsonString);

  return adContentSchema.parse(data);
}


/**
 * Generates a promotional ad image using Google's Imagen model.
 * If it fails, it falls back to a static iPhone placeholder image.
 */
export async function generateAdImage(title: string) {
  try {
    // --- ATTEMPT 1: Generate a real AI image ---
    const prompt = `A professional, clean, eye-catching promotional banner image for an ad titled: "${title}". Do not include any text in the image. Photorealistic, 1024x1024.`;

    const { image } = await generateImage({
      model: google('models/imagen-flash') as any, // 'as any' bypasses the type bug
      prompt: prompt,
    });

    const imageBuffer = Buffer.from(image.uint8Array);
    const filename = `ai-real-${Date.now()}-${title.replace(/\s+/g, '_')}.png`;
    const publicPath = path.join(process.cwd(), 'public/uploads', filename);

    await writeFile(publicPath, imageBuffer);
    return `/uploads/${filename}`;

  } catch (error) {
    // --- ATTEMPT 2: Fallback to a *Reliable iPhone Placeholder* ---
    console.error('--- Real AI Image Generation Failed ---');
    console.error(error); // Log the real error (e.g., billing)
    console.warn('--- Falling back to static iPhone placeholder image ---');

    try {
      // --- FIX: Using a high-quality, static iPhone image ---
      const placeholderUrl = `https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`;
      
      const imageResponse = await fetch(placeholderUrl);
      if (!imageResponse.ok) {
        throw new Error('Pexels placeholder fetch failed.');
      }

      const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
      const filename = `ai-placeholder-iphone.jpg`; // Use a static name
      const publicPath = path.join(process.cwd(), 'public/uploads', filename);

      await writeFile(publicPath, imageBuffer);
      
      // Return the placeholder URL
      return `/uploads/${filename}`;

    } catch (fallbackError) {
      console.error('--- Placeholder Fallback Also Failed ---', fallbackError);
      // If both fail, throw the *original* error
      throw error;
    }
  }
}