'use client';

import Image from 'next/image';
import Link from 'next/link';

const features = [
  {
    title: 'Structured Content',
    description:
      'Easily format and structure your articles with a clean and minimalistic design.',
    icon: '📖',
  },
  {
    title: 'SEO Optimized',
    description:
      'Our platform ensures that your articles rank well on search engines, improving visibility.',
    icon: '🚀',
  },
  {
    title: 'Easy Collaboration',
    description:
      'Share and collaborate with other writers in real time for a seamless writing experience.',
    icon: '🤝',
  },
];

const AboutPage = () => {
  return (
    <section className="overflow-hidden bg-white py-20 sm:py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="lg:pr-8 lg:pt-4">
            <h2 className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">
              Enhance Your Writing
            </h2>
            <p className="mt-3 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
              A Blog Platform Tailored for Writers
            </p>
            <p className="mt-6 text-lg text-gray-700 leading-relaxed">
              Our platform provides a seamless experience for writers, ensuring clarity, accessibility, and a distraction-free writing environment.
            </p>
            <dl className="mt-10 space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="relative pl-10">
                  <dt className="font-semibold text-gray-900 flex items-center">
                    <span className="absolute left-0 top-1 text-2xl">{feature.icon}</span>
                    {feature.title}
                  </dt>
                  <dd className="text-gray-600 mt-1 leading-relaxed">{feature.description}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-10 flex gap-6">
              <Link
                href="/sign-up"
                className="rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-500"
              >
                Start Writing
              </Link>

            </div>
          </div>
          <Image
            src="https://img.freepik.com/free-vector/designer-concept-illustration_114360-29441.jpg?semt=ais_hybrid"
            alt="Writing platform illustration"
            width={1080}
            height={720}
            className="w-full max-w-lg rounded-xl shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutPage;