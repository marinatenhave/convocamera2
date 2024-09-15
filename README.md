# ConvoCamera: ConvoCamera: AI-Powered, Instant & Comprehensive Speaking Feedback

<h1 className="inline-block text-center text-4xl font-bold tracking-tighter text-dark lg:text-7xl">
          ConvoCamera: View Grammar Feedback, Instant & Comprehensive Speaking Feedback
        </h1>
        <p className="mt-8 text-center text-xl font-light tracking-tight lg:text-3xl">
          ConvoCamera instantly processes your language conversations into{' '}
          <span className="font-bold">
            clear <br className="hidden lg:inline-block" />
            grammar feedback
          </span>{' '}
          and provides <span className="font-bold">image-centered vocabulary search</span> using AI.
        </p>

<p align="center">
  Generate action items from your notes in seconds. Powered by Convex, Together.ai, and Whisper.
</p>

<p align="center">
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy Your Own</strong></a> ·
  <a href="#future-tasks"><strong>Future Tasks</strong></a>
</p>
<br/>

## Tech Stack

- [Convex](https://convex.dev/) for the database and cloud functions
- Next.js [App Router](https://nextjs.org/docs/app) for the framework
- [Together Inference](https://dub.sh/together-ai) for the LLM (Mixtral)
- [Together Embeddings](https://dub.sh/together-ai) for the embeddings for search
- [Convex File Storage](https://docs.convex.dev/file-storage) for storing voice notes
- [Convex Vector search](https://docs.convex.dev/vector-search) for vector search
- [Replicate](https://replicate.com/) for Whisper transcriptions
- [Clerk](https://clerk.dev/) for user authentication
- [Tailwind CSS](https://tailwindcss.com/) for styling

## Deploy Your Own

You can deploy this template by setting up the following services and adding their environment variables:

1. Run `npm install` to install dependencies.
2. Run `npm run dev`. It will prompt you to log into [Convex](https://convex.dev) and create a project.
3. It will then ask you to supply the `CLERK_ISSUER_URL`. To do this:
   1. Make a [Clerk](https://clerk.dev) account.
   2. Copy both the `CLERK_SECRET_KEY` and `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` [API keys](https://dashboard.clerk.com/last-active?path=api-keys) into `.env.local`.
   3. Do steps 1-3 [here](https://docs.convex.dev/auth/clerk) and copy the Issuer URL.
      It should look something like `https://some-animal-123.clerk.accounts.dev`.
   4. Add `CLERK_ISSUER_URL` to your [Convex Environment Variables](https://dashboard.convex.dev/deployment/settings/environment-variables?var=CLERK_ISSUER_URL)
      (deep link also available in your terminal). Paste the Issuer URL as the value and click "Save".
4. Now your frontend and backend should be running and you should be able to log in but not record.
5. Make a [Together](https://dub.sh/together-ai) account to get your [API key](https://api.together.xyz/settings/api-keys).
6. Make a [Replicate](https://replicate.com) account to get your [API key](https://replicate.com/account/api-tokens).
7. Save your environment variables in Convex [as `REPLICATE_API_KEY` and `TOGETHER_API_KEY`](https://dashboard.convex.dev/deployment/settings/environment-variables?var=REPLICATE_API_KEY&var=TOGETHER_API_KEY).

