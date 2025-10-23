import { Node } from '../../entities/Node';

export const RelationSummaryTemplate = {
  system: 'You are a concise semantic graph summarizer.',

  base: (sourceNode: Node, targetNode: Node) => `
   Source Node: "${sourceNode.title}"
  Summary: ${sourceNode.summary}

  Target Node: "${targetNode.title}"
  Summary: ${targetNode.summary}

  Describe their relationship in one sentence:`,
};
