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

      const { top, height } = articleElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const visibleHeight = Math.min(windowHeight - top, height);
      const scrolledHeight = Math.max(0, visibleHeight);
      const newProgress = Math.min((scrolledHeight / height) * 100, 100);

      setProgress(newProgress);
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll();

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
