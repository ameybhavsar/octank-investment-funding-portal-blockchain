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
var Oifp = /** @class */ (function () {
    function Oifp() {
        this.id = null;
        this.oifp_name = null;
        this.oifp_reg_no = null;
        this.oifp_address = null;
        this.oifp_phone = null;
        this.oifp_email = null;
        this.oifp_website = null;
        this.oifp_Investors = 0;
        this.oifp_investments = 0;
        this.oifp_fund_utilized = 0;
        this.oifp_projects = 0;
        this.oifp_active_projects = 0;
        this.oifp_on_hold_projects = 0;
        this.oifp_complete_projects = 0;
        this.oifp_about = null;
        this.oifp_project_details = null;
        this.oifp_rating = 0;
        this.oifp_user_rating = 0;
        this.oifp_funds_details = null;
        this.oifp_user_investments = 0.00;
        this.oifp_investor_details = new Map();
        this.oifp_spend_details = [];
        this.oifp_investors_list = [];
    }
    return Oifp;
}());
var Rating = /** @class */ (function () {
    function Rating() {
        this.ratingId = null;
        this.rating = 0;
        this.investorUserName = null;
        this.oifpRegistrationNumber = null;
        this.ratingDate = new Date();
        this.transactionId = null;
    }
    Rating.prototype.set = function (rating, investor, oifp) {
        this.investorUserName = "" + investor;
        this.oifpRegistrationNumber = "" + oifp;
        this.rating = rating;
        this.ratingId = uuid.v4();
        return this;
    };
    Rating.prototype.toString = function () {
        try {
            return JSON.stringify(this);
        }
        catch (error) {
            // do nothing;
        }
        return null;
    };
    return Rating;
}());
export { Oifp, Rating };
//# sourceMappingURL=oifp.model.js.map