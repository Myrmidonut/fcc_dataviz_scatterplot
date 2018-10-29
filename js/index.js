 // [{}, {}, ...]
// Year(number) Time(string) Seconds(number)
// Place(number) Name Doping  URL Nationality

var url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

d3.json(url, function (error, data) {
   if (error) console.log(error);

   var formatTime = d3.timeFormat("%M:%S");
   var parseTime = d3.timeParse("%M:%S");

   var width = 1200;
   var height = 500;
   var padding = 100;

   var svg = d3.select("#graph").
   append("svg").
   attr("width", width).
   attr("height", height);

   var xScale = d3.scaleTime().
   domain([d3.min(data, function (e) {return Date.parse(e.Year);}), d3.max(data, function (e) {return Date.parse(e.Year);})]).
   range([padding, width - padding]);

   var yScale = d3.scaleTime().
   domain([d3.min(data, function (e) {return parseTime(e.Time);}), d3.max(data, function (e) {return parseTime(e.Time);})]).
   range([height - padding, padding]);

   var xAxis = d3.axisBottom(xScale);
   var yAxis = d3.axisLeft(yScale).
   tickFormat(formatTime);

   var tooltip = d3.select("#graph").
   append("div").
   attr("id", "tooltip").
   style("opacity", 0);

   svg.selectAll("circle").
   data(data).
   enter().
   append("circle").
   attr("cx", function (e) {return xScale(Date.parse(e.Year));}).
   attr("cy", function (e) {return yScale(parseTime(e.Time));}).
   attr("r", 5).
   attr("class", "dot").
   attr("data-xvalue", function (e) {return e.Year;}).
   attr("data-yvalue", function (e) {return parseTime(e.Time);}).
   attr("fill", function (e) {
      if (e.Doping) return "red";else
      return "green";
   }).

   on("mouseover", function (e) {
      tooltip.transition().
      duration(200).
      style("opacity", .9);
      tooltip.html("<span class='legendSpan'>Name: </span>" + e.Name + "<br>" +
      "<span class='legendSpan'>Nationality: </span>" + e.Nationality + "<br>" +
      "<span class='legendSpan'>Time: </span>" + e.Time + "<br>" +
      "<span class='legendSpan'>Year: </span>" + e.Year + "<br>" +
      "<span class='legendSpan'>Doping: </span>" + e.Doping + "<br>").
      attr("data-year", e.Year).
      style("left", function (e) {
         if (d3.event.pageX >= 1200) return d3.event.pageX - 400 + "px";else
         return d3.event.pageX + "px";
      }).
      style("top", function (e) {
         if (d3.event.pageY >= 300) return d3.event.pageY - 100 + "px";else
         return d3.event.pageY + "px";
      });
   }).
   on("mouseout", function (e) {
      tooltip.transition().
      duration(500).
      style("opacity", 0);
   });

   svg.append("g").
   attr("transform", "translate(0," + (height - padding) + ")").
   attr("id", "x-axis").
   style("font-size", 15).
   call(xAxis);

   svg.append("g").
   attr("transform", "translate(" + padding + ", 0)").
   attr("id", "y-axis").
   style("font-size", 15).
   call(yAxis);

   svg.append("text").
   text("Fastest ascents of the Tour de France stage up the Alpe d'Huez mountain.").
   attr("x", width / 2).
   attr("y", padding / 2).
   attr("id", "title").
   style("font-size", 25).
   style("text-anchor", "middle").
   style("alignment-baseline", "middle").
   style("font-family", "Lato");


   svg.append("text").
   html("Legend:").
   attr("id", "legend").
   attr("x", 950).
   attr("y", 330).
   style("width", 50).
   style("font-weight", "bold").
   style("font-family", "Lato");

   svg.append("text").
   html("Positive Doping Test").
   attr("id", "legend").
   attr("x", 950).
   attr("y", 350).
   style("width", 50).
   style("fill", "red").
   style("font-family", "Lato");

   svg.append("text").
   html("Negative Doping Test").
   attr("id", "legend").
   attr("x", 950).
   attr("y", 370).
   style("width", 50).
   style("fill", "green").
   style("font-family", "Lato");

   svg.append("text").
   attr("x", width / 2).
   attr("y", height - padding / 2 + 7).
   style("text-anchor", "middle").
   style("alignment-baseline", "middle").
   style("font-family", "Lato").
   style("font-weight", "bold").
   text("Years");

   svg.append("text").
   attr("transform", "translate(" + (padding / 2 - 20) + ", " + height / 2 + ") rotate(-90)").
   style("text-anchor", "middle").
   style("alignment-baseline", "middle").
   style("font-family", "Lato").
   style("font-weight", "bold").
   text("Time in minutes");
});