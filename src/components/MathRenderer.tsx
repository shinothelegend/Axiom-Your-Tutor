import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Copy, Check } from 'lucide-react';
import { copyToClipboard } from '../services/export';

interface MathRendererProps {
  content: string;
  className?: string;
  allowCopyLatex?: boolean;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ 
  content, 
  className = '',
  allowCopyLatex = true
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(content);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`relative group ${className}`}>
      {allowCopyLatex && content.includes('$') && (
        <button
          onClick={handleCopy}
          title="Copy raw LaTeX / Markdown"
          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-axiom-surface-dark dark:bg-axiom-surface-dark border border-white/10 text-xs text-axiom-muted-dark hover:text-axiom-amber rounded-none flex items-center gap-1 z-10"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-green-400" />
              <span className="font-mono text-[10px] text-green-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span className="font-mono text-[10px]">LaTeX</span>
            </>
          )}
        </button>
      )}

      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p: ({ children }) => <p className="mb-2 leading-relaxed">{children}</p>,
          code: ({ className: codeClassName, children, ...props }) => {
            const isInline = !codeClassName;
            return isInline ? (
              <code className="font-mono text-xs px-1.5 py-0.5 bg-black/20 dark:bg-white/10 border border-white/10 text-axiom-text-dark rounded-none" {...props}>
                {children}
              </code>
            ) : (
              <pre className="font-mono text-xs p-3 bg-black/20 dark:bg-white/5 text-axiom-text-dark overflow-x-auto my-2 rounded-none">
                <code {...props}>{children}</code>
              </pre>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
