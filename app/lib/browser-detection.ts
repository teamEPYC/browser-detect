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
  thirdPartyCookiesEnabled: boolean;
  javascriptEnabled: boolean;
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
      thirdPartyCookiesEnabled: await this.getThirdPartyCookiesEnabled(),
      javascriptEnabled: this.getJavaScriptEnabled(),
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

  private getJavaScriptEnabled(): boolean {
    // If this code is running, JavaScript is enabled
    // But we can also check for basic JavaScript features
    try {
      return typeof eval !== 'undefined' && 
             typeof Function !== 'undefined' && 
             typeof JSON !== 'undefined';
    } catch (e) {
      return false;
    }
  }

  private async getThirdPartyCookiesEnabled(): Promise<boolean> {
    try {
      // Test if third-party cookies are enabled by trying to create and read a cookie
      // in a cross-origin context simulation
      
      // First check if cookies are enabled at all
      if (!navigator.cookieEnabled) {
        return false;
      }

      // Try to detect third-party cookie blocking using various methods
      // Method 1: Check if Storage Access API is available (indicates third-party restrictions)
      if ('requestStorageAccess' in document) {
        try {
          // If requestStorageAccess exists, it suggests third-party context restrictions
          const permission = await navigator.permissions.query({ name: 'storage-access' as any });
          return permission.state === 'granted';
        } catch (e) {
          // If the API throws, assume restricted
        }
      }

      // Method 2: Try to detect SameSite restrictions
      try {
        // Set a test cookie and try to read it
        const testCookieName = 'third_party_test_' + Date.now();
        document.cookie = `${testCookieName}=test; SameSite=None; Secure`;
        
        // Small delay to allow cookie to be set
        await new Promise(resolve => setTimeout(resolve, 10));
        
        const cookieExists = document.cookie.indexOf(testCookieName) !== -1;
        
        // Clean up test cookie
        document.cookie = `${testCookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure`;
        
        return cookieExists;
      } catch (e) {
        // If cookie setting fails, assume third-party cookies are blocked
        return false;
      }

    } catch (error) {
      console.warn('Third-party cookie detection failed:', error);
      return false;
    }
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
  


  // Replace your existing detectPrivateMode method with this enhanced version
private async detectPrivateMode(): Promise<boolean> {
  try {
    console.log('🔍 Starting enhanced private mode detection...');

    // Get browser type for targeted detection
    const userAgent = navigator.userAgent.toLowerCase();
    const browserInfo = {
      isChrome: userAgent.includes('chrome') && !userAgent.includes('edg') && !userAgent.includes('opr'),
      isFirefox: userAgent.includes('firefox'),
      isSafari: userAgent.includes('safari') && !userAgent.includes('chrome'),
      isEdge: userAgent.includes('edg'),
      isOpera: userAgent.includes('opr') || userAgent.includes('opera')
    };

    console.log('🌐 Browser detection:', browserInfo);

    // Method 1: Storage Quota API (Most reliable for Chromium browsers)
    if (browserInfo.isChrome || browserInfo.isEdge || browserInfo.isOpera) {
      try {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
          const estimate = await navigator.storage.estimate();
          const quotaMB = estimate.quota ? (estimate.quota / (1024 * 1024)).toFixed(2) : 0;
          
          console.log(`💾 Storage quota: ${quotaMB} MB (${estimate.quota} bytes)`);
          
          // Chrome/Edge normal mode: typically 50GB+ (50,000+ MB)
          // Chrome/Edge incognito mode: typically 10-20MB
          if (estimate.quota && estimate.quota < 100 * 1024 * 1024) { // Less than 100MB
            console.log('✅ Private mode detected via storage quota (Chromium)');
            return true;
          } else {
            console.log('🔓 Normal mode detected via storage quota (Chromium)');
            return false;
          }
        } else {
          console.log('❌ Storage.estimate() not available in Chromium browser');
        }
      } catch (e) {
        console.log('❌ Storage quota test failed:', e);
      }
    }

    // Method 2: Firefox-specific IndexedDB test
    if (browserInfo.isFirefox) {
      try {
        const isPrivateFirefox = await new Promise<boolean>((resolve) => {
          let resolved = false;
          const dbName = `firefox_private_test_${Date.now()}`;
          
          try {
            const request = indexedDB.open(dbName, 1);
            
            request.onerror = (e) => {
              if (!resolved) {
                resolved = true;
                console.log('✅ Private mode detected via Firefox IndexedDB error');
                resolve(true); // Error indicates private mode in Firefox
              }
            };
            
            request.onupgradeneeded = () => {
              try {
                const db = request.result;
                const store = db.createObjectStore('test', { keyPath: 'id' });
                store.add({ id: 1, data: 'test' });
              } catch (e) {
                if (!resolved) {
                  resolved = true;
                  console.log('✅ Private mode detected via Firefox IndexedDB creation failure');
                  resolve(true);
                }
              }
            };
            
            request.onsuccess = () => {
              if (!resolved) {
                resolved = true;
                try {
                  const db = request.result;
                  db.close();
                  indexedDB.deleteDatabase(dbName);
                  console.log('🔓 Normal mode detected via Firefox IndexedDB success');
                  resolve(false); // Success indicates normal mode
                } catch (e) {
                  console.log('✅ Private mode detected via Firefox IndexedDB cleanup failure');
                  resolve(true);
                }
              }
            };
            
            // Timeout fallback
            setTimeout(() => {
              if (!resolved) {
                resolved = true;
                console.log('⏰ Firefox IndexedDB test timeout - assuming normal mode');
                resolve(false);
              }
            }, 1000);
            
          } catch (e) {
            console.log('✅ Private mode detected via Firefox IndexedDB exception:', e);
            resolve(true);
          }
        });

        return isPrivateFirefox;
        
      } catch (e) {
        console.log('❌ Firefox private mode detection failed:', e);
      }
    }

    // Method 3: Safari-specific localStorage quota test
    if (browserInfo.isSafari) {
      try {
        const testKey = `safari_private_test_${Date.now()}`;
        
        // Try to store data that would exceed Safari private mode quota
        const testData = 'x'.repeat(1024 * 10); // 10KB test data
        
        try {
          localStorage.setItem(testKey, testData);
          const retrieved = localStorage.getItem(testKey);
          
          // Clean up
          localStorage.removeItem(testKey);
          
          if (retrieved === testData) {
            console.log('🔓 Normal mode detected via Safari localStorage success');
            return false;
          } else {
            console.log('✅ Private mode detected via Safari localStorage retrieval failure');
            return true;
          }
          
        } catch (e) {
          console.log('✅ Private mode detected via Safari localStorage exception:', e.name);
          
          // Safari private mode throws QuotaExceededError
          if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
            return true;
          }
          
          // Other errors might also indicate private mode
          return true;
        }
        
      } catch (e) {
        console.log('❌ Safari private mode detection failed:', e);
      }
    }

    // Method 4: Fallback tests for unknown browsers or when primary method fails
    console.log('🔄 Running fallback detection methods...');

    // Fallback A: Try IndexedDB for any browser
    try {
      const indexedDBTest = await new Promise<boolean>((resolve) => {
        try {
          const dbName = `fallback_test_${Date.now()}`;
          const request = indexedDB.open(dbName, 1);
          
          let resolved = false;
          
          request.onerror = () => {
            if (!resolved) {
              resolved = true;
              resolve(true); // Error suggests private mode
            }
          };
          
          request.onsuccess = () => {
            if (!resolved) {
              resolved = true;
              try {
                request.result.close();
                indexedDB.deleteDatabase(dbName);
                resolve(false); // Success suggests normal mode
              } catch (e) {
                resolve(true);
              }
            }
          };
          
          setTimeout(() => {
            if (!resolved) {
              resolved = true;
              resolve(false); // Timeout assumes normal mode
            }
          }, 500);
          
        } catch (e) {
          resolve(true);
        }
      });

      if (indexedDBTest) {
        console.log('✅ Private mode detected via fallback IndexedDB test');
        return true;
      }
    } catch (e) {
      console.log('🔄 Fallback IndexedDB test failed:', e);
    }

    // Fallback B: Large sessionStorage test
    try {
      const largeData = 'x'.repeat(2 * 1024 * 1024); // 2MB
      const testKey = `large_storage_test_${Date.now()}`;
      
      sessionStorage.setItem(testKey, largeData);
      const retrieved = sessionStorage.getItem(testKey);
      sessionStorage.removeItem(testKey);
      
      if (retrieved !== largeData) {
        console.log('✅ Private mode detected via sessionStorage size limit');
        return true;
      }
    } catch (e) {
      console.log('✅ Private mode detected via sessionStorage exception:', e.name);
      return true;
    }

    // Fallback C: Multiple localStorage operations test
    try {
      const baseKey = `multi_test_${Date.now()}`;
      const testData = 'test_data_' + Math.random();
      
      // Test multiple rapid localStorage operations
      for (let i = 0; i < 5; i++) {
        localStorage.setItem(`${baseKey}_${i}`, testData + i);
      }
      
      // Verify all items were stored
      let allStored = true;
      for (let i = 0; i < 5; i++) {
        if (localStorage.getItem(`${baseKey}_${i}`) !== testData + i) {
          allStored = false;
          break;
        }
      }
      
      // Clean up
      for (let i = 0; i < 5; i++) {
        localStorage.removeItem(`${baseKey}_${i}`);
      }
      
      if (!allStored) {
        console.log('✅ Private mode detected via localStorage consistency test');
        return true;
      }
    } catch (e) {
      console.log('✅ Private mode detected via localStorage multi-operation test:', e);
      return true;
    }

    console.log('🔓 No private mode indicators found - assuming normal mode');
    return false;

  } catch (error) {
    console.warn('❌ Private mode detection failed completely:', error);
    return false; // Default to normal mode if detection fails
  }
}

// Helper methods (add these if they don't already exist in your class)
private isSafari(): boolean {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

private isChrome(): boolean {
  return /chrome/i.test(navigator.userAgent) && !/edg/i.test(navigator.userAgent);
}

private isEdge(): boolean {
  return /edg/i.test(navigator.userAgent);
}

private isFirefox(): boolean {
  return /firefox/i.test(navigator.userAgent);
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