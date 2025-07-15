import { StarIcon } from "./icons";

interface StarRatingProps {
    rating: number;
    maxRating?: number;
    className?: string;
    starClassName?: string;
}

export default function StarRating({ 
    rating, 
    maxRating = 5, 
    className = "",
    starClassName = "w-4 h-4"
}: StarRatingProps) {
    return (
        <div className={`flex space-x-1 ${className}`}>
            {Array.from({ length: maxRating }, (_, index) => (
                <StarIcon 
                    key={index} 
                    className={starClassName}
                />
            ))}
        </div>
    );
} 