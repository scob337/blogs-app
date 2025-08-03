import Head from 'next/head';

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

export default function SEO({
  title,
  description = 'Share your ideas and articles with the world',
  keywords = 'blogs, articles, writing, content, blog',
  image = '/logo.png',
  url = 'https://blogs-app.com',
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'Blogs App',
}: SEOProps) {
  const siteName = 'G-Spot Blog';
  const fullTitle = `${title} | ${siteName}`;
  const fullUrl = url.startsWith('http') ? url : `https://blogs-app.com${url}`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Article specific meta tags */}
      {type === 'article' && (
        <>
          <meta property="article:published_time" content={publishedTime} />
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          <meta property="article:author" content={author} />
        </>
      )}
      
      <link rel="canonical" href={fullUrl} />
    </Head>
  );
}
