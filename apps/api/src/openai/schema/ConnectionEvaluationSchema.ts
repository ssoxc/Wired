export const ConnectionEvaluationSchema = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  name: 'ConnectionEvaluation',
  description: 'Describes how two nodes are semantically and causally related.',
  type: 'object',
  properties: {
    related: { type: 'boolean' },
    relation_type: {
      type: 'string',
      enum: [
        'caused_by',
        'inspired_by',
        'contradicts',
        'similar_to',
        'continues_from',
        'depends_on',
        'associated_with',
        'reflects_on',
      ],
    },
    confidence: { type: 'number', minimum: 0, maximum: 1 },
    summary: {
      type: 'string',
      description: 'A brief explanation of the relationship.',
    },
  },
  required: ['related', 'relation_type', 'confidence', 'summary'],
};
