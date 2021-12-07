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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InvestorService } from 'src/app/services/shared';
import { Validators, FormBuilder, FormControl } from '@angular/forms';
import { Investor } from 'src/app/models';
var SigninComponent = /** @class */ (function () {
    function SigninComponent(formBuilder, router, userService) {
        this.formBuilder = formBuilder;
        this.router = router;
        this.userService = userService;
        this.submitted = false;
        this.error = null;
        this.loading = false;
    }
    SigninComponent.prototype.ngOnInit = function () {
        this.userForm = this.formBuilder.group({
            username: new FormControl('', {
                validators: Validators.compose([Validators.required,
                    Validators.minLength(4), Validators.maxLength(20)]),
                updateOn: 'blur'
            })
        });
    };
    Object.defineProperty(SigninComponent.prototype, "user", {
        get: function () { return this.userForm.controls; },
        enumerable: true,
        configurable: true
    });
    SigninComponent.prototype.login = function () {
        var _this = this;
        if (this.loading) {
            return;
        }
        this.error = null;
        this.submitted = true;
        this.loading = true;
        if (this.userForm.invalid) {
            this.loading = false;
            return;
        }
        var user = this.userForm.value;
        var resp = this.userService.signin(user).subscribe(function (data) {
            var fistrecord = data[0];
            var investor = new Investor().get(fistrecord.investorUserName, fistrecord.email);
            _this.userService.setAuth(investor);
            _this.router.navigate(['oifplist']);
        }, function (err) {
            _this.loading = false;
            _this.error = 'User not found';
        });
    };
    SigninComponent = __decorate([
        Component({
            selector: 'app-signin',
            templateUrl: './signin.component.html',
            styleUrls: ['./signin.component.scss']
        }),
        __metadata("design:paramtypes", [FormBuilder,
            Router,
            InvestorService])
    ], SigninComponent);
    return SigninComponent;
}());
export { SigninComponent };
//# sourceMappingURL=signin.component.js.map