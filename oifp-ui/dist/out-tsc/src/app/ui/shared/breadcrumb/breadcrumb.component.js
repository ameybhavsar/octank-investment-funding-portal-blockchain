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
import { Component } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
var BreadcrumbComponent = /** @class */ (function () {
    function BreadcrumbComponent(router, activatedRoute) {
        var _this = this;
        this.router = router;
        this.breadcrumbs = [{ label: 'Dashboard', url: '/dashboard' }];
        this.router.events.subscribe(function (e) {
            if (e instanceof NavigationEnd) {
                _this.buildBreadCrumb(e.url);
            }
        });
    }
    BreadcrumbComponent.prototype.ngOnInit = function () {
    };
    BreadcrumbComponent.prototype.buildBreadCrumb = function (url) {
        var label = url.split('/')[1];
        var nextUrl = url;
        var breadcrumb = {
            label: label,
            url: nextUrl
        };
        var previousState = [];
        previousState = previousState.concat(this.breadcrumbs);
        var newState = [];
        for (var _i = 0, previousState_1 = previousState; _i < previousState_1.length; _i++) {
            var item = previousState_1[_i];
            if (item && nextUrl === item.url) {
                break;
            }
            newState = newState.concat([item]);
        }
        newState = newState.concat([breadcrumb]);
        this.breadcrumbs = newState;
    };
    BreadcrumbComponent = __decorate([
        Component({
            selector: 'app-breadcrumb',
            templateUrl: './breadcrumb.component.html',
            styleUrls: ['./breadcrumb.component.scss']
        }),
        __metadata("design:paramtypes", [Router, ActivatedRoute])
    ], BreadcrumbComponent);
    return BreadcrumbComponent;
}());
export { BreadcrumbComponent };
//# sourceMappingURL=breadcrumb.component.js.map