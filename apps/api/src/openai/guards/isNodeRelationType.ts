import { NodeRelationType } from '../../enums/NodeRelationType';

export const isNodeRelationType = (
  classification: string,
): classification is NodeRelationType => {
  return Object.values(NodeRelationType).some(
    (type) => type === (classification as NodeRelationType),
  );
};
