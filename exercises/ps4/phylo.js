
function make_tree(edges) {
  edges.push({to: 1, from: null});
  stratifier = d3.stratify(edges)
    .id(d => d.to)
    .parentId(d => d.from)
  tree_gen = d3.tree(tree)
    .size([400, 400])

  return tree_gen(stratifier(edges))
}

function make_scales() {
  let countries = [
    "China", "UnitedStates", "Netherlands", "Australia", "UnitedKingdom",
    "Singapore", "Switzerland", "Korea", "Japan", "NA"
  ]
  let colors = [
    "#014034", "#67A60A", "#788C2E", "#D98B8B", "#322059", "#6CAFD9",
    "#3B401A", "#F27405", "#8C6C65", "#C5D9CA"
  ]

  return {
    fill: d3.scaleOrdinal()
      .domain(countries)
      .range(colors)
  }
}

function draw_tree(tree, nodes_lookup, scales) {
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
      r: 4
    })
}

function visualize(data) {
  [nodes, edges] = data

  nodes_lookup = {}
  for (let i = 0; i < nodes.length; i++) {
    nodes_lookup[i + 1] = nodes[i]
  }

  tree = make_tree(edges)
  scales = make_scales()
  draw_tree(tree, nodes_lookup, scales)

  d3.select("#country_select")
    .on("change", ev => highlight_countries(ev, nodes_lookup))
  neighborhoods = d3.Delaunay.from(tree.descendants().map(d => [d.x, d.y]))
  d3.select("svg").on("mousemove", (ev) => update_labels(ev, neighborhoods, tree, nodes_lookup))
}

function highlight_countries(ev, nodes_lookup) {
  countries_ = $(ev.target).val()
  d3.select("#tree")
    .selectAll("circle")
    .transition().duration(transition_length)
    .attrs({
      r: d => countries_.indexOf(nodes_lookup[d.id].country) == -1? 1 : 4,
      opacity: d => countries_.indexOf(nodes_lookup[d.id].country) == -1? 0.1 : 1
    })

  d3.select("#tree")
    .selectAll("path")
    .attrs({ "stroke-width": 2 })

  d3.select("#labels text").text("")
}

function focus_ids(cur_node) {
    descendants = cur_node.descendants().map(d => d.id)
    ancestors = cur_node.ancestors().map(d => d.id)
    return ancestors.concat(descendants)
}

function radius(depth) {
  return 10 * Math.exp(-.05 * depth)
}

function highlight(d, i, ix, focus) {
  if (i == ix) {
    return 1
  } else if (focus.indexOf(d.id) != -1) {
    return 0
  }
  return -1
}

function update_labels(ev, neighborhoods, tree, nodes_lookup) {
  let pos = d3.pointer(ev),
    ix = neighborhoods.find(pos[0], pos[1]),
    cur_node = tree.descendants()[ix],
    focus = focus_ids(cur_node)

  d3.select("#tree")
    .selectAll("circle")
    .transition().duration(100)
    .attrs({
      r: (d, i) => {
        let relevance = highlight(d, i, ix, focus)
        return relevance == 1 ? 8 : relevance == 0 ? 4 : 1
      },
      opacity: (d, i) => highlight(d, i, ix, focus) >= 0 ? 1 : 0.1
    })

  d3.select("#tree")
    .selectAll("path")
    .transition().duration(100)
    .attr("stroke-width", d => focus.indexOf(d.target.id) == -1 ? 1 : 4)

  d3.select("#labels")
    .selectAll("text")
    .text(nodes_lookup[cur_node.id].name)
    .attr("transform", `translate(${cur_node.x}, ${cur_node.y})`)
}

let transition_length = 400
Promise.all([
  d3.csv("covid-nodes.csv", d3.autoType),
  d3.csv("covid-edges.csv", d3.autoType)
]).then(visualize)
