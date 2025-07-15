import Header from "../components/Header";
import HeroBanner from "../components/HeroBanner";
import WhyBuild from "../components/WhyBuild";
import HowItWorks from "../components/HowItWorks";
import Footer from "../components/Footer";

export default function Home() {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main>
                <HeroBanner />
                <WhyBuild />
                <HowItWorks />
            </main>
            <Footer />
        </div>
    );
}
