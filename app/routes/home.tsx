import Header from "../components/Header";
import HeroBanner from "../components/HeroBanner";
import WhyBuild from "../components/WhyBuild";
import HowItWorks from "../components/HowItWorks";
import Footer from "../components/Footer";
import OurBrands from "~/components/OurBrands";
import About from "~/components/About";

export function meta() {
    return [
        { title: "BrowserDetect – Know Your Browser, Instantly | EPYC" },
        {
            name: "description",
            content:
                "BrowserDetect is a tool by EPYC to detect browser details, generate a shareable link, and email the full environment profile. No setup needed.",
        },
        {
            property: "og:title",
            content: "BrowserDetect – Know Your Browser, Instantly | EPYC",
        },
        {
            property: "og:description",
            content:
                "BrowserDetect is a tool by EPYC to detect browser details, generate a shareable link, and email the full environment profile. No setup needed.",
        },
        {
            name: "twitter:card",
            content: "summary",
        },
        {
            name: "twitter:title",
            content: "BrowserDetect – Know Your Browser, Instantly | EPYC",
        },
        {
            name: "twitter:description",
            content:
                "BrowserDetect is a tool by EPYC to detect browser details, generate a shareable link, and email the full environment profile. No setup needed.",
        },
        {
            rel: "canonical",
            href: "https://browserdetect.epyc.in/",
        }
    ];
}

export default function Home() {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main>
                <HeroBanner />
                <WhyBuild />
                <HowItWorks />
                <About />
                <OurBrands />
            </main>
            <Footer />
        </div>
    );
}
