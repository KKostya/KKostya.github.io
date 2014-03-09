function lineChart() {
    var margin = {top: 20, right: 30, bottom: 40, left: 60},
        width  = 300, xDomain = [0, 1],
        height = 300, yDomain = [0, 1],
        xScale = d3.scale.linear(),
        yScale = d3.scale.linear(),
        xAxis  = d3.svg.axis().scale(xScale).orient("bottom"),
        yAxis  = d3.svg.axis().scale(yScale).orient("left"),
        xTitle = "x", yTitle = "y",
        x = function(d) {return d.x;}, vx = function(d) {return 10*d.vx;}, 
        y = function(d) {return d.y;}, vy = function(d) {return 10*d.vy;};

    var line = d3.svg.line()
        .x(function(d) { return xScale(x(d)); })
        .y(function(d) { return yScale(y(d)); });

    function chart(selection) {
        selection.each(function(data, i){
            // Setting parent w and h
            d3.select(this).style("width", width).style("height", height);
            // Select the svg element.
            var svg = d3.select(this).selectAll("g").data([data]);

            // Otherwise, create the skeletal chart.
            var gEnter = svg.enter().append("g");
            gEnter.append("path").attr("class", "line");
            gEnter.append("g").attr("class", "x axis");
            gEnter.append("g").attr("class", "y axis");

            // Updating
            svg = svg.attr("transform", 
                "translate(" + margin.left + "," + margin.top + ")");
       
            // Axes 
            xScale.domain(xDomain).range([0,  width - margin.right - margin.left]);
            yScale.domain(yDomain).range([height - margin.top - margin.bottom, 0]); 

            svg.select(".x.axis").attr("transform", "translate(0," + yScale.range()[0] + ")").call(xAxis);
            svg.select(".y.axis").call(yAxis);

            svg.append("text")
               .style("text-anchor", "middle")
               .attr("x", xScale((xDomain[1]+xDomain[0])/2))
               .attr("y", yScale.range()[0] + 0.8*margin.bottom)
               .text(xTitle); 
       
            var ordlabelx = xScale.range()[0] - 0.8*margin.left,
                ordlabely = yScale((yDomain[1]+yDomain[0])/2);
            svg.append("text")
               .style("text-anchor", "middle")
               .attr("x", ordlabelx).attr("y", ordlabely)
               .attr("transform", "rotate(-90 "+ordlabelx+" "+ordlabely+")")
               .text(yTitle); 
        
            // The graph itself
            svg.select(".line").attr("d", line(data));

            var i = 0;
            var tang  = svg.append("line").attr("class", "velocity");
            var point = svg.append("circle")
                           .attr("class", "dot")
                           .attr("r", 4);
            var tupdate = function()
            {
               point.attr("cx", xScale(x(data[i]))).attr("cy", yScale(y(data[i])));
               tang.attr("x1", xScale(x(data[i]))).attr("y1", yScale(y(data[i])))
                   .attr("x2", xScale(x(data[i]) + vx(data[i]))).attr("y2", yScale(y(data[i]) + vy(data[i])));
               i++; if(i >= data.length) i = 0;
               d3.timer(tupdate,100); 
               return true;
            }
            d3.timer(tupdate,0); 
        });
    } 

    chart.width  = function(value) { if (!arguments.length) return  width;  width = value; return chart; };
    chart.height = function(value) { if (!arguments.length) return height; height = value; return chart; };

    chart.xDomain = function(value) { if (!arguments.length) return xDomain; xDomain = value; return chart; };
    chart.yDomain = function(value) { if (!arguments.length) return yDomain; yDomain = value; return chart; };

    chart.xTitle = function(value) { if (!arguments.length) return xTitle; xTitle = value; return chart; };
    chart.yTitle = function(value) { if (!arguments.length) return yTitle; yTitle = value; return chart; };

    chart.x = function(value) { if (!arguments.length) return x; x = value; return chart; };
    chart.y = function(value) { if (!arguments.length) return y; y = value; return chart; };
    chart.vx = function(value) { if (!arguments.length) return vx; vx = value; return chart; };
    chart.vy = function(value) { if (!arguments.length) return vy; vy = value; return chart; };




    return chart;
}
