import { notFound } from "next/navigation";

export default function ArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const articles = [
    { id: "article-1", title: "مقالة 1", content: "تفاصيل المقالة الأولى..." },
    { id: "article-2", title: "مقالة 2", content: "تفاصيل المقالة الثانية..." },
  ];

  const article = articles.find((a) => a.id === id);

  if (!article) return notFound();

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">{article.title}</h1>
      <p className="mt-4">{article.content}</p>
    </main>
  );
}
