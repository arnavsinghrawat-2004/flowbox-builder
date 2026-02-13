import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { User, Server, Code, GitBranch } from "lucide-react";

const iconMap = {
  user: User,
  service: Server,
  script: Code,
  parallel: GitBranch,
};

const colorMap: Record<string, string> = {
  user: "text-blue-500",
  service: "text-emerald-500",
  script: "text-amber-500",
  parallel: "text-violet-500",
};

export type FlowNodeData = {
  label: string;
  nodeType: "user" | "service" | "script" | "parallel";
  description?: string;
};

const FlowNode = ({ data, selected }: NodeProps<FlowNodeData>) => {
  const Icon = iconMap[data.nodeType];

  return (
    <div
      className={`w-[160px] h-[80px] rounded-lg border-2 bg-card shadow-md flex items-center gap-3 px-4 transition-colors ${
        selected ? "border-primary ring-2 ring-primary/20" : "border-border"
      }`}
    >
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-muted-foreground !border-2 !border-background" />
      <div className={`shrink-0 ${colorMap[data.nodeType]}`}>
        <Icon size={20} />
      </div>
      <span className="text-sm font-medium text-foreground truncate">{data.label}</span>
      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-muted-foreground !border-2 !border-background" />
    </div>
  );
};

export default memo(FlowNode);
