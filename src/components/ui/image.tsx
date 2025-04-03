
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

export function Image({ 
  className, 
  src, 
  alt = "", 
  fallback = "/images/placeholder.png",
  ...props 
}: ImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(src || "");
  const [error, setError] = useState<boolean>(false);

  const handleError = () => {
    if (!error) {
      setImageSrc(fallback);
      setError(true);
    }
  };

  return (
    <img
      className={cn("object-cover", className)}
      src={imageSrc}
      alt={alt}
      onError={handleError}
      {...props}
    />
  );
}
