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
  .attr("height", 210)
  .append("g");

const victim_bar_svg = d3
  .select("#victim_bar")
  .append("svg")
  .attr("height", 210)
  .append("g");

const winnermap_svg = d3
  .select("#winnermap")
  .append("svg")
  .attr("width", width)
  .attr("height", height + margin.top + margin.bottom)
  .append("g");

var div = d3.select("#all").append("div").attr("class", "tooltip").style("opacity", 0);

let map_type = "ERANGEL",
  map_type_win = "ERANGEL",
  weapon = "",
  rank = "",
  t1 = "",
  t2 = "";

let yScale = d3.scaleLinear()
  .domain([0, 3000])
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

  svg
    .append("text")
    .attr("transform", `translate(0, 820)`)
    .attr("font-family", "times")
    .attr("fill", "white")
    .text("紅點表示玩家死亡位置");
}

function drawWinData(win_data) {
  winnermap_svg
    .selectAll("dot")
    .data(win_data)
    .enter()
    .append("circle")
    .attr("fill", "red")
    .attr("r", "2")
    .attr("cx", (d) => (d.killer_position_x * width) / 800000)
    .attr("cy", (d) => (d.killer_position_y * height) / 800000)
    .on("mouseover", (d) => mouseoverWin(d))
    .on('mouseout', (d) => mouseout(d));

  winnermap_svg
    .append("text")
    .attr("transform", `translate(0, 820)`)
    .attr("font-family", "times")
    .attr("fill", "white")
    .text("紅點表示吃雞玩家位置");
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
    .attr('x', (d) => d.key * 3 + 1.5)
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
    .text("People");

  killer_bar_svg
    .append("text")
    .attr("transform", `translate(233, 210)`)
    .attr("font-family", "times")
    .attr("fill", "white")
    .text("Placement");


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
    .text("People");

  victim_bar_svg
    .append("text")
    .attr("transform", `translate(233, 210)`)
    .attr("font-family", "times")
    .attr("fill", "white")
    .text("Placement");
}

d3.json(
  `https://idyllic-chimera-280508.ue.r.appspot.com/get_data?map=${map_type}`
)
  // d3.csv("kill10000.csv")
  .then((killed_data) => {
    drawData(killed_data);
    drawBar(killed_data);

    let reset = d3.select("#reset")
      .append("button")
      .text("全部清除")
      .on("click", function(){
        weapon = "";
        t1 = "";
        t2 = "";
        rank = "";
        d3.select("#weaponsTex").text("Weapons: ");
        d3.select("#ranksTex").text("Ranks: ");
        resetOptions(map_type);
    });
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
          d3.select("#mapTex").text("Maps: " + map_type);
          weapon="";
          t1="";
          t2="";
          rank="";
          updateData(this.value, weapon, t1, t2, rank);
        }
      });
    const weapons = killed_data.map((item) => item.killed_by);
    const distinctWeapon = [...new Set(weapons)];
    // console.log(distinctWeapon);
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
        d3.select("#weaponsTex").text("Weapons: " + weapon);
        updateData(map_type, this.value, t1, t2, rank);
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
        d3.select("#ranksTex").text("Ranks: " + rank);

        updateData(map_type, weapon, t1, t2, this.value);
      });
    
    d3.select(".multirange.original")
    .on("change", function() {
      low = d3.select(".multirange.ghost").style("--low");
      high = d3.select(".multirange.ghost").style("--high");
      t1 = (+low.replace("%", "")-1) * 0.01 * 2000;
      t2 = (+high.replace("%", "")+1) * 0.01 * 2000;
      updateData(map_type, weapon, t1, t2, rank);

      console.log(t1, t2);
      
      
    })
    d3.select(".multirange.ghost")
    .on("change", function () {
      low = d3.select(".multirange.ghost").style("--low");
      high = d3.select(".multirange.ghost").style("--high");
       t1 = (+low.replace("%", "") - 1) * 0.01 * 2000;
       t2 = (+high.replace("%", "") + 1) * 0.01 * 2000;
      updateData(map_type, weapon, t1, t2, rank);
      console.log(t1, t2);
    });
      
  });

d3.csv("5000winner.csv").then(
  (win_data) => {
    // console.log(win_data);
    drawWinData(win_data);
    let map_option = d3
      .select("#mapss")
      .selectAll("button")
      .data(["ERANGEL", "MIRAMAR"])
      .enter()
      .append("button")
      .attr("value", (d) => d)
      .text((d) => d)
      .on("click", function() {
        if (map_type_win != this.value) {
          map_type_win = this.value;
          drawWinMap(map_type_win);
          updateWinData(this.value);
        }
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

function updateData(map_type, weapon, t1, t2, rank) {
  d3.json(
    `https://idyllic-chimera-280508.ue.r.appspot.com/get_data?map=${map_type}&weapon=${weapon}&time1=${t1}&time2=${t2}&rank=${rank}`
  ).then((killed_data) => {
    svg.selectAll("circle").remove();
    drawData(killed_data);
    drawBar(killed_data);
  });
}
function drawWinMap(map_type_win) {
  winnermap_svg.selectAll("image").remove();

  if (map_type_win == "ERANGEL") {
    winnermap_svg
      .append("image")
      .attr("xlink:href", "erangel.jpg")
      .attr("width", width)
      .attr("height", height);
  } else {
    winnermap_svg
      .append("image")
      .attr("xlink:href", "miramar.jpg")
      .attr("width", width)
      .attr("height", height);
  }
}
drawWinMap(map_type_win);
function updateWinData(map_type_win) {
  // d3.json(
  //   `https://pubg-flask.herokuapp.com/get_data?map=${map_type}&weapon=${weapon}`
  // )
  d3.csv("5000winner.csv").then((win_data) => {
    winnermap_svg.selectAll("circle").remove();
    drawWinData(win_data);
  });
}

function mouseover(d) {
  console.log("aa");
  div.transition()
    .duration(200)
    .style("opacity", 0.9);

  div.html("[Name]" + "&emsp;" + d.victim_name + "<br/>" +
      "[Placement]" + "&emsp;" + d.victim_placement + "<br/>" +
      "[Killed By]" + "&emsp;" + d.killed_by + "<br/>" +
      "[Killer Name]" + "&emsp;" + d.killer_name + "<br/>" +
      "[Killer Placement]" + "&emsp;" + d.killer_placement + "<br/>")
    .style("left", (d.victim_position_x * width) / 800000 + 50 + "px")
    .style("top", (d.victim_position_y * height) / 800000 + 50 + "px");
}

function mouseoverWin(d) {
  console.log("bb");
  div.transition()
    .duration(200)
    .style("opacity", 0.9);

  div.html("[Name]" + "&emsp;" + d.killer_name + "<br/>" +
      "[Placement]" + "&emsp;" + d.killer_placement + "<br/>" +
      "[Weapon]" + "&emsp;" + d.killed_by)
    .style("left", (d.killer_position_x * width) / 800000 + 50 + "px")
    .style("top", (d.killer_position_y * height) / 800000 + 50 + "px");
}

function mouseout(d) {
  div.transition()
    .style("opacity", 0);
}

function resetOptions(map_type) {
  updateData(map_type, "", "", "", "");
}
