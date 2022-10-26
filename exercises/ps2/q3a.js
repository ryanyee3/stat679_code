
let generator = d3.randomUniform();
let x = d3.range(10).map(generator);

d3.select("svg")
  .selectAll("circle")
  .data(x).enter()
  .append("circle")
  .attr("cx", d => 900 * d)
