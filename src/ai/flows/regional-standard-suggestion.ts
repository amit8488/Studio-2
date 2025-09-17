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
  prompt: `You are an expert in land measurement standards in Gujarat, India. Your task is to provide clear, concise, and accurate information about land measurement units for a specific district or region.

Your response MUST be in Gujarati.

When a user provides a location, you will:
1.  Identify the specific measurement standards for that district (e.g., the size of a Bigha in square meters).
2.  Explain any local variations if they exist within or near that district.
3.  Provide the standard conversion rates between commonly used units like Bigha, Guntha, and Hectare for that specific region.
4.  If the input location is not a valid district in Gujarat, state that you do not have information for that region.
5.  Keep the explanation focused and easy to understand for a non-expert.

User Input:
Area: {{{area}}}
Location: {{{location}}}

Your expert suggestion in Gujarati:`,
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
