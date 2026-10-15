import { useEffect, useRef } from 'react';

type IntersectionLoadMoreOptions = Readonly<{
  enabled: boolean;
  revision: number;
  onLoadMore: () => void;
}>;

export const useIntersectionLoadMore = ({
  enabled,
  revision,
  onLoadMore,
}: IntersectionLoadMoreOptions) => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!enabled || !sentinel || typeof IntersectionObserver === 'undefined') return;

    let active = true;
    let requested = false;
    const observer = new IntersectionObserver((entries) => {
      if (!active || requested || !entries.some((entry) => entry.isIntersecting)) return;
      requested = true;
      onLoadMore();
    }, { rootMargin: '0px 0px 160px 0px' });

    observer.observe(sentinel);
    return () => {
      active = false;
      observer.disconnect();
    };
    // A new revision moves the sentinel below the newly rendered items.
  }, [enabled, onLoadMore, revision]);

  return sentinelRef;
};
