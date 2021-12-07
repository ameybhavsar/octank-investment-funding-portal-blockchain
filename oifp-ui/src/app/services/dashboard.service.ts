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
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Investment } from '../models';
import { OifpService } from 'src/app/services/oifp.service';
import { SessionService, ApiService, UtilsService } from 'src/app/services/shared';

import { Contribution } from '../ui/components/investorchart/contribution';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  oifpMap = UtilsService.jsonToMap(SessionService.getValue('oifps'));

  constructor(private apiService: ApiService,
    private oifpService: OifpService,
    private sessionService: SessionService) { }

  getUserInvestments() {
    const path = `investors/${SessionService.getUser().name}/investments`;
    return this.apiService.get(path).pipe(map(data => this.userInvestmentsJsonAdopter(data)));
  }

  getInvestmentsByOIFP(oifp_id) {
    const path = `oifps/${oifp_id}/investments`;
    return this.apiService.get(path).pipe(map(data => data));
  }

  getContributorsBySpend(spendId) {
    const path = `spend/${spendId}/spendallocations`;
    return this.apiService.get(path).pipe(map(data => data));
  }

  getOIFPNameById(nog_id: string) {
    const data = this.oifpService.getOIFP(nog_id);
    if (data[0] !== undefined) {
      return data[0].oifp_name;
    }
    return null;
  }

  userContributionJsonAdopter(userContributionData: any = []) {
    const userContributions: Array<Contribution> = [];

    if (userContributionData.length === undefined) {
      userContributionData = [userContributionData];
    }
    for (const key in userContributionData) {
      if (userContributionData[key] !== undefined) {
        const userContribution = <Contribution>userContributionData[key];
        userContributions.push(userContribution);
      }
    }
    return userContributions;
  }

  userInvestmentsJsonAdopter(userInvestmentsData: any = []) {
    const userInvestments: Array<Investment> = [];

    if (userInvestmentsData.length === undefined) {
      userInvestmentsData = [userInvestmentsData];
    }
    for (const key in userInvestmentsData) {
      if (userInvestmentsData[key] !== undefined) {
        const data = userInvestmentsData[key];
        const userInvestment: Investment = new Investment();

        userInvestment.id = data.investmentId;
        userInvestment.Investor_id = data.investorUserName;
        userInvestment.oifp_id = data.oifpRegistrationNumber;
        userInvestment.date = new Date(data.investmentDate);
        userInvestment.amount = data.investmentAmount;
        if (this.oifpMap.get(userInvestment.oifp_id)) {
          userInvestment.oifp_name = this.oifpMap.get(userInvestment.oifp_id).oifp_name;
          userInvestment.project_id = this.oifpMap.get(userInvestment.oifp_id).oifp_about;
        }
        userInvestments.push(userInvestment);
      }
    }
    return userInvestments;
  }
}
