
let initial = d3.select("#initial")
initial.clone(true).attrs({ transform: "translate(100, 0)" })

let unif = d3.randomUniform(0, 500);
let centers = d3.range(50).map(d => { return {x: unif(), y: unif()} });

for (let i = 0; i < centers.length; i++) {
  initial.clone(true)
    .transition()
    .duration(1000)
    .attrs({
      transform: d => "translate(" + centers[i].x + "," + centers[i].y + ")"
    })
}
