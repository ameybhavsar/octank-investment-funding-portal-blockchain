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
import { Component, Input, ChangeDetectorRef } from '@angular/core';
var GalleryComponent = /** @class */ (function () {
    function GalleryComponent(_cdr) {
        this._cdr = _cdr;
        this.images = [];
    }
    Object.defineProperty(GalleryComponent.prototype, "itemId", {
        set: function (value) {
            this._itemId = value;
            this._cdr.detectChanges();
            this.ngAfterViewInit();
        },
        enumerable: true,
        configurable: true
    });
    GalleryComponent.prototype.ngAfterViewInit = function () {
        this.images = [
            "assets/images/" + this._itemId + "/activities/01.jpg",
            "assets/images/" + this._itemId + "/activities/02.jpg",
            "assets/images/" + this._itemId + "/activities/03.jpg",
            "assets/images/" + this._itemId + "/activities/04.jpg",
        ];
    };
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], GalleryComponent.prototype, "itemId", null);
    GalleryComponent = __decorate([
        Component({
            selector: 'app-gallery',
            templateUrl: './gallery.component.html',
            styleUrls: ['./gallery.component.scss']
        }),
        __metadata("design:paramtypes", [ChangeDetectorRef])
    ], GalleryComponent);
    return GalleryComponent;
}());
export { GalleryComponent };
//# sourceMappingURL=gallery.component.js.map