import { useLoaderData, useNavigate } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import EmailService from "../components/EmailService";
import { saveBrowserDetection, getBrowserDetection } from "../lib/database";
import { BrowserDetector, type ComprehensiveBrowserDetails } from "../lib/browser-detection";
import { CopyIcon, HomeIcon, BrowserIcon, ComputerIcon, MonitorIcon2, ZapIcon, WifiIcon, ShieldIcon, SettingsIcon, DatabaseIcon, GlobeIcon2, PlugIcon, MapPinIcon } from "../components/icons";
import { useState, useCallback, useRef } from "react";

// --- Helper Components for the new table layout ---

export function meta() {
    return [
        { title: "Detect Your Browser Details – BrowserDetect by EPYC" },
        {
            name: "description",
            content:
                "View full browser and system information, copy a shareable link, or send it via email. Powered by BrowserDetect from EPYC.",
        },
        {
            property: "og:title",
            content: "Detect Your Browser Details – BrowserDetect by EPYC",
        },
        {
            property: "og:description",
            content:
                "View full browser and system information, copy a shareable link, or send it via email. Powered by BrowserDetect from EPYC.",
        },
        {
            name: "twitter:card",
            content: "summary",
        },
        {
            name: "twitter:title",
            content: "Detect Your Browser Details – BrowserDetect by EPYC",
        },
        {
            name: "twitter:description",
            content:
                "Use BrowserDetect to inspect and share your browser and system data for debugging or support purposes.",
        },
        {
            rel: "canonical",
            href: "https://browserdetect.epyc.in/detect",
        },
    ];
}

// Table Section Header Component
const TableSectionHeader = ({ title, icon }: { title: string; icon: React.ReactNode; }) => (
    <tr className="bg-muted/40 border-t-2 border-gray-200 border-muted">
        <th colSpan={2} className="p-4 text-left text-xl font-bold text-foreground">
            <div className="flex items-center gap-4">
                <span className="text-2xl">{icon}</span>
                <span>{title}</span>
            </div>
        </th>
    </tr>
);

