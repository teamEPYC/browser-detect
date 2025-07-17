import { Link, useLocation } from "react-router";
import { MonitorIcon, MenuIcon } from "./icons";

export default function Header() {
    const location = useLocation();
    const isHomePage = location.pathname === "/";

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-gray-100/80 backdrop-blur-md border-b border-gray-200 border-border">
            <div className="container mx-auto px-4 md:px-12 h-16 flex items-center justify-center sm:justify-between">
                <Link to="/">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white">
                            <MonitorIcon className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold text-brand-primary">BrowserDetect</span>
                    </div>
                </Link>
                {/* <nav className="hidden md:flex items-center space-x-8">
                    <a href="#about" className="text-muted-foreground hover:text-foreground transition-smooth text-black">About</a>
                    <a href="#docs" className="text-muted-foreground hover:text-foreground transition-smooth text-black">Docs</a>
                </nav> */}
                {isHomePage && (
                    <div className="hidden sm:flex items-center space-x-4">
                        <Link to="/detect" className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 text-primary-foreground h-9 rounded-md px-3 bg-brand-primary hover:bg-brand-hover min-w-30 shadow-elegant hover:shadow-glow transition-all duration-300 text-white">Detect My Browser</Link>
                    </div>
                )}
                {/* <button className="md:hidden p-2 text-foreground">
                    <MenuIcon className="w-5 h-5" />
                </button> */}
            </div>
        </header>
    );
}