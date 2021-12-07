var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/*
# Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License").
# You may not use this file except in compliance with the License.
# A copy of the License is located at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# or in the "license" file accompanying this file. This file is distributed
# on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
# express or implied. See the License for the specific language governing
# permissions and limitations under the License.
#
*/
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { DashboardService } from 'src/app/services/dashboard.service';
import * as _ from 'underscore';
var InvestorchartComponent = /** @class */ (function () {
    function InvestorchartComponent(dashboardService, elRef) {
        var _this = this;
        this.dashboardService = dashboardService;
        this.elRef = elRef;
        this.svg = null;
        this.createChart = function () {
            _this.hostElement = _this.chartContainer.nativeElement;
            _this.radius = Math.min(_this.hostElement.offsetWidth, _this.hostElement.offsetHeight) / 2;
            var innerRadius = _this.radius - 80;
            var outerRadius = _this.radius - 15;
            var hoverRadius = _this.radius - 5;
            _this.pieColours = d3.scaleOrdinal(d3.schemeCategory10);
            _this.pieGenerator = d3.pie().sort(null).value(function (d) { return d; })([0, 0, 0]);
            _this.arcGenerator = d3.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius);
            _this.arcHover = d3.arc()
                .innerRadius(innerRadius)
                .outerRadius(hoverRadius);
            _this.labelArc = d3.arc()
                .outerRadius(innerRadius - 40)
                .innerRadius(outerRadius - 40);
        };
        this.updateChart = function (firstRun) {
            if (_this.svg === null) {
                _this.svg = d3.select(_this.hostElement).append('svg')
                    .attr('viewBox', '0, -10, ' + _this.hostElement.offsetWidth + ', ' + (_this.hostElement.offsetHeight + 20))
                    .append('g')
                    .attr('transform', "translate(" + _this.hostElement.offsetWidth / 2 + ", " + _this.hostElement.offsetHeight / 2 + ")");
            }
            var vm = _this;
            _this.slices = _this.updateSlices(_this.data);
            _this.labels = _this.slices.map(function (slice) { return slice.name; });
            _this.investment = _this.slices.map(function (slice) { return slice.investment; });
            _this.colourSlices = _this.slices.map(function (slice) { return _this.pieColours(slice.name); });
            _this.values = firstRun ? [0, 0, 0] : _.toArray(_this.slices).map(function (slice) { return slice.investment; });
            _this.pieGenerator = d3.pie().sort(null).value(function (d) { return d; })(_this.values);
            var arc = _this.svg.selectAll('.arc')
                .data(_this.pieGenerator);
            arc.exit().remove();
            var arcEnter = arc.enter().append('g')
                .attr('class', 'arc');
            arcEnter.append('path')
                .attr('d', _this.arcGenerator)
                .each(function (values) { return firstRun ? values.storedValues = values : null; })
                .on('mouseover', _this.mouseover)
                .on('mouseout', _this.mouseout);
            d3.select(_this.hostElement).selectAll('path')
                .data(_this.pieGenerator)
                .attr('fill', function (datum, index) { return _this.pieColours(_this.labels[index]); })
                .attr('d', _this.arcGenerator)
                .attr('id', function (d, i) { return 'donutArc' + i; })
                .transition()
                .duration(750)
                .attrTween('d', function (newValues, i) {
                return vm.arcTween(newValues, i, this);
            });
            _this.svg.select('.totalspend').remove();
            _this.svg.append('text')
                .attr('dy', '-25px')
                .style('text-anchor', 'middle')
                .attr('class', 'totalspend')
                .attr('fill', '#57a1c6')
                .text('$ ' + _this.totalSpend);
        };
        this.mouseover = function (d, i) {
            _this.selectedSlice = _this.slices[i];
            d3.select(d3.event.currentTarget).transition()
                .duration(200)
                .attr('d', _this.arcHover);
            _this.svg.append('text')
                .attr('dy', '0px')
                .style('text-anchor', 'middle')
                .attr('class', 'label')
                .attr('fill', '#57a1c6')
                .text(_this.labels[i] + ' contribution is $ ' + _this.investment[i]);
        };
        this.mouseout = function () {
            _this.svg.select('.label').remove();
            _this.svg.select('.percent').remove();
            d3.select(d3.event.currentTarget).transition()
                .duration(100)
                .attr('d', _this.arcGenerator);
        };
        this.toPercent = function (a, b) {
            return Math.round(a / b * 100) + '%';
        };
        this.updateSlices = function (newData) {
            // const queriesByInvestment = _.groupBy(_.sortBy(newData, 'investment'), 'investmentId');
            // const queriesByInvestment = _.sortBy(newData, 'investment');
            _this.totalSpend = _this.total;
            return _.sortBy(newData, 'investment');
        };
    }
    InvestorchartComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.createChart();
        this.updateChart(true);
        setTimeout(function () { return _this.updateChart(false); }, 50);
    };
    InvestorchartComponent.prototype.ngOnChanges = function () {
        //   if (this.svg) { this.updateChart(false); }
    };
    InvestorchartComponent.prototype.arcTween = function (newValues, i, slice) {
        var _this = this;
        var interpolation = d3.interpolate(slice.storedValues, newValues);
        slice.storedValues = interpolation(0);
        return function (t) {
            return _this.arcGenerator(interpolation(t));
        };
    };
    __decorate([
        ViewChild('chart'),
        __metadata("design:type", ElementRef)
    ], InvestorchartComponent.prototype, "chartContainer", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], InvestorchartComponent.prototype, "data", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Array)
    ], InvestorchartComponent.prototype, "colours", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], InvestorchartComponent.prototype, "total", void 0);
    InvestorchartComponent = __decorate([
        Component({
            selector: 'app-investorchart',
            templateUrl: './investorchart.component.html',
            styleUrls: ['./investorchart.component.scss']
        }),
        __metadata("design:paramtypes", [DashboardService, ElementRef])
    ], InvestorchartComponent);
    return InvestorchartComponent;
}());
export { InvestorchartComponent };
//# sourceMappingURL=investorchart.component.js.map