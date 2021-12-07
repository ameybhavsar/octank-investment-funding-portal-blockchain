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

class Investment {
    id: string = null;
    Investor_id: string = null;
    oifp_id: string = null;
    oifp_name: string = null;
    project_id: string = null;
    status: string = null;
    amount = 0;
    utilized = 0;
    transaction_id: string = null;
    date: Date = null;
}
class Invest {
    investmentId: string = null;
    investmentAmount: number = null;
    investmentDate: string = null;
    investorUserName: string = null;
    oifpRegistrationNumber: string = null;
    constructor() {

    }

    set(investmentAmount: number, investor: string, oifp: string) {
        this.investmentId = uuid.v4();
        this.investmentAmount = investmentAmount;
        this.investmentDate = '';
        this.investorUserName = investor;
        this.oifpRegistrationNumber = oifp;
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
export { Investment, Invest };
