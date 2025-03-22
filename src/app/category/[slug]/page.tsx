import { notFound } from "next/navigation";

interface Props {
  params: { slug: string };
}

const categories = ["tech", "health", "business"];

const CategoryPage = ({ params }: Props) => {
  if (!categories.includes(params.slug)) return notFound();

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">تصنيفات: {params.slug}</h1>
      <p className="mt-4">قائمة المقالات في هذا التصنيف...</p>
    </main>
  );
};

export default CategoryPage;
