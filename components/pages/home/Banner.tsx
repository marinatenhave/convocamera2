import Link from 'next/link';

const Banner = () => {
  return (
    <div className="relative h-[350px] w-full  px-4 md:h-[605px] md:px-6 lg:px-8 xl:px-10 2xl:px-0">
      <div className="flex h-full w-full flex-col items-center justify-center">
        <a
          href="https://dub.sh/together-ai"
          target="_blank"
          rel="noreferrer"
          className="mb-5 cursor-pointer rounded-2xl border border-black px-4 py-1 text-sm text-slate-600 transition duration-300 ease-in-out hover:text-slate-700 sm:text-base"
        >
          Get so much more out of language conversations
        </a>
        <h1 className="inline-block text-center text-4xl font-bold tracking-tighter text-dark lg:text-7xl">
          ConvoCamera: AI-Powered, Instant & Comprehensive Speaking Feedback
        </h1>
        <p className="mt-8 text-center text-xl font-light tracking-tight lg:text-3xl">
          ConvoCamera instantly processes your language conversations into{' '}
          <span className="font-bold">
            clear <br className="hidden lg:inline-block" />
            grammar feedback
          </span>{' '}
          and provides <span className="font-bold">image-centered vocabulary search</span> using AI.
        </p>
        <Link
          href={'/dashboard'}
          className="primary-gradient primary-shadow mx-auto mt-16 flex max-w-xl items-center justify-center gap-5 rounded-full px-4 py-2 text-center text-sm text-light md:px-12 md:py-4 md:text-2xl"
        >
          Get Started
        </Link>
      </div>
      {/* background gradient */}
      <div className="absolute bottom-0 left-0 right-0 top-0 z-[-1] hidden h-full w-full grid-cols-3 md:grid">
        <BackgroundGradient />
        <BackgroundGradient />
        <BackgroundGradient />
      </div>
    </div>
  );
};

function BackgroundGradient() {
  return (
    <div
      className="h-full w-full rounded-full"
      style={{
        opacity: '0.4',
        background:
          'radial-gradient(54.14% 54.14% at 50% 50%, #650293 0%, rgba(103, 2, 139, 0.02) 100%)',
        filter: 'blur(177px)',
      }}
    />
  );
}

export default Banner;
