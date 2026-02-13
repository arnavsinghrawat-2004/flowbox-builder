import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Server, Code, GitBranch } from "lucide-react";
import type { FlowNodeData } from "./FlowNode";

const iconMap = {
  user: User,
  service: Server,
  script: Code,
  parallel: GitBranch,
};

interface PropertiesPanelProps {
  open: boolean;
  onClose: () => void;
  data: FlowNodeData | null;
  onUpdate: (updates: Partial<FlowNodeData>) => void;
}

const PropertiesPanel = ({ open, onClose, data, onUpdate }: PropertiesPanelProps) => {
  if (!data) return null;
  const Icon = iconMap[data.nodeType];

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Icon size={18} />
            Node Properties
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 flex flex-col gap-5">
          <div>
            <Label className="text-xs text-muted-foreground">Type</Label>
            <Badge variant="secondary" className="mt-1 capitalize">{data.nodeType}</Badge>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="node-name">Name</Label>
            <Input
              id="node-name"
              value={data.label}
              onChange={(e) => onUpdate({ label: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="node-desc">Description</Label>
            <Textarea
              id="node-desc"
              value={data.description || ""}
              onChange={(e) => onUpdate({ description: e.target.value })}
              rows={4}
              placeholder="Add a description…"
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PropertiesPanel;
