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

import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './ui/dashboard/dashboard.component';
import { OifpDetailsComponent } from './ui/oifp-details/oifp-details.component';
import { OifpsListComponent } from './ui/oifps-list/oifps-list.component';
import { InvestComponent } from './ui/invest/invest.component';
import { SigninComponent } from './ui/signin/signin.component';
import { SignupComponent } from './ui/signup/signup.component';

const routes: Routes = [
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'oifplist', component: OifpsListComponent },
  { path: 'details/:id', component: OifpDetailsComponent },
  { path: 'invest/:id', component: InvestComponent },
  { path: 'dashboard', component: DashboardComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
