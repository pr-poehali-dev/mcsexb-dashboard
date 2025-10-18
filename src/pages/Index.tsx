import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Article {
  id: number;
  title: string;
  date: string;
  keywords: string[];
  wordCount: number;
  category: string;
}

const mockArticles: Article[] = [
  { id: 1, title: 'Введение в React Hooks', date: '2024-01-15', keywords: ['React', 'JavaScript', 'Hooks'], wordCount: 1523, category: 'Разработка' },
  { id: 2, title: 'Оптимизация производительности веб-приложений', date: '2024-01-22', keywords: ['Производительность', 'Оптимизация', 'Web'], wordCount: 2341, category: 'Оптимизация' },
  { id: 3, title: 'TypeScript: лучшие практики 2024', date: '2024-02-05', keywords: ['TypeScript', 'JavaScript', 'Практики'], wordCount: 1876, category: 'Разработка' },
  { id: 4, title: 'CSS Grid vs Flexbox: когда что использовать', date: '2024-02-12', keywords: ['CSS', 'Layout', 'Grid', 'Flexbox'], wordCount: 1654, category: 'Дизайн' },
  { id: 5, title: 'Безопасность веб-приложений в 2024', date: '2024-02-20', keywords: ['Безопасность', 'Web', 'Security'], wordCount: 2890, category: 'Безопасность' },
  { id: 6, title: 'State Management: Redux vs Zustand', date: '2024-03-03', keywords: ['Redux', 'Zustand', 'State'], wordCount: 2156, category: 'Разработка' },
  { id: 7, title: 'Микрофронтенды: архитектура будущего', date: '2024-03-15', keywords: ['Архитектура', 'Микрофронтенды', 'Frontend'], wordCount: 3124, category: 'Архитектура' },
  { id: 8, title: 'GraphQL против REST API', date: '2024-03-28', keywords: ['GraphQL', 'REST', 'API'], wordCount: 1987, category: 'Backend' },
  { id: 9, title: 'Docker для фронтенд-разработчиков', date: '2024-04-10', keywords: ['Docker', 'DevOps', 'Frontend'], wordCount: 2543, category: 'DevOps' },
  { id: 10, title: 'Accessibility в веб-разработке', date: '2024-04-25', keywords: ['Accessibility', 'A11y', 'Web'], wordCount: 2234, category: 'Доступность' },
  { id: 11, title: 'Next.js 14: новые возможности', date: '2024-05-08', keywords: ['Next.js', 'React', 'SSR'], wordCount: 1765, category: 'Разработка' },
  { id: 12, title: 'Тестирование React компонентов', date: '2024-05-20', keywords: ['Testing', 'React', 'Jest'], wordCount: 2098, category: 'Тестирование' },
  { id: 13, title: 'WebAssembly: производительность на новом уровне', date: '2024-06-05', keywords: ['WebAssembly', 'Performance', 'WASM'], wordCount: 2876, category: 'Производительность' },
  { id: 14, title: 'Анимации в вебе: CSS vs JavaScript', date: '2024-06-18', keywords: ['Анимации', 'CSS', 'JavaScript'], wordCount: 1543, category: 'Дизайн' },
  { id: 15, title: 'Serverless архитектура для веб-приложений', date: '2024-07-02', keywords: ['Serverless', 'Cloud', 'Архитектура'], wordCount: 2654, category: 'Backend' },
];

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Article>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredArticles = useMemo(() => {
    return mockArticles
      .filter(article => 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.keywords.some(kw => kw.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        if (sortField === 'date') {
          return sortOrder === 'asc' 
            ? new Date(aValue as string).getTime() - new Date(bValue as string).getTime()
            : new Date(bValue as string).getTime() - new Date(aValue as string).getTime();
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        return 0;
      });
  }, [searchTerm, sortField, sortOrder]);

  const stats = useMemo(() => {
    const totalArticles = mockArticles.length;
    const totalWords = mockArticles.reduce((sum, article) => sum + article.wordCount, 0);
    const avgWords = Math.round(totalWords / totalArticles);
    const allKeywords = mockArticles.flatMap(a => a.keywords);
    const uniqueKeywords = new Set(allKeywords).size;

    return { totalArticles, totalWords, avgWords, uniqueKeywords };
  }, []);

  const monthlyData = useMemo(() => {
    const monthCounts: Record<string, number> = {};
    mockArticles.forEach(article => {
      const month = article.date.substring(0, 7);
      monthCounts[month] = (monthCounts[month] || 0) + 1;
    });
    
    return Object.entries(monthCounts)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, []);

  const keywordFrequency = useMemo(() => {
    const freq: Record<string, number> = {};
    mockArticles.forEach(article => {
      article.keywords.forEach(kw => {
        freq[kw] = (freq[kw] || 0) + 1;
      });
    });
    
    return Object.entries(freq)
      .map(([keyword, count]) => ({ keyword, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, []);

  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {};
    mockArticles.forEach(article => {
      categories[article.category] = (categories[article.category] || 0) + 1;
    });
    
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, []);

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#14b8a6'];

  const exportToCSV = () => {
    const headers = ['ID', 'Заголовок', 'Дата', 'Категория', 'Ключевые слова', 'Количество слов'];
    const rows = filteredArticles.map(article => [
      article.id,
      `"${article.title}"`,
      article.date,
      article.category,
      `"${article.keywords.join(', ')}"`,
      article.wordCount
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `mcsexb_articles_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleSort = (field: keyof Article) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Аналитика mcsexb.ru</h1>
            <p className="text-slate-600 mt-2">Полная статистика и аналитика статей сайта</p>
          </div>
          <Button onClick={exportToCSV} className="bg-emerald-600 hover:bg-emerald-700 shadow-lg">
            <Icon name="Download" className="mr-2" size={18} />
            Экспорт CSV
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-emerald-500 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Icon name="FileText" size={18} className="text-emerald-600" />
                Всего статей
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.totalArticles}</div>
              <p className="text-xs text-slate-500 mt-1">Опубликовано на сайте</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Icon name="Type" size={18} className="text-blue-600" />
                Средняя длина
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.avgWords}</div>
              <p className="text-xs text-slate-500 mt-1">Слов в статье</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Icon name="Hash" size={18} className="text-purple-600" />
                Ключевых слов
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.uniqueKeywords}</div>
              <p className="text-xs text-slate-500 mt-1">Уникальных тегов</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Icon name="BarChart3" size={18} className="text-amber-600" />
                Общий объём
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{(stats.totalWords / 1000).toFixed(1)}k</div>
              <p className="text-xs text-slate-500 mt-1">Слов всего</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="TrendingUp" size={20} className="text-emerald-600" />
                Публикации по месяцам
              </CardTitle>
              <CardDescription>Динамика публикаций статей за период</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={(value) => {
                      const [year, month] = value.split('-');
                      return `${month}.${year.slice(2)}`;
                    }}
                  />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="PieChart" size={20} className="text-blue-600" />
                Распределение по категориям
              </CardTitle>
              <CardDescription>Статьи по тематическим категориям</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Tag" size={20} className="text-purple-600" />
              Топ-10 ключевых слов
            </CardTitle>
            <CardDescription>Самые популярные ключевые слова в статьях</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={keywordFrequency} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis dataKey="keyword" type="category" tick={{ fill: '#64748b', fontSize: 12 }} width={120} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Table" size={20} className="text-slate-700" />
                  Все статьи
                </CardTitle>
                <CardDescription>Полный список статей с возможностью поиска и сортировки</CardDescription>
              </div>
              <div className="w-72">
                <Input
                  placeholder="Поиск по названию или ключевым словам..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="w-12 font-semibold">ID</TableHead>
                    <TableHead className="font-semibold">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleSort('title')}
                        className="hover:bg-slate-100"
                      >
                        Заголовок
                        <Icon name={sortField === 'title' ? (sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} size={16} className="ml-2" />
                      </Button>
                    </TableHead>
                    <TableHead className="font-semibold">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleSort('date')}
                        className="hover:bg-slate-100"
                      >
                        Дата
                        <Icon name={sortField === 'date' ? (sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} size={16} className="ml-2" />
                      </Button>
                    </TableHead>
                    <TableHead className="font-semibold">Категория</TableHead>
                    <TableHead className="font-semibold">Ключевые слова</TableHead>
                    <TableHead className="font-semibold text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleSort('wordCount')}
                        className="hover:bg-slate-100"
                      >
                        Слов
                        <Icon name={sortField === 'wordCount' ? (sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} size={16} className="ml-2" />
                      </Button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredArticles.map((article, idx) => (
                    <TableRow key={article.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                      <TableCell className="font-mono text-slate-500">{article.id}</TableCell>
                      <TableCell className="font-medium text-slate-900">{article.title}</TableCell>
                      <TableCell className="text-slate-600 font-mono text-sm">{article.date}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {article.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {article.keywords.map((kw, i) => (
                            <Badge key={i} variant="secondary" className="text-xs bg-emerald-100 text-emerald-800">
                              {kw}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono text-slate-700">{article.wordCount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 text-sm text-slate-500">
              Показано {filteredArticles.length} из {mockArticles.length} статей
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
