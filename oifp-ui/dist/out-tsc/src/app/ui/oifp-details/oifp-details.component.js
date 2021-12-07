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
import { Component, Input, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Oifp, Rating } from 'src/app/models';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { OifpService, InvestService, DashboardService } from 'src/app/services';
import { SessionService, UtilsService } from 'src/app/services/shared';
import { InvestorchartComponent } from 'src/app/ui/components/investorchart/investorchart.component';
var OifpDetailsComponent = /** @class */ (function () {
    function OifpDetailsComponent(oifpService, formBuilder, router, route, investService, dashboardService, 
    // private sessionService: SessionService,
    componentFactoryResolver) {
        this.oifpService = oifpService;
        this.formBuilder = formBuilder;
        this.router = router;
        this.route = route;
        this.investService = investService;
        this.dashboardService = dashboardService;
        this.componentFactoryResolver = componentFactoryResolver;
        this.oifpProjects = null;
        this.selectedOIFP = new Oifp();
        this.investForm = null;
        this.submitted = false;
        this.oifp_my_investment = 0.00;
        this.oifp_total_investment = 0.00;
        this.oifp_spend_amount = 0.00;
        this.oifp_total_investors_set = new Set();
        this.oifp_investors_amounts = new Map();
        this.userInvestmentslist = [];
        this.error = null;
        this.oifpRating = 4;
        this.oifp_investors_list = [];
        this.selected_oifp_spend_details = [];
        this.componentRef = null;
        this.loading = false;
        this.contribution_list = [];
        this.show_graph = false;
        if (this.oifp_id === null || this.oifp_id === undefined) {
            this.oifp_id = route.snapshot.params.id;
        }
    }
    Object.defineProperty(OifpDetailsComponent.prototype, "investment", {
        get: function () { return this.investForm.controls; },
        enumerable: true,
        configurable: true
    });
    OifpDetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.investForm = this.formBuilder.group({
            investmentAmount: new FormControl('', [Validators.required])
        });
        this.oifpService.getOIFP(this.oifp_id).subscribe(function (data) {
            _this.selectedOIFP = data.length > 0 ? data[0] : new Oifp();
            _this.getOIFPSpendData(_this.selectedOIFP);
            _this.getOIFPFundsDetails(_this.selectedOIFP);
            _this.setRatings(_this.selectedOIFP);
        }, function (err) {
            console.error(err);
        });
    };
    OifpDetailsComponent.prototype.getOIFPFundsDetails = function (oifp) {
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
    OifpDetailsComponent.prototype.getOifpInvestorsAmountKeys = function () {
        return Array.from(this.selectedOIFP.oifp_investor_details.keys());
    };
    OifpDetailsComponent.prototype.getOIFPSpendData = function (oifp) {
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
    OifpDetailsComponent.prototype.setRatings = function (oifp) {
        var _this = this;
        this.oifpService.getOIFPRating(oifp.id).subscribe(function (data) {
            var rating = 0;
            for (var i in data) {
                if (data[i]) {
                    rating = rating + data[i].rating;
                }
            }
            if (rating > 0) {
                rating = rating / data.length;
            }
            oifp.oifp_rating = Math.ceil(rating);
        });
        this.oifpService.getInvestorOIFPRating(oifp.id, SessionService.getUser().name).subscribe(function (data) {
            _this.userRating = new Rating();
            if (data[0]) {
                data = data[0];
            }
            _this.userRating = data;
        });
    };
    OifpDetailsComponent.prototype.makeInvestment = function () {
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
            _this.error = 'Something wrong with the investment. Will update you soon on this.';
        });
    };
    OifpDetailsComponent.prototype.getSpendData = function (spend_Id, totalamount) {
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
    OifpDetailsComponent.prototype.renderGraph = function (spend_Id, totalamount) {
        if (this.componentRef !== null) {
            this.componentRef.destroy();
        }
        this.getSpendData(spend_Id, totalamount);
    };
    __decorate([
        ViewChild('graphcontainer', { read: ViewContainerRef }),
        __metadata("design:type", ViewContainerRef)
    ], OifpDetailsComponent.prototype, "viewContainer", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], OifpDetailsComponent.prototype, "oifp_id", void 0);
    OifpDetailsComponent = __decorate([
        Component({
            selector: 'app-oifp-details',
            templateUrl: './oifp-details.component.html',
            styleUrls: ['./oifp-details.component.scss']
        }),
        __metadata("design:paramtypes", [OifpService,
            FormBuilder,
            Router,
            ActivatedRoute,
            InvestService,
            DashboardService,
            ComponentFactoryResolver])
    ], OifpDetailsComponent);
    return OifpDetailsComponent;
}());
export { OifpDetailsComponent };
//# sourceMappingURL=oifp-details.component.js.map