
function make_tree(edges) {
  edges.push({to: 1, from: null});
  stratifier = d3.stratify(edges)
    .id(d => d.to)
    .parentId(d => d.from)
  tree_gen = d3.tree(tree)
    .size([400, 400])

  return tree_gen(stratifier(edges))
}

function make_scales(data) {
  [nodes, edges] = data
  return {
    fill: d3.scaleOrdinal()
      .domain([... new Set(nodes.map(d => d.country))])
      .range(d3.schemeCategory10)
  }
}

function draw_tree(tree, nodes_lookup) {
  let link = d3.linkVertical()
    .x(d => d.x)
    .y(d => d.y)

  d3.select("#tree")
    .selectAll("path")
    .data(tree.links()).enter()
    .append("path")
    .attrs({
      d: link,
      "stroke-width": 2,
      stroke: "#d3d3d3"
    })

  d3.select("#tree")
    .selectAll("circle")
    .data(tree.descendants()).enter()
    .append("circle")
    .attrs({
      cx: d => d.x,
      cy: d => d.y,
      fill: d => scales.fill(nodes_lookup[d.id].country),
      r: 10
    })
}

function visualize(data) {
  [nodes, edges] = data

  nodes_lookup = {}
  for (let i = 0; i < nodes.length; i++) {
    nodes_lookup[i + 1] = nodes[i]
  }

  tree = make_tree(edges)
  scales = make_scales(data)
  draw_tree(tree, nodes_lookup)
}

Promise.all([
  d3.csv("covid-nodes.csv", d3.autoType),
  d3.csv("covid-edges.csv", d3.autoType)
]).then(visualize)
