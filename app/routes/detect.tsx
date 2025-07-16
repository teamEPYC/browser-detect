import { useLoaderData, useNavigate } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { saveBrowserDetection, getBrowserDetection } from "../lib/database";
import { BrowserDetector, type ComprehensiveBrowserDetails } from "../lib/browser-detection";
import { useState, useCallback, useRef } from "react";

// Loader function - runs before component renders
export async function loader({ params }: LoaderFunctionArgs) {
    const { id } = params;

    // If we have an ID, try to load existing detection
    if (id) {
        console.log('🔍 Loading existing detection:', id);
        try {
            const existingDetection = await getBrowserDetection(id);
            if (existingDetection) {
                return {
                    type: 'existing' as const,
                    data: existingDetection.detection_data,
                    id: existingDetection.id,
                    created_at: existingDetection.created_at,
                    shareableUrl: `${typeof window !== 'undefined' ? window.location.origin : ''}/detect/${id}`
                };
            } else {
                console.log('⚠️ Detection not found, will create new one');
                return { type: 'new' as const };
            }
        } catch (error) {
            console.error('Error loading detection:', error);
            return { type: 'new' as const };
        }
    }

    // No ID provided, create new detection
    return { type: 'new' as const };
}

// Global flag to prevent multiple collections across all instances
declare global {
    interface Window {
        browserDetectionInProgress?: boolean;
    }
}

