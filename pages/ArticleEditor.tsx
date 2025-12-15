import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthState } from '../types';
import { ArticleService } from '../services/articleService';
import { GeminiService } from '../services/geminiService';
import { Sparkles, Save, Loader2, ArrowLeft } from 'lucide-react';
import MarkdownEditor from '../components/MarkdownEditor';

interface ArticleEditorProps {
  auth: AuthState;
}

const ArticleEditor: React.FC<ArticleEditorProps> = ({ auth }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(!!id);

  // Load existing article if editing
  useEffect(() => {
    if (id) {
        ArticleService.getById(id).then(article => {
            if (article) {
                setTitle(article.title);
                setContent(article.content);
                setSummary(article.summary);
                setTags(article.tags.join(', '));
                setImageUrl(article.imageUrl);
                setCreatedAt(article.createdAt);
            } else {
                navigate('/admin/dashboard');
            }
            setLoading(false);
        });
    } else {
        // Set default image for new articles
        setImageUrl(`https://picsum.photos/800/400?random=${Date.now()}`);
    }
  }, [id, navigate]);

  // Auth Guard
  if (!auth.isAuthenticated || auth.user?.role !== 'ADMIN') {
    return <div className="p-10 text-center text-red-600">Bu sayfaya erişim yetkiniz yok.</div>;
  }

  if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;

  const handleAiGenerate = async () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    const generatedContent = await GeminiService.generateArticleDraft(aiPrompt);
    setContent(generatedContent);
    
    const suggestedTags = await GeminiService.suggestTags(generatedContent);
    setTags(suggestedTags.join(', '));
    
    if (!summary) {
        setSummary(generatedContent.substring(0, 150).replace(/[#*`]/g, '') + '...');
    }
    
    setIsGenerating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
    
    if (id) {
        // Update
        await ArticleService.update({
            id,
            title,
            content,
            summary,
            tags: tagArray,
            imageUrl,
            createdAt: createdAt, // Keep original date
            author: auth.user!
        });
    } else {
        // Create
        await ArticleService.create({
            title,
            content,
            summary,
            tags: tagArray,
            imageUrl,
            author: auth.user!
        });
    }

    setIsSaving(false);
    navigate('/admin/dashboard');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => navigate('/admin/dashboard')} className="mb-6 flex items-center text-gray-500 hover:text-gray-900 transition-colors">
        <ArrowLeft size={20} className="mr-1" />
        Yönetim Paneline Dön
      </button>

      <div className="md:flex md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{id ? 'Makaleyi Düzenle' : 'Yeni Makale Yaz'}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Editor */}
        <div className="lg:col-span-3 space-y-6">
          <form id="article-form" onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 text-lg"
                placeholder="Makale başlığı..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">İçerik</label>
              {/* Replaced textarea with MarkdownEditor */}
              <MarkdownEditor value={content} onChange={setContent} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Özet</label>
              <textarea
                required
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ana sayfada görünecek kısa açıklama"
              />
            </div>
            
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Etiketler</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Örn: React, AI"
                  />
                </div>
                
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Görsel URL</label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 text-gray-600 text-sm"
                  />
                </div>
             </div>
          </form>
        </div>

        {/* Sidebar / AI Tools */}
        <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm sticky top-24">
                <h3 className="text-lg font-semibold text-indigo-900 flex items-center gap-2 mb-4">
                    <Sparkles size={20} className="text-indigo-600"/>
                    AI Asistanı
                </h3>
                <p className="text-xs text-gray-600 mb-4">
                    Makale konusu hakkında kısa bir bilgi verin, AI sizin için taslağı oluştursun.
                </p>
                <div className="space-y-4">
                    <textarea
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        className="w-full border border-indigo-200 rounded-md p-3 text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-indigo-50"
                        placeholder="Örn: Docker Network tipleri nelerdir?"
                        rows={6}
                    />
                    <button
                        type="button"
                        onClick={handleAiGenerate}
                        disabled={!aiPrompt || isGenerating}
                        className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50 transition-colors"
                    >
                        {isGenerating ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                        {isGenerating ? 'Yazılıyor...' : 'Taslak Oluştur'}
                    </button>
                </div>
            </div>

            <div className="mt-6 sticky top-[340px]">
                <button
                    form="article-form"
                    type="submit"
                    disabled={isSaving}
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none disabled:opacity-50 transition-colors"
                >
                    {isSaving ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <Save className="h-5 w-5 mr-2" />}
                    {id ? 'Kaydet' : 'Yayınla'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleEditor;