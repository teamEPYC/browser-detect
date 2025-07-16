import { v4 as uuidv4 } from 'uuid';

// Comprehensive browser details interface
export interface ComprehensiveBrowserDetails {
  // Basic Browser Info
  userAgent: string;
  browser: string;
  browserVersion: string;
  browserEngine: string;
  
  // Operating System
  os: string;
  osVersion: string;
  platform: string;
  architecture: string;
  
  // Device Information
  deviceType: string;
  deviceModel?: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  
  // Display & Graphics
  screenResolution: string;
  availableScreenSize: string;
  viewportSize: string;
  pixelRatio: number;
  colorDepth: number;
  pixelDepth: number;
  orientation: string;
  
  // Hardware Capabilities
  hardwareConcurrency: number;
  deviceMemory?: number;
  maxTouchPoints: number;
  
  // Network & Connection
  connectionType?: string;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
  onlineStatus: boolean;
  ipAddress?: string;
  
  // Browser Features & Support
  cookiesEnabled: boolean;
  javaEnabled: boolean;
  webglSupported: boolean;
  webgl2Supported: boolean;
  touchSupport: boolean;
  pointerSupport: boolean;
  
  // Localization
  language: string;
  languages: string[];
  timezone: string;
  timezoneOffset: number;
  localTime: string;
  
  // Browser Storage
  localStorageAvailable: boolean;
  sessionStorageAvailable: boolean;
  indexedDBAvailable: boolean;
  
  // Security & Privacy
  doNotTrack?: string;
  adBlockerDetected: boolean;
  privateMode: boolean;
  
  // Browser Plugins & Extensions
  plugins: string[];
  mimeTypes: string[];
  
  // Performance & Timing
  loadTime: number;
  navigationTiming?: PerformanceNavigationTiming;
  
  // Geolocation (if permitted)
  geolocation?: {
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: number;
    locationName?: string;
  };
  
  // Page Context
  referrer: string;
  url: string;
  documentTitle: string;
  
  // Canvas Fingerprinting
  canvasFingerprint?: string;
  webglFingerprint?: string;
  
  // Audio Context
  audioFingerprint?: string;
  
  // Metadata
  uniqueId: string;
  timestamp: string;
  userTimestamp: string;
}

export class BrowserDetector {
  private static instance: BrowserDetector;
  private isCollecting: boolean = false;
  private collectionPromise: Promise<ComprehensiveBrowserDetails> | null = null;
  
  static getInstance(): BrowserDetector {
    if (!BrowserDetector.instance) {
      BrowserDetector.instance = new BrowserDetector();
    }
    return BrowserDetector.instance;
  }
  
  async collectAllDetails(): Promise<ComprehensiveBrowserDetails> {
    // Prevent multiple simultaneous collections
    if (this.isCollecting && this.collectionPromise) {
      console.log('🔄 Collection already in progress, returning existing promise');
      return this.collectionPromise;
    }

    this.isCollecting = true;
    
    this.collectionPromise = (async () => {
      const startTime = performance.now();
      
      const details: ComprehensiveBrowserDetails = {
      // Basic Browser Info
      userAgent: navigator.userAgent,
      ...this.getBrowserInfo(),
      browserEngine: this.getBrowserEngine(),
      
      // Operating System
      ...this.getOSInfo(),
      architecture: this.getArchitecture(),
      
      // Device Information
      ...this.getDeviceInfo(),
      
      // Display & Graphics
      ...this.getDisplayInfo(),
      
      // Hardware Capabilities
      hardwareConcurrency: navigator.hardwareConcurrency || 0,
      deviceMemory: (navigator as any).deviceMemory,
      maxTouchPoints: navigator.maxTouchPoints || 0,
      
      // Network & Connection
      ...this.getNetworkInfo(),
      onlineStatus: navigator.onLine,
      ipAddress: await this.getIPAddress(),
      
      // Browser Features & Support
      cookiesEnabled: navigator.cookieEnabled,
      javaEnabled: typeof (window as any).java !== 'undefined',
      ...this.getGraphicsSupport(),
      touchSupport: this.getTouchSupport(),
      pointerSupport: this.getPointerSupport(),
      
      // Localization
      language: navigator.language,
      languages: Array.from(navigator.languages),
      ...this.getTimezoneInfo(),
      
      // Browser Storage
      ...this.getStorageSupport(),
      
      // Security & Privacy
      doNotTrack: navigator.doNotTrack || undefined,
      adBlockerDetected: this.detectAdBlocker(),
      privateMode: await this.detectPrivateMode(),
      
      // Browser Plugins & Extensions
      plugins: this.getPlugins(),
      mimeTypes: this.getMimeTypes(),
      
      // Performance & Timing
      loadTime: performance.now() - startTime,
      navigationTiming: this.getNavigationTiming(),
      
      // Page Context
      referrer: document.referrer,
      url: window.location.href,
      documentTitle: document.title,
      
      // Fingerprinting
      canvasFingerprint: this.getCanvasFingerprint(),
      webglFingerprint: this.getWebGLFingerprint(),
      audioFingerprint: this.getAudioFingerprint(),
      
      // Metadata
      uniqueId: uuidv4(),
      timestamp: new Date().toISOString(),
      userTimestamp: new Date().toLocaleString(),
    };
    
      // Try to get geolocation (async)
      try {
        details.geolocation = await this.getGeolocation();
      } catch (error) {
        console.log('Geolocation not available:', error);
      }
      
      return details;
    })();
    
    try {
      const result = await this.collectionPromise;
      return result;
    } finally {
      this.isCollecting = false;
      this.collectionPromise = null;
    }
  }
  
