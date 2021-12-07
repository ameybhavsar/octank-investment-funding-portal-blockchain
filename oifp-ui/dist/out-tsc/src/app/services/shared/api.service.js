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
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
var ApiService = /** @class */ (function () {
    function ApiService(http) {
        this.http = http;
    }
    ApiService.prototype.setHeaders = function () {
        var headersConfig = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        return new HttpHeaders(headersConfig);
    };
    ApiService.prototype.setHeadersCustomer = function () {
        var headersConfig = {
            'Content-Type': 'application/json',
            'Token': ' bla bla '
        };
        return new Headers(headersConfig);
    };
    ApiService.prototype.formatErrors = function (error) {
        var err_msg = (error.message) ? error.message : error.status ? error.status + " - " + error.statusText : 'Server error';
        return throwError(error);
    };
    ApiService.prototype.get = function (path, params) {
        if (params === void 0) { params = new HttpParams(); }
        return this.http.get("" + environment.api_url + path, { headers: this.setHeaders(), params: params }).
            pipe(map(function (response) { return response; }), catchError(this.formatErrors));
    };
    ApiService.prototype.put = function (path, body) {
        var _this = this;
        if (body === void 0) { body = {}; }
        return this.http.put("" + environment.api_url + path, JSON.stringify(body), { headers: this.setHeaders() }).pipe(map(function (response) { return response; }), catchError(function (error) { return _this.formatErrors(error); }));
    };
    ApiService.prototype.post = function (path, body) {
        if (body === void 0) { body = {}; }
        return this.http.post("" + environment.api_url + path, JSON.stringify(body), { headers: this.setHeaders() }).pipe(map(function (response) { return response; }), catchError(this.formatErrors));
    };
    ApiService.prototype.delete = function (path) {
        return this.http.delete("" + environment.api_url + path, { headers: this.setHeaders() }).pipe(map(function (response) { return response; }), catchError(this.formatErrors));
    };
    ApiService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        Injectable(),
        __metadata("design:paramtypes", [HttpClient])
    ], ApiService);
    return ApiService;
}());
export { ApiService };
//# sourceMappingURL=api.service.js.map