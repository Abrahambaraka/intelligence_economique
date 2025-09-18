interface ArticleContentProps {
  content: string;
}

export function ArticleContent({ content }: ArticleContentProps) {
  // Function to normalize and format special characters
  const normalizeSpecialChars = (text: string) => {
    return text
      // Replace common HTML entities
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      // Replace smart quotes with proper French quotation marks
      .replace(/[""]/g, '"')
      .replace(/['']/g, "'")
      // Handle French quotation marks
      .replace(/&laquo;/g, '«')
      .replace(/&raquo;/g, '»')
      // Handle accented characters
      .replace(/&agrave;/g, 'à')
      .replace(/&aacute;/g, 'á')
      .replace(/&eacute;/g, 'é')
      .replace(/&egrave;/g, 'è')
      .replace(/&ecirc;/g, 'ê')
      .replace(/&euml;/g, 'ë')
      .replace(/&iacute;/g, 'í')
      .replace(/&igrave;/g, 'ì')
      .replace(/&icirc;/g, 'î')
      .replace(/&iuml;/g, 'ï')
      .replace(/&oacute;/g, 'ó')
      .replace(/&ograve;/g, 'ò')
      .replace(/&ocirc;/g, 'ô')
      .replace(/&uacute;/g, 'ú')
      .replace(/&ugrave;/g, 'ù')
      .replace(/&ucirc;/g, 'û')
      .replace(/&ccedil;/g, 'ç')
      // Handle uppercase accented characters
      .replace(/&Agrave;/g, 'À')
      .replace(/&Aacute;/g, 'Á')
      .replace(/&Eacute;/g, 'É')
      .replace(/&Egrave;/g, 'È')
      .replace(/&Ecirc;/g, 'Ê')
      .replace(/&Ccedil;/g, 'Ç');
  };

  // Function to format text content with proper paragraphs
  const formatContent = (text: string) => {
    // Normalize special characters first
    const normalizedText = normalizeSpecialChars(text);
    
    // Split by double line breaks for paragraphs
    const paragraphs = normalizedText.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    
    return paragraphs.map((paragraph, index) => {
      // Join lines within paragraphs with spaces instead of line breaks
      const cleanedParagraph = paragraph.split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => line.trim())
        .join(' ');
      
      return (
        <p key={index} className="mb-6 leading-relaxed text-neutral-800 text-[15px] sm:text-base tracking-normal">
          {cleanedParagraph}
        </p>
      );
    });
  };

  // If content contains HTML-like tags, render as HTML
  if (content.includes('<p>') || content.includes('<br>') || content.includes('<div>')) {
    const normalizedHtmlContent = normalizeSpecialChars(content);
    return (
      <div 
        className="prose max-w-none prose-p:leading-relaxed prose-p:text-[15px] sm:prose-p:text-base prose-p:mb-6 prose-p:text-neutral-800 prose-p:tracking-normal"
        dangerouslySetInnerHTML={{ __html: normalizedHtmlContent }}
      />
    );
  }

  // Otherwise, format as plain text with proper paragraphs
  return (
    <div className="max-w-none font-feature-default article-content">
      {formatContent(content)}
    </div>
  );
}
