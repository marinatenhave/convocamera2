import OpenAI from 'openai';
import {
  internalAction,
  internalMutation,
  internalQuery,
} from './_generated/server';
import { v } from 'convex/values';
import { internal } from './_generated/api';
import { z } from 'zod';
import { actionWithUser } from './utils';
import Instructor from '@instructor-ai/instructor';

const togetherApiKey = process.env.TOGETHER_API_KEY ?? 'undefined';

// Together client for LLM extraction
const togetherai = new OpenAI({
  apiKey: togetherApiKey,
  baseURL: 'https://api.together.xyz/v1',
});

// Instructor for returning structured JSON
const client = Instructor({
  client: togetherai,
  mode: 'JSON_SCHEMA',
});

const NoteSchema = z.object({
  title: z
    .string()
    .describe('Please provide a concise title for this transcript starting with "Lesson in {language in the transcript}" and ending with the topic of the lesson. For example, "Lesson in English: Ordering food at a restaurant"'),
    summary: z
    .string()
    .describe(
      'A summary of the grammar errors they made.',
    )
    .max(500),
  actionItems: z
    .array(z.string())
    .describe(
      'A list of EVERY SINGLE grammar mistake the learner made in the transcript: provide a bulleted list describing each grammar error the learner made in detail, along with original phrase AND the corrected phrase/what the learner should have said. For example, if they said ‘I is sad’ in the transcription, you should state: ‘”Estar” should be used instead of “ser” here. Original phrase: “yo soy triste”, Correct phrase: “yo estoy triste.”’ However! If there are no grammar errors, please write “You had no grammar errors :).”',
    ),
});

export const chat = internalAction({
  args: {
    id: v.id('notes'),
    transcript: v.string(),
  },
  handler: async (ctx, args) => {
    const { transcript } = args;

    try {
      const extract = await client.chat.completions.create({
        messages: [
          {
            role: 'system',
            content:
            "This text is a transcript of someone participating in a language exchange or language lesson, where they are an active learner of the language, and the person on the other side of the video call is a native speaker in that language. You are an expert, experienced grammar checker and are tasked to correct the learner's speaking so they can get better at the language. First, generate the title: please provide a concise title for the transcript starting with 'Lesson in {language the transcript is in}’ and ending with the topic of the lesson. For example, 'Lesson in English: Ordering food at a restaurant'. Second, provide a summary of the grammar errors they made. Third, provide a list of EVERY SINGLE grammar mistake the learner made in the transcript: provide a bulleted list describing each grammar error the learner made in detail, along with original phrase AND the corrected phrase/what the learner should have said. For example, if they said 'I is sad', in just one bullet, you should state: ‘The subject-verb agreement of “to be” was incorrect for the “I” form. Original phrase: “I is sad”, Correct phrase: “I am sad.”’ However! If there are no grammar errors, please write “You had no grammar errors :).” Answer in JSON in the latter format: {title: string, summary: string, actionItems: [string, string, ...]}",          },
          { role: 'user', content: transcript },
        ],
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        response_model: { schema: NoteSchema, name: 'SummarizeNotes' },
        max_tokens: 1000,
        temperature: 0.6,
        max_retries: 3,
      });
      const { title, summary, actionItems } = extract;

      await ctx.runMutation(internal.together.saveSummary, {
        id: args.id,
        summary,
        actionItems,
        title,
      });
    } catch (e) {
      console.error('Error extracting from voice message', e);
      await ctx.runMutation(internal.together.saveSummary, {
        id: args.id,
        summary: 'Summary failed to generate',
        actionItems: [],
        title: 'Title',
      });
    }
  },
});

export const getTranscript = internalQuery({
  args: {
    id: v.id('notes'),
  },
  handler: async (ctx, args) => {
    const { id } = args;
    const note = await ctx.db.get(id);
    return note?.transcription;
  },
});

export const saveSummary = internalMutation({
  args: {
    id: v.id('notes'),
    summary: v.string(),
    title: v.string(),
    actionItems: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, summary, actionItems, title } = args;
    await ctx.db.patch(id, {
      summary: summary,
      title: title,
      generatingTitle: false,
    });

    let note = await ctx.db.get(id);

    if (!note) {
      console.error(`Couldn't find note ${id}`);
      return;
    }
    for (let actionItem of actionItems) {
      await ctx.db.insert('actionItems', {
        task: actionItem,
        noteId: id,
        userId: note.userId,
      });
    }

    await ctx.db.patch(id, {
      generatingActionItems: false,
    });
  },
});

export type SearchResult = {
  id: string;
  score: number;
};