// Table Row Component
const TableRow = ({ label, value, index }: { label: string; value: React.ReactNode; index: number; }) => {
    if (value === null || value === undefined || value === '') return null;
    const isEven = index % 2 === 0;
    return (
        <tr className={`border-b border-border border-gray-200 last:border-b-0 ${isEven ? 'bg-alternate-row' : 'bg-white'} hover:bg-brand-100/40 transition-colors`}>
            <td className="p-4 font-semibold text-foreground w-1/3">{label}</td>
            <td className="p-4 text-muted-foreground break-all">{value}</td>
        </tr>
    );
};

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
                    shareableUrl: `/detect/${id}` // Will be fixed on client-side
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

    const [shareableUrl, setShareableUrl] = useState(() => {
        if (loaderData.type === 'existing') {
            const baseUrl = loaderData.shareableUrl;
            // If we're on client-side and URL doesn't have domain, add it
            if (typeof window !== 'undefined' && baseUrl && !baseUrl.startsWith('http')) {
                return `${window.location.origin}${baseUrl}`;
            }
            return baseUrl;
        }
        return "";
    });

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

    // Main UI - with new "Table Report" layout
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12 pt-12">
                        <h1 className="text-4xl font-bold text-foreground mb-4">
                            {loaderData.type === 'existing' ? 'Shared Browser Details' : 'Your Browser Details'}
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            {loaderData.type === 'existing'
                                ? `Detected on ${new Date(loaderData.created_at).toLocaleString()}`
                                : 'Complete technical profile for debugging and support'
                            }
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center my-12">
                        <button
                            onClick={copyToClipboard}
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground h-9 rounded-md px-3 bg-brand-primary hover:bg-brand-hover min-w-30 shadow-elegant hover:shadow-glow transition-all duration-300 text-white cursor-pointer"
                        >
                            <CopyIcon />
                            {copied ? "Copied to Clipboard!" : "Copy Link"}
                        </button>

                        <EmailService browserDetails={browserDetails} shareableUrl={shareableUrl} />

                    </div>

                    <div className="border border-gray-200 border-t-0 rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                            <tbody>
                                <TableSectionHeader title="Browser Information" icon={<BrowserIcon />} />
                                <TableRow label="Browser" value={`${browserDetails.browser} ${browserDetails.browserVersion}`} index={1} />
                                <TableRow label="Engine" value={browserDetails.browserEngine} index={2} />
                                <TableRow label="User Agent" value={browserDetails.userAgent} index={3} />

                                <TableSectionHeader title="System & Device" icon={<ComputerIcon />} />
                                <TableRow label="Operating System" value={`${browserDetails.os} ${browserDetails.osVersion}`} index={5} />
                                <TableRow label="Architecture" value={browserDetails.architecture} index={6} />
                                <TableRow label="Device Type" value={browserDetails.deviceType} index={7} />
                                <TableRow label="Model" value={browserDetails.deviceModel} index={8} />

                                <TableSectionHeader title="Display & Graphics" icon={<MonitorIcon2 />} />
                                <TableRow label="Screen Resolution" value={browserDetails.screenResolution} index={10} />
                                <TableRow label="Viewport Size" value={browserDetails.viewportSize} index={11} />
                                <TableRow label="Pixel Ratio" value={`${browserDetails.pixelRatio}x`} index={12} />
                                <TableRow label="Color Depth" value={`${browserDetails.colorDepth} bits`} index={13} />
                                <TableRow label="WebGL Support" value={
                                    <>
                                        {browserDetails.webglSupported ? '✅ WebGL' : '❌ WebGL'}
                                        {browserDetails.webgl2Supported ? ' ✅ WebGL2' : ' ❌ WebGL2'}
                                    </>
                                } index={14} />

                                <TableSectionHeader title="Hardware & Network" icon={<ZapIcon />} />
                                <TableRow label="CPU Cores" value={browserDetails.hardwareConcurrency} index={16} />
                                <TableRow label="Device Memory" value={browserDetails.deviceMemory ? `${browserDetails.deviceMemory} GB` : ''} index={17} />
                                <TableRow label="Online Status" value={browserDetails.onlineStatus ? '🟢 Online' : '🔴 Offline'} index={18} />
                                <TableRow label="IP Address" value={browserDetails.ipAddress} index={19} />
                                <TableRow label="Connection" value={browserDetails.effectiveType} index={20} />
                                <TableRow label="Downlink" value={browserDetails.downlink ? `${browserDetails.downlink} Mbps` : ''} index={21} />
                                <TableRow label="RTT" value={browserDetails.rtt ? `${browserDetails.rtt} ms` : ''} index={22} />

                                <TableSectionHeader title="Security & Privacy" icon={<ShieldIcon />} />
                                <TableRow label="JavaScript Enabled" value={browserDetails.javascriptEnabled ? '✅ Enabled' : '❌ Disabled'} index={24} />
                                <TableRow label="Cookies Enabled" value={browserDetails.cookiesEnabled ? '✅ Enabled' : '❌ Disabled'} index={25} />
                                <TableRow label="Third-Party Cookies" value={browserDetails.thirdPartyCookiesEnabled ? '✅ Enabled' : '❌ Blocked'} index={26} />
                                <TableRow label="Do Not Track" value={browserDetails.doNotTrack || 'Not set'} index={27} />
                                <TableRow label="Private Mode" value={browserDetails.privateMode ? '🕵️ Yes' : '👁️ No'} index={28} />
                                <TableRow label="Ad Blocker" value={browserDetails.adBlockerDetected ? '🛡️ Detected' : '❌ None'} index={29} />

                                <TableSectionHeader title="Advanced Details" icon={<SettingsIcon />} />
                                <TableRow label="Language" value={browserDetails.language} index={31} />
                                <TableRow label="Timezone" value={browserDetails.timezone} index={32} />
                                <TableRow label="Local Storage" value={browserDetails.localStorageAvailable ? '✅ Available' : '❌ Blocked'} index={33} />
                                <TableRow label="Page Load Time" value={`${browserDetails.loadTime.toFixed(2)} ms`} index={34} />
                                {browserDetails.geolocation && (
                                    <>
                                        <TableRow
                                            label="Location"
                                            value={
                                                browserDetails.geolocation.locationName && browserDetails.geolocation.locationName !== 'Unknown Location'
                                                    ? browserDetails.geolocation.locationName
                                                    : `${browserDetails.geolocation.latitude.toFixed(4)}, ${browserDetails.geolocation.longitude.toFixed(4)}`
                                            }
                                            index={35}
                                        />
                                        <TableRow label="Location Accuracy" value={`±${browserDetails.geolocation.accuracy.toFixed(0)}m`} index={36} />
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}