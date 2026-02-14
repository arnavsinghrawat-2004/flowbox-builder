import { useCallback, useRef, useState, DragEvent } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Connection,
  ReactFlowProvider,
  ReactFlowInstance,
  Node,
  ConnectionMode,
} from "reactflow";
import "reactflow/dist/style.css";

import FlowNode, { FlowNodeData } from "@/components/flow/FlowNode";
import NodeSidebar from "@/components/flow/NodeSidebar";
import PropertiesPanel from "@/components/flow/PropertiesPanel";
import { Button } from "@/components/ui/button";
import { downloadGraphAsJSON, getGraphData } from "@/lib/graphExport";
import { Download, Copy, Check } from "lucide-react";

const nodeTypes = { flowNode: FlowNode };

let id = 0;
const getId = () => `node_${id++}`;

const labelMap: Record<string, string> = {
  user: "User",
  service: "Service",
  script: "Script",
  parallel: "Parallel",
};

const FlowCanvas = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node<FlowNodeData> | null>(null);
  const [copied, setCopied] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: "hsl(var(--muted-foreground))" } }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      if (!type || !rfInstance || !reactFlowWrapper.current) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = rfInstance.screenToFlowPosition({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const newNode: Node<FlowNodeData> = {
        id: getId(),
        type: "flowNode",
        position,
        data: { label: labelMap[type] || type, nodeType: type as FlowNodeData["nodeType"], description: "" },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [rfInstance, setNodes]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node<FlowNodeData>) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const onUpdateNode = useCallback(
    (updates: Partial<FlowNodeData>) => {
      if (!selectedNode) return;
      setNodes((nds) =>
        nds.map((n) =>
          n.id === selectedNode.id ? { ...n, data: { ...n.data, ...updates } } : n
        )
      );
      setSelectedNode((prev) => (prev ? { ...prev, data: { ...prev.data, ...updates } } : null));
    },
    [selectedNode, setNodes]
  );

  const handleExportJSON = useCallback(() => {
    const timestamp = new Date().toISOString().slice(0, 10);
    downloadGraphAsJSON(nodes, edges, `graph-${timestamp}.json`, {
      x: rfInstance?.getViewport().x || 0,
      y: rfInstance?.getViewport().y || 0,
      zoom: rfInstance?.getZoom() || 1,
    });
  }, [nodes, edges, rfInstance]);

  const handleCopyJSON = useCallback(async () => {
    const graphData = getGraphData(nodes, edges, {
      x: rfInstance?.getViewport().x || 0,
      y: rfInstance?.getViewport().y || 0,
      zoom: rfInstance?.getZoom() || 1,
    });
    const jsonString = JSON.stringify(graphData, null, 2);
    
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy JSON:", error);
    }
  }, [nodes, edges, rfInstance]);

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <h1 className="text-lg font-semibold text-foreground">Flow Builder</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyJSON}
            className="gap-2"
          >
            {copied ? (
              <>
                <Check size={16} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={16} />
                Copy JSON
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportJSON}
            className="gap-2"
          >
            <Download size={16} />
            Export JSON
          </Button>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <NodeSidebar />
        <div className="flex-1" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setRfInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            deleteKeyCode={["Backspace", "Delete"]}
            className="bg-background"
            connectionMode={ConnectionMode.Loose}
          >
            <Background gap={16} size={1} color="hsl(var(--border))" />
            <Controls className="[&>button]:bg-card [&>button]:border-border [&>button]:text-foreground" />
            <MiniMap
              nodeColor="hsl(var(--primary))"
              maskColor="hsl(var(--background) / 0.7)"
              className="!bg-card !border-border"
            />
          </ReactFlow>
        </div>
        <PropertiesPanel
          open={!!selectedNode}
          onClose={() => setSelectedNode(null)}
          data={selectedNode?.data ?? null}
          onUpdate={onUpdateNode}
        />
      </div>
    </div>
  );
};

const Index = () => (
  <ReactFlowProvider>
    <FlowCanvas />
  </ReactFlowProvider>
);

export default Index;
