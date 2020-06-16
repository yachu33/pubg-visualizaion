const margin = {
    top: 60,
    right: 40,
    bottom: 50,
    left: 100
  },
  width = 800,
  height = 800

const svg = d3
  .select("#map")
  .append("svg")
  .attr("width", width)
  .attr("height", height + margin.top + margin.bottom)
  .append("g");

const killer_bar_svg = d3
  .select("#killer_bar")
  .append("svg")
  .attr("height", 200)
  .append("g");

const victim_bar_svg = d3
  .select("#victim_bar")
  .append("svg")
  .attr("height", 200)
  .append("g");

// .attr("transform", `translate(${margin.left}, ${margin.right})`);

var div = d3.select("#all").append("div").attr("class", "tooltip").style("opacity", 0);

let map_type = "ERANGEL",
  weapon = "",
  rank = "";

let yScale = d3.scaleLinear()
  .domain([0,3000])
  .range([700, 0]);

function drawData(killed_data) {
  svg
    .selectAll("dot")
    .data(killed_data)
    .enter()
    .append("circle")
    .attr("fill", "red")
    .attr("r", "2")
    .attr("cx", (d) => (d.victim_position_x * width) / 800000)
    .attr("cy", (d) => (d.victim_position_y * height) / 800000)
    .on("mouseover", (d) => mouseover(d))
    .on('mouseout', (d) => mouseout(d));
}

function drawBar(killed_data) {
  var killer_placement_array = [];
  var victim_placement_array = [];
  var killer_placement = d3.nest().key((d) => d.killer_placement).entries(killed_data);
  var victim_placement = d3.nest().key((d) => d.victim_placement).entries(killed_data);

  for (var c = 0; c < 100; c++) {
    killer_placement.forEach(i => {
      if (c == i.key) {
        killer_placement_array.push({
          key: i.key,
          values: i.values.length
        });
      }
    })
    victim_placement.forEach(i => {
      if (c == i.key) {
        victim_placement_array.push({
          key: i.key,
          values: i.values.length
        });
      }
    })
  }

  killer_bar_svg
    .selectAll("rect")
    .data(killer_placement_array)
    .enter()
    .append("rect")
    .attr("fill", "#F4C117")
    .attr('x', (d) => d.key * 3+1.5)
    .attr('y', (d) => yScale(d.values) - 525)
    .attr('width', 2)
    .attr('height', (d) => 700 - yScale(d.values));

    killer_bar_svg
    .append("line")
    .attr("stroke", "white")
    .attr("transform", `translate(0, 176)`)
    .attr("x1", 0)
    .attr("x2", 300)

    killer_bar_svg
    .append("line")
    .attr("stroke", "white")
    .attr("stroke-width", "2")
    .attr("transform", `translate(0, 176)`)
    .attr("y1", -175)
    .attr("y2", 0)

    killer_bar_svg
    .append("text")
    .attr("transform", `translate(0, 190)`)
    .attr("font-family", "times")
    .attr("fill", "white")
    .text("1");

    killer_bar_svg
    .append("text")
    .attr("transform", `translate(280, 190)`)
    .attr("font-family", "times")
    .attr("fill", "white")
    .text("99");

    killer_bar_svg
    .append("text")
    .attr("transform", `translate(4, 13)`)
    .attr("font-family", "times")
    .attr("fill", "white")
    .text("人數");

    killer_bar_svg
    .append("text")
    .attr("transform", `translate(270, 160)`)
    .attr("font-family", "times")
    .attr("fill", "white")
    .text("名次");


  victim_bar_svg
    .selectAll("rect")
    .data(victim_placement_array)
    .enter()
    .append("rect")
    .attr("fill", "#F4C117")
    .attr('x', (d) => d.key * 3)
    .attr('y', (d) => yScale(d.values) - 525)
    .attr('width', 2)
    .attr('height', (d) => 700 - yScale(d.values));

    victim_bar_svg
    .append("line")
    .attr("stroke", "white")
    .attr("transform", `translate(0, 176)`)
    .attr("x1", 0)
    .attr("x2", 300)

    victim_bar_svg
    .append("line")
    .attr("stroke", "white")
    .attr("stroke-width", "2")
    .attr("transform", `translate(0, 176)`)
    .attr("y1", -175)
    .attr("y2", 0)

    victim_bar_svg
    .append("text")
    .attr("transform", `translate(0, 190)`)
    .attr("font-family", "times")
    .attr("fill", "white")
    .text("1");

    victim_bar_svg
    .append("text")
    .attr("transform", `translate(278, 190)`)
    .attr("font-family", "times")
    .attr("fill", "white")
    .text("100");

    victim_bar_svg
    .append("text")
    .attr("transform", `translate(4, 13)`)
    .attr("font-family", "times")
    .attr("fill", "white")
    .text("人數");

    victim_bar_svg
    .append("text")
    .attr("transform", `translate(270, 160)`)
    .attr("font-family", "times")
    .attr("fill", "white")
    .text("名次");
}

