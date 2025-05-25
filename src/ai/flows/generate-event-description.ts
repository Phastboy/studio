'use server';

/**
 * @fileOverview AI flow to generate an event description based on keywords and details.
 *
 * - generateEventDescription - A function that generates an event description.
 * - GenerateEventDescriptionInput - The input type for the generateEventDescription function.
 * - GenerateEventDescriptionOutput - The return type for the generateEventDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEventDescriptionInputSchema = z.object({
  keywords: z
    .string()
    .describe('Keywords related to the event (e.g., music, food, art).'),
  details: z
    .string()
    .describe('Specific details about the event, such as time, location, and special attractions.'),
});
export type GenerateEventDescriptionInput = z.infer<
  typeof GenerateEventDescriptionInputSchema
>;

const GenerateEventDescriptionOutputSchema = z.object({
  description: z
    .string()
    .describe('A generated event description based on the provided keywords and details.'),
});
export type GenerateEventDescriptionOutput = z.infer<
  typeof GenerateEventDescriptionOutputSchema
>;

export async function generateEventDescription(
  input: GenerateEventDescriptionInput
): Promise<GenerateEventDescriptionOutput> {
  return generateEventDescriptionFlow(input);
}

const generateEventDescriptionPrompt = ai.definePrompt({
  name: 'generateEventDescriptionPrompt',
  input: {schema: GenerateEventDescriptionInputSchema},
  output: {schema: GenerateEventDescriptionOutputSchema},
  prompt: `You are an AI assistant designed to generate engaging event descriptions.

  Based on the following keywords and details, create a compelling event description:

  Keywords: {{{keywords}}}
  Details: {{{details}}}

  Description:`,
});

const generateEventDescriptionFlow = ai.defineFlow(
  {
    name: 'generateEventDescriptionFlow',
    inputSchema: GenerateEventDescriptionInputSchema,
    outputSchema: GenerateEventDescriptionOutputSchema,
  },
  async input => {
    const {output} = await generateEventDescriptionPrompt(input);
    return output!;
  }
);
