#!/bin/bash

#
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

# Script for loading the OIFPs and other data used in the workshop, via the REST API
# Set the exports below to point to the REST API hostname/port and run the script

# The export statements below can be used to point to either localhost or to an ELB endpoint, 
# depending on where the REST API server is running 
set +e
#export ENDPOINT=oifp10-elb-2090058053.us-east-1.elb.amazonaws.com
#export PORT=80
export ENDPOINT=localhost
export PORT=3000

echo '---------------------------------------'
echo connecting to server: $ENDPOINT:$PORT
echo '---------------------------------------'

echo '---------------------------------------'
echo Registering a user
echo '---------------------------------------'
echo 'Register User'
USERID=$(uuidgen)
echo
response=$(curl -s -X POST http://${ENDPOINT}:${PORT}/users -H 'content-type: application/x-www-form-urlencoded' -d "username=${USERID}&orgName=Org1")
echo $response
echo Response should be: {"success":true,"secret":"","message":"$USERID enrolled Successfully"}

echo '---------------------------------------'
echo OIFPs
echo '---------------------------------------'

echo 'Creating OIFP - 1101'
echo

TRX_ID=$(curl -s -X POST http://${ENDPOINT}:${PORT}/oifps -H 'content-type: application/json' -d '{
    "oifpRegistrationNumber": "1101",
    "oifpName": "Amazon Stock Investment",
    "oifpDescription": "Invest in Amazon Stocks and Portfolio.",
    "address": "101 Amazon Stock Investment",
    "contactNumber": "6304972628",
    "contactEmail": "investment@stock.com"
}')

echo "Transaction ID is $TRX_ID"

echo 'Creating OIFP - 1102'
echo

TRX_ID=$(curl -s -X POST http://${ENDPOINT}:${PORT}/oifps -H 'content-type: application/json' -d '{
    "oifpRegistrationNumber": "1102",
    "oifpName": "Metaverse ETF Investment",
    "oifpDescription": "Invest in various Metaverse equities and holdings.",
    "address": "201 Metaverse ETF Investment",
    "contactNumber": "6305932628",
    "contactEmail": "investment@metaverse.com"
}')

echo "Transaction ID is $TRX_ID"


echo 'Creating OIFP - 1103'
echo

TRX_ID=$(curl -s -X POST http://${ENDPOINT}:${PORT}/oifps -H 'content-type: application/json' -d '{
    "oifpRegistrationNumber": "1103",
    "oifpName": "Robinhood SPAC Investment",
    "oifpDescription": "Invest in early SPACs for high fidelity advantage.",
    "address": "301 Robinhood SPAC Investment",
    "contactNumber": "6309472628",
    "contactEmail": "investment@spac.com"
}')

echo "Transaction ID is $TRX_ID"

echo 'Creating OIFP - 1104'
echo

TRX_ID=$(curl -s -X POST http://${ENDPOINT}:${PORT}/oifps -H 'content-type: application/json' -d '{
    "oifpRegistrationNumber": "1104",
    "oifpName": "LendingTree Mortgage Securities",
    "oifpDescription": "Invest in various mortgages securities offered by lending tree.",
    "address": "401 LendingTree Mortgage Securities",
    "contactNumber": "6307352628",
    "contactEmail": "investment@mortgages.com"
}')

echo "Transaction ID is $TRX_ID"

echo 'Creating OIFP - 1105'
echo

TRX_ID=$(curl -s -X POST http://${ENDPOINT}:${PORT}/oifps -H 'content-type: application/json' -d '{
    "oifpRegistrationNumber": "1105",
    "oifpName": "Redfin Real Estate Securities",
    "oifpDescription": "Invest in various Real Estate products.",
    "address": "1501 Redfin Real Estate Securities",
    "contactNumber": "8574639353",
    "contactEmail": "investment@realestate.com"
}')

echo "Transaction ID is $TRX_ID"

echo 'Checking that the data has been loaded'

echo 'Query all OIFPs'
echo
curl -s -X GET http://${ENDPOINT}:${PORT}/oifps -H 'content-type: application/json'
echo
echo 'Query specific OIFPs - looking for OIFP 1103'
echo
curl -s -X GET http://${ENDPOINT}:${PORT}/oifps/1103 -H 'content-type: application/json'

echo '---------------------------------------'
echo Rating
echo '---------------------------------------'
echo 'Create Rating'
echo
RATING1=$(uuidgen)
TRX_ID=$(curl -s -X POST http://${ENDPOINT}:${PORT}/ratings -H 'content-type: application/json' -d '{ 
   "investorUserName": "'"${INVESTOR1}"'", 
   "oifpRegistrationNumber": "1103", 
   "rating": 4
}')
echo "Transaction ID is $TRX_ID"
echo
RATING2=$(uuidgen)
TRX_ID=$(curl -s -X POST http://${ENDPOINT}:${PORT}/ratings -H 'content-type: application/json' -d '{ 
   "investorUserName": "'"${INVESTOR2}"'", 
   "oifpRegistrationNumber": "1101", 
   "rating": 5
}')
echo "Transaction ID is $TRX_ID"
echo
RATING3=$(uuidgen)
TRX_ID=$(curl -s -X POST http://${ENDPOINT}:${PORT}/ratings -H 'content-type: application/json' -d '{ 
   "investorUserName": "'"${INVESTOR2}"'", 
   "oifpRegistrationNumber": "1105", 
   "rating": 3
}')
echo "Transaction ID is $TRX_ID"

echo '---------------------------------------'
echo Investors
echo '---------------------------------------'
echo 'Create Investor'
echo
TRX_ID=$(curl -s -X POST http://${ENDPOINT}:${PORT}/investors -H 'content-type: application/json' -d '{ 
   "investorUserName": "jane", 
   "email": "jane@abc.com", 
   "registeredDate": "2018-10-21T09:52:20.182Z" 
}')
echo "Transaction ID is $TRX_ID"
echo
TRX_ID=$(curl -s -X POST http://${ENDPOINT}:${PORT}/investors -H 'content-type: application/json' -d '{ 
   "investorUserName": "louisa", 
   "email": "louisa@hij.com", 
   "registeredDate": "2018-11-18T05:32:20.182Z" 
}')
echo "Transaction ID is $TRX_ID"

echo 'Query all investors'
echo
curl -s -X GET http://${ENDPOINT}:${PORT}/investors -H 'content-type: application/json'

echo '---------------------------------------'
echo Investment
echo '---------------------------------------'
echo
echo 'Create Investment'
echo
INVESTMENT1=$(uuidgen)
TRX_ID=$(curl -s -X POST http://${ENDPOINT}:${PORT}/investments -H 'content-type: application/json' -d '{ 
        "investmentId": "'"${INVESTMENT1}"'",
        "investmentAmount": 100,
        "investmentDate": "2018-09-20T12:41:59.582Z",
        "investorUserName": "edge",
        "oifpRegistrationNumber": "1102"
}')
echo "Transaction ID is $TRX_ID"
echo
INVESTMENT2=$(uuidgen)
TRX_ID=$(curl -s -X POST http://${ENDPOINT}:${PORT}/investments -H 'content-type: application/json' -d '{ 
        "investmentId": "'"${INVESTMENT2}"'",
        "investmentAmount": 255,
        "investmentDate": "2018-09-18T07:41:59.582Z",
        "investorUserName": "jane",
        "oifpRegistrationNumber": "1105"
}')
echo "Transaction ID is $TRX_ID"
echo
INVESTMENT3=$(uuidgen)
TRX_ID=$(curl -s -X POST http://${ENDPOINT}:${PORT}/investments -H 'content-type: application/json' -d '{ 
        "investmentId": "'"${INVESTMENT3}"'",
        "investmentAmount": 900,
        "investmentDate": "2018-09-09T06:32:59.582Z",
        "investorUserName": "louisa",
        "oifpRegistrationNumber": "1103"
}')
echo "Transaction ID is $TRX_ID"
echo
INVESTMENT4=$(uuidgen)
TRX_ID=$(curl -s -X POST http://${ENDPOINT}:${PORT}/investments -H 'content-type: application/json' -d '{ 
        "investmentId": "'"${INVESTMENT4}"'",
        "investmentAmount": 430,
        "investmentDate": "2018-08-09T09:32:59.582Z",
        "investorUserName": "braendle",
        "oifpRegistrationNumber": "1103"
}')
echo "Transaction ID is $TRX_ID"
echo
INVESTMENT5=$(uuidgen)
TRX_ID=$(curl -s -X POST http://${ENDPOINT}:${PORT}/investments -H 'content-type: application/json' -d '{ 
        "investmentId": "'"${INVESTMENT5}"'",
        "investmentAmount": 200,
        "investmentDate": "2018-09-18T07:41:59.582Z",
        "investorUserName": "edge",
        "oifpRegistrationNumber": "1103"
}')
echo "Transaction ID is $TRX_ID"
echo
INVESTMENT6=$(uuidgen)
TRX_ID=$(curl -s -X POST http://${ENDPOINT}:${PORT}/investments -H 'content-type: application/json' -d '{ 
        "investmentId": "'"${INVESTMENT6}"'",
        "investmentAmount": 520,
        "investmentDate": "2018-09-20T12:41:59.582Z",
        "investorUserName": "edge",
        "oifpRegistrationNumber": "1101"
}')
echo "Transaction ID is $TRX_ID"
echo
INVESTMENT7=$(uuidgen)
TRX_ID=$(curl -s -X POST http://${ENDPOINT}:${PORT}/investments -H 'content-type: application/json' -d '{ 
        "investmentId": "'"${INVESTMENT7}"'",
        "investmentAmount": 760,
        "investmentDate": "2018-09-18T07:41:59.582Z",
        "investorUserName": "jane",
        "oifpRegistrationNumber": "1105"
}')
echo "Transaction ID is $TRX_ID"
echo
INVESTMENT8=$(uuidgen)
TRX_ID=$(curl -s -X POST http://${ENDPOINT}:${PORT}/investments -H 'content-type: application/json' -d '{ 
        "investmentId": "'"${INVESTMENT8}"'",
        "investmentAmount": 25,
        "investmentDate": "2018-09-09T06:32:59.582Z",
        "investorUserName": "louisa",
        "oifpRegistrationNumber": "1101"
}')
echo "Transaction ID is $TRX_ID"
echo
INVESTMENT9=$(uuidgen)
TRX_ID=$(curl -s -X POST http://${ENDPOINT}:${PORT}/investments -H 'content-type: application/json' -d '{ 
        "investmentId": "'"${INVESTMENT9}"'",
        "investmentAmount": 44,
        "investmentDate": "2018-08-09T09:32:59.582Z",
        "investorUserName": "braendle",
        "oifpRegistrationNumber": "1103"
}')
echo "Transaction ID is $TRX_ID"
echo
INVESTMENT10=$(uuidgen)
TRX_ID=$(curl -s -X POST http://${ENDPOINT}:${PORT}/investments -H 'content-type: application/json' -d '{ 
        "investmentId": "'"${INVESTMENT10}"'",
        "investmentAmount": 120,
        "investmentDate": "2018-09-18T07:41:59.582Z",
        "investorUserName": "edge",
        "oifpRegistrationNumber": "1104"
}')
echo "Transaction ID is $TRX_ID"

echo 'Query all Investments'
echo
curl -s -X GET http://${ENDPOINT}:${PORT}/investments -H 'content-type: application/json'

echo '---------------------------------------'
echo Spend
echo '---------------------------------------'
echo 'Create Spend'
echo
SPENDID=$(uuidgen)
TRX_ID=$(curl -s -X POST http://${ENDPOINT}:${PORT}/spend -H 'content-type: application/json' -d '{ 
        "oifpRegistrationNumber": "1103",
        "spendId": "'"${SPENDID}"'",
        "spendDescription": "Fees for working capital.",
        "spendDate": "2018-11-19T12:20:59.582Z",
        "spendAmount": 125
}')
echo "Transaction ID is $TRX_ID"
echo
SPENDID=$(uuidgen)
TRX_ID=$(curl -s -X POST http://${ENDPOINT}:${PORT}/spend -H 'content-type: application/json' -d '{ 
        "oifpRegistrationNumber": "1105",
        "spendId": "'"${SPENDID}"'",
        "spendDescription": "Purchase deeds for various properties.",
        "spendDate": "2018-09-10T22:41:59.582Z",
        "spendAmount": 99
}')
echo "Transaction ID is $TRX_ID"
