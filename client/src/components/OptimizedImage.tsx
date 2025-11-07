import { ImgHTMLAttributes, useState, type MouseEvent } from 'react';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'loading'> {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}

export function OptimizedImage({ 
  src, 
  alt, 
  priority = false,
  className = "",
  ...props 
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const imgAttributes: any = {
    src,
    alt,
    loading: priority ? "eager" : "lazy",
    decoding: priority ? "sync" : "async",
    onLoad: () => setIsLoaded(true),
    onContextMenu: (e: MouseEvent) => e.preventDefault(),
    draggable: false,
    className: `transition-opacity duration-300 select-none ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`,
    ...props
  };

  // fetchpriority is a valid HTML attribute but not yet in React's types
  if (priority) {
    imgAttributes.fetchpriority = "high";
  }

  return <img {...imgAttributes} />;
}
