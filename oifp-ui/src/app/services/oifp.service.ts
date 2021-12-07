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
import { Project, Oifp, Rating } from '../models';
import { ApiService } from '../services/shared/api.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OifpService {

  constructor(private apiService: ApiService) {

  }

  getOIFPs() {
    const path = 'oifps';
    return this.apiService.get(path).pipe(map(data => this.oifpJsonAdopter(data)));
  }

  getOIFP(oifp_id) {
    const path = `oifps/${oifp_id}`;
    return this.apiService.get(path).pipe(map(data => this.oifpJsonAdopter(data)));
  }
  getOIFPSpend(oifp_id) {
    const path = `oifps/${oifp_id}/spend`;
    return this.apiService.get(path);
  }

  getOIFPRating(oifp_id) {
    const path = `oifps/${oifp_id}/ratings`;
    return this.apiService.get(path);
  }

  getInvestorOIFPRating(oifp_id, investor_id) {
    const path = `ratings/${oifp_id}/${investor_id}`;
    return this.apiService.get(path);
  }

  updateInvestorOIFPRating(rating_id, userRating, Investor_name, oifp_id) {
    const rating = new Rating().set(userRating, Investor_name, oifp_id);
    rating.transactionId = rating_id;
    const path = `ratings`;
    return this.apiService.put(path, rating);
  }

  createInvestorOIFPRating(userRating, Investor_name, oifp_id) {
    const rating = new Rating().set(userRating, Investor_name, oifp_id);
    const path = `ratings`;
    return this.apiService.post(path, rating);
  }

  oifpJsonAdopter(oifpData: any = []) {
    const oifps: Array<Oifp> = [];
    if (oifpData.length === undefined) {
      oifpData = [oifpData];
    }
    for (const key in oifpData) {
      if (oifpData[key] !== undefined) {
        const data = oifpData[key];
        const oifp: Oifp = new Oifp();
        oifp.id = data.oifpRegistrationNumber;
        oifp.oifp_about = data.oifpDescription;
        oifp.oifp_reg_no = data.oifpRegistrationNumber;
        oifp.oifp_name = data.oifpName;
        oifp.oifp_address = data.address;
        oifp.oifp_phone = data.contactNumber;
        oifp.oifp_email = data.contactEmail;
        oifp.oifp_icon_url = `assets/images/${data.oifpRegistrationNumber}/${data.oifpRegistrationNumber}.png`;
        oifp.oifp_rating = 0;
        oifp.oifp_projects = Math.floor(Math.random() * (+40 - +10)) + +10;
        oifps.push(oifp);
      }
    }
    return oifps;
  }
}
