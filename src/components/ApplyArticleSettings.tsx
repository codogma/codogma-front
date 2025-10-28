import React from 'react';

export async function ApplyArticleSettings() {
  const script = () => {
    const fontSize = localStorage.getItem('fontSize') || '1';
    const contentWidth = localStorage.getItem('contentWidth') || '70';
    const fontFamily = localStorage.getItem('fontFamily') || 'var(--font-sans)';

    document.documentElement.style.setProperty(
      '--article-font-size',
      `${fontSize}rem`,
    );
    document.documentElement.style.setProperty(
      '--article-max-width',
      `${contentWidth}ch`,
    );
    document.documentElement.style.setProperty(
      '--article-font-family',
      fontFamily,
    );
  };

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(${script.toString()})();`,
      }}
    />
  );
}
