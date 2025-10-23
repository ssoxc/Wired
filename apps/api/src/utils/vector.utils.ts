export function cosineSimilarity(a: number[], b: number[]): number {
  if (!a?.length || !b?.length) return 0;
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return dot / (normA * normB);
}

export const averageVectors = (vectors: number[][]): number[] => {
  const validVectors = vectors.filter((v) => Array.isArray(v) && v.length > 0);

  if (validVectors.length === 0) return [];

  const length = validVectors[0].length;
  const sum = new Array(length).fill(0);

  for (const vec of validVectors) {
    if (vec.length !== length) {
      //inconsistent vector lengths, skipping one vector'
      continue;
    }
    for (let i = 0; i < length; i++) {
      sum[i] += vec[i];
    }
  }

  return sum.map((value) => value / validVectors.length);
};
