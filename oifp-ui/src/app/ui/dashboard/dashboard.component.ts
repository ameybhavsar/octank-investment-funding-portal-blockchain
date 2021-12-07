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
import { Component, OnInit, HostListener } from '@angular/core';
import { DashboardService } from './../../services';
import { UtilsService } from 'src/app/services/shared';
import { Investment } from 'src/app/models';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],

})
export class DashboardComponent implements OnInit {

  constructor(private userInvestmentsService: DashboardService,
    private formBuilder: FormBuilder,
    private router: Router) { }

  userInvestmentslist: Array<Investment> = [];
  investForm: FormGroup = null;
  submitted = false;
  total_Investment = 0.00;
  month_Investment = 0.00;


  @HostListener('window:resize', ['$event'])
  update(event) { UtilsService.onHeightChange('.table-responsive'); }

  ngOnInit() {
    this.userInvestmentsService.getUserInvestments().subscribe(data => {
      this.userInvestmentslist = data;
      for (const i in data) {
        if (data[i]) {
          this.total_Investment = this.total_Investment + data[i].amount;
          if (data[i].date.getMonth === new Date().getMonth) {
            this.month_Investment = this.month_Investment + data[i].amount;
          }
        }
      }
      UtilsService.onHeightChange('.table-responsive', 50);
    },
      err => {
        console.error(err);
      }
    );
    this.investForm = this.formBuilder.group({
      invest: new FormControl('', [Validators.required])
    });
  }
}
