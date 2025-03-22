  import Link from "next/link";

  const Hero9 = () => {
    return (
      <div className="relative z-10 bg-[#090E34] h-screen pt-[120px] md:pt-[150px] lg:pb-[150px] lg:pt-[180px]">
        <div className="absolute right-0 top-0 z-[-1] h-full w-1/2 bg-primary"></div>
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center -mx-4">
            <div className="w-full px-4">
              <div className="mx-auto max-w-[550px] text-center">
                <span className="block mb-3 text-lg font-medium text-white">
                  We Are Creative Writers
                </span>

                <h2 className="mb-6 text-[30px] font-bold leading-[1.208] text-white md:text-[40px]">
                  Explore Inspiring Blogs

                </h2>
                <p className="mx-auto mb-9 max-w-[460px] text-base font-medium text-white">
                  Your Daily Dose of Knowledge & Insights
                  Discover engaging stories, expert opinions, and insightful articles across various topics. Join our community of passionate writers and readers!
                </p>
                <Link
                  href="/#"
                  className="inline-flex items-center 
                  justify-center py-3 text-base font-medium text-center
                  transition bg-white rounded-md px-7 text-dark shadow-1
                  
                    hover:bg-primary hover:text-white"

                >
                  Discover More
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  };

  export default Hero9;
