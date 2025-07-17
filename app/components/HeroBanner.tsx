import { Link } from "react-router";
import { ChromeIcon, GlobeIcon, ArrowRightIcon, SquareIcon, CircleIcon } from "./icons";
import StarRating from "./StarRating";

export default function HeroBanner() {
    return (
        <section className="relative min-h-screen flex items-center justify-center bg-brand-primary overflow-hidden">
            <div className="absolute inset-0 bg-background/10"></div>
            <div className="absolute inset-0">
                <div className="absolute top-20 left-10 w-20 h-20 bg-brand-900/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute bottom-32 right-16 w-32 h-32 bg-brand-600/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "1s" }}></div>
                <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-brand-900/25 rounded-full blur-lg animate-pulse" style={{ animationDelay: "2s" }}></div>
            </div>
            <div className="relative z-10 container mx-auto px-4 pt-20 pb-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div className="text-center lg:text-left space-y-8 animate-fade-in">
                        <div className="flex justify-center lg:justify-start space-x-4 mb-6">
                            <div className="animate-bounce" style={{ animationDelay: "0s" }}>
                                <ChromeIcon className="w-8 h-8 text-white opacity-80" />
                            </div>
                            <div className="animate-bounce" style={{ animationDelay: "0.2s" }}>
                                <GlobeIcon className="w-8 h-8 text-white opacity-80" />
                            </div>
                            <div className="animate-bounce" style={{ animationDelay: "0.4s" }}>
                                <div className="w-8 h-8 text-white opacity-80 flex items-center justify-center">
                                    <SquareIcon className="w-6 h-6" />
                                </div>
                            </div>
                            <div className="animate-bounce" style={{ animationDelay: "0.6s" }}>
                                <div className="w-8 h-8 text-white opacity-80 flex items-center justify-center">
                                    <CircleIcon className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                            Detect Your Browser<span className="block text-white/90">Details</span>
                        </h1>
                        <p className="text-xl text-white/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            Share your browser configuration with us to help us debug your experience quickly. Get a detailed technical snapshot in seconds.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link to="/detect" className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 rounded-md px-8 bg-white text-black hover:bg-background/90 shadow-elegant hover:shadow-glow transition-all duration-300 group hover:bg-brand-hover hover:text-white">
                                Detect My Browser
                                <ArrowRightIcon className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                            </Link>
                        </div>
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4">
                            <div className="text-white/60 text-sm">Trusted by 10,000+ developers</div>
                            <StarRating rating={5} />
                        </div>
                    </div>

                    <div className="p-6 ">
                        <img src="/hero-banner.png" alt="Browser Detection Tool" className="w-full h-auto rounded-xl" />
                    </div>
                </div>
            </div>
        </section>
    );
}