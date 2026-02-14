import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { LucideIcon } from "lucide-react";

export type BaseNodeData = {
  label: string;
  description?: string;
};

interface BaseNodeProps extends NodeProps<BaseNodeData> {
  Icon: LucideIcon;
  color: string;
}

const BaseNode = ({ data, selected, Icon, color }: BaseNodeProps) => {
  return (
    <div
      className={`w-[160px] h-[80px] rounded-lg border-2 bg-card shadow-md flex items-center gap-3 px-4 transition-colors ${
        selected ? "border-primary ring-2 ring-primary/20" : "border-border"
      }`}
    >
      <Handle id="t-top" type="target" position={Position.Top} className="!w-3 !h-3 !bg-muted-foreground !border-2 !border-background" />
      <Handle id="t-right" type="target" position={Position.Right} className="!w-3 !h-3 !bg-muted-foreground !border-2 !border-background" />
      <Handle id="t-left" type="target" position={Position.Left} className="!w-3 !h-3 !bg-muted-foreground !border-2 !border-background" />
      <Handle id="t-bottom" type="target" position={Position.Bottom} className="!w-3 !h-3 !bg-muted-foreground !border-2 !border-background" />

      <Handle id="s-top" type="source" position={Position.Top} className="!w-3 !h-3 !bg-muted-foreground !border-2 !border-background" />
      <Handle id="s-right" type="source" position={Position.Right} className="!w-3 !h-3 !bg-muted-foreground !border-2 !border-background" />
      <Handle id="s-left" type="source" position={Position.Left} className="!w-3 !h-3 !bg-muted-foreground !border-2 !border-background" />
      <Handle id="s-bottom" type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-muted-foreground !border-2 !border-background" />

      <div className={`shrink-0 ${color}`}>
        <Icon size={20} />
      </div>
      <span className="text-sm font-medium text-foreground truncate">{data.label}</span>
    </div>
  );
};

export default memo(BaseNode);
