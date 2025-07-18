import type { ReactNode } from "react";

interface SectionHeaderProps {
    title: string;
    description?: ReactNode;
    className?: string;
    titleClassName?: string;
    descriptionClassName?: string;
}

export default function SectionHeader({
    title,
    description,
    className = "text-center mb-8 md:mb-12 px-4",
    titleClassName = "text-3xl md:text-4xl font-medium text-foreground mb-4 font-tt-rationalist text-brand-primary",
    descriptionClassName = "text-lg text-brand-primary max-w-2xl mx-auto font-tt-norms-pro-serif"
}: SectionHeaderProps) {
    return (
        <div className={className}>
            <h2 className={titleClassName}>{title}</h2>
            {description && (
                <p className={descriptionClassName}>{description}</p>
            )}
        </div>
    );
} 