# Supabase Setup Guide

## Required Environment Variables

Create a `.env` file in your project root with the following variables:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project dashboard under Settings > API.

## Database Setup

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-schema.sql` 
4. Execute the SQL to create the required tables and policies

## Tables Created

### `browser_detections`
Simplified structure with JSON storage:
- `id`: UUID primary key (used in shareable URLs)
- `created_at`: Timestamp
- `detection_data`: JSONB field containing all browser/device information
- `user_agent`: Text field for basic indexing
- `ip_address`: Optional IP address (INET type)

## Features

✅ **Simplified Storage** - All detection data stored in a single JSON field for maximum flexibility
✅ **Permanent Links** - Share links never expire (no session management needed)
✅ **UUID-based URLs** - Proper UUID generation using the `uuid` package
✅ **Direct URL Support** - Visit `/detect/{uuid}` to view any existing detection
✅ **Clean UI** - Copy button instead of URL input field
✅ **Fallback Support** - App works offline with local storage if database is unavailable
✅ **Row Level Security** - Proper security policies in place

## Security

- Row Level Security (RLS) is enabled on all tables
- Public read access for detection data (appropriate for debugging tool)
- UUID-based URLs provide sufficient security through obscurity
- No sensitive user data is stored

## Usage

### Creating New Detection
1. Visit `/detect` to run browser detection
2. Data is automatically saved to Supabase with a UUID
3. URL updates to `/detect/{uuid}` automatically
4. Click "Copy Share Link" to share the detection

### Viewing Existing Detection
1. Visit `/detect/{uuid}` with any valid UUID
2. Detection data is loaded from Supabase
3. If UUID not found, redirects to create new detection

## URL Structure

- `/detect` - Create new browser detection
- `/detect/{uuid}` - View existing detection by UUID

The app includes error handling and will fall back to local-only mode if Supabase is unavailable. 