export const RelationTypeClassification = {
  system: 'You are a semantic relation classifier for a knowledge graph.',

  base: (
    sourceNodeSummary: string,
    targetNodeSummary: string,
  ) => `Between the following two pieces of text, classify their relationship using one of:
"caused_by", "inspired_by", "contradicts", "similar_to", "continues_from", "depends_on", "associated_with" or "reflects_on".

Source Node: ${sourceNodeSummary}
Target Node: ${targetNodeSummary}

Return ONLY the keyword.`,
};
