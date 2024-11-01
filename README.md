# ConvoCamera: AI-Powered, Instant & Comprehensive Speaking Feedback

### 💡 Instantly processes your language conversations into clear grammar feedback and provides image-centered vocabulary search using AI. 

Check out our [HackMIT Presentation](https://www.canva.com/design/DAGQzq87BVU/DUTKWNb1YEBWL6JlJdPmiw/edit?utm_content=DAGQzq87BVU&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton) for more details!

<p align="center">
  Refactored from the open-source NotesGPT app from Convex. Powered by Convex, Together.ai, and Whisper.
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
- [Convex File Storage](https://docs.convex.dev/file-storage) for storing conversations
- [Convex Vector search](https://docs.convex.dev/vector-search) for vector search
- [Replicate](https://replicate.com/) for Whisper transcriptions
- [Clerk](https://clerk.dev/) for user authentication
- [Tailwind CSS](https://tailwindcss.com/) for styling
