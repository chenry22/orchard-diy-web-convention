import Graph from "graphology";
import ForceSupervisor from "graphology-layout-force/worker";
import EdgeCurveProgram from "@sigma/edge-curve";
import Sigma from "sigma";

let ROTATION_SPEED = 0.0015;

const graph = new Graph();
graph.addNode("p1", { label: 'hi', x: -3, y: 0, size: 20, color: 'blue' });
graph.addNode("p2", { x: -1, y: 2, size: 20, color: 'red' });
graph.addNode("p3", { x: 1, y: 4, size: 20, color: 'green' });
graph.addNode("p4", { x: 3, y: 2, size: 20, color: 'yellow' });
graph.addNode("p5", { x: 1, y: -4, size: 20, color: 'orange' });
graph.addNode('center', { x: 0, y: 0, size: 10, color: 'yellow' });
graph.setNodeAttribute('center', "highlighted", true);

graph.addEdge("p1", "p2", { type: 'curved' });
graph.addEdge("p2", "p3", { type: 'curved' });
graph.addEdge("p3", "p4", { type: 'curved' });
graph.addEdge("p4", "p5", { type: 'curved' });
graph.addEdge("p5", "p1", { type: 'curved' });

for (let node of graph.nodes()) {
  if (node !== 'center') {
    graph.addEdge("center", node, { size: 0, color: 'black' });
  }
}
const img = new Image();
img.src = "/assets/tree.png";
img.onload = () => {
  graph.setNodeAttribute('center', "renderer", (context, data, _) => {
    context.drawImage(img, data.x - 15, data.y - 15, 30, 30);
  });
  renderer.refresh();
}



// physics
const layout = new ForceSupervisor(graph, { 
  isNodeFixed: (_, attr) => attr.highlighted,
  settings: {
    gravity: 0.05,
  }
});
layout.start();



// for rotation
function getGraphCenter(graph) {
  let xSum = 0, ySum = 0, count = 0;
  graph.forEachNode((_, attrs) => {
    xSum += attrs.x;
    ySum += attrs.y;
    count++;
  });
  return { x: xSum / count, y: ySum / count };
}
let graphCenter = getGraphCenter(graph);

function rotateGraph(graph, angle, center) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  graph.forEachNode((node, attrs) => {
    if (node !== 'center') {
      const dx = attrs.x - center.x;
      const dy = attrs.y - center.y;

      graph.setNodeAttribute(
        node, "x", center.x + dx * cos - dy * sin
      );

      graph.setNodeAttribute(
        node, "y", center.y + dx * sin + dy * cos
      );
    }
  });
}


// main graph renderer
const renderer = new Sigma(graph, document.getElementById("container"), { 
  minCameraRatio: 0.9, maxCameraRatio: 1.5,
  cameraPanBoundaries: { tolerance: 0, boundaries: { x: [-4, 4], y: [-3, 3] }},
  defaultDrawNodeLabel: () => { return false; },
  labelFont: 'cursive', labelSize: 24,
  edgeProgramClasses: {
    curved: EdgeCurveProgram,
  },
});



// interaction
let draggedNode = null;
let isDragging = false;

renderer.on("downNode", (e) => {
  if (e.node === 'center') { return; }
  isDragging = true;
  draggedNode = e.node;
  graph.setNodeAttribute(draggedNode, "highlighted", true);
  if (!renderer.getCustomBBox()) {
      renderer.setCustomBBox(renderer.getBBox());
  }
});

renderer.on("moveBody", ({ event }) => {
  if (!isDragging || !draggedNode) { return };

  const pos = renderer.viewportToGraph(event);
  graph.setNodeAttribute(draggedNode, "x", pos.x);
  graph.setNodeAttribute(draggedNode, "y", pos.y);

  // Prevent sigma to move camera:
  event.preventSigmaDefault();
  event.original.preventDefault();
  event.original.stopPropagation();
});

const handleUp = () => {
    if (draggedNode) {
        graph.removeNodeAttribute(draggedNode, "highlighted");
    }
    isDragging = false;
    draggedNode = null;
};
renderer.on("upNode", handleUp);
renderer.on("upStage", handleUp);


// rotate...
function animate() {
  rotateGraph(graph, ROTATION_SPEED, graphCenter);
  renderer.refresh();
  requestAnimationFrame(animate);
}
animate();