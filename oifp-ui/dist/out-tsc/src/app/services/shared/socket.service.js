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
import { Injectable, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
var SocketService = /** @class */ (function () {
    function SocketService() {
        this.messages = new Subject();
        this.newMessage = new EventEmitter();
    }
    SocketService.prototype.connect = function (url) {
        if (!this.subject) {
            this.subject = this.create(url);
        }
        return this.subject;
    };
    SocketService.prototype.create = function (url) {
        var _this = this;
        this.ws = new WebSocket(url);
        var observable = Observable.create(function (obs) {
            _this.ws.onmessage = obs.next.bind(obs);
            _this.ws.onerror = obs.error.bind(obs);
            _this.ws.onclose = obs.complete.bind(obs);
            return _this.ws.close.bind(_this.ws);
        });
        var observer = {
            next: function (data) {
                if (_this.ws.readyState === WebSocket.OPEN) {
                    _this.ws.send(JSON.stringify(data));
                }
            }
        };
        return Subject.create(observer, observable);
    };
    SocketService.prototype.close = function () {
        this.ws.close();
        this.subject = null;
    };
    SocketService = __decorate([
        Injectable({
            providedIn: 'root'
        })
    ], SocketService);
    return SocketService;
}());
export { SocketService };
//# sourceMappingURL=socket.service.js.map