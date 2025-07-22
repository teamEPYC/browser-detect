import { Link, useNavigate, useParams } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import EmailService from "../components/EmailService";
import { saveBrowserDetection, getBrowserDetection } from "../lib/database";
import { BrowserDetector, type ComprehensiveBrowserDetails } from "../lib/browser-detection";
import { CopyIcon, BrowserIcon, ComputerIcon, MonitorIcon2, ZapIcon, ShieldIcon, SettingsIcon, MailIcon } from "../components/icons";
import { useState, useEffect, useRef } from "react";

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
            <div className="flex items-center gap-4 font-tt-rationalist">
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
        <tr className={`border-b border-border border-gray-200 last:border-b-0 ${isEven ? 'bg-alternate-row' : 'bg-white'} hover:bg-brand-100/40 transition-colors font-tt-norms-pro-serif`}>
            <td className="p-4 font-semibold text-foreground w-1/3">{label}</td>
            <td className="p-4 text-muted-foreground break-all">{value}</td>
        </tr>
    );
};

export default function Detect() {
    const { id } = useParams();
    const navigate = useNavigate();
    const collectionStartedRef = useRef(false);
    const isCollectingRef = useRef(false);
    const [browserDetails, setBrowserDetails] = useState<ComprehensiveBrowserDetails | null>(null);
    const [shareableUrl, setShareableUrl] = useState("");
    const [copied, setCopied] = useState(false);
    const [isCollecting, setIsCollecting] = useState(!id);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (id) {
            (async () => {
                try {
                    const detection = await getBrowserDetection(id!);
                    if (detection) {
                        setBrowserDetails(detection.detection_data as ComprehensiveBrowserDetails);
                        setShareableUrl(`${window.location.origin}/detect/${detection.id}`);
                        setIsCollecting(false);
                        setNotFound(false);
                    } else {
                        setNotFound(true);
                        setIsCollecting(false);
                    }
                } catch (e) {
                    setNotFound(true);
                    setIsCollecting(false);
                }
            })();
            return;
        }
        if (!id && (!collectionStartedRef.current && !window.browserDetectionInProgress)) {
            collectionStartedRef.current = true;
            isCollectingRef.current = true;
            window.browserDetectionInProgress = true;
            setTimeout(() => startBrowserDetection(), 0);
        }
    }, [id]);

    const startBrowserDetection = async () => {
        if (typeof window === 'undefined') return;
        try {
            const detector = BrowserDetector.getInstance();
            const details = await detector.collectAllDetails();
            setBrowserDetails(details);
            try {
                const savedDetection = await saveBrowserDetection(details);
                const newShareableUrl = `${window.location.origin}/detect/${savedDetection.id}`;
                setShareableUrl(newShareableUrl);
                window.history.replaceState({}, '', `/detect/${savedDetection.id}`);
            } catch (error) {
                const fallbackUrl = `${window.location.origin}/detect/${details.uniqueId}`;
                setShareableUrl(fallbackUrl);
                window.history.replaceState({}, '', `/detect/${details.uniqueId}`);
            }
        } catch (error) {
            // handle error
        } finally {
            setIsCollecting(false);
            isCollectingRef.current = false;
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

    if (isCollecting || !browserDetails) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <main className="container mx-auto px-4 py-16 md:px-12 flex flex-col items-center justify-center min-h-[60vh]">
                    {notFound ? (
                        <div className="text-center">
                            <h1 className="text-2xl font-bold mb-4">Detection Not Found</h1>
                            <p>The detection you are looking for does not exist.</p>
                        </div>
                    ) : (
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-900 mx-auto mb-4"></div>
                            <p className="text-lg text-muted-foreground font-tt-rationalist">
                                {id ? 'Loading browser details...' : 'Collecting comprehensive browser details...'}
                            </p>
                            <p className="text-sm text-muted-foreground mt-2 font-tt-norms-pro-serif">
                                Gathering detailed technical insights from your browser and device.
                            </p>
                        </div>
                    )}
                </main>
                <Footer />
            </div>
        );
    }

    // Main UI
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="container mx-auto px-4 py-16 md:px-12">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12 pt-12">
                        <h1 className="text-4xl font-bold text-foreground mb-4 font-tt-rationalist">
                            {id ? 'Shared Browser Details' : 'Your Browser Details'}
                        </h1>
                        <p className="text-lg text-muted-foreground font-tt-norms-pro-serif">
                            Complete technical profile for debugging and support
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center my-12">
                        <button
                            onClick={copyToClipboard}
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground h-9 rounded-full px-4 bg-brand-700 hover:bg-brand-hover min-w-30 shadow-elegant hover:shadow-glow transition-all duration-300 text-white cursor-pointer font-tt-norms-pro-serif"
                        >
                            <CopyIcon />
                            {copied ? "Copied to Clipboard!" : "Copy Link"}
                        </button>
                        {/* <EmailService browserDetails={browserDetails} shareableUrl={shareableUrl} /> */}
                        {browserDetails && shareableUrl && (() => {
                            const subject = `Browser Detection Report - ${browserDetails.browser} on ${browserDetails.os}`;
                            const body = [
                                "Hi,",
                                "",
                                "Here is my browser detection report for your reference:",
                                "",
                                shareableUrl,
                                "",
                                "Best regards,"
                            ].join('\n');
                            return (
                                <Link
                                    to={`mailto:manishpandeycareer@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}
                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground h-9 rounded-full px-4 bg-brand-700 hover:bg-brand-hover min-w-30 shadow-elegant hover:shadow-glow transition-all duration-300 text-white cursor-pointer font-tt-norms-pro-serif"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <MailIcon />
                                    Send Email
                                </Link>
                            );
                        })()}
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
                                <TableRow label="Private Mode" value={browserDetails.privateMode ? 'Yes' : '-'} index={28} />
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