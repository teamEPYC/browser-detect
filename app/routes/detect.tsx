import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

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
    const [browserDetails, setBrowserDetails] = useState<BrowserDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [shareableUrl, setShareableUrl] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        collectBrowserDetails();
    }, []);

    const collectBrowserDetails = async () => {
        try {
            // Generate unique ID
            const uniqueId = generateUniqueId();
            
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
            
            // Generate shareable URL
            const shareableUrl = `${window.location.origin}/detect/${uniqueId}`;
            setShareableUrl(shareableUrl);
            
            // TODO: Save to database
            // await saveToDatabase(details);
            
        } catch (error) {
            console.error('Error collecting browser details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const generateUniqueId = () => {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
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
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-foreground mb-4">Your Browser Details</h1>
                        <p className="text-lg text-muted-foreground">Share this information with our team for faster debugging</p>
                    </div>

                    {browserDetails && (
                        <div className="space-y-8">
                            {/* Shareable URL Section */}
                            <div className="bg-card border border-border rounded-lg p-6">
                                <h2 className="text-xl font-semibold text-foreground mb-4">Shareable Link</h2>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={shareableUrl}
                                        readOnly
                                        className="flex-1 px-3 py-2 border border-border rounded-md bg-muted text-foreground"
                                    />
                                    <button
                                        onClick={copyToClipboard}
                                        className="px-4 py-2 bg-brand-900 text-primary-foreground rounded-md hover:bg-brand-700 transition-colors"
                                    >
                                        {copied ? "Copied!" : "Copy"}
                                    </button>
                                </div>
                            </div>

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
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={emailUs}
                                    className="px-6 py-3 bg-brand-900 text-primary-foreground rounded-lg hover:bg-brand-700 transition-colors"
                                >
                                    Email Us
                                </button>
                                <a
                                    href="/"
                                    className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors text-center"
                                >
                                    Back to Home
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
} 