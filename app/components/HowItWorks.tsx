export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-20 bg-gray-100">
            <div className="container mx-auto px-4 md:px-12">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
                    <p className="text-lg text-black/60 max-w-2xl mx-auto">Get comprehensive browser details in just a few simple steps.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
                    <div className="group bg-white border border-border border-gray-200 rounded-xl p-6 shadow-card hover:shadow-lg transition-all duration-300 animate-fade-in text-center" style={{ animationDelay: "0s" }}>
                        <div className="mb-4 overflow-hidden rounded-lg">
                            <img src="/how-it-works-1.jpg" alt="Click the Button" className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-primary text-white mb-4 text-lg font-bold">1</div>
                        <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">Click the Button</h3>
                        <p className="text-black/60 leading-relaxed">Simply click 'Detect My Browser' to start the detection process.</p>
                    </div>
                    
                    <div className="group bg-white border border-border border-gray-200 rounded-xl p-6 shadow-card hover:shadow-lg transition-all duration-300 animate-fade-in text-center" style={{ animationDelay: "0.1s" }}>
                        <div className="mb-4 overflow-hidden rounded-lg">
                            <img src="/how-it-works-2.jpg" alt="We Collect Details" className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-primary text-white mb-4 text-lg font-bold">2</div>
                        <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">We Collect Details</h3>
                        <p className="text-black/60 leading-relaxed">Our system safely captures your browser, OS, and device information.</p>
                    </div>
                    <div className="group bg-white border border-border border-gray-200 rounded-xl p-6 shadow-card hover:shadow-lg transition-all duration-300 animate-fade-in text-center" style={{ animationDelay: "0.2s" }}>
                        <div className="mb-4 overflow-hidden rounded-lg">
                            <img src="/how-it-works-3.jpg" alt="Get Shareable Link" className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-primary text-white mb-4 text-lg font-bold">3</div>
                        <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">Get Shareable Link</h3>
                        <p className="text-black/60 leading-relaxed">Receive a unique URL containing all your technical details.</p>
                    </div>
                    
                    <div className="group bg-white border border-border border-gray-200 rounded-xl p-6 shadow-card hover:shadow-lg transition-all duration-300 animate-fade-in text-center" style={{ animationDelay: "0.3s" }}>
                        <div className="mb-4 overflow-hidden rounded-lg">
                            <img src="/how-it-works-4.png" alt="Faster Debugging" className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-primary text-white mb-4 text-lg font-bold">4</div>
                        <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">Faster Debugging</h3>
                        <p className="text-black/60 leading-relaxed">Share the link with our team for instant, accurate technical support.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}