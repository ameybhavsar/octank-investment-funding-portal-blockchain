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
import { Component, Input, Injectable, EventEmitter } from '@angular/core';
var RatingService = /** @class */ (function () {
    function RatingService() {
        this.ratingClick = new EventEmitter();
    }
    RatingService = __decorate([
        Injectable()
    ], RatingService);
    return RatingService;
}());
export { RatingService };
var RatingComponent = /** @class */ (function () {
    function RatingComponent(ratingService) {
        this.ratingService = ratingService;
    }
    RatingComponent.prototype.ngOnInit = function () {
        this.inputName = this.itemId + '_rating';
    };
    RatingComponent.prototype.onClick = function (rating) {
        if (this.iseditable) {
            this.rating = rating;
            this.ratingService.ratingClick.emit({
                itemId: this.itemId,
                rating: rating
            });
        }
    };
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], RatingComponent.prototype, "rating", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], RatingComponent.prototype, "itemId", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], RatingComponent.prototype, "iseditable", void 0);
    RatingComponent = __decorate([
        Component({
            selector: 'app-star-rating',
            templateUrl: './rating.component.html',
            styleUrls: ['./rating.component.scss']
        }),
        __metadata("design:paramtypes", [RatingService])
    ], RatingComponent);
    return RatingComponent;
}());
export { RatingComponent };
//# sourceMappingURL=rating.component.js.map