// d3.json(`https://pubg-flask.herokuapp.com/get_data?map=${map_type}`)
d3.csv("kill5000.csv").then(
  (killed_data) => {
    // console.log(killed_data);
    drawData(killed_data);
    drawBar(killed_data);
    let map_options = d3
      .select("#maps")
      .selectAll("button")
      .data(["ERANGEL", "MIRAMAR"])
      .enter()
      .append("button")
      .attr("value", (d) => d)
      .text((d) => d)
      .on("click", function() {
        if (map_type != this.value) {
          map_type = this.value;
          drawMap(map_type);
          updateData(this.value, weapon, rank);
        }
      });

    const weapons = killed_data.map((item) => item.killed_by);
    const distinctWeapon = [...new Set(weapons)];
    let weapon_options = d3
      .select("#weapons")
      .append("input")
      .attr("type", "text")
      .attr("list", "weapon-list")
      .on("focus", function() {
        this.value = "";
      })
      .on("mouseenter", function() {
        this.value = "";
      })
      .on("change", function() {
        weapon = this.value;
        updateData(map_type, this.value, rank);
      });

    let dlist = d3
      .select("#weapons")
      .append("datalist")
      .attr("id", "weapon-list");

    dlist
      .selectAll("option")
      .data(distinctWeapon)
      .enter()
      .append("option")
      .attr("id", (d, i) => `op${i}`)
      .text((d) => d);

    let rank_options = d3
      .select("#ranks")
      .selectAll("button")
      .data([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
      .enter()
      .append("button")
      .attr("value", (d) => d)
      .text((d) => d)
      .on("click", function() {
        rank = this.value;
        updateData(map_type, weapon, this.value);
      });
  }
);

function drawMap(map_type) {
  svg.selectAll("image").remove();

  if (map_type == "ERANGEL") {
    svg
      .append("image")
      .attr("xlink:href", "erangel.jpg")
      .attr("width", width)
      .attr("height", height);
  } else {
    svg
      .append("image")
      .attr("xlink:href", "miramar.jpg")
      .attr("width", width)
      .attr("height", height);
  }
}
drawMap(map_type);

function updateData(map_type, weapon, rank) {
  // d3.json(
  //   `https://pubg-flask.herokuapp.com/get_data?map=${map_type}&weapon=${weapon}`
  // )
  d3.csv("kill5000.csv").then((killed_data) => {
    svg.selectAll("circle").remove();
    drawData(killed_data);
    drawBar(killed_data);
  });
}

function mouseover(d) {
  div.transition()
    .duration(200)
    .style("opacity", 0.9);

  div.html("[Name]" + "&emsp;" + d.victim_name + "<br/>" +
      "[Placement]" + "&emsp;" + d.victim_placement + "<br/>" +
      "[Killed By]" + "&emsp;" + d.killed_by + "<br/>" +
      "[Killer Name]" + "&emsp;" + d.killer_name + "<br/>" +
      "[Killer Placement]" + "&emsp;" + d.killer_placement + "<br/>")
    .style("left", (d.victim_position_x * width) / 800000 + "px")
    .style("top", (d.victim_position_y * height) / 800000 + 50 + "px");
}

function mouseout(d) {
  div.transition()
    .style("opacity", 0);
}
