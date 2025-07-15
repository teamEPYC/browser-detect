export default function Footer() {
    return (
        <footer className="bg-card border-t border-gray-200 border-border">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-brand-900 to-brand-800 text-white rounded-lg flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-monitor w-5 h-5 text-primary-foreground">
                                    <rect width="20" height="14" x="2" y="3" rx="2">
                                    </rect>
                                    <line x1="8" x2="16" y1="21" y2="21">
                                    </line>
                                    <line x1="12" x2="12" y1="17" y2="21">
                                    </line>
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-foreground">BrowserDetect</span>
                        </div>
                        <p className="text-muted-foreground text-sm">Browser detection tool to help debug your experience quickly.</p>
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-semibold text-foreground">Product</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#features" className="text-muted-foreground hover:text-foreground transition-smooth">Features</a>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-foreground transition-smooth">Documentation</a>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-foreground transition-smooth">API Reference</a>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-foreground transition-smooth">Pricing</a>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-semibold text-foreground">Company</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#about" className="text-muted-foreground hover:text-foreground transition-smooth">About</a>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-foreground transition-smooth">Blog</a>
                            </li>
                            <li>
                                <a href="#contact" className="text-muted-foreground hover:text-foreground transition-smooth">Contact</a>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-foreground transition-smooth">Privacy Policy</a>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-semibold text-foreground">Connect</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="text-muted-foreground hover:text-primary transition-smooth" aria-label="Email">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail w-5 h-5">
                                    <rect width="20" height="16" x="2" y="4" rx="2">
                                    </rect>
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7">
                                    </path>
                                </svg>
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-smooth" aria-label="GitHub">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github w-5 h-5">
                                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4">
                                    </path>
                                    <path d="M9 18c-4.51 2-5-2-7-2">
                                    </path>
                                </svg>
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-smooth" aria-label="Twitter">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter w-5 h-5">
                                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z">
                                    </path>
                                </svg>
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-smooth" aria-label="LinkedIn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin w-5 h-5">
                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z">
                                    </path>
                                    <rect width="4" height="12" x="2" y="9">
                                    </rect>
                                    <circle cx="4" cy="4" r="2">
                                    </circle>
                                </svg>
                            </a>
                        </div>
                        <p className="text-xs text-muted-foreground">Get notified about updates and new features</p>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-border border-gray-200 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-muted-foreground">© 2025 EPYC. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">Terms of Service</a>
                        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">Privacy Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}