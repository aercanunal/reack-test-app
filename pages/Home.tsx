import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../types';
import { ArticleService } from '../services/articleService';
import { Calendar, Tag, User as UserIcon } from 'lucide-react';

const Home: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      const data = await ArticleService.getAll();
      // Sort by newest first
      const sorted = [...data].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setArticles(sorted);
      setLoading(false);
    };
    fetchArticles();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Blog
        </h1>
        <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
          Yazılım mimarisi, clean code ve güncel teknolojiler üzerine notlar.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
        {articles.map((article) => (
          <div key={article.id} className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white hover:shadow-2xl transition-shadow duration-300">
            <div className="flex-shrink-0">
              <img className="h-48 w-full object-cover" src={article.imageUrl} alt={article.title} />
            </div>
            <div className="flex-1 bg-white p-6 flex flex-col justify-between">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-3">
                    {article.tags.map(tag => (
                        <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {tag}
                        </span>
                    ))}
                </div>
                <Link to={`/article/${article.id}`} className="block mt-2">
                  <p className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                    {article.title}
                  </p>
                  <p className="mt-3 text-base text-gray-500 line-clamp-3">
                    {article.summary}
                  </p>
                </Link>
              </div>
              <div className="mt-6 flex items-center">
                <div className="flex-shrink-0">
                  <span className="sr-only">{article.author.displayName}</span>
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      {article.author.avatarUrl ? (
                          <img className="h-10 w-10 rounded-full" src={article.author.avatarUrl} alt="" />
                      ) : <UserIcon size={20} />}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {article.author.displayName}
                  </p>
                  <div className="flex space-x-1 text-sm text-gray-500">
                    <time dateTime={article.createdAt}>
                      {new Date(article.createdAt).toLocaleDateString('tr-TR')}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;