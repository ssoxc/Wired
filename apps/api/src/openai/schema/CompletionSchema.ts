import { NodeType } from '../../enums/NodeType';

export const CompletionSchema = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  name: 'NodeCompletion',
  description:
    'Structured AI response describing the properties of a single node in Wired.',
  type: 'object',
  properties: {
    title: { type: 'string', minLength: 1, maxLength: 60 },
    summary: { type: 'string', minLength: 5, maxLength: 300 },
    type: {
      type: 'string',
      enum: Object.values(NodeType),
    },
    sentiment: { type: 'number', minimum: -1, maximum: 1 },
    importance: { type: 'number', minimum: 0, maximum: 1 },
  },
  required: ['title', 'summary', 'sentiment', 'importance', 'type'],
  additionalProperties: false,
};
