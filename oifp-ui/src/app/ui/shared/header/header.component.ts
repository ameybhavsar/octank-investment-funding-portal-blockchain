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
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InvestorService } from 'src/app/services/shared';
import { Investor } from 'src/app/models';
import { DashboardService } from 'src/app/services';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isVisible = false;
  currentUser: Investor = null;

  greetingMsg = 'Hello';
  investmentAmount = 0.00;
  actionButton = 'Logout';

  constructor(
    private investorService: InvestorService, private userInvestmentsService: DashboardService
  ) { }

  ngOnInit() {
    this.investorService.currentInvestor.subscribe(
      (userData) => {
        this.currentUser = userData;
      }
    );
  }

  doAction() {
    if (this.actionButton === 'Logout') {
      this.investorService.signout();
      this.currentUser = null;
    }
  }
}
