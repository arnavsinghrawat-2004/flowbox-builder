

# Flowchart Builder App

## Overview
A drag-and-drop flowchart builder with a sidebar of node types and an interactive canvas powered by React Flow.

## Layout
- **Left Sidebar** – Contains 4 draggable node types: User, Service, Script, and Parallel. Each shown as a card with a small distinguishing icon (e.g., User icon, Server icon, Code icon, GitBranch icon from Lucide).
- **Main Canvas** – React Flow powered canvas where nodes are dropped, positioned, and connected with edges.
- **Right Properties Panel** – Slides open when a node is clicked, showing editable fields (name, description, type) for the selected node.

## Node Types
All four node types share the same size and rounded-rectangle shape. They are differentiated by a small icon in the top-left corner:
1. **User Box** – 👤 User icon
2. **Service Box** – ⚙️ Server/Cog icon
3. **Script Box** – 📝 Code icon
4. **Parallel Box** – 🔀 GitBranch icon

Each node displays its label text and the type icon.

## Features
1. **Drag from sidebar to canvas** – Drag any of the 4 node types from the sidebar onto the canvas to create a new node.
2. **Connect nodes** – Drag from one node's handle to another to create directional edges (arrows).
3. **Select & edit** – Click a node to open a properties panel on the right with editable name and description fields.
4. **Move & rearrange** – Drag nodes freely on the canvas; edges follow automatically.
5. **Delete** – Select a node or edge and press Delete/Backspace to remove it.
6. **Canvas controls** – Zoom, pan, and minimap for navigation.

## Tech
- **React Flow** (reactflow) for the canvas, nodes, edges, and interactions.
- **Tailwind CSS** for all styling.
- **Lucide React** for node-type icons.
- **shadcn/ui Sheet** component for the properties panel.
- In-memory only – no persistence.

