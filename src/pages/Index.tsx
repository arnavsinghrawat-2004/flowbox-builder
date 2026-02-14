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

  return (
    <div className="flex h-screen w-full bg-background">
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
  );
};

const Index = () => (
  <ReactFlowProvider>
    <FlowCanvas />
  </ReactFlowProvider>
);

export default Index;
