import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export type ParamsType = { slug: string }; 

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
 ): Promise<NextResponse> {
  const { slug } = await params; 
  const articles = [
    { slug: "article-1", title: "مقالة 1", content: "تفاصيل المقالة الأولى..." },
    { slug: "article-2", title: "مقالة 2", content: "تفاصيل المقالة الثانية..." },
  ];

  const article = articles.find((a) => a.slug === slug);

  if (!article) return notFound();

  return NextResponse.json({
    title: article.title,
    content: article.content,
  });
}
