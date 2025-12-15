import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Article, Comment, AuthState } from '../types';
import { ArticleService } from '../services/articleService';
import ArticleViewer from '../components/ArticleViewer';
import { Send } from 'lucide-react';

interface ArticleDetailProps {
  auth: AuthState;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ auth }) => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      ArticleService.getById(id).then(data => {
        setArticle(data || null);
        setLoading(false);
      });
      ArticleService.getComments(id).then(setComments);
    }
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!article || !auth.user || !newComment.trim()) return;

    const added = await ArticleService.addComment(article.id, newComment, auth.user);
    setComments([...comments, added]);
    setNewComment('');
  };

  if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;
  if (!article) return <div className="p-10 text-center text-red-500">Yazı bulunamadı.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
         <div className="flex gap-2 mb-4">
            {article.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">#{tag}</span>
            ))}
         </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
        <div className="flex items-center text-gray-500 text-sm">
            <span>{new Date(article.createdAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span className="mx-2">•</span>
            <span>{article.author.displayName}</span>
        </div>
      </div>

      {/* Hero Image */}
      <div className="rounded-xl overflow-hidden shadow-lg mb-10 h-64 md:h-96 w-full">
        <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="bg-white p-8 rounded-lg shadow-sm mb-12">
        <ArticleViewer content={article.content} />
      </div>

      {/* Comments Section */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Yorumlar ({comments.length})</h3>

        {/* Comment Form */}
        {auth.isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <div className="mb-4">
              <label htmlFor="comment" className="sr-only">Yorumunuz</label>
              <textarea
                id="comment"
                rows={3}
                className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md p-3"
                placeholder="Bu yazı hakkında ne düşünüyorsunuz?"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} className="mr-2" />
                Gönder
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Yorum yapmak için lütfen <a href="/#/login" className="font-medium underline hover:text-yellow-600">giriş yapın</a>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Comment List */}
        <div className="space-y-6">
            {comments.length === 0 && <p className="text-gray-500 italic">Henüz yorum yapılmamış. İlk yorumu sen yap!</p>}
            {comments.map((comment) => (
                <div key={comment.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center">
                            <div className="font-bold text-gray-900">{comment.author.displayName}</div>
                            <span className="mx-2 text-gray-300">•</span>
                            <div className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString('tr-TR')}</div>
                        </div>
                    </div>
                    <p className="mt-2 text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;