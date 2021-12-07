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
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import * as $ from 'jquery';
import * as popper from 'popper.js';
import * as bootstrap from 'bootstrap';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './ui/shared/header/header.component';
import { FooterComponent } from './ui/shared/footer/footer.component';
import { DashboardComponent } from './ui/dashboard/dashboard.component';
import { SigninComponent } from './ui/signin/signin.component';
import { SignupComponent } from './ui/signup/signup.component';
import { InvestComponent } from './ui/invest/invest.component';
import { HttpClientModule } from '@angular/common/http';
import { OifpsListComponent } from './ui/oifps-list/oifps-list.component';
import { OifpDetailsComponent } from './ui/oifp-details/oifp-details.component';

// Custom Componants
import { RatingComponent, RatingService } from './ui/components/rating/rating.component';
import { BlockchainProgressComponent } from './ui/components/blockchain-progress/blockchain-progress.component';

// Shared Services
import { AuthService, ApiService, SessionService } from './services/shared';
import { GalleryComponent } from './ui/components/gallery/gallery.component';
import { BreadcrumbComponent } from './ui/shared/breadcrumb/breadcrumb.component';
import { BlockchainComponent } from './ui/shared/blockchain/blockchain.component';
import { SidenavComponent } from './ui/shared/sidenav/sidenav.component';
import { InvestorchartComponent } from './ui/components/investorchart/investorchart.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    SigninComponent,
    SignupComponent,
    InvestComponent,
    OifpsListComponent,
    OifpDetailsComponent,
    BlockchainProgressComponent,
    RatingComponent,
    GalleryComponent,
    BreadcrumbComponent,
    BlockchainComponent,
    SidenavComponent,
    InvestorchartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
  ],
  providers: [
    AuthService,
    ApiService,
    SessionService,
    RatingService
  ],
  bootstrap: [AppComponent],
  entryComponents: [InvestorchartComponent]
})
export class AppModule {

}