export default function Detect() {
    const loaderData = useLoaderData<typeof loader>();
    const navigate = useNavigate();
    
    // Protection flags
    const collectionStartedRef = useRef(false);
    const isCollectingRef = useRef(false);
    
    // Initialize state - for existing detections, set data immediately
    const [browserDetails, setBrowserDetails] = useState<ComprehensiveBrowserDetails | null>(
        loaderData.type === 'existing' ? loaderData.data as ComprehensiveBrowserDetails : null
    );
    
    // Initialize and start collection for new detections
    const [, setInitialized] = useState(() => {
        // Only run on client-side for new detections
        if (typeof window !== 'undefined' && 
            loaderData.type === 'new' && 
            !collectionStartedRef.current && 
            !window.browserDetectionInProgress) {
            
            // Set protection flags immediately
            collectionStartedRef.current = true;
            isCollectingRef.current = true;
            window.browserDetectionInProgress = true;
            
            // Start collection asynchronously (non-blocking)
            setTimeout(() => startBrowserDetection(), 0);
        }
        return true;
    });
    
    const [shareableUrl, setShareableUrl] = useState(
        loaderData.type === 'existing' ? loaderData.shareableUrl : ""
    );
    
    const [copied, setCopied] = useState(false);
    const [isCollecting, setIsCollecting] = useState(
        loaderData.type === 'new' && !browserDetails
    );

    // Browser detection function (extracted from previous useEffect logic)
    const startBrowserDetection = useCallback(async () => {
        if (typeof window === 'undefined') return; // SSR guard
        
        console.log('🔍 Starting comprehensive browser detection...');
        
        try {
            const detector = BrowserDetector.getInstance();
            const details = await detector.collectAllDetails();

            console.log('📊 Collected browser details:', details);
            setBrowserDetails(details);

            // Save to database
            try {
                const savedDetection = await saveBrowserDetection(details);
                const newShareableUrl = `${window.location.origin}/detect/${savedDetection.id}`;
                setShareableUrl(newShareableUrl);

                // Update URL without page reload
                window.history.replaceState({}, '', `/detect/${savedDetection.id}`);
                console.log('✅ Saved to database with ID:', savedDetection.id);
            } catch (error) {
                console.error('❌ Error saving to database:', error);
                // Fallback URL with generated ID
                const fallbackUrl = `${window.location.origin}/detect/${details.uniqueId}`;
                setShareableUrl(fallbackUrl);
                window.history.replaceState({}, '', `/detect/${details.uniqueId}`);
            }
        } catch (error) {
            console.error('Error collecting browser details:', error);
        } finally {
            setIsCollecting(false);
            isCollectingRef.current = false;
            // Keep protection flags set to prevent any future attempts
        }
    }, []); // No dependencies needed since we're not using this in useEffect

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

    // Loading state - same as before
    if (isCollecting || !browserDetails) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <main className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-900 mx-auto mb-4"></div>
                        <p className="text-lg text-muted-foreground">
                            {loaderData.type === 'existing' ? 'Loading browser details...' : 'Collecting comprehensive browser details...'}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Gathering {loaderData.type === 'new' ? '50+' : ''} data points about your browser and device
                        </p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Main UI - exactly the same as your current implementation
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-16">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12 pt-12">
                        <h1 className="text-4xl font-bold text-foreground mb-4">
                            {loaderData.type === 'existing' ? 'Shared Browser Details' : 'Your Comprehensive Browser Profile'}
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            {loaderData.type === 'existing'
                                ? `Detected on ${new Date(loaderData.created_at).toLocaleString()}`
                                : 'Complete technical profile for debugging and support'
                            }
                        </p>
                    </div>

                    <div className="space-y-8">
                        {/* Enhanced Browser Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {/* Browser Information */}
                            <div className="bg-card border border-border rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-foreground mb-4">🌐 Browser Information</h3>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-sm text-muted-foreground">Browser:</span>
                                        <p className="font-medium">{browserDetails.browser} {browserDetails.browserVersion}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-muted-foreground">Engine:</span>
                                        <p className="font-medium">{browserDetails.browserEngine}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-muted-foreground">User Agent:</span>
                                        <p className="font-medium text-xs break-all">{browserDetails.userAgent}</p>
                                    </div>
                                </div>
                            </div>

                            {/* System Information */}
                            <div className="bg-card border border-border rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-foreground mb-4">💻 System Information</h3>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-sm text-muted-foreground">Operating System:</span>
                                        <p className="font-medium">{browserDetails.os} {browserDetails.osVersion}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-muted-foreground">Architecture:</span>
                                        <p className="font-medium">{browserDetails.architecture}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-muted-foreground">Platform:</span>
                                        <p className="font-medium">{browserDetails.platform}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Device Information */}
                            <div className="bg-card border border-border rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-foreground mb-4">📱 Device Information</h3>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-sm text-muted-foreground">Device Type:</span>
                                        <p className="font-medium capitalize">{browserDetails.deviceType}</p>
                                    </div>
                                    {browserDetails.deviceModel && (
                                        <div>
                                            <span className="text-sm text-muted-foreground">Model:</span>
                                            <p className="font-medium">{browserDetails.deviceModel}</p>
                                        </div>
                                    )}
                                    <div>
                                        <span className="text-sm text-muted-foreground">Flags:</span>
                                        <p className="font-medium text-sm">
                                            {browserDetails.isMobile ? '📱 Mobile' : ''}
                                            {browserDetails.isTablet ? '📟 Tablet' : ''}
                                            {browserDetails.isDesktop ? '🖥️ Desktop' : ''}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Display & Graphics */}
                            <div className="bg-card border border-border rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-foreground mb-4">🖼️ Display & Graphics</h3>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-sm text-muted-foreground">Screen Resolution:</span>
                                        <p className="font-medium">{browserDetails.screenResolution}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-muted-foreground">Viewport Size:</span>
                                        <p className="font-medium">{browserDetails.viewportSize}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-muted-foreground">Pixel Ratio:</span>
                                        <p className="font-medium">{browserDetails.pixelRatio}x</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-muted-foreground">Color Depth:</span>
                                        <p className="font-medium">{browserDetails.colorDepth} bits</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-muted-foreground">WebGL Support:</span>
                                        <p className="font-medium">
                                            {browserDetails.webglSupported ? '✅ WebGL' : '❌ WebGL'}
                                            {browserDetails.webgl2Supported ? ' ✅ WebGL2' : ' ❌ WebGL2'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Hardware Capabilities */}
                            <div className="bg-card border border-border rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-foreground mb-4">⚡ Hardware</h3>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-sm text-muted-foreground">CPU Cores:</span>
                                        <p className="font-medium">{browserDetails.hardwareConcurrency}</p>
                                    </div>
                                    {browserDetails.deviceMemory && (
                                        <div>
                                            <span className="text-sm text-muted-foreground">Device Memory:</span>
                                            <p className="font-medium">{browserDetails.deviceMemory} GB</p>
                                        </div>
                                    )}
                                    <div>
                                        <span className="text-sm text-muted-foreground">Touch Points:</span>
                                        <p className="font-medium">{browserDetails.maxTouchPoints}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-muted-foreground">Input Support:</span>
                                        <p className="font-medium text-sm">
                                            {browserDetails.touchSupport ? '👆 Touch' : '❌ Touch'}
                                            {browserDetails.pointerSupport ? ' 🖱️ Pointer' : ' ❌ Pointer'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Network & Connection */}
                            <div className="bg-card border border-border rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-foreground mb-4">🌐 Network</h3>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-sm text-muted-foreground">Online Status:</span>
                                        <p className="font-medium">{browserDetails.onlineStatus ? '🟢 Online' : '🔴 Offline'}</p>
                                    </div>
                                    {browserDetails.effectiveType && (
                                        <div>
                                            <span className="text-sm text-muted-foreground">Connection:</span>
                                            <p className="font-medium">{browserDetails.effectiveType}</p>
                                        </div>
                                    )}
                                    {browserDetails.downlink && (
                                        <div>
                                            <span className="text-sm text-muted-foreground">Downlink:</span>
                                            <p className="font-medium">{browserDetails.downlink} Mbps</p>
                                        </div>
                                    )}
                                    {browserDetails.rtt && (
                                        <div>
                                            <span className="text-sm text-muted-foreground">RTT:</span>
                                            <p className="font-medium">{browserDetails.rtt} ms</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Security & Privacy */}
                            <div className="bg-card border border-border rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-foreground mb-4">🔒 Security & Privacy</h3>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-sm text-muted-foreground">Cookies:</span>
                                        <p className="font-medium">{browserDetails.cookiesEnabled ? '✅ Enabled' : '❌ Disabled'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-muted-foreground">Do Not Track:</span>
                                        <p className="font-medium">{browserDetails.doNotTrack || 'Not set'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-muted-foreground">Private Mode:</span>
                                        <p className="font-medium">{browserDetails.privateMode ? '🕵️ Yes' : '👁️ No'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-muted-foreground">Ad Blocker:</span>
                                        <p className="font-medium">{browserDetails.adBlockerDetected ? '🛡️ Detected' : '❌ None'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Storage Support */}
                            <div className="bg-card border border-border rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-foreground mb-4">💾 Storage</h3>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-sm text-muted-foreground">Local Storage:</span>
                                        <p className="font-medium">{browserDetails.localStorageAvailable ? '✅ Available' : '❌ Blocked'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-muted-foreground">Session Storage:</span>
                                        <p className="font-medium">{browserDetails.sessionStorageAvailable ? '✅ Available' : '❌ Blocked'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-muted-foreground">IndexedDB:</span>
                                        <p className="font-medium">{browserDetails.indexedDBAvailable ? '✅ Available' : '❌ Blocked'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Localization */}
                            <div className="bg-card border border-border rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-foreground mb-4">🌍 Localization</h3>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-sm text-muted-foreground">Primary Language:</span>
                                        <p className="font-medium">{browserDetails.language}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-muted-foreground">All Languages:</span>
                                        <p className="font-medium text-sm">{browserDetails.languages.slice(0, 3).join(', ')}</p>
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
                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground h-9 rounded-md px-3 bg-gradient-to-br from-brand-900 to-brand-800 hover:from-brand-800 hover:to-brand-900 min-w-30 shadow-elegant hover:shadow-glow transition-all duration-300 text-white cursor-pointer"
                            >
                                {copied ? "✅ Copied to Clipboard!" : "Copy Share Link"}
                            </button>
                            <button
                                onClick={emailUs}
                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground h-9 rounded-md px-3 bg-gradient-to-br from-brand-900 to-brand-800 hover:from-brand-800 hover:to-brand-900 min-w-30 shadow-elegant hover:shadow-glow transition-all duration-300 text-white cursor-pointer"
                            >
                                Email to us
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="px-6 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors cursor-pointer hover:underline"
                            >
                                Back to Home
                            </button>
                        </div>

                        {/* Technical Details Expandable Section */}
                        {browserDetails.canvasFingerprint && (
                            <details className="bg-card border border-border rounded-lg p-6">
                                <summary className="text-lg font-semibold text-foreground cursor-pointer">🔬 Advanced Technical Details</summary>
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-sm text-muted-foreground">Performance Load Time:</span>
                                        <p className="font-medium">{browserDetails.loadTime.toFixed(2)} ms</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-muted-foreground">Plugins Count:</span>
                                        <p className="font-medium">{browserDetails.plugins.length}</p>
                                    </div>
                                    {browserDetails.geolocation && (
                                        <div className="md:col-span-2">
                                            <span className="text-sm text-muted-foreground">Geolocation:</span>
                                            <p className="font-medium text-sm">
                                                {browserDetails.geolocation.latitude.toFixed(4)}, {browserDetails.geolocation.longitude.toFixed(4)}
                                                (±{browserDetails.geolocation.accuracy}m)
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </details>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}