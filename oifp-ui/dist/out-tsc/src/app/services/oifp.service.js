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
import { Oifp, Rating } from '../models';
import { ApiService } from '../services/shared/api.service';
import { map } from 'rxjs/operators';
var OifpService = /** @class */ (function () {
    function OifpService(apiService) {
        this.apiService = apiService;
    }
    OifpService.prototype.getOIFPs = function () {
        var _this = this;
        var path = 'oifps';
        return this.apiService.get(path).pipe(map(function (data) { return _this.oifpJsonAdopter(data); }));
    };
    OifpService.prototype.getOIFP = function (oifp_id) {
        var _this = this;
        var path = "oifps/" + oifp_id;
        return this.apiService.get(path).pipe(map(function (data) { return _this.oifpJsonAdopter(data); }));
    };
    OifpService.prototype.getOIFPSpend = function (oifp_id) {
        var path = "oifps/" + oifp_id + "/spend";
        return this.apiService.get(path);
    };
    OifpService.prototype.getOIFPRating = function (oifp_id) {
        var path = "oifps/" + oifp_id + "/ratings";
        return this.apiService.get(path);
    };
    OifpService.prototype.getInvestorOIFPRating = function (oifp_id, investor_id) {
        var path = "ratings/" + oifp_id + "/" + investor_id;
        return this.apiService.get(path);
    };
    OifpService.prototype.updateInvestorOIFPRating = function (rating_id, userRating, Investor_name, oifp_id) {
        var rating = new Rating().set(userRating, Investor_name, oifp_id);
        rating.transactionId = rating_id;
        var path = "ratings";
        return this.apiService.put(path, rating);
    };
    OifpService.prototype.createInvestorOIFPRating = function (userRating, Investor_name, oifp_id) {
        var rating = new Rating().set(userRating, Investor_name, oifp_id);
        var path = "ratings";
        return this.apiService.post(path, rating);
    };
    OifpService.prototype.oifpJsonAdopter = function (oifpData) {
        if (oifpData === void 0) { oifpData = []; }
        var oifps = [];
        if (oifpData.length === undefined) {
            oifpData = [oifpData];
        }
        for (var key in oifpData) {
            if (oifpData[key] !== undefined) {
                var data = oifpData[key];
                var oifp = new Oifp();
                oifp.id = data.oifpRegistrationNumber;
                oifp.oifp_about = data.oifpDescription;
                oifp.oifp_reg_no = data.oifpRegistrationNumber;
                oifp.oifp_name = data.oifpName;
                oifp.oifp_address = data.address;
                oifp.oifp_phone = data.contactNumber;
                oifp.oifp_email = data.contactEmail;
                oifp.oifp_icon_url = "assets/images/" + data.oifpRegistrationNumber + "/" + data.oifpRegistrationNumber + ".png";
                oifp.oifp_rating = 0;
                oifp.oifp_projects = Math.floor(Math.random() * (+40 - +10)) + +10;
                oifps.push(oifp);
            }
        }
        return oifps;
    };
    OifpService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [ApiService])
    ], OifpService);
    return OifpService;
}());
export { OifpService };
//# sourceMappingURL=oifp.service.js.map