  private getBrowserInfo() {
    const userAgent = navigator.userAgent;
    let browser = "Unknown";
    let version = "Unknown";
    
    // Enhanced browser detection
    if (userAgent.includes("Firefox")) {
      browser = "Firefox";
      version = userAgent.match(/Firefox\/(\d+\.\d+)/)?.[1] || "Unknown";
    } else if (userAgent.includes("Edg")) {
      browser = "Microsoft Edge";
      version = userAgent.match(/Edg\/(\d+\.\d+)/)?.[1] || "Unknown";
    } else if (userAgent.includes("Chrome")) {
      browser = "Chrome";
      version = userAgent.match(/Chrome\/(\d+\.\d+)/)?.[1] || "Unknown";
    } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
      browser = "Safari";
      version = userAgent.match(/Version\/(\d+\.\d+)/)?.[1] || "Unknown";
    } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
      browser = "Opera";
      version = userAgent.match(/(?:Opera|OPR)\/(\d+\.\d+)/)?.[1] || "Unknown";
    }
    
    return { browser, browserVersion: version };
  }
  
  private getBrowserEngine(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Gecko") && userAgent.includes("Firefox")) return "Gecko";
    if (userAgent.includes("WebKit")) return "WebKit";
    if (userAgent.includes("Blink")) return "Blink";
    if (userAgent.includes("Trident")) return "Trident";
    return "Unknown";
  }
  
  private getOSInfo() {
    const userAgent = navigator.userAgent;
    let os = "Unknown";
    let osVersion = "Unknown";
    
    if (userAgent.includes("Windows")) {
      os = "Windows";
      if (userAgent.includes("Windows NT 10.0")) {
        // Enhanced Windows 11 detection
        osVersion = this.detectWindows11() ? "11" : "10";
      }
      else if (userAgent.includes("Windows NT 6.3")) osVersion = "8.1";
      else if (userAgent.includes("Windows NT 6.2")) osVersion = "8";
      else if (userAgent.includes("Windows NT 6.1")) osVersion = "7";
    } else if (userAgent.includes("Mac")) {
      os = "macOS";
      const match = userAgent.match(/Mac OS X (\d+[._]\d+[._]?\d*)/);
      if (match) osVersion = match[1].replace(/_/g, '.');
    } else if (userAgent.includes("Linux")) {
      os = "Linux";
    } else if (userAgent.includes("Android")) {
      os = "Android";
      const match = userAgent.match(/Android (\d+\.\d+)/);
      if (match) osVersion = match[1];
    } else if (userAgent.includes("iOS") || userAgent.includes("iPhone") || userAgent.includes("iPad")) {
      os = "iOS";
      const match = userAgent.match(/OS (\d+_\d+)/);
      if (match) osVersion = match[1].replace('_', '.');
    }
    
    return { os, osVersion, platform: navigator.platform };
  }

  private detectWindows11(): boolean {
    try {
      // Method 1: Check for Windows 11 specific user agent hints
      if ('userAgentData' in navigator) {
        const uaData = (navigator as any).userAgentData;
        if (uaData && uaData.getHighEntropyValues) {
          // This is async, but we'll try sync detection first
          // Could be enhanced with async detection later
        }
      }

      // Method 2: Check for Windows 11 indicators in user agent
      const userAgent = navigator.userAgent;
      
      // Windows 11 sometimes includes specific build numbers or identifiers
      if (userAgent.includes('Windows NT 10.0') && userAgent.includes('22000')) {
        return true; // Windows 11 build 22000+
      }

      // Method 3: Check for modern browser versions that typically run on Windows 11
      // This is heuristic-based and not 100% reliable
      const isModernChrome = userAgent.includes('Chrome') && 
        parseInt(userAgent.match(/Chrome\/(\d+)/)?.[1] || '0') >= 96;
      
      const hasHighDPI = window.devicePixelRatio >= 1.25;
      const hasModernFeatures = 'MediaQueryList' in window && 'matches' in MediaQueryList.prototype;
      
      // Heuristic: Newer systems with modern browsers and high DPI are more likely Windows 11
      // This is not definitive but provides a better guess
      if (isModernChrome && hasHighDPI && hasModernFeatures) {
        // Additional check: Windows 11 typically has newer hardware
        const hasManyLogicalProcessors = navigator.hardwareConcurrency >= 8;
        if (hasManyLogicalProcessors) {
          return true; // Likely Windows 11
        }
      }

      return false; // Default to Windows 10
    } catch (error) {
      console.warn('Windows 11 detection failed:', error);
      return false;
    }
  }
  
  private getArchitecture(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("WOW64") || userAgent.includes("Win64") || userAgent.includes("x64")) return "x64";
    if (userAgent.includes("ARM")) return "ARM";
    if (userAgent.includes("x86")) return "x86";
    return "Unknown";
  }
  
  private getDeviceInfo() {
    const userAgent = navigator.userAgent;
    const isMobile = /mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent);
    const isTablet = /tablet|ipad|playbook|silk/i.test(userAgent);
    const isDesktop = !isMobile && !isTablet;
    
    let deviceType = "desktop";
    if (isMobile) deviceType = "mobile";
    else if (isTablet) deviceType = "tablet";
    
    return {
      deviceType,
      isMobile,
      isTablet,
      isDesktop,
      deviceModel: this.getDeviceModel()
    };
  }
  
  private getDeviceModel(): string | undefined {
    const userAgent = navigator.userAgent;
    // Try to extract device model for mobile devices
    const iPhoneMatch = userAgent.match(/iPhone OS [\d_]+ like Mac OS X\) Version\/[\d.]+ Mobile\/[\w]+ Safari\/[\d.]+/);
    if (iPhoneMatch) return "iPhone";
    
    const androidMatch = userAgent.match(/Android [\d.]+; ([^)]+)\)/);
    if (androidMatch) return androidMatch[1];
    
    return undefined;
  }
  
  private getDisplayInfo() {
    return {
      screenResolution: `${screen.width}x${screen.height}`,
      availableScreenSize: `${screen.availWidth}x${screen.availHeight}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      pixelRatio: window.devicePixelRatio,
      colorDepth: screen.colorDepth,
      pixelDepth: screen.pixelDepth,
      orientation: screen.orientation ? screen.orientation.type : 'unknown'
    };
  }
  
  private getNetworkInfo() {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (!connection) return {};
    
    return {
      connectionType: connection.type,
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    };
  }

  private async getIPAddress(): Promise<string | undefined> {
    try {
      // Using a simple, privacy-respecting IP detection service
      const response = await fetch('https://api.ipify.org?format=json', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.ip;
      }
    } catch (error) {
      console.warn('Could not detect IP address:', error);
    }
    
    return undefined;
  }
  
  private getGraphicsSupport() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    const gl2 = canvas.getContext('webgl2');
    
    return {
      webglSupported: !!gl,
      webgl2Supported: !!gl2
    };
  }
  
  private getTouchSupport(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }
  
  private getPointerSupport(): boolean {
    return 'onpointerdown' in window;
  }
  
  private getTimezoneInfo() {
    const now = new Date();
    return {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: now.getTimezoneOffset(),
      localTime: now.toLocaleString()
    };
  }
  
  private getStorageSupport() {
    const testLocalStorage = () => {
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
      } catch (e) {
        return false;
      }
    };
    
    const testSessionStorage = () => {
      try {
        sessionStorage.setItem('test', 'test');
        sessionStorage.removeItem('test');
        return true;
      } catch (e) {
        return false;
      }
    };
    
    const testIndexedDB = () => {
      return !!window.indexedDB;
    };
    
    return {
      localStorageAvailable: testLocalStorage(),
      sessionStorageAvailable: testSessionStorage(),
      indexedDBAvailable: testIndexedDB()
    };
  }
  
  private detectAdBlocker(): boolean {
    // Simple ad blocker detection
    const testAd = document.createElement('div');
    testAd.innerHTML = '&nbsp;';
    testAd.className = 'adsbox';
    testAd.style.position = 'absolute';
    testAd.style.left = '-10000px';
    document.body.appendChild(testAd);
    
    const blocked = testAd.offsetHeight === 0;
    document.body.removeChild(testAd);
    return blocked;
  }
  
  private async detectPrivateMode(): Promise<boolean> {
    try {
      // Test for private mode by trying to use localStorage
      if (navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')) {
        try {
          localStorage.setItem('test', '1');
          localStorage.removeItem('test');
          return false;
        } catch (e) {
          return true;
        }
      }
      
      // For other browsers, try indexedDB
      return new Promise((resolve) => {
        const db = indexedDB.open('test');
        db.onerror = () => resolve(true);
        db.onsuccess = () => resolve(false);
      });
    } catch (e) {
      return false;
    }
  }
  
  private getPlugins(): string[] {
    return Array.from(navigator.plugins).map(plugin => plugin.name);
  }
  
  private getMimeTypes(): string[] {
    return Array.from(navigator.mimeTypes).map(mimeType => mimeType.type);
  }
  
  private getNavigationTiming(): PerformanceNavigationTiming | undefined {
    const perfEntries = performance.getEntriesByType('navigation');
    return perfEntries[0] as PerformanceNavigationTiming;
  }
  
  private getCanvasFingerprint(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('BrowserDetect Canvas Test 🌐', 2, 2);
    return canvas.toDataURL();
  }
  
  private getWebGLFingerprint(): string {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    if (!gl) return '';
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return '';
    
    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    return `${vendor} - ${renderer}`;
  }
  
  private getAudioFingerprint(): string {
    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = context.createAnalyser();
      const data = new Float32Array(analyser.frequencyBinCount);
      analyser.getFloatFrequencyData(data);
      context.close();
      return data.slice(0, 10).join(',');
    } catch (e) {
      return '';
    }
  }
  
  private getGeolocation(): Promise<{ latitude: number; longitude: number; accuracy: number; timestamp: number; locationName?: string }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };

          // Try to get location name using reverse geocoding
          try {
            const locationName = await this.reverseGeocode(coords.latitude, coords.longitude);
            resolve({ ...coords, locationName });
          } catch (error) {
            console.warn('Reverse geocoding failed:', error);
            resolve(coords); // Return without location name if reverse geocoding fails
          }
        },
        (error) => reject(error),
        { timeout: 5000, enableHighAccuracy: true }
      );
    });
  }

  private async reverseGeocode(latitude: number, longitude: number): Promise<string> {
    try {
      // Using a free reverse geocoding service
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log('🌍 Reverse geocoding response:', data); // Debug log
        
        // Build location string from locality (city), state, country
        const parts = [];
        if (data.locality) parts.push(data.locality);
        if (data.principalSubdivision) parts.push(data.principalSubdivision);
        if (data.countryName) parts.push(data.countryName);
        
        return parts.length > 0 ? parts.join(', ') : 'Unknown Location';
      }
      
      throw new Error('Reverse geocoding API failed');
    } catch (error) {
      console.warn('Could not get location name:', error);
      return 'Unknown Location';
    }
  }
} 