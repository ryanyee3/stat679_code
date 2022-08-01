
function setup_simulation(data) {
  let nodes = data["nodes"],
      links = data["links"];

  let simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links)) // attracts nodes
    .force("charge", d3.forceManyBody().strength(-20)) // repels nodes
    .force("center", d3.forceCenter(300, 300)) // center of the canvas

  return {simulation: simulation, nodes: nodes, links: links}
}

function make_scales(order) {
  return {
    fill: d3.scaleOrdinal()
      .domain(d3.range(10))
      .range(d3.schemeCategory10)
  }
}

function initialize_graph(nodes, links) {
  d3.select("#nodes")
    .selectAll("circle")
    .data(nodes).enter()
    .append("circle")

  d3.select("#links")
    .selectAll("line")
    .data(links).enter()
    .append("line")
}

function ticked() {
  d3.select("#nodes")
    .selectAll("circle")
    .attrs({
      cx: d => d.x,
      cy: d => d.y,
      fill: d => scales.fill(d.group)
    })

  d3.select("#links")
    .selectAll("line")
    .attrs({
      x1: d => d.source.x,
      y1: d => d.source.y,
      x2: d => d.target.x,
      y2: d => d.target.y
    })
}

function dragged(event) {
  event.subject.fx = event.x;
  event.subject.fy = event.y;
}

function drag_start(simulation, event) {
  if (!event.active) {
    simulation.alphaTarget(0.9).restart();
  }
}

function visualize(data) {
  let {simulation, nodes, links} = setup_simulation(data);
  initialize_graph(nodes, links);
  simulation.on("tick", ticked)

  let drag = d3.drag()
    .on("start", (e) => drag_start(simulation, e))
    .on("drag", dragged);
  d3.select("#nodes")
    .selectAll("circle")
    .call(drag)
}

function visualize(data) {
  let {simulation, nodes, links} = setup_simulation(data);
  console.log(simulation)
  initialize_graph(nodes, links);
  simulation.on("tick", ticked)

  let drag = d3.drag()
    .on("start", (e) => drag_start(simulation, e))
    .on("drag", dragged);
  d3.select("#nodes")
    .selectAll("circle")
    .call(drag)
}

let scales = make_scales()
d3.json("miserables.json")
  .then(visualize)
