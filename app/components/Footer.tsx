import { Link } from "react-router";
import { MonitorIcon, MailIcon, GithubIcon, TwitterIcon, LinkedinIcon } from "./icons";

export default function Footer() {
    return (
        <footer className="bg-card border-t border-gray-200 border-border">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <Link to="/">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-brand-900 to-brand-800 text-white rounded-lg flex items-center justify-center">
                                    <MonitorIcon className="w-5 h-5 text-primary-foreground" />
                                </div>
                                <span className="text-xl font-bold text-foreground">BrowserDetect</span>
                            </div>
                        </Link>
                        <p className="text-black/60 text-sm mt-4">Browser detection tool to help debug your experience quickly.</p>
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-semibold text-foreground">Product</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="#features" className="text-black/60 hover:underline transition-smooth">Features</Link>
                            </li>
                            <li>
                                <Link to="#" className="text-black/60 hover:underline transition-smooth">Documentation</Link>
                            </li>
                            <li>
                                <Link to="#" className="text-black/60 hover:underline transition-smooth">API Reference</Link>
                            </li>
                            <li>
                                <Link to="#" className="text-black/60 hover:underline transition-smooth">Pricing</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-semibold text-foreground">Company</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="#about" className="text-black/60 hover:underline transition-smooth">About</Link>
                            </li>
                            <li>
                                <Link to="#" className="text-black/60 hover:underline transition-smooth">Blog</Link>
                            </li>
                            <li>
                                <Link to="#contact" className="text-black/60 hover:underline transition-smooth">Contact</Link>
                            </li>
                            <li>
                                <Link to="#" className="text-black/60 hover:underline transition-smooth">Privacy Policy</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-semibold text-foreground">Connect</h3>
                        <div className="flex space-x-4">
                            <Link to="#" className="text-black/60 hover:text-primary hover:underline transition-smooth" aria-label="Email">
                                <MailIcon className="w-5 h-5" />
                            </Link>
                            <Link to="#" className="text-black/60 hover:text-primary hover:underline transition-smooth" aria-label="GitHub">
                                <GithubIcon className="w-5 h-5" />
                            </Link>
                            <Link to="#" className="text-black/60 hover:text-primary hover:underline transition-smooth" aria-label="Twitter">
                                <TwitterIcon className="w-5 h-5" />
                            </Link>
                            <Link to="#" className="text-black/60 hover:text-primary hover:underline transition-smooth" aria-label="LinkedIn">
                                <LinkedinIcon className="w-5 h-5" />
                            </Link>
                        </div>
                        <p className="text-xs text-black/60">Get notified about updates and new features</p>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-border border-gray-200 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-black/60">© 2025 EPYC. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link to="#" className="text-sm text-black/60 hover:underline transition-smooth">Terms of Service</Link>
                        <Link to="#" className="text-sm text-black/60 hover:underline transition-smooth">Privacy Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}