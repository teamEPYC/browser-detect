import { MonitorIcon, WrenchIcon, MessageSquareIcon } from "./icons";

export default function WhyBuild() {
    return (
        <section id="why-built" className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-12">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why We Built This</h2>
                    <p className="text-lg text-black/60 max-w-2xl mx-auto">Browser compatibility issues create constant headaches for developers and support teams. We built this tool to remove the guesswork.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="group bg-gradient-card border border-border border-gray-200 rounded-xl p-6 shadow-card hover:shadow-lg transition-all duration-300 animate-fade-in text-center" style={{ animationDelay: "0s" }}>
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gray-200/80 mb-6 group-hover:scale-110 transition-transform duration-300">
                            <MonitorIcon className="w-8 h-8 text-brand-primary" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">Browser Compatibility Issues</h3>
                        <p className="text-black/60 leading-relaxed">Different browsers handle code differently, causing unexpected behavior and user experience problems.</p>
                    </div>
                    <div className="group bg-gradient-card border border-border border-gray-200 rounded-xl p-6 shadow-card hover:shadow-lg transition-all duration-300 animate-fade-in text-center" style={{ animationDelay: "0.1s" }}>
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gray-200/80 mb-6 group-hover:scale-110 transition-transform duration-300">
                            <WrenchIcon className="w-8 h-8 text-brand-primary" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">Debugging Guesswork</h3>
                        <p className="text-black/60 leading-relaxed">Without proper browser information, debugging becomes a time-consuming trial-and-error process.</p>
                    </div>
                    <div className="group bg-gradient-card border border-border border-gray-200 rounded-xl p-6 shadow-card hover:shadow-lg transition-all duration-300 animate-fade-in text-center" style={{ animationDelay: "0.2s" }}>
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gray-200/80 mb-6 group-hover:scale-110 transition-transform duration-300">
                            <MessageSquareIcon className="w-8 h-8 text-brand-primary" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">Support Challenges</h3>
                        <p className="text-black/60 leading-relaxed">Support teams struggle to help users without knowing their exact browser and system configuration.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}