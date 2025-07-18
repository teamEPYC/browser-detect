import { MonitorIcon, WrenchIcon, MessageSquareIcon } from "./icons";
import SectionHeader from "./SectionHeader";

export default function WhyBuild() {
    return (
        <section id="why-built" className="py-20 bg-white">
            <div className="container mx-auto px-4 lg:px-12">
                <SectionHeader
                    title="Why We Built This"
                    description={"Browser compatibility issues create constant headaches for developers and support teams. We built this tool to remove the guesswork."}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="group bg-gradient-card border border-border border-gray-200 rounded-xl p-6 shadow-card hover:shadow-lg transition-all duration-300 animate-fade-in text-center" style={{ animationDelay: "0s" }}>
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gray-200/80 mb-6 group-hover:scale-110 transition-transform duration-300">
                            <MonitorIcon className="w-8 h-8 text-brand-primary" />
                        </div>
                        <h3 className="text-xl font-medium text-foreground mb-3 group-hover:text-primary transition-colors font-tt-rationalist text-brand-primary">Browser Compatibility Issues</h3>
                        <p className="text-brand-primary leading-relaxed">Different browsers handle code differently, causing unexpected behavior and user experience problems.</p>
                    </div>
                    <div className="group bg-gradient-card border border-border border-gray-200 rounded-xl p-6 shadow-card hover:shadow-lg transition-all duration-300 animate-fade-in text-center" style={{ animationDelay: "0.1s" }}>
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gray-200/80 mb-6 group-hover:scale-110 transition-transform duration-300">
                            <WrenchIcon className="w-8 h-8 text-brand-primary" />
                        </div>
                        <h3 className="text-xl font-medium text-foreground mb-3 group-hover:text-primary transition-colors font-tt-rationalist text-brand-primary">Debugging Guesswork</h3>
                        <p className="text-brand-primary leading-relaxed">Without proper browser information, debugging becomes a time-consuming trial-and-error process.</p>
                    </div>
                    <div className="group bg-gradient-card border border-border border-gray-200 rounded-xl p-6 shadow-card hover:shadow-lg transition-all duration-300 animate-fade-in text-center" style={{ animationDelay: "0.2s" }}>
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gray-200/80 mb-6 group-hover:scale-110 transition-transform duration-300">
                            <MessageSquareIcon className="w-8 h-8 text-brand-primary" />
                        </div>
                        <h3 className="text-xl font-medium text-foreground mb-3 group-hover:text-primary transition-colors font-tt-rationalist text-brand-primary">Support Challenges</h3>
                        <p className="text-brand-primary leading-relaxed">Support teams struggle to help users without knowing their exact browser and system configuration.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}