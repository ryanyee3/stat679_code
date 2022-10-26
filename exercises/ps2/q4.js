
let bar_ages = [],
generator = d3.randomUniform(0, 500),
id = 0;

function update() {
  bar_ages = bar_ages.map(d => { return {id: d.id, age: d.age + 1, height: d.height }})
  bar_ages.push({age: 0, height: generator(), id: id});
  bar_ages = bar_ages.filter(d => d.age < 5)
  id += 1;

  let selection = d3.select("svg")
    .selectAll("rect")
    .data(bar_ages, d => d.id)

  selection.enter()
    .append("rect")
    .attrs({ x: 0, y: 500 })

  d3.select("svg")
    .selectAll("rect")
    .transition()
    .duration(1000)
    .attrs({
      x: d => (900 / 5) * d.age,
      y: d => 500 - d.height,
      height: d => d.height,
      width: 100
    })

  selection.exit()
    .transition()
    .duration(1000)
    .attrs({ y: 500 height: 0})
    .remove()
}
