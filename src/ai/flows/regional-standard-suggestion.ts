'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting regional land measurement standards based on user input.
 *
 * @remarks
 * - `suggestRegionalStandard`: An async function that takes user input and returns a suggestion for regional land measurement standards.
 * - `RegionalStandardSuggestionInput`: The input type for the `suggestRegionalStandard` function.
 * - `RegionalStandardSuggestionOutput`: The output type for the `suggestRegionalstandard` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RegionalStandardSuggestionInputSchema = z.object({
  area: z.string().describe('The area input by the user.'),
  location: z.string().optional().describe('The location of the area, if known.'),
});
export type RegionalStandardSuggestionInput = z.infer<typeof RegionalStandardSuggestionInputSchema>;

const RegionalStandardSuggestionOutputSchema = z.object({
  suggestion: z.string().describe('A suggestion for regional land measurement standards based on the input area or location.'),
});
export type RegionalStandardSuggestionOutput = z.infer<typeof RegionalStandardSuggestionOutputSchema>;

export async function suggestRegionalStandard(input: RegionalStandardSuggestionInput): Promise<RegionalStandardSuggestionOutput> {
  return suggestRegionalStandardFlow(input);
}

const prompt = ai.definePrompt({
  name: 'regionalStandardSuggestionPrompt',
  input: {schema: RegionalStandardSuggestionInputSchema},
  output: {schema: RegionalStandardSuggestionOutputSchema},
  prompt: `You are an expert in land measurement standards, familiar with regional variations in Gujarat, India.

  Based on the user's input, suggest relevant regional land measurement standards.
  Consider both the area and location (if provided) to provide the most accurate suggestion.
  Your entire response MUST be in Gujarati.

  Area: {{{area}}}
  Location: {{{location}}}

  Suggestion:`, // The suggestion should automatically provide an explanation.
});

const suggestRegionalStandardFlow = ai.defineFlow(
  {
    name: 'suggestRegionalStandardFlow',
    inputSchema: RegionalStandardSuggestionInputSchema,
    outputSchema: RegionalStandardSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
