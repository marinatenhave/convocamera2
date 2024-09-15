import Together from 'together-ai';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const together = new Together();

// Defining the schema we want our data in
const voiceNoteSchema = z.object({
  title: z.string().describe('A title for the voice note'),
  summary: z
    .string()
    .describe('A short one sentence summary of the voice note.'),
  actionItems: z
    .array(z.string())
    .describe('A list of action items from the voice note'),
});
const jsonSchema = zodToJsonSchema(voiceNoteSchema, 'voiceNoteSchema');

async function main() {
  const transcript =
    "Good morning! It's 7:00 AM, and I'm just waking up. Today is going to be a busy day, so let's get started. First, I need to make a quick breakfast. I think I'll have some scrambled eggs and toast with a cup of coffee. While I'm cooking, I'll also check my emails to see if there's anything urgent.";
  const extract = await together.chat.completions.create({
    messages: [
      {
        role: 'system',
        content:
          'The following is a voice message transcript. Only answer in JSON.',
      },
      {
        role: 'user',
        content: transcript,
      },
    ],
    model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
    // @ts-ignore
    response_format: { type: 'json_object', schema: jsonSchema },
  });

  if (extract?.choices?.[0]?.message?.content) {
    const output = JSON.parse(extract?.choices?.[0]?.message?.content);
    console.log(output);
    return output;
  }
  return 'No output.';
}

main();