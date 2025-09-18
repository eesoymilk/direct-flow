export const joinSentences = (
  sentences: string[][],
  options: {
    separator?: string;
    conjunction?: string;
  } = {}
) => {
  const { separator = "，", conjunction = "。" } = options;
  return (
    sentences.map((sentence) => sentence.join(separator)).join(conjunction) +
    conjunction
  );
};
