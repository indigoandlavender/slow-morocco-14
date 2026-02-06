'use client';

import { linkGlossaryTermsText } from '@/lib/glossary-linker';

interface StoryBodyProps {
  content: string;
}

export default function StoryBody({ content }: StoryBodyProps) {
  if (!content) return null;

  // Split by double newlines for paragraphs
  const paragraphs = content.split(/\n\n+/).filter(Boolean);

  return (
    <div className="prose prose-lg max-w-none">
      {paragraphs.map((paragraph, index) => {
        // Check if it's a blockquote (starts with >)
        if (paragraph.trim().startsWith('>')) {
          const quoteText = paragraph.trim().replace(/^>\s*/, '');
          return (
            <blockquote
              key={index}
              className="border-l-2 border-foreground/20 pl-6 my-8 text-xl italic text-foreground/70"
            >
              {linkGlossaryTermsText(quoteText)}
            </blockquote>
          );
        }

        // Check if it's a heading (starts with ##)
        if (paragraph.trim().startsWith('## ')) {
          const headingText = paragraph.trim().replace(/^##\s*/, '');
          return (
            <h2
              key={index}
              className="font-serif text-2xl text-foreground mt-12 mb-6"
            >
              {headingText}
            </h2>
          );
        }

        // Regular paragraph - link glossary terms
        return (
          <p
            key={index}
            className="text-foreground/70 leading-relaxed mb-6"
          >
            {linkGlossaryTermsText(paragraph)}
          </p>
        );
      })}
    </div>
  );
}
