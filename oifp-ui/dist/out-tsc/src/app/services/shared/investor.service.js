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
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { Investor } from '../../models';
import { SessionService } from './session.service';
import { ApiService } from './api.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { map, distinctUntilChanged } from 'rxjs/operators';
var InvestorService = /** @class */ (function () {
    function InvestorService(apiService, sessionService, route, activatedRoute) {
        var _this = this;
        this.apiService = apiService;
        this.sessionService = sessionService;
        this.route = route;
        this.activatedRoute = activatedRoute;
        this.currentInvestorSubject = new BehaviorSubject(null);
        this.currentInvestor = this.currentInvestorSubject.asObservable().pipe(distinctUntilChanged());
        this.isAuthenticatedSubject = new ReplaySubject(1);
        this.isAuthenticated = this.isAuthenticatedSubject.asObservable();
        this.currentUrl = '';
        route.events.subscribe(function (event) {
            if (event instanceof NavigationEnd) {
                _this.currentUrl = event.url;
            }
        });
    }
    InvestorService.prototype.signin = function (logindata) {
        return this.apiService.get("investors/" + logindata.username);
    };
    InvestorService.prototype.createUser = function (userdata) {
        var userData = {
            username: userdata.username,
            orgName: 'Org1'
        };
        return this.apiService.post("users", userData);
    };
    InvestorService.prototype.signup = function (userdata) {
        var reqData = {
            investorUserName: userdata.username,
            email: userdata.email,
            registeredDate: new Date().toISOString()
        };
        return this.apiService.post("investors", reqData);
    };
    InvestorService.prototype.signout = function () {
        this.purgeAuth();
        this.route.navigate(['signin']);
    };
    InvestorService.prototype.populate = function () {
        var _this = this;
        var userinfo = SessionService.getUser();
        if (userinfo) {
            this.apiService.get("investors/" + userinfo.name)
                .subscribe(function (data) {
                if (data.length > 0) {
                    var datum = data[0];
                    var investor = new Investor().get(datum.investorUserName, datum.email);
                    _this.setAuth(investor);
                    if (_this.currentUrl !== '/' || _this.currentUrl !== '/singin') {
                        _this.route.navigate(['oifplist']);
                    }
                    return;
                }
            }, function (err) {
                _this.purgeAuth();
                if (_this.currentUrl !== '/singup') {
                    _this.route.navigate(['signin']);
                }
            });
        }
        else {
            if (this.currentUrl !== '/singup') {
                this.route.navigate(['signin']);
            }
        }
    };
    InvestorService.prototype.setAuth = function (investor) {
        this.sessionService.saveUser(investor);
        this.currentInvestorSubject.next(investor);
        this.isAuthenticatedSubject.next(true);
    };
    InvestorService.prototype.purgeAuth = function () {
        this.sessionService.deleteUser();
        this.currentInvestorSubject.next(null);
        this.isAuthenticatedSubject.next(false);
    };
    InvestorService.prototype.attemptAuth = function (type, credentials) {
        var _this = this;
        var route = (type === 'login') ? '/login' : '';
        return this.apiService.get("/investors/" + credentials.name + route).pipe(map(function (data) {
            var investor = new Investor().get(data.name, data.email);
            _this.setAuth(investor);
            return investor;
        }));
    };
    InvestorService.prototype.getCurrentInvestor = function () {
        return this.currentInvestorSubject.value;
    };
    InvestorService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [ApiService,
            SessionService,
            Router,
            ActivatedRoute])
    ], InvestorService);
    return InvestorService;
}());
export { InvestorService };
//# sourceMappingURL=investor.service.js.map