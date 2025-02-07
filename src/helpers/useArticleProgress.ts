import { useEffect, useState } from 'react';

export function useArticleProgress(articleId: number) {
  const [progress, setProgress] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    setProgress(0);
    setTimeSpent(0);

    function handleScroll() {
      const articleElement = document.getElementById(`article-${articleId}`);
      if (!articleElement) return;

      const articleTop = articleElement.offsetTop;
      const articleHeight = articleElement.offsetHeight;
      const scrollY = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;

      const maxScrollable = articleHeight - windowHeight;
      if (maxScrollable <= 0) {
        setProgress(0);
        return;
      }

      const scrolled = scrollY - articleTop;
      const clampedScrolled = Math.max(0, Math.min(scrolled, maxScrollable));
      const newProgress = (clampedScrolled / maxScrollable) * 100;
      setProgress(newProgress);
    }

    window.addEventListener('scroll', handleScroll);
    if (articleId) handleScroll();

    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, [articleId]);

  return { progress, timeSpent };
}
