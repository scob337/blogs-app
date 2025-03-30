
type Params = Promise<{ id: string }>;

export default async function ArticlePage({ params }: { params: Params }) {    
const { id } = await params;

  const articles = [
    { id: "1", title: "مقالة 1", content: "تفاصيل المقالة الأولى..." },
    { id: "2", title: "مقالة 2", content: "تفاصيل المقالة الثانية..." },
  ];

  const article = articles.find((a) => a.id === id);

  if (!article) {
    return <p>مقالة غير موجودة</p>;
  }
  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">{article.title}</h1>
      <p className="mt-4">{article.content}</p>
    </main>
  );
}
