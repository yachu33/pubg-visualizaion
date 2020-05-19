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

// const svg2 = d3
//   .select("#map")
//   .append("svg")
//   .attr("width", width)
//   .attr("height", height + margin.top + margin.bottom)
//   .append("g");

Promise.all([
    d3.csv("small_kill.csv")
]).then(([small_kill]) => {
    // console.log(
    //   small_kill[1].victim_position_x,
    //   small_kill[1].victim_position_y
    // );
    // vic_x = small_kill[1].victim_position_x * width/800000;
    // vic_y = small_kill[1].victim_position_y * height/800000;

    let map = "ERANGEL";

    map_image = svg
      .append("image")
      .attr("xlink:href", "erangel.jpg")
      .attr("width", width)
      .attr("height", height);
    let erangel_kill = small_kill.filter(function (d) {
      return d.map == "ERANGEL";
    });
    let miramar_kill = small_kill.filter(function (d) {
      return d.map == "MIRAMAR";
    });
    // console.log(erangel_kill);

    svg
      .selectAll("dot")
      .data(erangel_kill)
      .enter()
      .append("circle")
      .attr("fill", "red")
      .attr("r", "4")
      .attr("cx", (d) => (d.victim_position_x * width) / 800000)
      .attr("cy", (d) => (d.victim_position_y * height) / 800000);

    let dropDown = d3
      .select("#options")
      .selectAll("button")
      .data(["ERANGEL", "MIRAMAR"])
      .enter()
      .append("button")
      .attr("value", (d) => d)
      .text((d) => d)
      .on("click", function () {
        map = this.value;
        updateMap();
        
      });

      function updateMap() {
        // console.log('d');
        // mapJPG = (map == "ERANGEL") ? "erangel.jpg" : "miramar.jpg";
          svg
            .selectAll("image")
            .remove();
          svg
            .selectAll("circle")
            .remove();
          if (map == "ERANGEL") {
            svg
              .append("image")
              .attr("xlink:href", "erangel.jpg")
              .attr("width", width)
              .attr("height", height);
            svg
              .selectAll("dot")
              .data(erangel_kill)
              .enter()
              .append("circle")
              .attr("fill", "red")
              .attr("r", "4")
              .attr("cx", (d) => (d.victim_position_x * width) / 800000)
              .attr("cy", (d) => (d.victim_position_y * height) / 800000);
            
          } else {
            svg
              .append("image")
              .attr("xlink:href", "miramar.jpg")
              .attr("width", width)
              .attr("height", height);
            svg
              .selectAll("dot")
              .data(miramar_kill)
              .enter()
              .append("circle")
              .attr("fill", "red")
              .attr("r", "4")
              .attr("cx", (d) => (d.victim_position_x * width) / 800000)
              .attr("cy", (d) => (d.victim_position_y * height) / 800000);
          }
            

      }
      
        

})