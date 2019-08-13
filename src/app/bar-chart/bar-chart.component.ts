import { Component, ElementRef, Input, OnChanges, ViewChild, ViewEncapsulation, HostListener } from '@angular/core';
import * as d3 from 'd3';
import { PriceHistory } from '../priceHistory';
import { Item } from '../item';

@Component({
  selector: 'app-bar-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnChanges {
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

  ngOnChanges(): void {
    if (!this.data || this.data.length < 1) {
      d3.select('svg').remove();
      return;
    }

    //this.createChart();
    this.createGroupedBarChart();
  }

  onResize() {
    //this.createChart();
    this.createGroupedBarChart();
  }

  private createChart(): void {
    d3.select('svg').remove();

    const element = this.chartContainer.nativeElement;
    const data = this.data;

    const svg = d3.select(element).append('svg')
        .attr('width', element.offsetWidth)
        .attr('height', element.offsetHeight);

    const contentWidth = element.offsetWidth - this.margin.left - this.margin.right;
    const contentHeight = element.offsetHeight - this.margin.top - this.margin.bottom;

    const x = d3
      .scaleBand()
      .rangeRound([0, contentWidth])
      .padding(0.1)
      .domain(data.map(d => d.Date.toString()));

    const y = d3
      .scaleLinear()
      .rangeRound([contentHeight, 0])
      .domain([0, d3.max(data, d => d.Price)]);

    const g = svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + contentHeight + ')')
      .call(d3.axisBottom(x));

    g.append('g')
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(y).ticks(10, '$.2f'))
      .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('text-anchor', 'end')
        .text('Price ($)');

    g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.Date.toString()))
        .attr('y', d => y(d.Price))
        .attr('width', x.bandwidth())
        .attr('height', d => contentHeight - y(d.Price))
        .append('title').text(d => d.Date.toString() + ': ' + d3.format('$.2f')(d.Price));
  }
  
  private createGroupedBarChart(): void {

    d3.select('svg').remove();

    const element = this.chartContainer.nativeElement;

    const svg = d3.select(element).append('svg')
        .attr('width', element.offsetWidth)
        .attr('height', element.offsetHeight);

    const contentWidth = element.offsetWidth - this.margin.left - this.margin.right;
    const contentHeight = element.offsetHeight - this.margin.top - this.margin.bottom;

    let realPriceData = this.data.map((item, index) => {
      let obj = Object();
  
      obj.Date = item.Date;
      obj.Price  = item.Price;
      obj.Average = d3.mean(this.data.slice(0, index + 1), d => d.Price);

      return obj;
    });
    
    const groupKey = 'Date';
    const keys = ['Price', 'Average'];

    let x0 = d3.scaleBand()
      .domain(realPriceData.map(d => d[groupKey].toString()))
      // The start position of where the bars shuld be rendered.
      .rangeRound([this.margin.left, contentWidth + this.margin.left])
      .paddingInner(0.1);

    let x1 = d3.scaleBand()
      .domain(keys)
      .rangeRound([0, x0.bandwidth()])
      .padding(0.05);

    let y = d3.scaleLinear()
      .domain([0, d3.max(realPriceData, d => d3.max(keys, key => d[key]))]).nice()
      .rangeRound([contentHeight, 0]);

    let colorRange = d3.scaleOrdinal(["#CA5A7F", "#9D4663"]);

    let colorScheme = d3.scaleOrdinal(["bar-price", "bar-avg-price"]);

    let xAxis = g => g
      .attr("transform", `translate(0,${contentHeight + this.margin.top})`)
      .call(d3.axisBottom(x0).tickSizeOuter(0))
      .call(g => g.select(".domain").remove());

    let yAxis = g => g
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
      .call(d3.axisLeft(y).ticks(null, "$.2f"))
      .call(g => g.select(".domain").remove())
      .call(g => g.select(".tick:last-of-type text").clone()
          .attr("x", 3)
          .attr("text-anchor", "start")
          .attr("font-weight", "bold"));

    svg.append("g")
      .selectAll("g")
      .data(realPriceData)
      .join("g")
        .attr("transform", d => `translate(${x0(d[groupKey])}, ${this.margin.top})`)
      .selectAll("rect")
      .data(d => keys.map(key => {
        return ({key, value: d[key]});
      }))
      .join("rect")
        .attr("x", d => x1(d.key))
        .attr("y", d => y(d.value))
        .attr("width", x1.bandwidth())
        .attr("height", d => y(0) - y(d.value))
        .attr('class', d => colorScheme(d.key))
        .append('title').text(d => d.key + ': ' + d3.format('$.2f')(d.value));

    svg.append("g")
        .call(xAxis);
  
    svg.append("g")
        .call(yAxis);
  }
}