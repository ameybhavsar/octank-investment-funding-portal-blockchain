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
import { Component, ViewContainerRef, ViewChild, ComponentFactoryResolver, HostListener } from '@angular/core';
import { Oifp, Rating } from 'src/app/models';
import { Router } from '@angular/router';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { SessionService, UtilsService } from 'src/app/services/shared';
import { InvestService, DashboardService, OifpService } from 'src/app/services';
import { RatingService } from '../components/rating/rating.component';
import { InvestorchartComponent } from '../components/investorchart/investorchart.component';
var OifpsListComponent = /** @class */ (function () {
    function OifpsListComponent(oifpService, formBuilder, router, investService, ratingService, dashboardService, componentFactoryResolver) {
        var _this = this;
        this.oifpService = oifpService;
        this.formBuilder = formBuilder;
        this.router = router;
        this.investService = investService;
        this.ratingService = ratingService;
        this.dashboardService = dashboardService;
        this.componentFactoryResolver = componentFactoryResolver;
        this.oifplist = [];
        this.oifpProjects = null;
        this.selectedOIFP = new Oifp();
        this.investForm = null;
        this.submitted = false;
        this.error = null;
        this.oifpRating = 0;
        this.userRating = new Rating();
        this.contribution_list = [];
        this.show_graph = false;
        this.componentRef = null;
        this.loading = false;
        this.oifpMap = new Map();
        this.ratingService.ratingClick.subscribe(function (data) {
            var currentInvestor = SessionService.getUser().name;
            _this.selectedOIFP.oifp_user_rating = data.rating;
            _this.oifpService.createInvestorOIFPRating(data.rating, currentInvestor, _this.selectedOIFP.oifp_reg_no).subscribe(function (resp) { });
        });
    }
    OifpsListComponent.prototype.update = function (event) { UtilsService.onHeightChange('.container-dynamic-height'); };
    OifpsListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.oifpService.getOIFPs().subscribe(function (data) {
            _this.oifplist = data;
            _this.oifplist.forEach(function (element) {
                _this.setRatings(element);
                _this.getOIFPFundsDetails(element);
                _this.getOIFPSpendData(element);
                _this.oifpMap.set(element.id, element);
            });
            _this.selectedOIFP = _this.oifplist.length > 0 ? _this.oifpMap.get(_this.oifplist[0].id) : new Oifp();
            setTimeout(function () {
                var oifp_data = UtilsService.mapToJson(_this.oifpMap);
                SessionService.setValue('oifps', oifp_data);
            }, 1000);
            // set height dynimically
            UtilsService.onHeightChange('.container-dynamic-height', 20);
        }, function (err) {
            console.error(err);
        });
        this.investForm = this.formBuilder.group({
            investmentAmount: new FormControl('', [Validators.required])
        });
    };
    OifpsListComponent.prototype.getOIFPFundsDetails = function (oifp) {
        this.dashboardService.getInvestmentsByOIFP(oifp.id).subscribe(function (oifp_data) {
            var oifp_total_investment = 0.00;
            var oifp_total_investors_set = new Set();
            var oifp_investors_amounts = new Map();
            for (var i in oifp_data) {
                if (oifp_data[i]) {
                    oifp_total_investment = oifp_total_investment + oifp_data[i].investmentAmount;
                    if (!oifp_total_investors_set.has(oifp_data[i].investorUserName)) {
                        oifp_total_investors_set.add(oifp_data[i].investorUserName);
                    }
                    var investor_name = oifp_data[i].investorUserName;
                    if (!oifp_investors_amounts.has(investor_name)) {
                        oifp_investors_amounts.set(investor_name, oifp_data[i].investmentAmount);
                    }
                    else {
                        oifp_investors_amounts.set(investor_name, oifp_data[i].investmentAmount + oifp_investors_amounts.get(investor_name));
                    }
                }
            }
            var user_investment = oifp_investors_amounts.get(SessionService.getUser().name);
            oifp.oifp_investments = oifp_total_investment;
            oifp.oifp_Investors = oifp_total_investors_set.size;
            oifp.oifp_investor_details = oifp_investors_amounts;
            oifp.oifp_user_investments = user_investment ? user_investment : 0;
            return oifp;
        });
    };
    OifpsListComponent.prototype.getOifpInvestorsAmountKeys = function () {
        return Array.from(this.selectedOIFP.oifp_investor_details.keys());
    };
    OifpsListComponent.prototype.getOIFPSpendData = function (oifp) {
        this.oifpService.getOIFPSpend(oifp.id).subscribe(function (oifpspenddata) {
            var oifp_spend_amount = 0;
            var oifp_spend_data = [];
            for (var i in oifpspenddata) {
                if (oifpspenddata[i] && oifpspenddata[i].docType === 'spend') {
                    oifp_spend_amount = oifp_spend_amount + oifpspenddata[i].spendAmount;
                    oifp_spend_data.push(oifpspenddata[i]);
                }
            }
            oifp.oifp_fund_utilized = oifp_spend_amount;
            oifp.oifp_spend_details = oifp_spend_data;
        }, function (err) {
            console.error(err);
        });
        return oifp;
    };
    OifpsListComponent.prototype.setRatings = function (oifp) {
        this.oifpService.getOIFPRating(oifp.id).subscribe(function (data) {
            var rating = 0;
            for (var i in data) {
                if (data[i]) {
                    rating = rating + data[i].rating;
                    if (SessionService.getUser().name === data[i].investorUserName) {
                        oifp.oifp_user_rating = data[i].rating;
                    }
                }
            }
            if (rating > 0) {
                rating = rating / data.length;
            }
            oifp.oifp_rating = Math.ceil(rating);
        });
    };
    OifpsListComponent.prototype.onOIFPSelect = function (oifp) {
        this.selectedOIFP = oifp;
        this.setRatings(oifp);
        this.getOIFPFundsDetails(oifp);
        this.getOIFPSpendData(oifp);
        return;
    };
    Object.defineProperty(OifpsListComponent.prototype, "investment", {
        get: function () { return this.investForm.controls; },
        enumerable: true,
        configurable: true
    });
    OifpsListComponent.prototype.onInvest = function () {
        var _this = this;
        if (this.loading) {
            return;
        }
        this.loading = true;
        this.submitted = true;
        if (this.investForm.invalid) {
            return;
        }
        this.investService.makeInvestment(this.selectedOIFP.oifp_reg_no, SessionService.getUser().name, this.investForm.value.investmentAmount)
            .subscribe(function (data) {
            _this.router.navigate(["invest/" + data.investmentId]);
        }, function (err) {
            _this.loading = false;
            console.error(err);
            _this.error = 'Something wrong with the investment. Will update you soon on this.';
        });
    };
    OifpsListComponent.prototype.getSpendData = function (spend_Id, totalamount) {
        var _this = this;
        this.dashboardService.getContributorsBySpend(spend_Id).subscribe(function (data) {
            if (data.length > 0) {
                var operations_1 = [];
                for (var i = 0; i < data.length; i++) {
                    var operation = {
                        spendAllocationId: data[i].spendAllocationId,
                        investment: UtilsService.formatFloat(data[i].spendAllocationAmount, 4),
                        name: 'Investor ' + i
                    };
                    operations_1.push(operation);
                }
                setTimeout(function () {
                    var factory = _this.componentFactoryResolver.resolveComponentFactory(InvestorchartComponent);
                    _this.componentRef = _this.viewContainer.createComponent(factory);
                    _this.componentRef.instance.data = operations_1;
                    _this.componentRef.instance.total = totalamount;
                    _this.show_graph = true;
                }, 500);
            }
        }, function (err) {
            console.error(err);
        });
    };
    OifpsListComponent.prototype.renderGraph = function (spend_Id, totalamount) {
        if (this.componentRef !== null) {
            this.componentRef.destroy();
        }
        this.getSpendData(spend_Id, totalamount);
    };
    __decorate([
        ViewChild('graphcontainer', { read: ViewContainerRef }),
        __metadata("design:type", ViewContainerRef)
    ], OifpsListComponent.prototype, "viewContainer", void 0);
    __decorate([
        HostListener('window:resize', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], OifpsListComponent.prototype, "update", null);
    OifpsListComponent = __decorate([
        Component({
            selector: 'app-oifps-list',
            templateUrl: './oifps-list.component.html',
            styleUrls: ['./oifps-list.component.scss']
        }),
        __metadata("design:paramtypes", [OifpService,
            FormBuilder,
            Router,
            InvestService,
            RatingService,
            DashboardService,
            ComponentFactoryResolver])
    ], OifpsListComponent);
    return OifpsListComponent;
}());
export { OifpsListComponent };
//# sourceMappingURL=oifps-list.component.js.map