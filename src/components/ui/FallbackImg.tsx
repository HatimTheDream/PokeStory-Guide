import { useMultiSrc } from '../../hooks/useMultiSrc';

interface FallbackImgProps {
  src?: string | string[];
  alt: string;
  className?: string;
}

export function FallbackImg({ src, alt, className }: FallbackImgProps) {
  const { cur, onError } = useMultiSrc(src);
  return <img src={cur} alt={alt} onError={onError} className={className} loading="lazy" />;
}
