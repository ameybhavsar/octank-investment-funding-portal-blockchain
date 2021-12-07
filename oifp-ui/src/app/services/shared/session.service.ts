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
import { Investor } from 'src/app/models';


@Injectable({
    providedIn: 'root'
})
export class SessionService {

    static getUser(): Investor {
        if (window.localStorage['user']) {
            try {
                const data = JSON.parse(window.localStorage['user']);
                return new Investor().get(data.name, data.email);
            } catch (error) {
                return null;
            }
        }
    }

    static getValue(key: string = '') {
        const value = window.localStorage[key];
        if (value && typeof value === 'string') {
            try {
                return JSON.parse(window.localStorage[key]);
            } catch (error) {
                // do nothing
            }
        }
        return value;
    }

    static setValue(key: string = '', value: any = null) {
        if (typeof value === 'object') {
            try {
                const data = JSON.stringify(value);
                return window.localStorage[key] = data;
            } catch (error) {
                // do nothing
            }
        }
        return window.localStorage[key] = value;
    }

    saveUser(investor: any) {
        const data = JSON.stringify(investor);
        window.localStorage['user'] = data;
    }

    deleteUser() {
        window.localStorage.removeItem('user');
    }


}
