import React from 'react';

interface ArticleContentProps {
  content: string;
}

export default function ArticleContent({ content }: ArticleContentProps) {
  // Process content to style links
  const processContent = (html: string) => {
    // Add target="_blank" and rel="noopener noreferrer" to all external links
    const processedHtml = html.replace(
      /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/g,
      (match, _, href) => {
        // Skip if already processed
        if (match.includes('target=')) return match;
        return `${match} target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors"`;
      }
    );

    return { __html: processedHtml };
  };

  return (
    <div 
      className="prose prose-lg max-w-none rtl text-right prose-headings:text-right prose-p:text-right prose-ul:text-right prose-ol:text-right mb-12"
      dangerouslySetInnerHTML={processContent(content)}
    />
  );
}
