-- Create browser_detections table with simplified JSON storage
CREATE TABLE IF NOT EXISTS browser_detections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    detection_data JSONB NOT NULL,
    user_agent TEXT NOT NULL,
    ip_address INET
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_browser_detections_created_at ON browser_detections(created_at);
CREATE INDEX IF NOT EXISTS idx_browser_detections_user_agent ON browser_detections(user_agent);
CREATE INDEX IF NOT EXISTS idx_browser_detections_data ON browser_detections USING GIN (detection_data);

-- Enable Row Level Security (RLS)
ALTER TABLE browser_detections ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since this is a browser detection tool)
-- Allow anyone to insert browser detection data
CREATE POLICY "Allow insert browser detections" ON browser_detections
    FOR INSERT WITH CHECK (TRUE);

-- Allow anyone to read browser detection data
CREATE POLICY "Allow read browser detections" ON browser_detections
    FOR SELECT USING (TRUE);

-- Drop the old detection_sessions table if it exists (we don't need it anymore)
DROP TABLE IF EXISTS detection_sessions; 