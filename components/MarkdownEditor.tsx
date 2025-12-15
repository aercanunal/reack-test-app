import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Code, Link as LinkIcon, List, Heading1, Quote, Eye, Edit3, Image as ImageIcon, ChevronDown } from 'lucide-react';
import ArticleViewer from './ArticleViewer';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange }) => {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages = [
    // Spring Boot / Backend
    { label: 'Java', value: 'java' },
    { label: 'Kotlin', value: 'kotlin' },
    { label: 'Spring Properties', value: 'properties' },
    { label: 'YAML / YML', value: 'yaml' },
    { label: 'XML (Maven)', value: 'xml' },
    { label: 'Groovy (Gradle)', value: 'groovy' },
    { label: 'SQL', value: 'sql' },
    { label: 'Docker', value: 'dockerfile' },
    { label: 'Bash / Shell', value: 'bash' },
    // Frontend / Web
    { label: 'JavaScript', value: 'javascript' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'React / JSX', value: 'jsx' },
    { label: 'HTML', value: 'html' },
    { label: 'CSS', value: 'css' },
    { label: 'JSON', value: 'json' },
    // Other
    { label: 'Düz Metin', value: 'text' },
  ];

  const insertFormat = (startTag: string, endTag: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    const replacement = `${startTag}${selectedText}${endTag}`;
    const newText = text.substring(0, start) + replacement + text.substring(end);

    onChange(newText);

    // Restore focus and cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + startTag.length, end + startTag.length);
    }, 0);
  };

  const handleLanguageSelect = (lang: string) => {
    insertFormat('```' + lang + '\n', '\n```');
    setShowLangMenu(false);
  };

  const handleToolbarClick = (action: string) => {
    switch (action) {
      case 'bold':
        insertFormat('**', '**');
        break;
      case 'italic':
        insertFormat('*', '*');
        break;
      case 'code':
        insertFormat('`', '`');
        break;
      case 'link':
        insertFormat('[', '](url)');
        break;
      case 'h1':
        insertFormat('# ');
        break;
      case 'h2':
        insertFormat('## ');
        break;
      case 'quote':
        insertFormat('> ');
        break;
      case 'image':
        insertFormat('![Alt Text](', ')');
        break;
      case 'list':
        insertFormat('- ');
        break;
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Header / Tabs */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
        <div className="flex space-x-2 bg-gray-200 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTab === 'write' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Edit3 size={16} className="mr-2" /> Yaz
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTab === 'preview' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Eye size={16} className="mr-2" /> Önizle
          </button>
        </div>
      </div>

      {/* Toolbar (Only visible in Write mode) */}
      {activeTab === 'write' && (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-white relative">
          <ToolbarButton onClick={() => handleToolbarClick('h1')} icon={<Heading1 size={18} />} title="Başlık 1" />
          <ToolbarButton onClick={() => handleToolbarClick('h2')} icon={<span className="font-bold text-sm">H2</span>} title="Başlık 2" />
          <div className="w-px h-6 bg-gray-300 mx-1"></div>
          <ToolbarButton onClick={() => handleToolbarClick('bold')} icon={<Bold size={18} />} title="Kalın" />
          <ToolbarButton onClick={() => handleToolbarClick('italic')} icon={<Italic size={18} />} title="İtalik" />
          <div className="w-px h-6 bg-gray-300 mx-1"></div>
          
          <ToolbarButton onClick={() => handleToolbarClick('code')} icon={<Code size={18} />} title="Satır içi Kod" />
          
          {/* Language Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setShowLangMenu(!showLangMenu)}
                className={`flex items-center gap-1 p-2 rounded hover:bg-gray-100 hover:text-blue-600 transition-colors ${showLangMenu ? 'bg-gray-100 text-blue-600' : 'text-gray-600'}`}
                title="Kod Bloğu Ekle"
            >
                <div className="flex items-center text-xs font-mono border border-current rounded px-1 h-5">{'<>'}</div>
                <ChevronDown size={12} />
            </button>
            
            {showLangMenu && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-xl border border-gray-200 py-1 z-20 max-h-64 overflow-y-auto">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-b border-gray-100 bg-gray-50">
                        Spring / Backend
                    </div>
                    {languages.filter(l => ['java', 'kotlin', 'properties', 'yaml', 'xml', 'groovy', 'sql', 'dockerfile', 'bash'].includes(l.value)).map(lang => (
                        <button
                            key={lang.value}
                            onClick={() => handleLanguageSelect(lang.value)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex justify-between group"
                        >
                            <span>{lang.label}</span>
                            <span className="text-gray-300 text-xs font-mono group-hover:text-blue-400">{lang.value}</span>
                        </button>
                    ))}
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-b border-gray-100 bg-gray-50 mt-1">
                        Frontend / Diğer
                    </div>
                    {languages.filter(l => !['java', 'kotlin', 'properties', 'yaml', 'xml', 'groovy', 'sql', 'dockerfile', 'bash'].includes(l.value)).map(lang => (
                        <button
                            key={lang.value}
                            onClick={() => handleLanguageSelect(lang.value)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex justify-between group"
                        >
                            <span>{lang.label}</span>
                            <span className="text-gray-300 text-xs font-mono group-hover:text-blue-400">{lang.value}</span>
                        </button>
                    ))}
                </div>
            )}
          </div>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>
          <ToolbarButton onClick={() => handleToolbarClick('link')} icon={<LinkIcon size={18} />} title="Link" />
          <ToolbarButton onClick={() => handleToolbarClick('image')} icon={<ImageIcon size={18} />} title="Resim" />
          <ToolbarButton onClick={() => handleToolbarClick('quote')} icon={<Quote size={18} />} title="Alıntı" />
          <ToolbarButton onClick={() => handleToolbarClick('list')} icon={<List size={18} />} title="Liste" />
        </div>
      )}

      {/* Content Area */}
      <div className="min-h-[400px]">
        {activeTab === 'write' ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-full min-h-[400px] p-4 font-mono text-sm text-gray-800 outline-none resize-y"
            placeholder="# Başlığınızı buraya yazın...&#10;&#10;İçeriğinizi Markdown formatında yazabilirsiniz."
            spellCheck={false}
          />
        ) : (
          <div className="p-6 bg-white min-h-[400px] prose prose-blue max-w-none">
             {/* Use existing viewer for consistent preview */}
            <ArticleViewer content={value} />
          </div>
        )}
      </div>
      
      {/* Footer info */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex justify-end">
        {value.length} karakter
      </div>
    </div>
  );
};

interface ToolbarButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ onClick, icon, title }) => (
  <button
    type="button"
    onClick={onClick}
    className="p-2 text-gray-600 rounded hover:bg-gray-100 hover:text-blue-600 focus:outline-none transition-colors"
    title={title}
  >
    {icon}
  </button>
);

export default MarkdownEditor;