export const similarNotes = actionWithUser({
  args: {
    searchQuery: v.string(),
  },
  handler: async (ctx, args): Promise<SearchResult[]> => {
    const getEmbedding = await togetherai.embeddings.create({
      input: [args.searchQuery.replace('/n', ' ')],
      model: 'togethercomputer/m2-bert-80M-32k-retrieval',
    });
    const embedding = getEmbedding.data[0].embedding;

    // 2. Then search for similar notes
    const results = await ctx.vectorSearch('notes', 'by_embedding', {
      vector: embedding,
      limit: 16,
      filter: (q) => q.eq('userId', ctx.userId), // Only search my notes.
    });

    console.log({ results });

    return results.map((r) => ({
      id: r._id,
      score: r._score,
    }));
  },
});

export const embed = internalAction({
  args: {
    id: v.id('notes'),
    transcript: v.string(),
  },
  handler: async (ctx, args) => {
    const getEmbedding = await togetherai.embeddings.create({
      input: [args.transcript.replace('/n', ' ')],
      model: 'togethercomputer/m2-bert-80M-32k-retrieval',
    });
    const embedding = getEmbedding.data[0].embedding;

    await ctx.runMutation(internal.together.saveEmbedding, {
      id: args.id,
      embedding,
    });
  },
});

export const saveEmbedding = internalMutation({
  args: {
    id: v.id('notes'),
    embedding: v.array(v.float64()),
  },
  handler: async (ctx, args) => {
    const { id, embedding } = args;
    await ctx.db.patch(id, {
      embedding: embedding,
    });
  },
});

// import OpenAI from 'openai';
// import {
//   internalAction,
//   internalMutation,
//   internalQuery,
// } from './_generated/server';
// import { v } from 'convex/values';
// import { internal } from './_generated/api';
// import { z } from 'zod';
// import { actionWithUser } from './utils';
// import Instructor from '@instructor-ai/instructor';
// import Together from 'together-ai';
// import { zodToJsonSchema } from 'zod-to-json-schema';

// const togetherApiKey = process.env.TOGETHER_API_KEY ?? 'undefined';

// // Together client for LLM extraction
// const togetherai = new OpenAI({
//   apiKey: togetherApiKey,
//   baseURL: 'https://api.together.xyz/v1',
// });

// // // Instructor for returning structured JSON
// // const client = Instructor({
// //   client: togetherai,
// //   mode: 'JSON_SCHEMA',
// // });

// const together = new Together();

// const initial_prompt = "This text is a transcript of someone participating in a language exchange or language lesson, where they are an active learner of the language, and the person on the other side of the video call is a native speaker in that language. "; 

// const NoteSchema = z.object({
//   title: z
//     .string()
//     .describe('Please provide a concise title for this transcript starting with "Lesson in {language the learner is learning}" and ending with the topic of the lesson. For example, "Lesson in Spanish: Ordering food at a restaurant"'),
//   summary: z
//     .string()
//     .describe(
//       "You are an expert, experienced grammar checker of that language. Please thoroughly analyze the transcript, and provide a bulleted list of each grammar error the learner made along with original phrase AND the corrected phrase or what the learner should have said. For example, if they said 'I is sad', you should output the grammar error description, as well as 'Original phrase: I is sad.,' and 'Correct phrase: I am sad.'. If there are no grammar errors, please write 'You had no grammar errors :)'.",
//     )
//     .max(500),
//   actionItems: z
//     .array(z.string())
//     .describe(
//       'A list of action items from the voice note, short and to the point. Make sure all action item lists are fully resolved if they are nested',
//     ),
// });
// const jsonSchema = zodToJsonSchema(NoteSchema, 'NoteSchema');

// export const chat = internalAction({
//   args: {
//     id: v.id('notes'),
//     transcript: v.string(),
//   },
//   handler: async (ctx, args) => {
//     const { transcript } = args;

