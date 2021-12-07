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
import { ApiService } from './shared';
import { Invest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class InvestService {

  constructor(private apiService: ApiService) { }

  makeInvestment(oifpName: string, InvestorUserName: string, investmentAmount: number) {
    const invest = new Invest().set(investmentAmount, InvestorUserName, oifpName);
    invest.investmentDate = new Date().toISOString();
    const path = `investments`;
    return this.apiService.post(path, invest);
  }
}
