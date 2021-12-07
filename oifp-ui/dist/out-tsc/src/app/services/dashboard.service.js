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
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Investment } from '../models';
import { OifpService } from 'src/app/services/oifp.service';
import { SessionService, ApiService, UtilsService } from 'src/app/services/shared';
var DashboardService = /** @class */ (function () {
    function DashboardService(apiService, oifpService, sessionService) {
        this.apiService = apiService;
        this.oifpService = oifpService;
        this.sessionService = sessionService;
        this.oifpMap = UtilsService.jsonToMap(SessionService.getValue('oifps'));
    }
    DashboardService.prototype.getUserInvestments = function () {
        var _this = this;
        var path = "investors/" + SessionService.getUser().name + "/investments";
        return this.apiService.get(path).pipe(map(function (data) { return _this.userInvestmentsJsonAdopter(data); }));
    };
    DashboardService.prototype.getInvestmentsByOIFP = function (oifp_id) {
        var path = "oifps/" + oifp_id + "/investments";
        return this.apiService.get(path).pipe(map(function (data) { return data; }));
    };
    DashboardService.prototype.getContributorsBySpend = function (spendId) {
        var path = "spend/" + spendId + "/spendallocations";
        return this.apiService.get(path).pipe(map(function (data) { return data; }));
    };
    DashboardService.prototype.getOIFPNameById = function (nog_id) {
        var data = this.oifpService.getOIFP(nog_id);
        if (data[0] !== undefined) {
            return data[0].oifp_name;
        }
        return null;
    };
    DashboardService.prototype.userContributionJsonAdopter = function (userContributionData) {
        if (userContributionData === void 0) { userContributionData = []; }
        var userContributions = [];
        if (userContributionData.length === undefined) {
            userContributionData = [userContributionData];
        }
        for (var key in userContributionData) {
            if (userContributionData[key] !== undefined) {
                var userContribution = userContributionData[key];
                userContributions.push(userContribution);
            }
        }
        return userContributions;
    };
    DashboardService.prototype.userInvestmentsJsonAdopter = function (userInvestmentsData) {
        if (userInvestmentsData === void 0) { userInvestmentsData = []; }
        var userInvestments = [];
        if (userInvestmentsData.length === undefined) {
            userInvestmentsData = [userInvestmentsData];
        }
        for (var key in userInvestmentsData) {
            if (userInvestmentsData[key] !== undefined) {
                var data = userInvestmentsData[key];
                var userInvestment = new Investment();
                userInvestment.id = data.investmentId;
                userInvestment.Investor_id = data.investorUserName;
                userInvestment.oifp_id = data.oifpRegistrationNumber;
                userInvestment.date = new Date(data.investmentDate);
                userInvestment.amount = data.investmentAmount;
                if (this.oifpMap.get(userInvestment.oifp_id)) {
                    userInvestment.oifp_name = this.oifpMap.get(userInvestment.oifp_id).oifp_name;
                    userInvestment.project_id = this.oifpMap.get(userInvestment.oifp_id).oifp_about;
                }
                userInvestments.push(userInvestment);
            }
        }
        return userInvestments;
    };
    DashboardService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [ApiService,
            OifpService,
            SessionService])
    ], DashboardService);
    return DashboardService;
}());
export { DashboardService };
//# sourceMappingURL=dashboard.service.js.map