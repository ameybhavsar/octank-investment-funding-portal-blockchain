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

class Oifp {
    id: string = null;
    oifp_name: string = null;
    oifp_reg_no: string = null;
    oifp_address: string = null;
    oifp_phone: string = null;
    oifp_email: string = null;
    oifp_website: string = null;
    oifp_Investors = 0;
    oifp_investments = 0;
    oifp_fund_utilized = 0;
    oifp_projects = 0;
    oifp_active_projects = 0;
    oifp_on_hold_projects = 0;
    oifp_complete_projects = 0;
    oifp_about: string = null;
    oifp_project_details: string = null;
    oifp_icon_url: string;
    oifp_gallary_url: string;
    oifp_rating = 0;
    oifp_user_rating = 0;

    oifp_funds_details = null;
    oifp_user_investments = 0.00;
    oifp_investor_details = new Map();
    oifp_spend_details = [];
    oifp_investors_list = [];
}

class Rating {
    ratingId: string = null;
    rating = 0;
    investorUserName: string = null;
    oifpRegistrationNumber: string = null;
    ratingDate = new Date();
    transactionId: string = null;


    constructor() {
    }

    set(rating: number, investor: string, oifp: string) {
        this.investorUserName = `${investor}`;
        this.oifpRegistrationNumber = `${oifp}`;
        this.rating = rating;
        this.ratingId = uuid.v4();
        return this;
    }

    toString() {
        try {
            return JSON.stringify(this);
        } catch (error) {
            // do nothing;
        }
        return null;
    }
}
export { Oifp, Rating };