//     try {
//       console.log("before const extract")
//       const extract = await together.chat.completions.create({
//         messages: [
//           {
//             role: 'system',
//             content:
//             "This text is a transcript of someone participating in a language exchange or language lesson, where they are an active learner of the language, and the person on the other side of the video call is a native speaker in that language. You are an expert, experienced grammar checker and are tasked to correct the learner's speaking so they can get better at the language. First, generate the title: please provide a concise title for the transcript starting with 'Lesson in {language the transcript is in}’ and ending with the topic of the lesson. For example, 'Lesson in English: Ordering food at a restaurant'. Second, provide a summary of the grammar errors they made. Third, provide a list of EVERY SINGLE grammar mistake the learner made in the transcript: provide a bulleted list describing each grammar error the learner made in detail, along with original phrase AND the corrected phrase/what the learner should have said. For example, if they said ‘yo soy triste’ in the transcription, you should state: ‘”Estar” should be used instead of “ser” here. Original phrase: “yo soy triste”, Correct phrase: “yo estoy triste.”’ However! If there are no grammar errors, please write “You had no grammar errors :).” Answer in JSON in the latter format: {title: string, summary: string, actionItems: [string, string, ...]}",          },
//           { role: 'user', content: transcript },
//         ],
//         model:　'mistralai/Mixtral-8x7B-Instruct-v0.1',  
//         // @ts-ignore
//         response_format: { type: 'json_object', schema: jsonSchema },
//         // max_tokens: 1000,
//         // temperature: 0.6,
//         // max_retries: 3,
//       });
//       console.log("extract", extract)
//       console.log("extract?.choices?.[0]?.message?.content", extract?.choices?.[0]?.message?.content);

//       const output = JSON.parse(extract?.choices?.[0]?.message?.content as string);
//       console.log(output);
//       // const title = "hi";
//       // const summary = "hi";
//       // const actionItems = ["hi", "hi1"];
      
//       const { title, summary, actionItems } =  output;

//       await ctx.runMutation(internal.together.saveSummary, {
//         id: args.id,
//         summary,
//         actionItems,
//         title,
//       });
//     } catch (e) {
//       console.error('Error extracting from voice message', e);
//       await ctx.runMutation(internal.together.saveSummary, {
//         id: args.id,
//         summary: 'Summary failed to generate',
//         actionItems: [],
//         title: 'Title',
//       });
//     }
//   },
// });

// export const getTranscript = internalQuery({
//   args: {
//     id: v.id('notes'),
//   },
//   handler: async (ctx, args) => {
//     const { id } = args;
//     const note = await ctx.db.get(id);
//     return note?.transcription;
//   },
// });

// export const saveSummary = internalMutation({
//   args: {
//     id: v.id('notes'),
//     summary: v.string(),
//     title: v.string(),
//     actionItems: v.array(v.string()),
//   },
//   handler: async (ctx, args) => {
//     const { id, summary, actionItems, title } = args;
//     await ctx.db.patch(id, {
//       summary: summary,
//       title: title,
//       generatingTitle: false,
//     });

//     let note = await ctx.db.get(id);

//     if (!note) {
//       console.error(`Couldn't find note ${id}`);
//       return;
//     }
//     for (let actionItem of actionItems) {
//       await ctx.db.insert('actionItems', {
//         task: actionItem,
//         noteId: id,
//         userId: note.userId,
//       });
//     }

//     await ctx.db.patch(id, {
//       generatingActionItems: false,
//     });
//   },
// });

// export type SearchResult = {
//   id: string;
//   score: number;
// };

// export const similarNotes = actionWithUser({
//   args: {
//     searchQuery: v.string(),
//   },
//   handler: async (ctx, args): Promise<SearchResult[]> => {
//     const getEmbedding = await togetherai.embeddings.create({
//       input: [args.searchQuery.replace('/n', ' ')],
//       model: 'togethercomputer/m2-bert-80M-32k-retrieval',
//     });
//     const embedding = getEmbedding.data[0].embedding;

//     // 2. Then search for similar notes
//     const results = await ctx.vectorSearch('notes', 'by_embedding', {
//       vector: embedding,
//       limit: 16,
//       filter: (q) => q.eq('userId', ctx.userId), // Only search my notes.
//     });

//     console.log({ results });

//     return results.map((r) => ({
//       id: r._id,
//       score: r._score,
//     }));
//   },
// });

// export const embed = internalAction({
//   args: {
//     id: v.id('notes'),
//     transcript: v.string(),
//   },
//   handler: async (ctx, args) => {
//     const getEmbedding = await togetherai.embeddings.create({
//       input: [args.transcript.replace('/n', ' ')],
//       model: 'togethercomputer/m2-bert-80M-32k-retrieval',
//     });
//     const embedding = getEmbedding.data[0].embedding;

//     await ctx.runMutation(internal.together.saveEmbedding, {
//       id: args.id,
//       embedding,
//     });
//   },
// });

// export const saveEmbedding = internalMutation({
//   args: {
//     id: v.id('notes'),
//     embedding: v.array(v.float64()),
//   },
//   handler: async (ctx, args) => {
//     const { id, embedding } = args;
//     await ctx.db.patch(id, {
//       embedding: embedding,
//     });
//   },
// });