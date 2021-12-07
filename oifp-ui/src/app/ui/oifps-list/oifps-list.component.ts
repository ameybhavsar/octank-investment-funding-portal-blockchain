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
import { Component, OnInit, ViewContainerRef, ViewChild, ComponentFactoryResolver, HostListener } from '@angular/core';
import { Oifp, Project, Rating } from 'src/app/models';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { SessionService, UtilsService } from 'src/app/services/shared';
import { InvestService, DashboardService, OifpService } from 'src/app/services';
import { RatingService } from '../components/rating/rating.component';
import { InvestorchartComponent } from '../components/investorchart/investorchart.component';

@Component({
  selector: 'app-oifps-list',
  templateUrl: './oifps-list.component.html',
  styleUrls: ['./oifps-list.component.scss']
})
export class OifpsListComponent implements OnInit {

  @ViewChild('graphcontainer', { read: ViewContainerRef }) viewContainer: ViewContainerRef;

  oifplist: Array<Oifp> = [];
  oifpProjects: Array<Project> = null;
  selectedOIFP: Oifp = new Oifp();
  investForm: FormGroup = null;
  submitted = false;
  error: String = null;
  oifpRating = 0;
  userRating: Rating = new Rating();
  contribution_list = [];
  spend_Id: any;
  show_graph = false;
  componentRef: any = null;
  loading = false;

  oifpMap = new Map();

  @HostListener('window:resize', ['$event'])
  update(event) { UtilsService.onHeightChange('.container-dynamic-height'); }



  constructor(private oifpService: OifpService,
    private formBuilder: FormBuilder,
    private router: Router,
    private investService: InvestService,
    private ratingService: RatingService,
    private dashboardService: DashboardService,
    private componentFactoryResolver: ComponentFactoryResolver) {
    this.ratingService.ratingClick.subscribe(
      (data: any) => {
        const currentInvestor = SessionService.getUser().name;
        this.selectedOIFP.oifp_user_rating = data.rating;
        this.oifpService.createInvestorOIFPRating(data.rating, currentInvestor, this.selectedOIFP.oifp_reg_no).subscribe(
          resp => { }
        );
      });
  }

  ngOnInit() {
    this.oifpService.getOIFPs().subscribe(data => {
      this.oifplist = data;
      this.oifplist.forEach(element => {
        this.setRatings(element);
        this.getOIFPFundsDetails(element);
        this.getOIFPSpendData(element);
        this.oifpMap.set(element.id, element);
      });
      this.selectedOIFP = this.oifplist.length > 0 ? this.oifpMap.get(this.oifplist[0].id) : new Oifp();
      setTimeout(() => {
        const oifp_data = UtilsService.mapToJson(this.oifpMap);
        SessionService.setValue('oifps', oifp_data);
      }, 1000);
      // set height dynimically
      UtilsService.onHeightChange('.container-dynamic-height', 20);

    },
      err => {
        console.error(err);
      }
    );
    this.investForm = this.formBuilder.group({
      investmentAmount: new FormControl('', [Validators.required])
    });

  }

  getOIFPFundsDetails(oifp: Oifp) {
    this.dashboardService.getInvestmentsByOIFP(oifp.id).subscribe(oifp_data => {
      let oifp_total_investment = 0.00;
      const oifp_total_investors_set = new Set();
      const oifp_investors_amounts = new Map();
      for (const i in oifp_data) {
        if (oifp_data[i]) {
          oifp_total_investment = oifp_total_investment + oifp_data[i].investmentAmount;
          if (!oifp_total_investors_set.has(oifp_data[i].investorUserName)) {
            oifp_total_investors_set.add(oifp_data[i].investorUserName);
          }
          const investor_name = oifp_data[i].investorUserName;
          if (!oifp_investors_amounts.has(investor_name)) {
            oifp_investors_amounts.set(investor_name, oifp_data[i].investmentAmount);
          } else {
            oifp_investors_amounts.set(investor_name, oifp_data[i].investmentAmount + oifp_investors_amounts.get(investor_name));
          }
        }
      }
      const user_investment = oifp_investors_amounts.get(SessionService.getUser().name);
      oifp.oifp_investments = oifp_total_investment;
      oifp.oifp_Investors = oifp_total_investors_set.size;
      oifp.oifp_investor_details = oifp_investors_amounts;
      oifp.oifp_user_investments = user_investment ? user_investment : 0;
      return oifp;
    });
  }

  getOifpInvestorsAmountKeys() {
    return Array.from(this.selectedOIFP.oifp_investor_details.keys());
  }

  getOIFPSpendData(oifp: Oifp) {
    this.oifpService.getOIFPSpend(oifp.id).subscribe(oifpspenddata => {
      let oifp_spend_amount = 0;
      const oifp_spend_data = [];
      for (const i in oifpspenddata) {
        if (oifpspenddata[i] && oifpspenddata[i].docType === 'spend') {
          oifp_spend_amount = oifp_spend_amount + oifpspenddata[i].spendAmount;
          oifp_spend_data.push(oifpspenddata[i]);
        }
      }
      oifp.oifp_fund_utilized = oifp_spend_amount;
      oifp.oifp_spend_details = oifp_spend_data;
    },
      err => {
        console.error(err);
      }
    );
    return oifp;
  }

  setRatings(oifp: Oifp) {
    this.oifpService.getOIFPRating(oifp.id).subscribe(
      data => {
        let rating = 0;
        for (const i in data) {
          if (data[i]) {
            rating = rating + data[i].rating;
            if (SessionService.getUser().name === data[i].investorUserName) {
              oifp.oifp_user_rating = data[i].rating;
            }
          }
        }
        if (rating > 0) {
          rating = rating / data.length;
        }
        oifp.oifp_rating = Math.ceil(rating);
      });
  }
  onOIFPSelect(oifp) {
    this.selectedOIFP = oifp;
    this.setRatings(oifp);
    this.getOIFPFundsDetails(oifp);
    this.getOIFPSpendData(oifp);
    return;
  }

  get investment() { return this.investForm.controls; }

  onInvest() {
    if (this.loading) { return; }
    this.loading = true;
    this.submitted = true;
    if (this.investForm.invalid) {
      return;
    }
    this.investService.makeInvestment(this.selectedOIFP.oifp_reg_no, SessionService.getUser().name, this.investForm.value.investmentAmount)
      .subscribe(
        data => {
          this.router.navigate([`invest/${data.investmentId}`]);
        },
        err => {
          this.loading = false;
          console.error(err);
          this.error = 'Something wrong with the investment. Will update you soon on this.';
        }
      );
  }

  getSpendData(spend_Id, totalamount) {
    this.dashboardService.getContributorsBySpend(spend_Id).subscribe(
      data => {
        if (data.length > 0) {
          const operations = [];
          for (let i = 0; i < data.length; i++) {
            const operation = {
              spendAllocationId: data[i].spendAllocationId,
              investment: UtilsService.formatFloat(data[i].spendAllocationAmount, 4),
              name: 'Investor ' + i
            };
            operations.push(operation);
          }
          setTimeout(() => {
            const factory = this.componentFactoryResolver.resolveComponentFactory(InvestorchartComponent);
            this.componentRef = this.viewContainer.createComponent(factory);
            this.componentRef.instance.data = operations;
            this.componentRef.instance.total = totalamount;
            this.show_graph = true;
          }, 500);
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  renderGraph(spend_Id, totalamount) {
    if (this.componentRef !== null) {
      this.componentRef.destroy();
    }
    this.getSpendData(spend_Id, totalamount);
  }
}
