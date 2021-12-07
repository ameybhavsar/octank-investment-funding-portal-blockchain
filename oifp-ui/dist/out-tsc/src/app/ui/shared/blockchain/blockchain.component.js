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
import { Subject } from 'rxjs';
import { SocketService } from 'src/app/services/shared/socket.service';
import { environment } from 'src/environments/environment';
import { InvestorService } from 'src/app/services/shared';
var BlockchainComponent = /** @class */ (function () {
    function BlockchainComponent(socketService, InvestorService) {
        this.socketService = socketService;
        this.InvestorService = InvestorService;
        this.error = null;
        this.connection = null;
        this.messageProducer = null;
        this.messages = new Subject();
        this.currentUser = null;
        this.content = 'Test Data';
        this.blockchain = [{
                caption: '0',
                date: new Date(),
                selected: true,
                title: 'Login',
                txCount: 0,
                txInBlock: []
            },
        ];
    }
    BlockchainComponent.prototype.setBlockChain = function (newdata) {
        this.blockchain = newdata;
    };
    BlockchainComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.messages = this.socketService.connect(environment.socket_url);
        this.messages.subscribe(function (message) {
            _this.processMessage(message);
        });
        setInterval(function () {
            try {
                _this.messages.next('ping');
            }
            catch (e) {
                console.error(e);
            }
        }, 1000);
        this.InvestorService.currentInvestor.subscribe(function (userData) {
            _this.currentUser = userData;
        });
    };
    BlockchainComponent.prototype.processError = function (error) {
        console.error(error);
    };
    BlockchainComponent.prototype.processMessage = function (message) {
        var jsonobj = null;
        try {
            var resp_data = JSON.parse(message.data);
            var message_obj = {
                caption: resp_data.blockNumber,
                date: new Date(1 / 1 / 2019),
                selected: true,
                title: resp_data.txCount,
                txCount: resp_data.txCount,
                txInBlock: resp_data.txInBlock
            };
            jsonobj = message_obj;
        }
        catch (e) {
            console.error('Invalid JSON: ', message.data);
            return;
        }
        if (jsonobj) {
            this.updateData(jsonobj);
        }
        else {
            console.error('Hmm..., I\'ve never seen JSON like this:', jsonobj);
        }
    };
    BlockchainComponent.prototype.updateData = function (block) {
        var data = this.blockchain;
        var len = data.length;
        if (data && data[len - 1].caption !== block.caption) {
            if (len > 0 && data[len - 1]) {
                (data[len - 1]).selected = null;
            }
            data.push(block);
            this.setBlockChain(data);
            this.socketService.newMessage.emit({
                data: this.blockchain
            });
        }
    };
    BlockchainComponent = __decorate([
        Component({
            selector: 'app-blockchain',
            templateUrl: './blockchain.component.html',
            styleUrls: ['./blockchain.component.scss']
        }),
        __metadata("design:paramtypes", [SocketService,
            InvestorService])
    ], BlockchainComponent);
    return BlockchainComponent;
}());
export { BlockchainComponent };
//# sourceMappingURL=blockchain.component.js.map