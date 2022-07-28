
let width = 900,
  height = 900,
  scales = {
    fill: d3.scaleQuantize()
      .domain([0, 100])
      .range(d3.schemeBlues[9])
  }

function mouseover(d) {
  d3.select("#name")
    .select("text")
    .text(d.properties.GLIMS_ID)
}

function visualize(data) {
  let proj = d3.geoMercator()
    .fitSize([width, height], data)
  let path = d3.geoPath()
    .projection(proj);

  d3.select("#map")
    .selectAll("path")
    .data(data.features).enter()
    .append("path")
    .attrs({
      d: path,
      fill: d => { console.log(d); return scales.fill(d.properties.Thickness)}
    })
    .on("mouseover", (_, d) => mouseover(d));

  d3.select("#name")
    .append("text")
    .attr("transform", "translate(100, 100)")
    .text("hover a glacier")
}

d3.json("https://raw.githubusercontent.com/krisrs1128/stat679_code/main/examples/week7/week7-3/glaciers.geojson")
  .then(visualize)
