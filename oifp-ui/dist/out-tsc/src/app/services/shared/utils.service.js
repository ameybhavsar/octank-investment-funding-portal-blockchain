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
var UtilsService = /** @class */ (function () {
    function UtilsService() {
    }
    UtilsService.onHeightChange = function (elementtoResize, offset) {
        if (offset === void 0) { offset = 50; }
        var x = $(elementtoResize).offset();
        var setElementHtTo = $(window).height() - x.top - offset;
        $(elementtoResize).css({ 'max-height': setElementHtTo });
    };
    UtilsService.mapToJson = function (map) {
        var josnObj = {};
        Array.from(map.entries()).forEach(function (entry) {
            josnObj[entry[0]] = JSON.stringify(entry[1]);
        });
        return josnObj;
    };
    UtilsService.jsonToMap = function (json) {
        if (json) {
            var mapObj_1 = new Map();
            Object.keys(json).forEach(function (key) {
                mapObj_1.set(key, JSON.parse(json[key]));
            });
            return mapObj_1;
        }
    };
    UtilsService.formatFloat = function (floatStr, offset) {
        if (offset === void 0) { offset = 4; }
        floatStr = String(floatStr);
        try {
            var decimalIndex = floatStr.indexOf('.');
            if (decimalIndex > 0 && floatStr.length > decimalIndex + offset) {
                return parseFloat(floatStr.substring(0, decimalIndex + offset));
            }
            return parseFloat(floatStr);
        }
        catch (e) {
            console.error("Cant format string " + floatStr + " to float");
            return 0.0;
        }
    };
    UtilsService = __decorate([
        Injectable({
            providedIn: 'root'
        })
    ], UtilsService);
    return UtilsService;
}());
export { UtilsService };
//# sourceMappingURL=utils.service.js.map