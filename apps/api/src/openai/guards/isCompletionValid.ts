import { IOpenAiCompletion } from '../../types/IOpenAiCompletion';
import { NodeType } from '../../enums/NodeType';

export const isCompletionValid = (
  completion: IOpenAiCompletion,
): completion is IOpenAiCompletion => {
  return (
    completion.importance >= 0 &&
    completion.importance <= 1 &&
    completion.sentiment >= -1 &&
    completion.sentiment <= 1 &&
    completion.summary.length > 0 &&
    completion.title.length > 0 &&
    !!NodeType[completion.type]
  );
};
