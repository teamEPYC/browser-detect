import { supabase, type BrowserDetection, type BrowserDetectionData } from './supabase'
import { type ComprehensiveBrowserDetails } from './browser-detection'

// Save browser detection data to Supabase
export async function saveBrowserDetection(data: ComprehensiveBrowserDetails) {
  if (!supabase) {
    console.warn('⚠️ Supabase not available, skipping database save')
    // Return a mock response for offline mode
    return {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      detection_data: data,
      user_agent: data.userAgent,
      ip_address: data.ipAddress
    } as BrowserDetection
  }

  try {
    const { data: result, error } = await supabase
      .from('browser_detections')
      .insert([{
        detection_data: data,
        user_agent: data.userAgent,
        ip_address: data.ipAddress
      }])
      .select()
      .single()

    if (error) {
      console.error('Error saving browser detection:', error)
      throw error
    }

    return result
  } catch (error) {
    console.error('Failed to save browser detection:', error)
    throw error
  }
}

// Get browser detection data by ID
export async function getBrowserDetection(id: string): Promise<BrowserDetection | null> {
  if (!supabase) {
    console.warn('⚠️ Supabase not available, cannot fetch detection')
    return null
  }

  try {
    const { data, error } = await supabase
      .from('browser_detections')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching browser detection:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Failed to fetch browser detection:', error)
    return null
  }
}

// Get analytics data (optional - for insights)
export async function getDetectionAnalytics() {
  if (!supabase) {
    console.warn('⚠️ Supabase not available, cannot fetch analytics')
    return []
  }

  try {
    const { data, error } = await supabase
      .from('browser_detections')
      .select('detection_data, created_at')
      .order('created_at', { ascending: false })
      .limit(1000)

    if (error) {
      console.error('Error fetching analytics:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Failed to fetch analytics:', error)
    throw error
  }
} 