export const shareOnSocial = (platform: string, url: string, title: string = '') => {
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`
  };
  
  const socialUrl = shareUrls[platform as keyof typeof shareUrls];
  if (socialUrl) {
    window.open(socialUrl, '_blank', 'width=600,height=400');
  }
};

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return { success: true };
  } catch (err) {
    console.error('Failed to copy:', err);
    return { success: false, error: err };
  }
};
