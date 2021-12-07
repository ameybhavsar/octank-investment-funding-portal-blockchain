var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
import { Investor } from 'src/app/models';
var SessionService = /** @class */ (function () {
    function SessionService() {
    }
    SessionService.getUser = function () {
        if (window.localStorage['user']) {
            try {
                var data = JSON.parse(window.localStorage['user']);
                return new Investor().get(data.name, data.email);
            }
            catch (error) {
                return null;
            }
        }
    };
    SessionService.getValue = function (key) {
        if (key === void 0) { key = ''; }
        var value = window.localStorage[key];
        if (value && typeof value === 'string') {
            try {
                return JSON.parse(window.localStorage[key]);
            }
            catch (error) {
                // do nothing
            }
        }
        return value;
    };
    SessionService.setValue = function (key, value) {
        if (key === void 0) { key = ''; }
        if (value === void 0) { value = null; }
        if (typeof value === 'object') {
            try {
                var data = JSON.stringify(value);
                return window.localStorage[key] = data;
            }
            catch (error) {
                // do nothing
            }
        }
        return window.localStorage[key] = value;
    };
    SessionService.prototype.saveUser = function (investor) {
        var data = JSON.stringify(investor);
        window.localStorage['user'] = data;
    };
    SessionService.prototype.deleteUser = function () {
        window.localStorage.removeItem('user');
    };
    SessionService = __decorate([
        Injectable({
            providedIn: 'root'
        })
    ], SessionService);
    return SessionService;
}());
export { SessionService };
//# sourceMappingURL=session.service.js.map