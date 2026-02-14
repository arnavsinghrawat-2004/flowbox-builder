import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { GitBranch } from "lucide-react";

const ParallelNode = ({ selected }: NodeProps<any>) => {
  return (
    <div className="relative inline-flex items-center justify-center">

      {/* KITE / DIAMOND */}
      <div
        className={`relative w-[56px] h-[56px] rotate-45 bg-card border-2 shadow-md flex items-center justify-center
        ${selected ? "border-primary ring-2 ring-primary/20" : "border-border"}`}
      >
        <div className="-rotate-45">
          <GitBranch size={18} className="text-violet-500" />
        </div>

        {/* TARGET */}
        <Handle id="t-top" type="target" position={Position.Top} />
        <Handle id="t-right" type="target" position={Position.Right} />
        <Handle id="t-left" type="target" position={Position.Left} />
        <Handle id="t-bottom" type="target" position={Position.Bottom} />

        {/* SOURCE */}
        <Handle id="s-top" type="source" position={Position.Top} />
        <Handle id="s-right" type="source" position={Position.Right} />
        <Handle id="s-left" type="source" position={Position.Left} />
        <Handle id="s-bottom" type="source" position={Position.Bottom} />

      </div>
    </div>
  );
};


export default memo(ParallelNode);
