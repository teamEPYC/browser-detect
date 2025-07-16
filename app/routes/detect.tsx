import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { saveBrowserDetection, getBrowserDetection } from "../lib/database";
import { v4 as uuidv4 } from 'uuid';

interface BrowserDetails {
    userAgent: string;
    browser: string;
    browserVersion: string;
    os: string;
    osVersion: string;
    platform: string;
    screenResolution: string;
    pixelRatio: number;
    timezone: string;
    localTime: string;
    language: string;
    languages: string[];
    touchSupport: boolean;
    deviceMemory?: number;
    hardwareConcurrency?: number;
    connectionType?: string;
    cookiesEnabled: boolean;
    uniqueId: string;
    timestamp: string;
}

export default function Detect() {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const [browserDetails, setBrowserDetails] = useState<BrowserDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [shareableUrl, setShareableUrl] = useState("");
    const [copied, setCopied] = useState(false);
    const [isExistingDetection, setIsExistingDetection] = useState(false);

    useEffect(() => {
        if (id) {
            loadExistingDetection(id);
        } else {
            collectBrowserDetails();
        }
    }, [id]);

    const collectBrowserDetails = async () => {
        console.log('🔍 Starting browser detection...');
        try {
            // Generate unique ID using UUID
            const uniqueId = uuidv4();
            console.log('📝 Generated UUID:', uniqueId);

            // Collect browser details
            const details: BrowserDetails = {
                userAgent: navigator.userAgent,
                browser: getBrowserInfo().name,
                browserVersion: getBrowserInfo().version,
                os: getOSInfo().name,
                osVersion: getOSInfo().version,
                platform: navigator.platform,
                screenResolution: `${screen.width}x${screen.height}`,
                pixelRatio: window.devicePixelRatio,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                localTime: new Date().toLocaleString(),
                language: navigator.language,
                languages: Array.from(navigator.languages),
                touchSupport: 'ontouchstart' in window,
                deviceMemory: (navigator as any).deviceMemory,
                hardwareConcurrency: navigator.hardwareConcurrency,
                connectionType: (navigator as any).connection?.effectiveType,
                cookiesEnabled: navigator.cookieEnabled,
                uniqueId,
                timestamp: new Date().toISOString()
            };

            setBrowserDetails(details);

            // Prepare data for saving
            const detectionData = {
                ...details,
                deviceType: getDeviceType(),
                viewportSize: `${window.innerWidth}x${window.innerHeight}`,
                colorDepth: screen.colorDepth,
                pixelDepth: screen.pixelDepth,
                maxTouchPoints: navigator.maxTouchPoints || 0,
                javaEnabled: typeof (window as any).java !== 'undefined',
                onlineStatus: navigator.onLine,
                referrer: document.referrer,
                url: window.location.href
            };

            // Save to Supabase database
            try {
                const savedDetection = await saveBrowserDetection(detectionData);
                const shareableUrl = `${window.location.origin}/detect/${savedDetection.id}`;
                setShareableUrl(shareableUrl);

                // Update the URL without page reload
                window.history.replaceState({}, '', `/detect/${savedDetection.id}`);

            } catch (error) {
                console.error('Error saving to database:', error);
                // Fallback to local unique ID if database save fails
                const shareableUrl = `${window.location.origin}/detect/${uniqueId}`;
                setShareableUrl(shareableUrl);
                window.history.replaceState({}, '', `/detect/${uniqueId}`);
            }

        } catch (error) {
            console.error('Error collecting browser details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadExistingDetection = async (detectionId: string) => {
        try {
            const detection = await getBrowserDetection(detectionId);
            if (detection) {
                // Convert BrowserDetectionData to BrowserDetails format
                const browserDetails: BrowserDetails = {
                    ...detection.detection_data,
                    uniqueId: detection.id,
                    timestamp: detection.created_at
                };
                setBrowserDetails(browserDetails);
                setShareableUrl(`${window.location.origin}/detect/${detectionId}`);
                setIsExistingDetection(true);
            } else {
                // If detection not found, start new detection
                console.log('Detection not found, creating new detection');
                collectBrowserDetails();
                return;
            }
        } catch (error) {
            console.error('Error loading existing detection:', error);
            // Fallback to new detection
            collectBrowserDetails();
        } finally {
            setIsLoading(false);
        }
    };

    const getBrowserInfo = () => {
        const userAgent = navigator.userAgent;
        let name = "Unknown";
        let version = "Unknown";

        if (userAgent.includes("Chrome")) {
            name = "Chrome";
            version = userAgent.match(/Chrome\/(\d+)/)?.[1] || "Unknown";
        } else if (userAgent.includes("Firefox")) {
            name = "Firefox";
            version = userAgent.match(/Firefox\/(\d+)/)?.[1] || "Unknown";
        } else if (userAgent.includes("Safari")) {
            name = "Safari";
            version = userAgent.match(/Version\/(\d+)/)?.[1] || "Unknown";
        } else if (userAgent.includes("Edge")) {
            name = "Edge";
            version = userAgent.match(/Edge\/(\d+)/)?.[1] || "Unknown";
        }

        return { name, version };
    };

    const getOSInfo = () => {
        const userAgent = navigator.userAgent;
        let name = "Unknown";
        let version = "Unknown";

        if (userAgent.includes("Windows")) {
            name = "Windows";
            if (userAgent.includes("Windows NT 10.0")) version = "10";
            else if (userAgent.includes("Windows NT 6.3")) version = "8.1";
            else if (userAgent.includes("Windows NT 6.2")) version = "8";
            else if (userAgent.includes("Windows NT 6.1")) version = "7";
        } else if (userAgent.includes("Mac")) {
            name = "macOS";
            const match = userAgent.match(/Mac OS X (\d+_\d+)/);
            if (match) version = match[1].replace('_', '.');
        } else if (userAgent.includes("Linux")) {
            name = "Linux";
        } else if (userAgent.includes("Android")) {
            name = "Android";
            const match = userAgent.match(/Android (\d+)/);
            if (match) version = match[1];
        } else if (userAgent.includes("iOS")) {
            name = "iOS";
            const match = userAgent.match(/OS (\d+_\d+)/);
            if (match) version = match[1].replace('_', '.');
        }

        return { name, version };
    };

    const getDeviceType = () => {
        const userAgent = navigator.userAgent;

        if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
            return "tablet";
        } else if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
            return "mobile";
        } else {
            return "desktop";
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareableUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    const emailUs = () => {
        const subject = "Browser Details for Debugging";
        const body = `Please find my browser details at: ${shareableUrl}\n\nBrowser Details:\n${JSON.stringify(browserDetails, null, 2)}`;
        window.location.href = `mailto:support@epyc.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <main className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-lg text-muted-foreground">Collecting your browser details...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12 pt-12">
                        <h1 className="text-4xl font-bold text-foreground mb-4">Your Browser Details</h1>
                        <p className="text-lg text-muted-foreground">Share this information with our team for faster debugging</p>
                    </div>

                    {browserDetails && (
                        <div className="space-y-8">

                            {/* Browser Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-card border border-border rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-foreground mb-4">Browser Information</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <span className="text-sm text-muted-foreground">Browser:</span>
                                            <p className="font-medium">{browserDetails.browser} {browserDetails.browserVersion}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-muted-foreground">User Agent:</span>
                                            <p className="font-medium text-sm break-all">{browserDetails.userAgent}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-muted-foreground">Cookies Enabled:</span>
                                            <p className="font-medium">{browserDetails.cookiesEnabled ? "Yes" : "No"}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-card border border-border rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-foreground mb-4">System Information</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <span className="text-sm text-muted-foreground">Operating System:</span>
                                            <p className="font-medium">{browserDetails.os} {browserDetails.osVersion}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-muted-foreground">Platform:</span>
                                            <p className="font-medium">{browserDetails.platform}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-muted-foreground">Screen Resolution:</span>
                                            <p className="font-medium">{browserDetails.screenResolution}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-muted-foreground">Pixel Ratio:</span>
                                            <p className="font-medium">{browserDetails.pixelRatio}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-card border border-border rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-foreground mb-4">Hardware & Performance</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <span className="text-sm text-muted-foreground">Hardware Concurrency:</span>
                                            <p className="font-medium">{browserDetails.hardwareConcurrency || "Unknown"}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-muted-foreground">Device Memory:</span>
                                            <p className="font-medium">{browserDetails.deviceMemory ? `${browserDetails.deviceMemory} GB` : "Unknown"}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-muted-foreground">Touch Support:</span>
                                            <p className="font-medium">{browserDetails.touchSupport ? "Yes" : "No"}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-muted-foreground">Connection Type:</span>
                                            <p className="font-medium">{browserDetails.connectionType || "Unknown"}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-card border border-border rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-foreground mb-4">Localization</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <span className="text-sm text-muted-foreground">Language:</span>
                                            <p className="font-medium">{browserDetails.language}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-muted-foreground">Languages:</span>
                                            <p className="font-medium text-sm">{browserDetails.languages.join(", ")}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-muted-foreground">Timezone:</span>
                                            <p className="font-medium">{browserDetails.timezone}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-muted-foreground">Local Time:</span>
                                            <p className="font-medium">{browserDetails.localTime}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
                                <button
                                    onClick={copyToClipboard}
                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground  h-9 rounded-md px-3 bg-gradient-to-br from-brand-900 to-brand-800 hover:from-brand-800 hover:to-brand-900 min-w-30 shadow-elegant hover:shadow-glow transition-all duration-300 text-white cursor-pointer"
                                >
                                    {copied ? " Copied to Clipboard!" : "Copy Link"}
                                </button>
                                <button
                                    onClick={emailUs}
                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground h-9 rounded-md px-3 bg-gradient-to-br from-brand-900 to-brand-800 hover:from-brand-800 hover:to-brand-900 min-w-30 shadow-elegant hover:shadow-glow transition-all duration-300 text-white cursor-pointer"
                                >
                                    Email Us
                                </button>
                                <button
                                    onClick={() => navigate('/')}
                                    className="px-6 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors cursor-pointer hover:underline"
                                >
                                    Back to Home
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
} 