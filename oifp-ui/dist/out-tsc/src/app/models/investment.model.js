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
import * as uuid from 'uuid';
var Investment = /** @class */ (function () {
    function Investment() {
        this.id = null;
        this.Investor_id = null;
        this.oifp_id = null;
        this.oifp_name = null;
        this.project_id = null;
        this.status = null;
        this.amount = 0;
        this.utilized = 0;
        this.transaction_id = null;
        this.date = null;
    }
    return Investment;
}());
var Invest = /** @class */ (function () {
    function Invest() {
        this.investmentId = null;
        this.investmentAmount = null;
        this.investmentDate = null;
        this.investorUserName = null;
        this.oifpRegistrationNumber = null;
    }
    Invest.prototype.set = function (investmentAmount, investor, oifp) {
        this.investmentId = uuid.v4();
        this.investmentAmount = investmentAmount;
        this.investmentDate = '';
        this.investorUserName = investor;
        this.oifpRegistrationNumber = oifp;
        return this;
    };
    Invest.prototype.toString = function () {
        try {
            return JSON.stringify(this);
        }
        catch (error) {
            // do nothing;
        }
        return null;
    };
    return Invest;
}());
export { Investment, Invest };
//# sourceMappingURL=investment.model.js.map