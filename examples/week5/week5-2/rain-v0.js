
function new_point(width, height, max_radius) {
  let generator = d3.randomUniform();
  return {
    x: width * generator(),
    y: height * generator(),
    r: 2,
    max_radius: max_radius * generator(),
    rate: 1 + 0.1 * generator()
  }
}

function update_data(rain) {
	  rain = rain.concat(new_point(900, 200, 50))
	  rain = rain.map(d => { d.r *= d.rate;	return d})
	  return rain.filter(d => d.r < d.max_radius);
	}

function update_vis() {
  rain = update_data(rain);
  let circ = d3.select("svg")
    .selectAll("circle")
    .data(rain)

  circ.enter()
    .append("circle")
    .attrs({ cx: d => d.x,  cy: d.y})
  circ.attr("r", d => d.r)
  circ.exit().remove();
}

//d3.interval(update_vis, 100);
