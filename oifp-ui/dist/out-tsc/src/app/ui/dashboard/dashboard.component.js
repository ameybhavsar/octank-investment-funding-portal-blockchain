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
import { Component, HostListener } from '@angular/core';
import { DashboardService } from './../../services';
import { UtilsService } from 'src/app/services/shared';
import { Router } from '@angular/router';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
var DashboardComponent = /** @class */ (function () {
    function DashboardComponent(userInvestmentsService, formBuilder, router) {
        this.userInvestmentsService = userInvestmentsService;
        this.formBuilder = formBuilder;
        this.router = router;
        this.userInvestmentslist = [];
        this.investForm = null;
        this.submitted = false;
        this.total_Investment = 0.00;
        this.month_Investment = 0.00;
    }
    DashboardComponent.prototype.update = function (event) { UtilsService.onHeightChange('.table-responsive'); };
    DashboardComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.userInvestmentsService.getUserInvestments().subscribe(function (data) {
            _this.userInvestmentslist = data;
            for (var i in data) {
                if (data[i]) {
                    _this.total_Investment = _this.total_Investment + data[i].amount;
                    if (data[i].date.getMonth === new Date().getMonth) {
                        _this.month_Investment = _this.month_Investment + data[i].amount;
                    }
                }
            }
            UtilsService.onHeightChange('.table-responsive', 50);
        }, function (err) {
            console.error(err);
        });
        this.investForm = this.formBuilder.group({
            invest: new FormControl('', [Validators.required])
        });
    };
    __decorate([
        HostListener('window:resize', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], DashboardComponent.prototype, "update", null);
    DashboardComponent = __decorate([
        Component({
            selector: 'app-dashboard',
            templateUrl: './dashboard.component.html',
            styleUrls: ['./dashboard.component.scss'],
        }),
        __metadata("design:paramtypes", [DashboardService,
            FormBuilder,
            Router])
    ], DashboardComponent);
    return DashboardComponent;
}());
export { DashboardComponent };
//# sourceMappingURL=dashboard.component.js.map