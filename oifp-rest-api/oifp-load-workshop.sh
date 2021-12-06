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
    "oifpName": "Making the Earth Green",
    "oifpDescription": "Our Earth is losing an estimated 18 million acres (7.3 million hectares) of forest every year. The impact of deforestation includes declining biodiversity, ecological imbalances and climate changes around the world. If the current rate of deforestaion continues, it will take less than 100 years to destroy all the rainforests on Earth. Making the Earth Green, a non-profit organization, works with governments, companies and communities to educate and promote responsible forest management practices and protect forest areas. We strongly believe that our children and the future generations deserve a better environment than the current state and it is our responsibility to make that happen. Please donate to make the Earth greener!",
    "address": "101 Making the Earth Green",
    "contactNumber": "6304972628",
    "contactEmail": "makingearth@makingearth.com"
}')

echo "Transaction ID is $TRX_ID"

echo 'Creating OIFP - 1102'
echo

TRX_ID=$(curl -s -X POST http://${ENDPOINT}:${PORT}/oifps -H 'content-type: application/json' -d '{
    "oifpRegistrationNumber": "1102",
    "oifpName": "Books Now Fund",
    "oifpDescription": "More than 330 million children, including over 90 percent of primary school age children in low-income countries, and 75 percent of children in lower-middle income countries, are expected not to be able to read by the time they finish primary school. Books Now Fund aims to bring the power of reading to children in these countries, to give them the opportunity to learn, and to encourage them to pursue education. Your investment will help us making the world a better reading place for these children! 1. UNESCO Institute for Statistics. (2017). More Than One-Half of Children and Adolescents Are Not Learning Worldwide. Fact Sheet. Paris: UNESCO. [Accessed 26 January 2018].",
    "address": "201 Books Now Fund",
    "contactNumber": "6305932628",
    "contactEmail": "booksfund@booksfund.com"
}')

echo "Transaction ID is $TRX_ID"


echo 'Creating OIFP - 1103'
echo

TRX_ID=$(curl -s -X POST http://${ENDPOINT}:${PORT}/oifps -H 'content-type: application/json' -d '{
    "oifpRegistrationNumber": "1103",
    "oifpName": "Animal Rescue Troop",
    "oifpDescription": "Animal Rescue Troop is a non-profit organization dedicated to animal welfare and shelter. We are volunteer-run and focus on rescuing, rehabilitating and finding forever homes for stray and abandoned animals. There are many ways that you can help: by adopting an animal, providing temporary shelter, becoming a sponsor or donating to our pet shelter. Step up and show that you care!",
    "address": "301 Animal Rescue Troop",
    "contactNumber": "6309472628",
    "contactEmail": "animalrescue@animalrescue.com"
}')

echo "Transaction ID is $TRX_ID"

echo 'Creating OIFP - 1104'
echo

TRX_ID=$(curl -s -X POST http://${ENDPOINT}:${PORT}/oifps -H 'content-type: application/json' -d '{
    "oifpRegistrationNumber": "1104",
    "oifpName": "Helping Hands",
    "oifpDescription": "Helping Hands is a homeless support group. According to a global survey conducted by the United Nations in 2005, an estimated 100 million people were homeless worldwide. Thousands of people around the United States currently face homelessness. During difficult times, local non-profit organizations like ours are vital in providing shelter and support to those in need. We work with local businesses and non-profit partners delivering life-saving services in the communities such as delivering essential backpacks to homeless shelters, sourcing food investments and job placements. Everyone deserved a place to call home, we appreciate your investment to support local communities in overcoming adversity.",
    "address": "401 Helping Thousands",
    "contactNumber": "6307352628",
    "contactEmail": "helpinghands@helpinghands.com"
}')

echo "Transaction ID is $TRX_ID"

echo 'Creating OIFP - 1105'
echo

TRX_ID=$(curl -s -X POST http://${ENDPOINT}:${PORT}/oifps -H 'content-type: application/json' -d '{
    "oifpRegistrationNumber": "1105",
    "oifpName": "STEM Sprout",
    "oifpDescription": "STEM Sprout\u0027s goal is expanding access to Science, Technology, Engineering and Mathematics in schools and increasing participation in these fields of study. Over the next decade, many of the 30+ fastest growing jobs will require STEM skills. We work with schools in our communities to organize activities and develop curricula. We want to ensure that understanding techology become a basic skill for our next generation. Giving children the resources and empowering them to understand even the basics of sciences would open up so many options and opportunities for them down the road. Come and help to open doors to STEM for our children!",
    "address": "1501 STEM",
    "contactNumber": "8574639353",
    "contactEmail": "stem@stemresearch.com"
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
        "spendDescription": "Fees for hiring transport for animal delivery",
        "spendDate": "2018-11-19T12:20:59.582Z",
        "spendAmount": 125
}')
echo "Transaction ID is $TRX_ID"
echo
SPENDID=$(uuidgen)
TRX_ID=$(curl -s -X POST http://${ENDPOINT}:${PORT}/spend -H 'content-type: application/json' -d '{ 
        "oifpRegistrationNumber": "1105",
        "spendId": "'"${SPENDID}"'",
        "spendDescription": "Purchase test tubes",
        "spendDate": "2018-09-10T22:41:59.582Z",
        "spendAmount": 99
}')
echo "Transaction ID is $TRX_ID"
