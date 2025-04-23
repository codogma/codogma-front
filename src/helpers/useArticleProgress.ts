import { useEffect, useState } from 'react';

import { useScrollContext } from '@/components/Scrollbar';

export function useArticleProgress(articleId: number) {
  const [progress, setProgress] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const { instance } = useScrollContext();

  useEffect(() => {
    const startTime = Date.now();
    setProgress(0);
    setTimeSpent(0);

    if (!instance) return;
    const viewport = instance.elements().viewport;
    if (!viewport) return;

    function handleScroll() {
      const articleElement = viewport.querySelector<HTMLElement>(
        `#article-${articleId}`,
      );
      if (!articleElement) return;

      const articleTop = articleElement.offsetTop;
      const articleHeight = articleElement.offsetHeight;
      const scrollTop = viewport.scrollTop;
      const viewHeight = viewport.clientHeight;

      const maxScrollable = articleHeight - viewHeight;
      if (maxScrollable <= 0) {
        setProgress(0);
        return;
      }

      const scrolled = scrollTop - articleTop;
      const clampedScrolled = Math.max(0, Math.min(scrolled, maxScrollable));
      const newProgress = (clampedScrolled / maxScrollable) * 100;
      setProgress(newProgress);
    }

    viewport.addEventListener('scroll', handleScroll);
    if (articleId) handleScroll();

    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => {
      viewport.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, [articleId]);

  return { progress, timeSpent };
}
