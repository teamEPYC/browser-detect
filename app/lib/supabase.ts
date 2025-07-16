import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: ReturnType<typeof createClient> | null = null

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
    console.log('✅ Supabase client initialized successfully')
  } catch (error) {
    console.error('❌ Failed to initialize Supabase client:', error)
  }
} else {
  console.warn('⚠️ Supabase environment variables not found. Running in offline mode.', {
    VITE_SUPABASE_URL: supabaseUrl ? '✓ Set' : '✗ Missing',
    VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? '✓ Set' : '✗ Missing'
  })
}

export { supabase }

// Types for our simplified database structure
export interface BrowserDetection {
  id: string
  created_at: string
  detection_data: BrowserDetectionData
  user_agent: string
  ip_address?: string
}

export interface BrowserDetectionData {
  userAgent: string
  browser: string
  browserVersion: string
  os: string
  osVersion: string
  platform: string
  screenResolution: string
  pixelRatio: number
  timezone: string
  localTime: string
  language: string
  languages: string[]
  touchSupport: boolean
  deviceMemory?: number
  hardwareConcurrency?: number
  connectionType?: string
  cookiesEnabled: boolean
  deviceType: string
  viewportSize: string
  colorDepth: number
  pixelDepth: number
  maxTouchPoints: number
  javaEnabled: boolean
  onlineStatus: boolean
  referrer: string
  url: string
  geolocation?: {
    latitude: number
    longitude: number
    accuracy: number
  }
  timestamp: string
} 