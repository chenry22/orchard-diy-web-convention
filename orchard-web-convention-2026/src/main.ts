import Graph from "graphology";
import ForceSupervisor from "graphology-layout-force/worker";
import EdgeCurveProgram from "@sigma/edge-curve";
import Sigma from "sigma";
import type { Attributes } from "graphology-types";

// let ROTATION_SPEED = 0.0015;
let ROTATION_SPEED = 0.0018;

const graph = new Graph();
// graph.addNode("convention", { label: 'April 11th. 11am-1pm', x: -3, y: 0, size: 20, color: '#fff59e' });
// graph.addNode("insta", { label: 'Reparative Computing...', x: -1, y: 2, size: 20, color: '#00d973' });
// graph.addNode("horse", { label: '🐎', x: 1, y: 4, size: 20, color: '#94ff94' });
// graph.addNode("orchard", { label: 'Join the ORCHARD...', x: 3, y: 2, size: 20, color: '#008aa1' });
// graph.addEdge("convention", "insta", { type: 'curved', color: 'gray' });
// graph.addEdge("insta", "horse", { type: 'curved', color: 'gray' });
// graph.addEdge("horse", "orchard", { type: 'curved', color: 'gray' });
// graph.addEdge("orchard", "convention", { type: 'curved', color: 'gray' });

graph.addNode("Jun", { label: 'Shrine of Being', x: 2, y: -1, size: 20, color: '#fff59e' });
graph.addNode("April", { label: 'Blankpagephobia', x: 0, y: -2, size: 20, color: '#ffffff' });
graph.addNode("Star", { label: 'Boing', x: -3, y: 0, size: 20, color: '#bd1a1a' });
graph.addNode("Ben", { label: 'Enter the Frutiger Midwest', x: -1, y: 1, size: 20, color: '#ffffff' });
graph.addNode("Caleb", { label: 'Horse Convention', x: 1, y: 3, size: 20, color: '#2f7dfa' });
graph.addNode("Kathryn", { label: 'bike', x: 3, y: 1, size: 20, color: 'rgb(230, 171, 63)' });
graph.addNode("Grace", { label: 'grayspindle', x: 3, y: 1, size: 20, color: 'rgb(218, 252, 184)' });
graph.addNode("Helen", { label: 'hives', x: 3, y: 1, size: 20, color: 'rgb(255, 0, 0)' });



graph.addEdge("Jun", "April", { type: 'curved' });
graph.addEdge("April", "Star", { type: 'curved' });
graph.addEdge("Star", "Ben", { type: 'curved' });
graph.addEdge("Ben", "Caleb", { type: 'curved' });
graph.addEdge("Caleb", "Kathryn", { type: 'curved' });
graph.addEdge("Kathryn", "Grace", { type: 'curved' });
graph.addEdge("Grace", "Helen", { type: 'curved' });
graph.addEdge("Helen", "Jun", { type: 'curved' });



graph.addNode('center', { x: 0, y: 0, size: 10, color: '#ffe600' });
graph.setNodeAttribute('center', "highlighted", true);

for (let node of graph.nodes()) {
  if (node !== 'center') {
    graph.addEdge("center", node, { size: 0, color: 'black' });
  }
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
function getGraphCenter(graph: Graph) {
  let xSum = 0, ySum = 0, count = 0;
  graph.forEachNode((_: any, attrs: Attributes) => {
    xSum += attrs.x;
    ySum += attrs.y;
    count++;
  });
  return { x: xSum / count, y: ySum / count };
}
let graphCenter = getGraphCenter(graph);

function rotateGraph(graph: Graph, angle: number, center: any) {
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
window.addEventListener('load', () => {
  let container: HTMLElement | null = document.getElementById("container");
  if (!container) { return; }

  const renderer = new Sigma(graph, container, { 
    minCameraRatio: 0.9, maxCameraRatio: 1.5,
    cameraPanBoundaries: { tolerance: 0, boundaries: { x: [-4, 4], y: [-3, 3] }},
    defaultDrawNodeLabel: () => { return false; },
    labelFont: 'Monospace', labelSize: 16,
    edgeProgramClasses: {
      curved: EdgeCurveProgram,
    },
  });



  // interaction
  let draggedNode: string | null = null;
  let isDragging = false;
  let redirect = true;

  renderer.on("downNode", (e) => {
    if (e.node === 'center') { return; }
    isDragging = true;
    draggedNode = e.node;
    redirect = true;

    graph.setNodeAttribute(draggedNode, "highlighted", true);
    if (!renderer.getCustomBBox()) {
        renderer.setCustomBBox(renderer.getBBox());
    }
  });

  renderer.on("moveBody", ({ event }) => {
    if (!isDragging || !draggedNode) { return };
    redirect = false; // dont redirect if moving

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

        if (redirect) {
          if (draggedNode === 'Jun') {
            window.open('convention.html', '_blank');
          } else if (draggedNode === 'April') {
            window.open('https://blankpagephobia.neocities.org/', '_blank');
          } else if (draggedNode === 'Star') {
            window.open('https://reparativecomputing.neocities.org', '_blank');
          } else if (draggedNode === 'Ben') {
            window.open('https://sackboyy.neocities.org', '_blank');
          } else if (draggedNode === 'Caleb') {
            window.open('https://horse-convention.neocities.org', '_blank');
          } else if (draggedNode === 'Kathryn') {
            window.open('https://dogmyers.neocities.org', '_blank');
          } else if (draggedNode === 'Grace') {
            window.open('https://grayspindle.neocities.org', '_blank');
          } else if (draggedNode === 'Helen') {
            window.open('https://hiveshiveshives.neocities.org', '_blank');
          }
        }
      }

      redirect = false;
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
});