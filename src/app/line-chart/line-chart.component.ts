import { Component, ElementRef, Input, OnChanges, ViewChild, ViewEncapsulation, HostListener } from '@angular/core';
import * as d3 from 'd3';
import { PriceHistory } from '../priceHistory';

@Component({
  selector: 'app-line-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnChanges {

  @ViewChild('chart')
  private chartContainer: ElementRef;

  @Input()
  data: PriceHistory[];

  margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 50
  };

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(): void {
    if (!this.data || this.data.length < 1) {
      d3.select('svg').remove();
      return;
    }
    this.createLineChart();
  }

  onResize() {
    this.createLineChart();
  }

  private createLineChart(): void {

    d3.select('svg').remove();

    const element = this.chartContainer.nativeElement;
    const data = this.data;

    const svg = d3.select(element).append('svg')
        .attr('width', element.offsetWidth)
        .attr('height', element.offsetHeight);

    const contentWidth = element.offsetWidth - this.margin.left - this.margin.right;
    const contentHeight = element.offsetHeight - this.margin.top - this.margin.bottom;

    const tooltip = d3.select('#tooltip');
    const tooltipLine = svg.append('line');

    let avgData = this.data.map((item, index) => {
      let obj = Object();
      obj.Date = item.Date;
      obj.Price = d3.mean(this.data.slice(0, index + 1), d => d.Price);
      return obj;
    });

    let parseDate = d3.timeParse("%Y-%m-%d");
    let bisectDate = d3.bisector(function(d: PriceHistory) { return parseDate(d.Date.toString()); }).left;

    // This is for creating min/max range for x values.
    let x = d3.scaleTime()
      .domain([parseDate(data[0].Date.toString()), parseDate(data[data.length - 1].Date.toString())])
      .range([this.margin.left, contentWidth + this.margin.left]);

    // This is for creating min/max range for y values.
    let y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.Price)]).nice()
      .range([contentHeight + this.margin.top, this.margin.top]);

    // This is for rendering the x-axis.
    let xAxis = g => g
      .attr("transform", `translate(0,${contentHeight + this.margin.top})`)
      .call(d3.axisBottom(x).ticks(data.length).tickSizeOuter(0));

    // This is for rendering the y-axis.
    let yAxis = g => g
      .attr("transform", `translate(${this.margin.left}, 0)`)
      .call(d3.axisLeft(y)
        .tickSize(-6)
        .ticks(6, "$.2f")
      );

    // This is a function for defining trend line.
    let line = d3.line<PriceHistory>()
    .curve(d3.curveMonotoneX)
      .x(d => x(parseDate(d.Date.toString())))
      .y(d => y(d.Price));

    const focus = svg.append("g")
      .attr("class", "focus")
      .style("display", "none");

    focus.append("circle")
      .attr("class", "dot-price")
      .attr("r", 5);

    focus.append("circle")
      .attr("class", "dot-average")
      .attr("r", 5);

    focus.append("text")
      .attr("class", "tooltip-price")
      .attr("x", 15)
      .attr("y", 5);

    // For detecting where the cursor is on the canvas.
    svg.append("rect")
      .attr("class", "overlay")
      .attr("width", contentWidth + this.margin.left * 2)
      .attr("height", contentHeight + this.margin.top * 2)
      .on("mouseover", function() { focus.style("display", null); })
      .on("mouseout", function() { focus.style("display", "none"); })
      .on("mousemove", mousemove);

    // This is for trend lines.
    svg.append("path")
      .datum(data)
      .attr("class", "step-line price")
      .attr("d", line);

    svg.append("path")
      .datum(avgData)
      .attr("class", "step-line average")
      .attr("d", line);

    // This is for data points.
    // svg.selectAll("line-circle")
    //   .data(data)
    //   .enter().append("circle")
    //     .attr("class", "data-circle dot dot-price")
    //     .attr("r", 5)
    //     .attr("cx", d => x(parseDate(d.Date.toString())))
    //     .attr("cy", d => y(d.Price));

    // svg.selectAll("line-circle")
    //   .data(avgData)
    //   .enter().append("circle")
    //     .attr("class", "data-circle dot dot-average")
    //     .attr("r", 5)
    //     .attr("cx", d => x(parseDate(d.Date.toString())))
    //     .attr("cy", d => y(d.Price));

    svg.append("g")
    .attr("class", "axis")
      .call(xAxis);
  
    svg.append("g")
      .attr("class", "grid axis")
      .call(yAxis);

    function mousemove() {
      const bisect = d3.bisector((d: PriceHistory) => d.Date).left;
      var x0 = x.invert(d3.mouse(this)[0]),
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = ((x0 - d0.Date) > (d1.Date - x0)) ? d1 : d0;
      focus.select(".dot-price").attr("transform", "translate(" + x(parseDate(d.Date.toString())) + "," + y(d.Price) + ")");

      var a0 = x.invert(d3.mouse(this)[0]),
        j = bisectDate(avgData, a0, 1),
        a0 = avgData[j - 1],
        a1 = avgData[j],
        a = ((a0 - a0.Date) > (a1.Date - a0)) ? a1 : a0;
      focus.select(".dot-average").attr("transform", "translate(" + x(parseDate(a.Date.toString())) + "," + y(a.Price) + ")");

      focus.select(".tooltip-price").text("Price: " + d3.format('$.2f')(d.Price))
        .attr("transform", "translate(" + x(parseDate(a.Date.toString())) + "," + y((a.Price + d.Price)/2) + ")");
    }
  }
}
