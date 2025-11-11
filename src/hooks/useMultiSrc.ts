import { useState } from 'react';
import { PLACEHOLDER } from '../utils/placeholder';

export function useMultiSrc(src?: string | string[]) {
  const arr = (Array.isArray(src) ? src : src ? [src] : []).filter(Boolean);
  const [idx, setIdx] = useState(0);
  const cur = arr[idx];

  const onError = () => {
    if (idx < arr.length - 1) {
      setIdx(idx + 1);
    }
  };

  return { cur: cur || PLACEHOLDER, onError };
}
