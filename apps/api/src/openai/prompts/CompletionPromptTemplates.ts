export const CompletionPromptTemplates = {
  system:
    "You're a structured summarizer for a digital brain project.\n          You output concise JSON describing the content.",

  base: (content: string) =>
    `Analyze this content and return:\n          - "title": short (max 5 words)\n          - "summary": one sentence summary\n          - "sentiment": number between -1 (negative) and 1 (positive)\n          - "importance": number between 0 (low) and 1 (high)\n          \n          Content: """${content}"""`,
};
