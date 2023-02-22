import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const LineChartComponent = ({ data }) => {
  const svgRef = useRef();
  const [isHovering, setIsHovering] = useState(false);
  const colors = ["purple", "darkorange", "forestgreen", "crimson"];
  const [currentColorIndex, setCurrentColorIndex] = useState(0);

  const handleColorChange = () => {
    const nextColorIndex = (currentColorIndex + 1) % colors.length;
    setCurrentColorIndex(nextColorIndex);
    const svg = d3.select(svgRef.current);
    svg.select("path").attr("stroke", colors[nextColorIndex]);
  };
  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;

    const margin = { top: 20, right: 20, bottom: 50, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.x))
      .range([0, innerWidth]);

    const y = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.y))
      .range([innerHeight, 0]);

    const line = d3
      .line()
      .x((d) => x(d.x))
      .y((d) => y(d.y));

    svg
      .append("g")
      .attr("class", "grid")
      .attr(
        "transform",
        `translate(${margin.left}, ${margin.top + innerHeight})`
      )
      .call(d3.axisBottom(x).tickSize(-innerHeight).tickFormat("").ticks(5));

    // Add the y-axis grid
    svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .call(d3.axisLeft(y).tickSize(-innerWidth).tickFormat("").ticks(5));

    // Add the line path
    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .append("path")
      .datum(data)
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2);

    // Add the x-axis
    svg
      .append("g")
      .attr(
        "transform",
        `translate(${margin.left}, ${innerHeight + margin.top})`
      )
      .call(d3.axisBottom(x));

    // Add the y-axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .call(d3.axisLeft(y));

    // Add the focus element with the circle and lines
    const focus = svg
      .append("g")
      .attr("class", "focus")
      .style("display", "none");

    focus.append("circle").attr("r", 4).attr("fill", "steelblue");

    focus
      .append("line")
      .attr("class", "x-hover-line hover-line")
      .attr("y1", 0)
      .attr("y2", innerHeight);

    focus
      .append("line")
      .attr("class", "y-hover-line hover-line")
      .attr("x1", 0)
      .attr("x2", innerWidth);

    // Add the overlay rectangle
    svg
      .append("rect")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .attr("class", "overlay")
      .attr("fill", "transparent")
      .attr("width", innerWidth)
      .attr("height", innerHeight)
      .on("mouseover", () => {
        setIsHovering(true);
        focus.style("display", null);
      })
      .on("mouseout", () => {
        setIsHovering(false);
        focus.style("display", "none");
      })
      .on("mousemove", function (event) {
        const x0 = x.invert(d3.pointer(event, this)[0]);
        const y0 = y.invert(d3.pointer(event, this)[1]);
        focus.attr("transform", `translate(${x(x0)}, ${y(y0)})`);
        focus.select(".x-hover-line").attr("y2", innerHeight - y(y0));
        focus.select(".y-hover-line").attr("x2", x(x0));
        if (isHovering) {
          focus.select(".x-hover-line").attr("y1", y(y0));
          focus.select(".y-hover-line").attr("y1", y(y0));
          focus.select(".x-hover-line").attr("x1", 0);
          focus.select(".y-hover-line").attr("x1", x(x0));

          focus.select(".x-hover-text").text(`x: ${x0.toFixed(2)}`);
          focus.select(".y-hover-text").text(`y: ${y0.toFixed(2)}`);
        }
      });
  }, [data]);

  return (
    <>
      <svg ref={svgRef} width="500" height="300">
        <g>
          <rect width="100%" height="100%" fill={colors[currentColorIndex]} />
          <path
            d="M 50 50 L 100 100 L 200 50 L 250 150"
            stroke={colors[currentColorIndex]}
            strokeWidth="5"
            fill="none"
          />
        </g>
      </svg>

      <button onClick={handleColorChange}>Change Color</button>
    </>
  );
};

export default LineChartComponent;
