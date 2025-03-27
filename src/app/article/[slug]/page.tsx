import { notFound } from "next/navigation";

export type ParamsType = { slug: string }; // ✅ إزالة Promise من النوع

export default function ArticlePage({ params }: { params: ParamsType }) {
  const { slug } = params; // ✅ لا داعي لاستخدام await
  const articles = [
    { slug: "article-1", title: "مقالة 1", content: "تفاصيل المقالة الأولى..." },
    { slug: "article-2", title: "مقالة 2", content: "تفاصيل المقالة الثانية..." },
  ];

  const article = articles.find((a) => a.slug === slug);

  if (!article) return notFound();

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">{article.title}</h1>
      <p className="mt-4">{article.content}</p>
    </main>
  );
}
