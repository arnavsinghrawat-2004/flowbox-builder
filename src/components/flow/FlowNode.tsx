import { memo } from "react";
import { NodeProps } from "reactflow";
import UserNode from "./nodes/UserNode";
import ServiceNode from "./nodes/ServiceNode";
import ScriptNode from "./nodes/ScriptNode";
import ParallelNode from "./nodes/ParallelNode";

export type FlowNodeData = {
  label: string;
  nodeType: "user" | "service" | "script" | "parallel";
  description?: string;
};

const nodeComponentMap = {
  user: UserNode,
  service: ServiceNode,
  script: ScriptNode,
  parallel: ParallelNode,
};

const FlowNode = (props: NodeProps<FlowNodeData>) => {
  const NodeComponent = nodeComponentMap[props.data.nodeType];
  return <NodeComponent {...props} />;
};

export default memo(FlowNode);
