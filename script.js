const margin = { top: 60, right: 40, bottom: 50, left: 100 },
    width = 800,
    height = 800
const svg = d3
  .select("#map")
  .append("svg")
  .attr("width", width)
  .attr("height", height + margin.top + margin.bottom)
  .append("g");
    // .attr("transform", `translate(${margin.left}, ${margin.right})`);

let map_type = "ERANGEL",
  weapon = "",
  rank = "";

function drawData(killed_data) {
  svg
    .selectAll("dot")
    .data(killed_data)
    .enter()
    .append("circle")
    .attr("fill", "red")
    .attr("r", "2")
    .attr("cx", (d) => (d.victim_position_x * width) / 800000)
    .attr("cy", (d) => (d.victim_position_y * height) / 800000);
}

d3.json(`https://pubg-flask.herokuapp.com/get_data?map=${map_type}`).then(
  (killed_data) => {
    // console.log(killed_data);
    drawData(killed_data);
    let map_options = d3
      .select("#maps")
      .selectAll("button")
      .data(["ERANGEL", "MIRAMAR"])
      .enter()
      .append("button")
      .attr("value", (d) => d)
      .text((d) => d)
      .on("click", function () {
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
      .on("focus", function () {
        this.value = "";
      })
      .on("mouseenter", function () {
        this.value = "";
      })
      .on("change", function () {
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
      .on("click", function () {
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
  d3.json(
    `https://pubg-flask.herokuapp.com/get_data?map=${map_type}&weapon=${weapon}`
  ).then((killed_data) => {
    svg.selectAll("circle").remove();
    drawData(killed_data);
  });
}



