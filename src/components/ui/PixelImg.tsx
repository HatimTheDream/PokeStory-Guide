import { useMultiSrc } from '../../hooks/useMultiSrc';
import { cn } from '../../utils/cn';

interface PixelImgProps {
  src?: string | string[];
  alt: string;
  className?: string;
}

export function PixelImg({ src, alt, className }: PixelImgProps) {
  const { cur, onError } = useMultiSrc(src);
  return (
    <img
      src={cur}
      alt={alt}
      onError={onError}
      className={cn('image-render-pixel', className)}
      style={{ imageRendering: 'pixelated' }}
      loading="lazy"
    />
  );
}
