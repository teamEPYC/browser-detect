import { useLoaderData, useNavigate } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { saveBrowserDetection, getBrowserDetection } from "../lib/database";
import { BrowserDetector, type ComprehensiveBrowserDetails } from "../lib/browser-detection";
import { CopyIcon, MailIcon, HomeIcon } from "../components/icons";
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
const TableSectionHeader = ({ title, icon }: { title: string; icon: string; }) => (
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
const TableRow = ({ label, value }: { label: string; value: React.ReactNode; }) => {
    if (value === null || value === undefined || value === '') return null;
    return (
        <tr className="border-b border-border border-gray-200 last:border-b-0 odd:bg-white even:bg-muted/40 hover:bg-brand-100/40 transition-colors">
            <td className="p-4 font-semibold text-foreground w-1/3">{label}</td>
            <td className="p-4 text-muted-foreground break-all">{value}</td>
        </tr>
    );
};

// Notification Component
const Notification = ({ message, type, onClose }: { message: string; type: 'success' | 'error' | 'info'; onClose: () => void }) => {
    const bgColor = type === 'success' ? 'bg-green-700' : type === 'error' ? 'bg-red-700' : 'bg-blue-500';
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';

    return (
        <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 max-w-md animate-in slide-in-from-right-2 fade-in duration-300`}>
            <span>{icon}</span>
            <span>{message}</span>
            <button onClick={onClose} className="ml-2 text-white hover:text-gray-200">×</button>
        </div>
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

    // Email-related state
    const [isEmailSending, setIsEmailSending] = useState(false);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    // Show notification with auto-close
    const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000); // Auto-close after 3 seconds
    };

    // Generate HTML email body with table format
    const generateEmailBody = (details: ComprehensiveBrowserDetails): string => {
        const formatValue = (value: any): string => {
            if (value === null || value === undefined || value === '') return 'N/A';
            if (typeof value === 'boolean') return value ? 'Yes' : 'No';
            if (Array.isArray(value)) return value.length > 0 ? value.join(', ') : 'N/A';
            return String(value);
        };

        const formatBoolean = (value: boolean, trueText: string = 'Yes', falseText: string = 'No'): string => {
            return value ? `✅ ${trueText}` : `❌ ${falseText}`;
        };

        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Browser Detection Report</title>
        </head>
        <body style="margin: 0; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; line-height: 1.6;">
            <div style="max-width: 800px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                
                <!-- Header Section -->
                <div style="background: #183228; color: white; padding: 30px 20px; text-align: center;">
                    <div style="display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                        <h1 style="margin: 0; font-size: 28px; font-weight: bold;">EPYC Browser Detect</h1>
                    </div>
                    <h2 style="margin: 0; font-size: 20px; font-weight: normal; opacity: 0.9;">Complete Browser Detection Report</h2>
                    <p style="margin: 15px 0 0 0; opacity: 0.8; font-size: 14px;">Generated on ${new Date().toLocaleString()}</p>
                </div>

                <!-- Shareable Link Section -->
                <div style="background-color: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px 20px; margin: 0;">
                    <p style="margin: 0; color: #1976d2; font-weight: 500;">
                        📎 <strong>Shareable Link:</strong> 
                        <a href="${shareableUrl}" style="color: #1976d2; text-decoration: none; word-break: break-all;">${shareableUrl}</a>
                    </p>
                </div>

                <!-- Main Content Table -->
                <table style="width: 100%; border-collapse: collapse; margin: 0;">
                    
                    <!-- Browser Information Section -->
                    <tr>
                        <th colspan="2" style="background-color: #f5f5f5; padding: 16px; text-align: left; font-size: 18px; font-weight: bold; color: #333; border-bottom: 2px solid #e0e0e0;">
                            🌐 Browser Information
                        </th>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; width: 35%; background-color: #fafafa;">Browser</td>
                        <td style="padding: 12px 20px; color: #333;">${details.browser} ${details.browserVersion}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">Engine</td>
                        <td style="padding: 12px 20px; color: #333;">${formatValue(details.browserEngine)}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">User Agent</td>
                        <td style="padding: 12px 20px; color: #333; word-break: break-all; font-size: 13px;">${formatValue(details.userAgent)}</td>
                    </tr>

                    <!-- System & Device Section -->
                    <tr>
                        <th colspan="2" style="background-color: #f5f5f5; padding: 16px; text-align: left; font-size: 18px; font-weight: bold; color: #333; border-bottom: 2px solid #e0e0e0; border-top: 2px solid #e0e0e0;">
                            💻 System & Device
                        </th>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">Operating System</td>
                        <td style="padding: 12px 20px; color: #333;">${details.os} ${details.osVersion}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">Platform</td>
                        <td style="padding: 12px 20px; color: #333;">${formatValue(details.platform)}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">Architecture</td>
                        <td style="padding: 12px 20px; color: #333;">${formatValue(details.architecture)}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">Device Type</td>
                        <td style="padding: 12px 20px; color: #333;">${formatValue(details.deviceType)}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">Device Model</td>
                        <td style="padding: 12px 20px; color: #333;">${formatValue(details.deviceModel)}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">Mobile/Tablet/Desktop</td>
                        <td style="padding: 12px 20px; color: #333;">
                            ${details.isMobile ? '📱 Mobile' : ''} 
                            ${details.isTablet ? '📓 Tablet' : ''} 
                            ${details.isDesktop ? '🖥️ Desktop' : ''}
                        </td>
                    </tr>

                    <!-- Display & Graphics Section -->
                    <tr>
                        <th colspan="2" style="background-color: #f5f5f5; padding: 16px; text-align: left; font-size: 18px; font-weight: bold; color: #333; border-bottom: 2px solid #e0e0e0; border-top: 2px solid #e0e0e0;">
                            🖼️ Display & Graphics
                        </th>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">Screen Resolution</td>
                        <td style="padding: 12px 20px; color: #333;">${formatValue(details.screenResolution)}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">Available Screen Size</td>
                        <td style="padding: 12px 20px; color: #333;">${formatValue(details.availableScreenSize)}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">Viewport Size</td>
                        <td style="padding: 12px 20px; color: #333;">${formatValue(details.viewportSize)}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">Pixel Ratio</td>
                        <td style="padding: 12px 20px; color: #333;">${details.pixelRatio}x</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">Color Depth</td>
                        <td style="padding: 12px 20px; color: #333;">${details.colorDepth} bits</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">Pixel Depth</td>
                        <td style="padding: 12px 20px; color: #333;">${details.pixelDepth} bits</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">Orientation</td>
                        <td style="padding: 12px 20px; color: #333;">${formatValue(details.orientation)}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">WebGL Support</td>
                        <td style="padding: 12px 20px; color: #333;">
                            ${formatBoolean(details.webglSupported, 'WebGL Supported', 'WebGL Not Supported')} 
                            ${formatBoolean(details.webgl2Supported, 'WebGL2 Supported', 'WebGL2 Not Supported')}
                        </td>
                    </tr>

                    <!-- Hardware & Performance Section -->
                    <tr>
                        <th colspan="2" style="background-color: #f5f5f5; padding: 16px; text-align: left; font-size: 18px; font-weight: bold; color: #333; border-bottom: 2px solid #e0e0e0; border-top: 2px solid #e0e0e0;">
                            ⚡ Hardware & Performance
                        </th>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">CPU Cores</td>
                        <td style="padding: 12px 20px; color: #333;">${details.hardwareConcurrency} cores</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">Device Memory</td>
                        <td style="padding: 12px 20px; color: #333;">${details.deviceMemory ? `${details.deviceMemory} GB` : 'N/A'}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">Max Touch Points</td>
                        <td style="padding: 12px 20px; color: #333;">${details.maxTouchPoints}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">Touch Support</td>
                        <td style="padding: 12px 20px; color: #333;">${formatBoolean(details.touchSupport, 'Touch Supported', 'No Touch')}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">Pointer Support</td>
                        <td style="padding: 12px 20px; color: #333;">${formatBoolean(details.pointerSupport, 'Pointer Supported', 'No Pointer')}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">Page Load Time</td>
                        <td style="padding: 12px 20px; color: #333;">${details.loadTime.toFixed(2)} ms</td>
                    </tr>

                    <!-- Network & Connection Section -->
                    <tr>
                        <th colspan="2" style="background-color: #f5f5f5; padding: 16px; text-align: left; font-size: 18px; font-weight: bold; color: #333; border-bottom: 2px solid #e0e0e0; border-top: 2px solid #e0e0e0;">
                            🌐 Network & Connection
                        </th>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">Online Status</td>
                        <td style="padding: 12px 20px; color: #333;">${details.onlineStatus ? '🟢 Online' : '🔴 Offline'}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">IP Address</td>
                        <td style="padding: 12px 20px; color: #333;">${formatValue(details.ipAddress)}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">Connection Type</td>
                        <td style="padding: 12px 20px; color: #333;">${formatValue(details.connectionType)}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">Effective Connection</td>
                        <td style="padding: 12px 20px; color: #333;">${formatValue(details.effectiveType)}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">Downlink Speed</td>
                        <td style="padding: 12px 20px; color: #333;">${details.downlink ? `${details.downlink} Mbps` : 'N/A'}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">Round Trip Time</td>
                        <td style="padding: 12px 20px; color: #333;">${details.rtt ? `${details.rtt} ms` : 'N/A'}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">Save Data Mode</td>
                        <td style="padding: 12px 20px; color: #333;">${details.saveData ? '✅ Enabled' : '❌ Disabled'}</td>
                    </tr>

                    <!-- Security & Privacy Section -->
                    <tr>
                        <th colspan="2" style="background-color: #f5f5f5; padding: 16px; text-align: left; font-size: 18px; font-weight: bold; color: #333; border-bottom: 2px solid #e0e0e0; border-top: 2px solid #e0e0e0;">
                            🔒 Security & Privacy
                        </th>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">JavaScript Enabled</td>
                        <td style="padding: 12px 20px; color: #333;">${formatBoolean(details.javascriptEnabled, 'Enabled', 'Disabled')}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">Java Enabled</td>
                        <td style="padding: 12px 20px; color: #333;">${formatBoolean(details.javaEnabled, 'Enabled', 'Disabled')}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">Cookies Enabled</td>
                        <td style="padding: 12px 20px; color: #333;">${formatBoolean(details.cookiesEnabled, 'Enabled', 'Disabled')}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">Third-Party Cookies</td>
                        <td style="padding: 12px 20px; color: #333;">${formatBoolean(details.thirdPartyCookiesEnabled, 'Enabled', 'Blocked')}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">Do Not Track</td>
                        <td style="padding: 12px 20px; color: #333;">${formatValue(details.doNotTrack) || 'Not Set'}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">Private Mode</td>
                        <td style="padding: 12px 20px; color: #333;">${formatBoolean(details.privateMode, '🕵️ Private Mode', '👁️ Normal Mode')}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">Ad Blocker</td>
                        <td style="padding: 12px 20px; color: #333;">${formatBoolean(details.adBlockerDetected, '🛡️ Detected', '❌ Not Detected')}</td>
                    </tr>

                    <!-- Storage & Features Section -->
                    <tr>
                        <th colspan="2" style="background-color: #f5f5f5; padding: 16px; text-align: left; font-size: 18px; font-weight: bold; color: #333; border-bottom: 2px solid #e0e0e0; border-top: 2px solid #e0e0e0;">
                            💾 Storage & Features
                        </th>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">Local Storage</td>
                        <td style="padding: 12px 20px; color: #333;">${formatBoolean(details.localStorageAvailable, 'Available', 'Blocked')}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">Session Storage</td>
                        <td style="padding: 12px 20px; color: #333;">${formatBoolean(details.sessionStorageAvailable, 'Available', 'Blocked')}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">IndexedDB</td>
                        <td style="padding: 12px 20px; color: #333;">${formatBoolean(details.indexedDBAvailable, 'Available', 'Not Available')}</td>
                    </tr>

                    <!-- Localization Section -->
                    <tr>
                        <th colspan="2" style="background-color: #f5f5f5; padding: 16px; text-align: left; font-size: 18px; font-weight: bold; color: #333; border-bottom: 2px solid #e0e0e0; border-top: 2px solid #e0e0e0;">
                            🌍 Localization
                        </th>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">Primary Language</td>
                        <td style="padding: 12px 20px; color: #333;">${formatValue(details.language)}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">All Languages</td>
                        <td style="padding: 12px 20px; color: #333;">${formatValue(details.languages)}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">Timezone</td>
                        <td style="padding: 12px 20px; color: #333;">${formatValue(details.timezone)}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">Timezone Offset</td>
                        <td style="padding: 12px 20px; color: #333;">${details.timezoneOffset} minutes</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">Local Time</td>
                        <td style="padding: 12px 20px; color: #333;">${formatValue(details.localTime)}</td>
                    </tr>

                    <!-- Browser Extensions & Plugins Section -->
                    <tr>
                        <th colspan="2" style="background-color: #f5f5f5; padding: 16px; text-align: left; font-size: 18px; font-weight: bold; color: #333; border-bottom: 2px solid #e0e0e0; border-top: 2px solid #e0e0e0;">
                            🔌 Browser Plugins & Extensions
                        </th>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">Installed Plugins</td>
                        <td style="padding: 12px 20px; color: #333; font-size: 13px;">${details.plugins.length > 0 ? details.plugins.join('<br>') : 'No plugins detected'}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">MIME Types</td>
                        <td style="padding: 12px 20px; color: #333; font-size: 13px;">${details.mimeTypes.length > 0 ? `${details.mimeTypes.length} types supported` : 'N/A'}</td>
                    </tr>

                    ${details.geolocation ? `
                    <!-- Location Section -->
                    <tr>
                        <th colspan="2" style="background-color: #f5f5f5; padding: 16px; text-align: left; font-size: 18px; font-weight: bold; color: #333; border-bottom: 2px solid #e0e0e0; border-top: 2px solid #e0e0e0;">
                            📍 Location Information
                        </th>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">Location</td>
                        <td style="padding: 12px 20px; color: #333;">
                            ${details.geolocation.locationName && details.geolocation.locationName !== 'Unknown Location'
                    ? details.geolocation.locationName
                    : `${details.geolocation.latitude.toFixed(4)}, ${details.geolocation.longitude.toFixed(4)}`
                }
                        </td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">Coordinates</td>
                        <td style="padding: 12px 20px; color: #333;">
                            Lat: ${details.geolocation.latitude.toFixed(6)}, Lng: ${details.geolocation.longitude.toFixed(6)}
                        </td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 12px 20px; font-weight: 600; color: #555; background-color: #fafafa;">Location Accuracy</td>
                        <td style="padding: 12px 20px; color: #333;">±${details.geolocation.accuracy.toFixed(0)} meters</td>
                    </tr>` : ''}

                </table>

                <!-- Footer Section -->
                <div style="background-color: #f8f9fa; padding: 25px 20px; text-align: center; border-top: 2px solid #e0e0e0;">
                    <div style="margin-bottom: 15px;">
                        <div style="display: inline-flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                            <span style="font-size: 18px; font-weight: bold; color: #333;">EPYC Browser Detect</span>
                        </div>
                        <p style="margin: 0; color: #666; font-size: 14px;">This report was generated automatically by EPYC Browser Detection Tool</p>
                    </div>
                    <div style="border-top: 1px solid #e0e0e0; padding-top: 15px; margin-top: 15px;">
                        <p style="margin: 5px 0; color: #888; font-size: 12px;"><strong>Report ID:</strong> ${details.uniqueId}</p>
                        <p style="margin: 5px 0; color: #888; font-size: 12px;"><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
                        <p style="margin: 5px 0; color: #888; font-size: 12px;">© 2025 EPYC. All rights reserved.</p>
                    </div>
                </div>

            </div>
        </body>
        </html>`;
    };

    // Send email via Express backend
    const emailUs = async () => {
        if (!browserDetails) return;

        setIsEmailSending(true);
        showNotification('Sending email...', 'info');

        try {
            const emailBody = generateEmailBody(browserDetails);

            // TODO: Add support for multiple recipients later
            // const recipients = ['manishpandeycareer@gmail.com', 'support@epyc.com'];
            const recipients = ['manishpandeycareer@gmail.com'];

            const response = await fetch('http://localhost:3001/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: recipients.join(', '), // Join multiple emails with comma
                    subject: `Browser Detection Report - ${browserDetails.browser} on ${browserDetails.os}`,
                    html: emailBody
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                showNotification('Email sent successfully!', 'success');
                console.log('📧 Email sent with ID:', result.messageId);
            } else {
                throw new Error(result.error || 'Failed to send email');
            }
        } catch (error) {
            console.error('❌ Email error:', error);
            showNotification('Failed to send email. Please try again.', 'error');
        } finally {
            setIsEmailSending(false);
        }
    };

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
                            {copied ? "Copied to Clipboard!" : "Copy Share Link"}
                        </button>
                        <button
                            onClick={emailUs}
                            disabled={isEmailSending}
                            className={`inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground h-9 rounded-md px-3 bg-brand-primary hover:bg-brand-hover min-w-30 shadow-elegant hover:shadow-glow transition-all duration-300 text-white cursor-pointer ${isEmailSending ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isEmailSending ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <MailIcon />
                                    Email to us
                                </>
                            )}
                        </button>
                    </div>

                    {/* Notification */}
                    {notification && (
                        <Notification
                            message={notification.message}
                            type={notification.type}
                            onClose={() => setNotification(null)}
                        />
                    )}

                    <div className="border border-gray-200 border-t-0 rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                            <tbody>
                                <TableSectionHeader title="Browser Information" icon="🌐" />
                                <TableRow label="Browser" value={`${browserDetails.browser} ${browserDetails.browserVersion}`} />
                                <TableRow label="Engine" value={browserDetails.browserEngine} />
                                <TableRow label="User Agent" value={browserDetails.userAgent} />

                                <TableSectionHeader title="System & Device" icon="💻" />
                                <TableRow label="Operating System" value={`${browserDetails.os} ${browserDetails.osVersion}`} />
                                <TableRow label="Architecture" value={browserDetails.architecture} />
                                <TableRow label="Device Type" value={browserDetails.deviceType} />
                                <TableRow label="Model" value={browserDetails.deviceModel} />

                                <TableSectionHeader title="Display & Graphics" icon="🖼️" />
                                <TableRow label="Screen Resolution" value={browserDetails.screenResolution} />
                                <TableRow label="Viewport Size" value={browserDetails.viewportSize} />
                                <TableRow label="Pixel Ratio" value={`${browserDetails.pixelRatio}x`} />
                                <TableRow label="Color Depth" value={`${browserDetails.colorDepth} bits`} />
                                <TableRow label="WebGL Support" value={
                                    <>
                                        {browserDetails.webglSupported ? '✅ WebGL' : '❌ WebGL'}
                                        {browserDetails.webgl2Supported ? ' ✅ WebGL2' : ' ❌ WebGL2'}
                                    </>
                                } />

                                <TableSectionHeader title="Hardware & Network" icon="⚡" />
                                <TableRow label="CPU Cores" value={browserDetails.hardwareConcurrency} />
                                <TableRow label="Device Memory" value={browserDetails.deviceMemory ? `${browserDetails.deviceMemory} GB` : ''} />
                                <TableRow label="Online Status" value={browserDetails.onlineStatus ? '🟢 Online' : '🔴 Offline'} />
                                <TableRow label="IP Address" value={browserDetails.ipAddress} />
                                <TableRow label="Connection" value={browserDetails.effectiveType} />
                                <TableRow label="Downlink" value={browserDetails.downlink ? `${browserDetails.downlink} Mbps` : ''} />
                                <TableRow label="RTT" value={browserDetails.rtt ? `${browserDetails.rtt} ms` : ''} />

                                <TableSectionHeader title="Security & Privacy" icon="🔒" />
                                <TableRow label="JavaScript Enabled" value={browserDetails.javascriptEnabled ? '✅ Enabled' : '❌ Disabled'} />
                                <TableRow label="Cookies Enabled" value={browserDetails.cookiesEnabled ? '✅ Enabled' : '❌ Disabled'} />
                                <TableRow label="Third-Party Cookies" value={browserDetails.thirdPartyCookiesEnabled ? '✅ Enabled' : '❌ Blocked'} />
                                <TableRow label="Do Not Track" value={browserDetails.doNotTrack || 'Not set'} />
                                <TableRow label="Private Mode" value={browserDetails.privateMode ? '🕵️ Yes' : '👁️ No'} />
                                <TableRow label="Ad Blocker" value={browserDetails.adBlockerDetected ? '🛡️ Detected' : '❌ None'} />

                                <TableSectionHeader title="Advanced Details" icon="⚙️" />
                                <TableRow label="Language" value={browserDetails.language} />
                                <TableRow label="Timezone" value={browserDetails.timezone} />
                                <TableRow label="Local Storage" value={browserDetails.localStorageAvailable ? '✅ Available' : '❌ Blocked'} />
                                <TableRow label="Page Load Time" value={`${browserDetails.loadTime.toFixed(2)} ms`} />
                                {browserDetails.geolocation && (
                                    <>
                                        <TableRow
                                            label="Location"
                                            value={
                                                browserDetails.geolocation.locationName && browserDetails.geolocation.locationName !== 'Unknown Location'
                                                    ? browserDetails.geolocation.locationName
                                                    : `${browserDetails.geolocation.latitude.toFixed(4)}, ${browserDetails.geolocation.longitude.toFixed(4)}`
                                            }
                                        />
                                        <TableRow label="Location Accuracy" value={`±${browserDetails.geolocation.accuracy.toFixed(0)}m`} />
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