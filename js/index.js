/*
[{}, {}, ...]
Year(number) Time(string) Seconds(number)
Place(number) Name Doping  URL Nationality
*/

const URL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

d3.json(URL, (error, data) => {
  if (error) throw(error);

  const formatTime = d3.timeFormat("%M:%S");
  const parseTime = d3.timeParse("%M:%S");

  const width = 1200;
  const height = 500;
  const padding = 100;

  const svg = d3.select("#graph")
                .append("svg")
                .attr("width", width)
                .attr("height", height);

  const xScale = d3.scaleTime()
                   .domain([ d3.min(data, e => Date.parse(e.Year)), d3.max(data, e => Date.parse(e.Year)) ])
                   .range([ padding, width - padding ]);

  const yScale = d3.scaleTime()
                   .domain([ d3.min(data, e => parseTime(e.Time)), d3.max(data, e => parseTime(e.Time)) ])
                   .range([ height - padding, padding ]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale)
                  .tickFormat(formatTime);

  const tooltip = d3.select("#graph")
                    .append("div")
                    .attr("id", "tooltip")
                    .style("opacity", 0);

  svg.selectAll("circle")
     .data(data)
     .enter()
     .append("circle")
     .attr("cx", e => xScale(Date.parse(e.Year)))
     .attr("cy", e => yScale(parseTime(e.Time)))
     .attr("r", 5)
     .attr("class", "dot")
     .attr("data-xvalue", e => e.Year)
     .attr("data-yvalue", e => parseTime(e.Time))
     .attr("fill", e => {
       if (e.Doping) return "red";
       else return "green";
     })
     .on("mouseover", e => {
       tooltip.transition()
              .duration(200)
              .style("opacity", .9);
       tooltip.html(`<span class='legendSpan'>Name: </span>${e.Name} <br>` +
                    `<span class='legendSpan'>Nationality: </span>${e.Nationality} <br>` +
                    `<span class='legendSpan'>Time: </span>${e.Time} <br>` +
                    `<span class='legendSpan'>Year: </span>${e.Year} <br>` +
                    `<span class='legendSpan'>Doping: </span>${e.Doping} <br>`)
              .attr("data-year", e.Year)
              .style("left", e => {
                if (d3.event.pageX >= 1200) return d3.event.pageX - 400 + "px";
                else return d3.event.pageX + "px";
              })
              .style("top", e => {
                if (d3.event.pageY >= 300) return d3.event.pageY - 100 + "px";
                else return d3.event.pageY + "px";
              });
     })
     .on("mouseout", e => {
       tooltip.transition()
              .duration(500)
              .style("opacity", 0);
     });

  svg.append("g")
     .attr("transform", `translate(0, ${height - padding})`)
     .attr("id", "x-axis")
     .style("font-size", 15)
     .call(xAxis);

  svg.append("g")
     .attr("transform", `translate(${padding}, 0)`)
     .attr("id", "y-axis")
     .style("font-size", 15)
     .call(yAxis);

  svg.append("text")
     .text("Fastest ascents of the Tour de France stage up the Alpe d'Huez mountain.")
     .attr("x", width / 2)
     .attr("y", padding / 2)
     .attr("id", "title")
     .style("font-size", 25)
     .style("text-anchor", "middle")
     .style("alignment-baseline", "middle")
     .style("font-family", "Lato");

  svg.append("text")
     .html("Legend:")
     .attr("id", "legend")
     .attr("x", 950)
     .attr("y", 330)
     .style("width", 50)
     .style("font-weight", "bold")
     .style("font-family", "Lato");

  svg.append("text")
     .html("Positive Doping Test")
     .attr("id", "legend")
     .attr("x", 950)
     .attr("y", 350)
     .style("width", 50)
     .style("fill", "red")
     .style("font-family", "Lato");

  svg.append("text")
     .html("Negative Doping Test")
     .attr("id", "legend")
     .attr("x", 950)
     .attr("y", 370)
     .style("width", 50)
     .style("fill", "green")
     .style("font-family", "Lato");

  svg.append("text")
     .attr("x", width / 2)
     .attr("y", height - padding / 2 + 7)
     .style("text-anchor", "middle")
     .style("alignment-baseline", "middle")
     .style("font-family", "Lato")
     .style("font-weight", "bold")
     .text("Years");

  svg.append("text")
     .attr("transform", `translate(${padding / 2 - 20}, ${height / 2}) rotate(-90)`)
     .style("text-anchor", "middle")
     .style("alignment-baseline", "middle")
     .style("font-family", "Lato")
     .style("font-weight", "bold")
     .text("Time in minutes");
});