import { Link } from "react-router";
import { MonitorIcon, TwitterIcon, LinkedinIcon, InstagramIcon } from "./icons";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 border-border">
            <div className="container mx-auto px-4 pb-20 pt-12 lg:px-12 md:py-12 relative">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <Link to="/">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-brand-primary text-white rounded-lg flex items-center justify-center shrink-0">
                                    <MonitorIcon className="w-5 h-5 text-primary-foreground" />
                                </div>
                                <span className="text-xl font-bold text-brand-primary font-tt-rationalist">BrowserDetect</span>
                            </div>
                        </Link>
                        <p className="text-brand-primary text-sm mt-4 font-tt-norms-pro-serif">Browser detection tool to help debug your experience quickly.</p>
                    </div>
                    <div className="space-y-4 md:px-2">
                        {/* <h3 className="font-semibold text-brand-primary">Links</h3> */}
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="https://www.epyc.in/projects" target="_blank" className="text-brand-primary hover:underline hover:text-brand-primary transition-smooth font-tt-norms-pro-serif">Projects</Link>
                            </li>
                            <li>
                                <Link to="https://www.epyc.in/#featured" target="_blank" className="text-brand-primary hover:underline hover:text-brand-primary transition-smooth font-tt-norms-pro-serif">Latest work</Link>
                            </li>
                            <li>
                                <Link to="https://www.epyc.in/blogs" target="_blank" className="text-brand-primary hover:underline hover:text-brand-primary transition-smooth font-tt-norms-pro-serif">Blogs</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-4 md:px-2">
                        {/* <h3 className="font-semibold text-brand-primary">Links</h3> */}
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="https://www.epyc.in/" target="_blank" className="text-brand-primary hover:underline hover:text-brand-primary transition-smooth font-tt-norms-pro-serif">Main website</Link>
                            </li>
                            <li>
                                <Link to="https://www.epyc.in/contact" target="_blank" className="text-brand-primary hover:underline hover:text-brand-primary transition-smooth font-tt-norms-pro-serif">Contact</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-semibold text-brand-primary">Connect</h3>
                        <div className="flex space-x-4">
                            {/* <Link to="#" className="text-brand-primary hover:text-primary hover:underline transition-smooth" aria-label="Email">
                                <MailIcon className="w-5 h-5" />
                            </Link> */}
                            {/* <Link to="#" target="_blank" className="text-brand-primary hover:text-primary hover:underline transition-smooth" aria-label="GitHub">
                                <GithubIcon className="w-5 h-5" />
                            </Link> */}
                            <Link to="https://www.instagram.com/teamEPYC/" target="_blank" className="text-brand-primary hover:text-primary hover:underline transition-smooth" aria-label="Instagram">
                                <InstagramIcon className="w-5 h-5 hover:text-brand-primary" />
                            </Link>
                            <Link to="https://x.com/teamEPYC" target="_blank" className="text-brand-primary hover:text-primary hover:underline transition-smooth" aria-label="Twitter">
                                <TwitterIcon className="w-5 h-5 hover:text-brand-primary" />
                            </Link>
                            <Link to="https://www.linkedin.com/company/epyc/" target="_blank" className="text-brand-primary hover:text-primary hover:underline transition-smooth" aria-label="LinkedIn">
                                <LinkedinIcon className="w-5 h-5 hover:text-brand-primary" />
                            </Link>

                        </div>
                        <p className="text-xs text-brand-primary font-tt-norms-pro-serif">Get notified about updates and new features</p>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-border border-gray-200 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-brand-primary">© {new Date().getFullYear()} <Link to="https://www.epyc.in/" target="_blank" className="text-sm text-brand-primary hover:underline hover:text-brand-primary transition-smooth font-tt-norms-pro-serif">EPYC</Link>. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link to="https://www.epyc.in/terms-and-conditions" target="_blank" className="text-sm text-brand-primary hover:underline hover:text-brand-primary transition-smooth font-tt-norms-pro-serif">Terms of Service</Link>
                        <Link to="https://www.epyc.in/privacy-policy" target="_blank" className="text-sm text-brand-primary hover:underline hover:text-brand-primary transition-smooth font-tt-norms-pro-serif">Privacy Policy</Link>
                    </div>
                </div>

                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-auto flex justify-center ">
                    <Link to='https://www.epyc.in/' target="_blank">
                        <img src="/epyc-logo.png" alt="EPYC Logo" className="w-20 h-20 md:w-30 md:h-30 object-cover" />
                    </Link>
                </div>
            </div>
        </footer>
    );
}