import { notFound } from "next/navigation";

type Params = Promise<{ slug: string }>;


const categories = ["tech", "health", "business"];

export default async function CategoryPage({ params }: { params: Params }) { 
  const { slug } = await params;

  if (!categories.includes(slug)) return notFound();

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">تصنيفات: {slug}</h1>
      <p className="mt-4">قائمة المقالات في هذا التصنيف...</p>
    </main>
  );
};
