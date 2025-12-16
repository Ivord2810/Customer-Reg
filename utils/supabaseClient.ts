import { createClient } from '@supabase/supabase-js';

// Helper to safely access process.env if it exists, preventing crashes in some environments
const getEnvVar = (key: string): string | undefined => {
  try {
    // @ts-ignore
    return typeof process !== 'undefined' && process.env ? process.env[key] : undefined;
  } catch (e) {
    return undefined;
  }
};

// Use environment variables or fallbacks to ensure createClient never receives undefined
const supabaseUrl = getEnvVar('SUPABASE_URL') || 'https://hwwekgvaddusocutczej.supabase.co';
const supabaseKey = getEnvVar('SUPABASE_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3d2VrZ3ZhZGR1c29jdXRjemVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2MjI3MTgsImV4cCI6MjA4MTE5ODcxOH0.2VlHBCIzLIpyYrcjTYzUSmKl1I4md1HThVqD6vuRaVI';

if (supabaseUrl === 'https://placeholder.supabase.co') {
  console.warn("Using placeholder Supabase URL. Authentication and Database features will not work until you connect a valid Supabase project.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);