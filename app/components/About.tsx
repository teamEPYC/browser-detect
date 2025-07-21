import SectionHeader from "./SectionHeader";

export default function About() {
    return (
        <section id="about" className="py-20 bg-white">
            <SectionHeader
                title="About EPYC"
                description={<>
                    We Design & Build Kickass Websites & Apps.<br />
                    We’ve built 110+ Website and Apps for SaaS and Venture Capital firms
                </>}
            />
            <div className="container mx-auto px-4 md:px-10">
                <div className="text-brand-primary max-w-5xl mx-auto text-center font-tt-norms-pro-serif">
                    <p className="mb-4">At <strong>EPYC</strong>, we’re a team of designers, developers, and technologists who believe great digital experiences are born at the intersection of strategy, creativity, and execution.
                    </p>
                    <p className="mb-4">We specialize in crafting high-performance websites, apps, and platforms for forward-thinking teams. Whether it’s intuitive UI/UX design, bold creative development, or lightning-fast no-code builds, we bring ideas to life with precision and purpose.</p>
                    <p className="mb-4">With deep expertise in <strong>Shopify, WordPress, Webflow, and modern no-code stacks like Bubble and FlutterFlow</strong>, we move fast without cutting corners. Our solutions empower marketing and GTM teams at <strong>75+ organizations</strong> to ship faster, scale smarter, and stand out.</p>
                    <p>We don’t just build products—we design experiences that make people stop, think, and act.</p>
                </div>

                <div>
                    <div className="tag-wrapper flex flex-wrap items-center justify-center gap-4 mt-12">
                        <div className="flex items-center gap-2 bg-brand-primary rounded-full px-3 py-1.5 text-brand-light">
                            <img src="https://cdn.prod.website-files.com/66445dc4463de54bfd7fe2cf/66446c9234a6c3b3df64df9c_tag-bubble-icon.svg" loading="eager" width="16" alt="Bubble Bronze Agency" className="tag-icon" />
                            <div>Bubble Bronze Agency</div>
                        </div>
                        <div className="flex items-center gap-2 bg-brand-primary rounded-full px-3 py-1.5 text-brand-light">
                            <img src="https://cdn.prod.website-files.com/66445dc4463de54bfd7fe2cf/66446c928665bd831ad700bb_tag-webflow-icon.svg" loading="eager" width="16" alt="Webflow Professional Partners" className="tag-icon" />
                            <div>Webflow Professional Partners</div>
                        </div>
                        <div className="flex items-center gap-2 bg-brand-primary rounded-full px-3 py-1.5 text-brand-light">
                            <img src="https://cdn.prod.website-files.com/66445dc4463de54bfd7fe2cf/664da675b37cd6b76eae502a_tag-wix-icon.svg" loading="eager" width="16" alt="Wix Enterprise Partners" className="tag-icon" />
                            <div>Wix Enterprise Partners</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}