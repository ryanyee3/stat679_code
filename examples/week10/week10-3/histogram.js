console = d3.window(svg.node()).console;

function make_scales() {
  return {
    x: d3.scaleBand()
      .domain(d3.range(100))
      .range([0, width]),
    y: d3.scaleLinear()
      .domain([0, 100])
      .range([0, height])
  }
}

function visualize(data) {
let brush = d3.brushX()
  .extent([[0, 0], [width, height]])
  .on('brush', brushed)

 svg.select("#bars")
    .selectAll("rect")
    .data(data).enter()
    .append("rect")
    .attrs({
      x: d => scales.x(d.bin_ix),
      y: d => height - scales.y(d.n),
      height: d => scales.y(d.n),
      width: scales.x.bandwidth()
    })
    
  svg.select("#background")
    .call(brush)
}

function brushed(event) {
  console.log(event)
}

let scales = make_scales();
console.log(scales)
svg.append("g")
  .attr("id", "background")
  .append("g")
  .attr("id", "bars")
visualize(data)