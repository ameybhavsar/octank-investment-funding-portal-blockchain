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
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, QueryList, ViewChild, ViewChildren, } from '@angular/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { SocketService } from 'src/app/services/shared/socket.service';
var BlockchainProgressComponent = /** @class */ (function () {
    function BlockchainProgressComponent(detectChange, socketService) {
        var _this = this;
        this.detectChange = detectChange;
        this.socketService = socketService;
        this.prevLinkInactive = true;
        this.nextLinkInactive = false;
        this.loaded = false;
        this.selectedIndex = 0;
        this.eventsWrapperWidth = 0;
        this._viewInitialized = false;
        this.blockEventsWidth = 720;
        this.blockEventsGap = 100;
        this.socketService.newMessage.subscribe(function (data) {
            try {
                detectChange.detectChanges();
                _this.ngAfterViewInit();
            }
            catch (ex) {
                console.error(ex);
            }
        });
    }
    BlockchainProgressComponent_1 = BlockchainProgressComponent;
    Object.defineProperty(BlockchainProgressComponent.prototype, "blockElements", {
        get: function () {
            return this._blockElements;
        },
        set: function (value) {
            this._blockElements = value;
            this.initView();
        },
        enumerable: true,
        configurable: true
    });
    BlockchainProgressComponent.pxToNumber = function (val) {
        return Number(val.replace('px', ''));
    };
    BlockchainProgressComponent.getElementWidth = function (element) {
        var computedStyle = window.getComputedStyle(element);
        if (!computedStyle.width) {
            return 0;
        }
        return BlockchainProgressComponent_1.pxToNumber(computedStyle.width);
    };
    BlockchainProgressComponent.parentElement = function (element, tagName) {
        if (!element || !element.parentNode) {
            return null;
        }
        var parent = element.parentNode;
        while (true) {
            if (parent.tagName.toLowerCase() === tagName) {
                return parent;
            }
            parent = parent.parentNode;
            if (!parent) {
                return null;
            }
        }
    };
    BlockchainProgressComponent.getTranslateValue = function (block) {
        var blockStyle = window.getComputedStyle(block);
        var blockTranslate = blockStyle.getPropertyValue('-webkit-transform') ||
            blockStyle.getPropertyValue('-moz-transform') ||
            blockStyle.getPropertyValue('-ms-transform') ||
            blockStyle.getPropertyValue('-o-transform') ||
            blockStyle.getPropertyValue('transform');
        var translateValue = 0;
        if (blockTranslate.indexOf('(') >= 0) {
            var blockTranslateStr = blockTranslate
                .split('(')[1]
                .split(')')[0]
                .split(',')[4];
            translateValue = Number(blockTranslateStr);
        }
        return translateValue;
    };
    BlockchainProgressComponent.setTransformValue = function (element, property, value) {
        element.style['-webkit-transform'] = property + '(' + value + ')';
        element.style['-moz-transform'] = property + '(' + value + ')';
        element.style['-ms-transform'] = property + '(' + value + ')';
        element.style['-o-transform'] = property + '(' + value + ')';
        element.style['transform'] = property + '(' + value + ')';
    };
    BlockchainProgressComponent.dayDiff = function (first, second) {
        return Math.round(second.getTime() - first.getTime());
    };
    BlockchainProgressComponent.minLapse = function (elements) {
        if (elements && elements.length && elements.length === 1) {
            return 0;
        }
        var result = 0;
        for (var i = 1; i < elements.length; i++) {
            var distance = BlockchainProgressComponent_1.dayDiff(elements[i - 1].date, elements[i].date);
            result = result ? Math.min(result, distance) : distance;
        }
        return result;
    };
    BlockchainProgressComponent.prototype.ngAfterViewInit = function () {
        this.detectChange.detach();
        this._viewInitialized = true;
        this.initView();
        $('[data-toggle="tooltip"]').tooltip();
    };
    BlockchainProgressComponent.prototype.initBlockChain = function (blockChains) {
        var blockEventsMinDist = 100;
        this.setBlockPosition(blockChains, this.blockEventsGap, blockEventsMinDist);
        this.setBlockChainWidth(blockChains, this.blockEventsGap, blockEventsMinDist);
        this.loaded = true;
    };
    BlockchainProgressComponent.prototype.onBlocksScrollChange = function (e, right) {
        e.preventDefault();
        this.updateBlocksVisibility(this.eventsWrapperWidth, right);
        this.detectChange.detectChanges();
    };
    BlockchainProgressComponent.prototype.updateBlocksVisibility = function (blockTotWidth, right) {
        var translateValue = BlockchainProgressComponent_1.getTranslateValue(this.eventsWrapper.nativeElement);
        if (right) {
            this.translateBlockChain(translateValue - this.blockEventsWidth + this.blockEventsGap, this.blockEventsWidth - blockTotWidth);
        }
        else {
            this.translateBlockChain(translateValue + this.blockEventsWidth - this.blockEventsGap, null);
        }
    };
    BlockchainProgressComponent.prototype.translateBlockChain = function (value, totWidth) {
        value = (value > 0) ? 0 : value;
        value = (!(totWidth === null) && value < totWidth) ? totWidth : value;
        BlockchainProgressComponent_1.setTransformValue(this.eventsWrapper.nativeElement, 'translateX', value + 'px');
        this.prevLinkInactive = value === 0;
        this.nextLinkInactive = value === totWidth;
    };
    BlockchainProgressComponent.prototype.updateBlockChainPosition = function (element) {
        var eventStyle = window.getComputedStyle(element);
        var eventLeft = BlockchainProgressComponent_1.pxToNumber(eventStyle.getPropertyValue('left'));
        var translateValue = BlockchainProgressComponent_1.getTranslateValue(this.eventsWrapper.nativeElement);
        if (eventLeft > this.blockEventsWidth - translateValue) {
            this.translateBlockChain(-eventLeft + this.blockEventsWidth / 2, this.blockEventsWidth - this.eventsWrapperWidth);
        }
    };
    BlockchainProgressComponent.prototype.setBlockChainWidth = function (elements, width, blockEventsMinDist) {
        var timeSpan = 100;
        if (elements.length > 2) {
            timeSpan = timeSpan * elements.length;
        }
        else {
            timeSpan = 350;
        }
        var timeSpanNorm = timeSpan / blockEventsMinDist;
        timeSpanNorm = Math.round(timeSpanNorm) + 4;
        this.eventsWrapperWidth = timeSpanNorm * width;
        var aHref = this.eventsWrapper.nativeElement.querySelectorAll('img.selected')[0];
        this.updateConnectBlocks(aHref);
        this.updateBlockChainPosition(aHref);
        return this.eventsWrapperWidth;
    };
    BlockchainProgressComponent.prototype.updateConnectBlocks = function (element) {
        var eventStyle = window.getComputedStyle(element);
        var eventLeft = eventStyle.getPropertyValue('left');
        var eventWidth = eventStyle.getPropertyValue('width');
        var eventLeftNum = BlockchainProgressComponent_1.pxToNumber(eventLeft) + BlockchainProgressComponent_1.pxToNumber(eventWidth) / 2;
        var scaleValue = eventLeftNum / this.eventsWrapperWidth;
        BlockchainProgressComponent_1.setTransformValue(this.connectBlocks.nativeElement, 'scaleX', scaleValue);
    };
    BlockchainProgressComponent.prototype.setBlockPosition = function (elements, min, blockEventsMinDist) {
        var blockEventsArray = this.blockEvents.toArray();
        var i = 0;
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
            var component = elements_1[_i];
            var distance = 100 * i + 1;
            var distanceNorm = Math.round(distance / blockEventsMinDist);
            blockEventsArray[i].nativeElement.style.left = distanceNorm * min + 'px';
            blockEventsArray[i].nativeElement.children[0].style.left = distanceNorm * min + 'px';
            var span = blockEventsArray[i].nativeElement.parentElement.children[1];
            var spanWidth = BlockchainProgressComponent_1.getElementWidth(span);
            span.style.left = distanceNorm * min - 8 + 'px';
            i++;
        }
    };
    BlockchainProgressComponent.prototype.initView = function () {
        if (!this._viewInitialized) {
            return;
        }
        if (this._blockElements && this._blockElements.length) {
            for (var i = 0; i < this._blockElements.length; i++) {
                if (this._blockElements[i].selected) {
                    this.selectedIndex = i;
                    break;
                }
            }
            this.initBlockChain(this._blockElements);
        }
        this.detectChange.detectChanges();
    };
    BlockchainProgressComponent.prototype.getTransections = function (item) {
        var translist = '';
        for (var i = 0; i < item.txInBlock.length; i++) {
            translist += "<em> " + item.txInBlock[i] + "</em><br>";
        }
        return "<span>Transaction Count:" + item.txCount + "</span><br><span>Transaction Blocks<span><br>" + translist;
    };
    var BlockchainProgressComponent_1;
    __decorate([
        ViewChild('eventsWrapper'),
        __metadata("design:type", ElementRef)
    ], BlockchainProgressComponent.prototype, "eventsWrapper", void 0);
    __decorate([
        ViewChild('connectBlocks'),
        __metadata("design:type", ElementRef)
    ], BlockchainProgressComponent.prototype, "connectBlocks", void 0);
    __decorate([
        ViewChildren('blockEvents'),
        __metadata("design:type", QueryList)
    ], BlockchainProgressComponent.prototype, "blockEvents", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [Array])
    ], BlockchainProgressComponent.prototype, "blockElements", null);
    BlockchainProgressComponent = BlockchainProgressComponent_1 = __decorate([
        Component({
            selector: 'app-blockchain-progress',
            templateUrl: './blockchain-progress.component.html',
            styleUrls: ['./blockchain-progress.component.scss'],
            changeDetection: ChangeDetectionStrategy.OnPush,
            animations: [
                trigger('contentState', [
                    state('active', style({
                        position: 'relative', 'z-index': 2, opacity: 1,
                    })),
                    transition('right => active', [
                        style({
                            transform: 'translateX(100%)'
                        }),
                        animate('400ms ease-in-out', keyframes([
                            style({ opacity: 0, transform: 'translateX(100%)', offset: 0 }),
                            style({ opacity: 1, transform: 'translateX(0%)', offset: 1.0 })
                        ]))
                    ]),
                    transition('active => right', [
                        style({
                            transform: 'translateX(-100%)'
                        }),
                        animate('400ms ease-in-out', keyframes([
                            style({ opacity: 1, transform: 'translateX(0%)', offset: 0 }),
                            style({ opacity: 0, transform: 'translateX(100%)', offset: 1.0 })
                        ]))
                    ]),
                    transition('active => left', [
                        style({
                            transform: 'translateX(-100%)'
                        }),
                        animate('400ms ease-in-out', keyframes([
                            style({ opacity: 1, transform: 'translateX(0%)', offset: 0 }),
                            style({ opacity: 0, transform: 'translateX(-100%)', offset: 1.0 })
                        ]))
                    ]),
                    transition('left => active', [
                        style({
                            transform: 'translateX(100%)'
                        }),
                        animate('400ms ease-in-out', keyframes([
                            style({ opacity: 0, transform: 'translateX(-100%)', offset: 0 }),
                            style({ opacity: 1, transform: 'translateX(0%)', offset: 1.0 })
                        ]))
                    ]),
                ])
            ]
        }),
        __metadata("design:paramtypes", [ChangeDetectorRef, SocketService])
    ], BlockchainProgressComponent);
    return BlockchainProgressComponent;
}());
export { BlockchainProgressComponent };
//# sourceMappingURL=blockchain-progress.component.js.map