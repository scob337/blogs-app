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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <section className="py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              About <span className="text-indigo-600">G-Spot Blogs</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A platform designed for writers, thinkers, and storytellers to share their voice with the world.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="lg:pr-8 order-2 lg:order-1">
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100">
                <h2 className="inline-block px-4 py-1.5 mb-6 text-sm font-medium text-indigo-600 rounded-full bg-indigo-50 border border-indigo-100">
                  Enhance Your Writing Journey
                </h2>
                <p className="text-3xl font-bold text-gray-900 mb-6">
                  A Blog Platform Tailored for Writers
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                  Our platform provides a seamless experience for writers, ensuring clarity, accessibility, and a distraction-free writing environment.
                </p>

                <div className="space-y-8">
                  {features.map((feature, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-4 bg-white/80 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <span className="text-3xl">{feature.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 flex gap-4">
                  <Link
                    href="/register"
                    className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-lg shadow-indigo-500/20"
                  >
                    Start Writing
                  </Link>
                  <Link
                    href="/auth"
                    className="px-6 py-3 border border-indigo-200 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-all duration-300"
                  >
                    Explore Articles
                  </Link>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-20 blur-2xl"></div>
                <Image
                  src="https://img.freepik.com/free-vector/designer-concept-illustration_114360-29441.jpg?semt=ais_hybrid"
                  alt="Writing platform illustration"
                  width={1080}
                  height={720}
                  className="relative rounded-xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;