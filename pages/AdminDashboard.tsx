import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Article, AuthState } from '../types';
import { ArticleService } from '../services/articleService';
import { Edit, Trash2, Plus, Eye } from 'lucide-react';

interface AdminDashboardProps {
  auth: AuthState;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ auth }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    const data = await ArticleService.getAll();
    // Sort by newest
    const sorted = [...data].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setArticles(sorted);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bu makaleyi silmek istediğinize emin misiniz?')) {
        await ArticleService.delete(id);
        await loadArticles();
    }
  };

  if (!auth.isAuthenticated || auth.user?.role !== 'ADMIN') {
    return <div className="p-10 text-center text-red-600">Yetkisiz erişim.</div>;
  }

  if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Yönetim Paneli</h1>
            <p className="text-gray-500 mt-1">Blog yazılarını yönetin.</p>
        </div>
        <Link 
            to="/admin/new" 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium shadow-sm transition-colors"
        >
            <Plus size={18} />
            Yeni Yazı
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Makale
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Yazar
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tarih
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">İşlemler</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-md object-cover" src={article.imageUrl} alt="" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{article.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{article.summary}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{article.author.displayName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(article.createdAt).toLocaleDateString('tr-TR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <Link to={`/article/${article.id}`} className="text-gray-400 hover:text-gray-600 inline-block" title="Görüntüle">
                    <Eye size={18} />
                  </Link>
                  <Link to={`/admin/edit/${article.id}`} className="text-indigo-600 hover:text-indigo-900 inline-block" title="Düzenle">
                    <Edit size={18} />
                  </Link>
                  <button onClick={() => handleDelete(article.id)} className="text-red-600 hover:text-red-900 inline-block" title="Sil">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
                <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                        Henüz hiç makale bulunmuyor.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;