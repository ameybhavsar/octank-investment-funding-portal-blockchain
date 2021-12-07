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
import { BehaviorSubject, ReplaySubject, Observable } from 'rxjs';
import { Investor } from '../../models';
import { SessionService } from './session.service';
import { ApiService } from './api.service';
import { Router, ActivatedRoute, Event, NavigationEnd } from '@angular/router';
import { map, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InvestorService {
  private currentInvestorSubject = new BehaviorSubject<Investor>(null);
  public currentInvestor = this.currentInvestorSubject.asObservable().pipe(distinctUntilChanged());
  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  currentUrl: String = '';

  constructor(
    private apiService: ApiService,
    private sessionService: SessionService,
    private route: Router,
    private activatedRoute: ActivatedRoute

  ) {
    route.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
    });
  }

  signin(logindata) {
    return this.apiService.get(`investors/${logindata.username}`);

  }

  createUser(userdata) {
    const userData = {
      username: userdata.username,
      orgName: 'Org1'
    };
    return this.apiService.post(`users`, userData);
  }

  signup(userdata) {
    const reqData = {
      investorUserName: userdata.username,
      email: userdata.email,
      registeredDate: new Date().toISOString()
    };
    return this.apiService.post(`investors`, reqData);
  }

  signout() {
    this.purgeAuth();
    this.route.navigate(['signin']);
  }


  populate() {
    const userinfo: Investor = SessionService.getUser();
    if (userinfo) {
      this.apiService.get(`investors/${userinfo.name}`)
        .subscribe(
          data => {
            if (data.length > 0) {
              const datum = data[0];
              const investor = new Investor().get(datum.investorUserName, datum.email);
              this.setAuth(investor);
              if (this.currentUrl !== '/' || this.currentUrl !== '/singin') {
                this.route.navigate(['oifplist']);
              }
              return;
            }
          },
          err => {
            this.purgeAuth();
            if (this.currentUrl !== '/singup') {
              this.route.navigate(['signin']);
            }
          }
        );
    } else {
      if (this.currentUrl !== '/singup') {
        this.route.navigate(['signin']);
      }
    }
  }

  setAuth(investor: Investor) {
    this.sessionService.saveUser(investor);
    this.currentInvestorSubject.next(investor);
    this.isAuthenticatedSubject.next(true);
  }

  purgeAuth() {
    this.sessionService.deleteUser();
    this.currentInvestorSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  attemptAuth(type, credentials): Observable<Investor> {
    const route = (type === 'login') ? '/login' : '';
    return this.apiService.get(`/investors/${credentials.name}` + route).pipe(
      map(data => {
        const investor = new Investor().get(data.name, data.email);
        this.setAuth(investor);
        return investor;
      }
      ));
  }

  getCurrentInvestor(): Investor {
    return this.currentInvestorSubject.value;
  }


}
