'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { categories, subCategories, Category, SubCategory } from '@/lib/categories';

// Local Icons for AI Buttons
const SparkleIcon = () => (
  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 12L17 14.25l-1.25-2.25L13.5 11l2.25-1.25L17 7.5l1.25 2.25L20.5 11l-2.25 1.25z" />
  </svg>
);

const ImageIcon = () => (
  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.581-1.581a4.5 4.5 0 0 1-6.364 0l-1.511-1.511a4.5 4.5 0 0 0-6.364 0L1.75 16.5m1.5-1.5h15.75m-15.75 0V3.75h15.75v12h-15.75Z" />
  </svg>
);

interface CreateAdFormProps {
  onClose: () => void;
}

const CreateAdForm: React.FC<CreateAdFormProps> = ({ onClose }) => {
  // --- CORE STATE ---
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<Category>(categories[0]);
  const [subCategory, setSubCategory] = useState<SubCategory>(subCategories[category][0]);
  const [media, setMedia] = useState<FileList | null>(null);
  const [hashtags, setHashtags] = useState(''); // Main hashtags field

  // --- AI STATE ---
  // We no longer need aiDescription, but we keep the others
  const [aiImageUrl, setAiImageUrl] = useState('');
  const [aiImagePreview, setAiImagePreview] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiContentGenerated, setAiContentGenerated] = useState(false);
  
  // --- UI STATE ---
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value as Category;
    setCategory(newCategory);
    setSubCategory(subCategories[newCategory][0] as SubCategory);
  };
  
  // --- AI CONTENT GENERATION HANDLER (UPDATED) ---
  const handleGenerateContent = async () => {
    if (!title.trim()) {
      setError('Please enter a title before generating AI content.');
      return;
    }
    
    setAiLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          description: description || 'No additional description provided.' 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // --- THIS IS THE FIX ---
        // Directly update the main form fields
        setTitle(data.enhancedTitle);
        setDescription(data.description);
        setHashtags(data.hashtags);
        setAiContentGenerated(true);
      } else {
        setError(data.error || 'AI Content Generation Failed.');
      }
    } catch (err) {
      setError('An error occurred while contacting the AI server.');
    }
    setAiLoading(false);
  };

  const handleGenerateImage = async () => {
    // ... (This function remains unchanged)
    if (!title.trim()) {
      setError('Please enter a title before generating an image.');
      return;
    }
    setAiLoading(true);
    setError(null);
    setAiImageUrl(''); 
    setAiImagePreview(''); 
    try {
      const res = await fetch('/api/ai/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      const data = await res.json();
      if (res.ok) {
        setAiImageUrl(data.aiImageUrl);
        setAiImagePreview(data.aiImageUrl);
      } else {
        setError(data.error || 'AI Image Generation Failed.');
      }
    } catch (err) {
      setError('An error occurred while contacting the AI server.');
    }
    setAiLoading(false);
  };
  
  // Apply button handler is no longer needed
  // const handleApplyAiDescription = () => { ... };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if ((!media || media.length === 0) && !aiImagePreview) {
      setError('Please upload at least one image or generate an AI thumbnail.');
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('subCategory', subCategory);
    
    // --- SEND AI FIELDS TO BACKEND ---
    // We no longer send a separate 'aiDescription'
    formData.append('hashtags', hashtags);
    formData.append('aiImageUrl', aiImageUrl);
    
    if (media) {
      Array.from(media).forEach((file) => {
        formData.append('media', file);
      });
    }

    try {
      const res = await fetch('/api/ads', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        router.refresh();
        onClose();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create ad.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    }

    setIsLoading(false);
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {error && (
        <div className="p-4 text-sm text-red-800 bg-red-50 rounded-lg border border-red-200 flex items-start gap-3" role="alert">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="font-medium">{error}</p>
        </div>
      )}
      
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-slate-800 mb-2">
          Post Title
        </label>
        <input
          type="text"
          id="title"
          className="block w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50 disabled:bg-slate-50"
          placeholder="e.g., iPhone 15 Pro Max for Sale"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* ... Category and Sub-Category fields ... (unchanged) */}
        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-slate-800 mb-2">
            Category
          </label>
          <select
            id="category"
            className="block w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            value={category}
            onChange={handleCategoryChange}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="subCategory" className="block text-sm font-semibold text-slate-800 mb-2">
            Sub-Category
          </label>
          <select
            id="subCategory"
            className="block w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value as SubCategory)}
          >
            {subCategories[category].map((subCat) => (
              <option key={subCat} value={subCat}>
                {subCat.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-slate-800 mb-2">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          className="block w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          placeholder="Add any additional details about your item..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required 
        ></textarea>
        <button
          type="button"
          onClick={handleGenerateContent}
          className="mt-3 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 hover:border-indigo-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || aiLoading}
        >
          <SparkleIcon />
          {aiLoading ? 'Generating...' : aiContentGenerated ? 'Regenerate with AI' : 'Enhance with AI'}
        </button>
      </div>

      {/* --- AI Generated Content Section REMOVED --- */}

      {/* --- Hashtags field is now a main field --- */}
      <div>
        <label htmlFor="hashtags" className="block text-sm font-semibold text-slate-800 mb-2">
          Hashtags (Optional)
        </label>
        <div className="relative">
          <input
            type="text"
            id="hashtags"
            className="block w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="e.g. #iphone #sale #tech"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            disabled={aiLoading}
          />
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Enter hashtags separated by spaces.
        </p>
      </div>


      <div>
        <label htmlFor="price" className="block text-sm font-semibold text-slate-800 mb-2">
          Price ($)
        </label>
        <input
          type="number"
          id="price"
          step="0.01"
          min="0"
          className="block w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          placeholder="0.00"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>

      <div>
        {/* ... Media Upload and AI Image Gen ... (unchanged) */}
        <label htmlFor="media" className="block text-sm font-semibold text-slate-800 mb-2">
          Media (Image/Video)
        </label>
        <input
          type="file"
          id="media"
          className="block w-full text-sm text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 file:transition-all"
          onChange={(e) => setMedia(e.target.files)}
          multiple
          accept="image/*,video/*"
        />
        <p className="mt-2 text-xs text-slate-500">
          Upload images/videos OR generate an AI thumbnail.
        </p>
        
        <div className="mt-4 flex items-center gap-4">
          <button
            type="button"
            onClick={handleGenerateImage}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg shadow-md hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || aiLoading || !!aiImagePreview}
          >
            <ImageIcon />
            {aiLoading ? 'Generating...' : aiImagePreview ? 'Thumbnail Generated' : 'Generate AI Thumbnail'}
          </button>
          
          {aiImagePreview && (
            <div className="relative group">
              <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-green-300 shadow-md">
                <img src={aiImagePreview} alt="AI Generated Thumbnail" className="w-full h-full object-cover" />
              </div>
              <button
                type="button"
                onClick={() => {
                  setAiImagePreview('');
                  setAiImageUrl('');
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                title="Remove AI thumbnail"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || aiLoading}
        className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Posting...
          </>
        ) : (
          'Post Advertisement'
        )}
      </button>
    </form>
  );
};

export default CreateAdForm;