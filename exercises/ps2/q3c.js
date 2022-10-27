
let generator = d3.randomUniform();
let x = d3.range(10).map(generator);

d3.select("svg")
  .selectAll("circle")
  .data(x).enter()
  .append("circle")
  .attr("cx", d => 900 * d)

function update() {
  x = d3.range(10).map(generator);
  d3.selectAll("circle")
    .data(x)
    .transition()
    .duration(1000)
    .attrs({
      cx: d => 900 * d,
      r: d => 50 * generator(),
      fill: d => `hsl(${360 * generator()},${100 * generator()}%,${20 + 80 * generator()}%)`
    })
}

d3.interval(update, 1000)
