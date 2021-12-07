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
var SignupComponent = /** @class */ (function () {
    function SignupComponent(formBuilder, router, userService) {
        this.formBuilder = formBuilder;
        this.router = router;
        this.userService = userService;
        this.submitted = false;
        this.error = null;
        this.loading = false;
    }
    SignupComponent.prototype.ngOnInit = function () {
        this.userForm = this.formBuilder.group({
            username: new FormControl('', {
                validators: Validators.compose([Validators.required,
                    Validators.minLength(4), Validators.maxLength(20)]),
                updateOn: 'blur'
            }),
            email: new FormControl('', Validators.compose([
                Validators.required,
                Validators.email
            ]))
        });
    };
    Object.defineProperty(SignupComponent.prototype, "user", {
        get: function () { return this.userForm.controls; },
        enumerable: true,
        configurable: true
    });
    SignupComponent.prototype.signup = function () {
        var _this = this;
        if (this.loading) {
            return;
        }
        this.loading = true;
        this.submitted = true;
        if (this.userForm.invalid) {
            this.loading = false;
            return;
        }
        var user = this.userForm.value;
        this.userService.createUser(user).subscribe(function (data) {
            if (data.success) {
                _this.userService.signup(user).subscribe(function (resp) {
                    _this.router.navigate(['signin']);
                    return;
                }, function (err) {
                    _this.loading = false;
                    _this.error = err.statusText;
                });
            }
            else {
                _this.loading = false;
                _this.error = 'Username or email already in use!';
            }
        }, function (err) {
            _this.loading = false;
            _this.error = err.statusText + ". Ensure you are using HTTP, not HTTPS, to access the site.";
        });
    };
    SignupComponent = __decorate([
        Component({
            selector: 'app-signup',
            templateUrl: './signup.component.html',
            styleUrls: ['./signup.component.scss']
        }),
        __metadata("design:paramtypes", [FormBuilder,
            Router,
            InvestorService])
    ], SignupComponent);
    return SignupComponent;
}());
export { SignupComponent };
//# sourceMappingURL=signup.component.js.map