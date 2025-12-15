import { Article, Comment, User } from '../types';
import { UserRole } from '../types';

// Mock Data
const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'React 19 ve Server Components',
    summary: 'React ekosistemindeki son gelişmeler ve RSC mimarisinin detayları.',
    content: `React Server Components (RSC), frontend dünyasında bir devrim yaratıyor.
    
Server-side rendering ve client-side interactivity arasındaki boşluğu dolduruyor.

\`\`\`javascript
// Örnek bir Server Component
async function BlogList() {
  const posts = await db.posts.find();
  return (
    <ul>
      {posts.map(post => <li key={post.id}>{post.title}</li>)}
    </ul>
  );
}
\`\`\`

Bu mimari sayesinde bundle size küçülüyor ve performans artıyor.`,
    imageUrl: 'https://picsum.photos/800/400?random=1',
    createdAt: new Date().toISOString(),
    author: {
        id: '1',
        username: 'admin',
        displayName: 'Ahmet Ercan Unal',
        role: UserRole.ADMIN
    },
    tags: ['React', 'Frontend', 'Architecture']
  },
  {
    id: '2',
    title: 'Clean Architecture ile Node.js',
    summary: 'Sürdürülebilir backend sistemleri tasarlamak için Clean Architecture prensipleri.',
    content: `Yazılım geliştirmede bağımlılıkların yönetimi çok kritiktir. 
    
Clean Architecture, iş kurallarını (Use Cases) framework detaylarından ayırır.

\`\`\`typescript
interface UserRepository {
  save(user: User): Promise<void>;
}

class CreateUserUseCase {
  constructor(private userRepo: UserRepository) {}
  
  async execute(dto: CreateUserDto) {
    // Business logic here
  }
}
\`\`\`

Bu sayede veritabanını değiştirmek veya mocklamak çok kolaylaşır.`,
    imageUrl: 'https://picsum.photos/800/400?random=2',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    author: {
        id: '1',
        username: 'admin',
        displayName: 'Ahmet Ercan Unal',
        role: UserRole.ADMIN
    },
    tags: ['Node.js', 'Clean Code', 'Backend']
  }
];

const MOCK_COMMENTS: Record<string, Comment[]> = {};

export const ArticleService = {
  getAll: async (): Promise<Article[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Read from local storage to allow runtime additions
    const stored = localStorage.getItem('articles');
    if (stored) return JSON.parse(stored);
    
    // Initialize mock data if empty
    localStorage.setItem('articles', JSON.stringify(MOCK_ARTICLES));
    return MOCK_ARTICLES;
  },

  getById: async (id: string): Promise<Article | undefined> => {
    const articles = await ArticleService.getAll();
    return articles.find(a => a.id === id);
  },

  create: async (article: Omit<Article, 'id' | 'createdAt'>): Promise<Article> => {
    const newArticle: Article = {
      ...article,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    const articles = await ArticleService.getAll();
    const updated = [newArticle, ...articles];
    localStorage.setItem('articles', JSON.stringify(updated));
    return newArticle;
  },

  update: async (article: Article): Promise<Article> => {
    const articles = await ArticleService.getAll();
    const index = articles.findIndex(a => a.id === article.id);
    
    if (index !== -1) {
        articles[index] = article;
        localStorage.setItem('articles', JSON.stringify(articles));
    }
    return article;
  },

  delete: async (id: string): Promise<void> => {
    const articles = await ArticleService.getAll();
    const filtered = articles.filter(a => a.id !== id);
    localStorage.setItem('articles', JSON.stringify(filtered));
  },

  getComments: async (articleId: string): Promise<Comment[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const stored = localStorage.getItem(`comments_${articleId}`);
    if (stored) return JSON.parse(stored);
    return [];
  },

  addComment: async (articleId: string, content: string, author: User): Promise<Comment> => {
    const newComment: Comment = {
      id: Date.now().toString(),
      articleId,
      author,
      content,
      createdAt: new Date().toISOString(),
    };

    const currentComments = await ArticleService.getComments(articleId);
    const updated = [...currentComments, newComment];
    localStorage.setItem(`comments_${articleId}`, JSON.stringify(updated));
    return newComment;
  }
};