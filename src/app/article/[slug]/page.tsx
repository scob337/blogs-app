import { notFound } from "next/navigation";

type Params = Promise<{ slug: string }>;

export default async function ArticlePage(props: { params: Params }) {
  const params = await props.params;
  const slug = params.slug;

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
