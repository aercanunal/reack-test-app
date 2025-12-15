import React from 'react';

interface ArticleViewerProps {
  content: string;
}

const ArticleViewer: React.FC<ArticleViewerProps> = ({ content }) => {
  // Simple parser to separate code blocks from text
  // Splits by triple backticks
  const parts = content.split('```');

  return (
    <div className="prose prose-lg max-w-none text-gray-800">
      {parts.map((part, index) => {
        // Even indices are text, Odd indices are code
        if (index % 2 === 1) {
            // Simple logic to extract language if provided (e.g. ```javascript)
            const firstLineBreak = part.indexOf('\n');
            const language = firstLineBreak > -1 ? part.substring(0, firstLineBreak).trim() : '';
            const code = firstLineBreak > -1 ? part.substring(firstLineBreak + 1) : part;

            return (
                <div key={index} className="my-6 rounded-lg overflow-hidden bg-gray-900 shadow-lg border border-gray-700">
                    {language && (
                        <div className="bg-gray-800 px-4 py-1 text-xs text-gray-400 uppercase font-mono tracking-wider border-b border-gray-700">
                            {language}
                        </div>
                    )}
                    <pre className="p-4 overflow-x-auto text-sm text-green-400 font-mono">
                        <code>{code}</code>
                    </pre>
                </div>
            );
        } else {
            // Render text with simple paragraph parsing
            return (
                <div key={index} className="whitespace-pre-wrap leading-relaxed">
                    {part.split('\n\n').map((p, i) => (
                        <p key={i} className="mb-4">{p}</p>
                    ))}
                </div>
            );
        }
      })}
    </div>
  );
};

export default ArticleViewer;