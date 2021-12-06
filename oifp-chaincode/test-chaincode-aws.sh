#!/bin/bash

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

echo Run this script on the Fabric client node, OUTSIDE of the CLI container
echo
echo Add Investors

# Note the Args below - we are passing in a JSON payload, rather than the usual array of strings that Fabric requires. 
# IMO this is much better as we can clearly see what each argument means, rather than just passing an array of strings

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" \ 
-e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" \ 
cli peer chaincode invoke -o $ORDERER -C $CHANNEL -n $CHAINCODENAME \ 
-c '{"Args":["createInvestor","{\"investorUserName\": \"edge\", \"email\": \"edge@def.com\", \"registeredDate\": \"2018-10-22T11:52:20.182Z\"}"]}'

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" \ 
-e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" \ 
cli peer chaincode invoke -o $ORDERER -C $CHANNEL -n $CHAINCODENAME \ 
-c '{"Args":["createInvestor","{\"investorUserName\": \"braendle\", \"email\": \"braendle@def.com\", \"registeredDate\": \"2018-10-22T11:52:20.182Z\"}"]}'

echo Add OIFPs

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" \ 
-e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" \ 
cli peer chaincode invoke -o $ORDERER -C $CHANNEL -n $CHAINCODENAME \ 
-c '{"Args":["createOIFP","{\"oifpRegistrationNumber\": \"6322\", \"oifpName\": \"Pets In Need\", \"oifpDescription\": \"We help pets in need\", \"address\": \"1 Pet street\", \"contactNumber\": \"82372837\", \"contactEmail\": \"pets@petco.com\"}"]}'


docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" \ 
-e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" \ 
cli peer chaincode invoke -o $ORDERER -C $CHANNEL -n $CHAINCODENAME \ 
-c '{"Args":["createOIFP","{\"oifpRegistrationNumber\": \"6323\", \"oifpName\": \"Dogs In Need\", \"oifpDescription\": \"We help dogs in need\", \"address\": \"1 Dog street\", \"contactNumber\": \"82372837\", \"contactEmail\": \"dogs@dogco.com\"}"]}'

echo Add Investment

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" 
\ -e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" 
\ cli peer chaincode invoke -o $ORDERER -C $CHANNEL -n $CHAINCODENAME 
\ -c '{"Args":["createInvestment","{\"investmentId\": \"2211\", \"investmentAmount\": 100, \"investmentDate\": \"2018-09-20T12:41:59.582Z\", \"investorUserName\": \"edge\", \"oifpRegistrationNumber\": \"6322\"}"]}'

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" \ 
-e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" \ 
cli peer chaincode invoke -o $ORDERER -C $CHANNEL -n $CHAINCODENAME \ 
-c '{"Args":["createInvestment","{\"investmentId\": \"2212\", \"investmentAmount\": 733, \"investmentDate\": \"2018-09-20T12:41:59.582Z\", \"investorUserName\": \"braendle\", \"oifpRegistrationNumber\": \"6322\"}"]}'

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" \ 
-e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" \ 
cli peer chaincode invoke -o $ORDERER -C $CHANNEL -n $CHAINCODENAME \ 
-c '{"Args":["createInvestment","{\"investmentId\": \"2230\", \"investmentAmount\": 450, \"investmentDate\": \"2018-09-20T12:41:59.582Z\", \"investorUserName\": \"edge\", \"oifpRegistrationNumber\": \"6323\"}"]}'

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" \ 
-e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" \ 
cli peer chaincode invoke -o $ORDERER -C $CHANNEL -n $CHAINCODENAME \ 
-c '{"Args":["createInvestment","{\"investmentId\": \"2231\", \"investmentAmount\": 29, \"investmentDate\": \"2018-09-20T12:41:59.582Z\", \"investorUserName\": \"braendle\", \"oifpRegistrationNumber\": \"6323\"}"]}'

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" \ 
-e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" \ 
cli peer chaincode invoke -o $ORDERER -C $CHANNEL -n $CHAINCODENAME \ 
-c '{"Args":["createInvestment","{\"investmentId\": \"2232\", \"investmentAmount\": 98, \"investmentDate\": \"2018-09-20T12:41:59.582Z\", \"investorUserName\": \"braendle\", \"oifpRegistrationNumber\": \"6323\"}"]}'

echo Add Spend

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" \ 
-e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" \ 
cli peer chaincode invoke -o $ORDERER -C $CHANNEL -n $CHAINCODENAME \ 
-c '{"Args":["createSpend","{\"oifpRegistrationNumber\": \"6322\", \"spendId\": \"2\", \"spendDescription\": \"Peter Pipers Poulty Portions for Pets\", \"spendDate\": \"2018-09-20T12:41:59.582Z\", \"spendAmount\": 33}"]}'

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" \ 
-e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" \ 
cli peer chaincode invoke -o $ORDERER -C $CHANNEL -n $CHAINCODENAME \ 
-c '{"Args":["createSpend","{\"oifpRegistrationNumber\": \"6322\", \"spendId\": \"3\", \"spendDescription\": \"Peter Pipers Poulty Portions for Pets\", \"spendDate\": \"2018-09-20T12:41:59.582Z\", \"spendAmount\": 651}"]}'

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" \ 
-e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" \ 
cli peer chaincode invoke -o $ORDERER -C $CHANNEL -n $CHAINCODENAME \ 
-c '{"Args":["createSpend","{\"oifpRegistrationNumber\": \"6323\", \"spendId\": \"4\", \"spendDescription\": \"Peter Pipers Poulty Portions for Pets\", \"spendDate\": \"2018-09-20T12:41:59.582Z\", \"spendAmount\": 323}"]}'

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" \ 
-e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" \ 
cli peer chaincode invoke -o $ORDERER -C $CHANNEL -n $CHAINCODENAME \ 
-c '{"Args":["createSpend","{\"oifpRegistrationNumber\": \"6323\", \"spendId\": \"5\", \"spendDescription\": \"Peter Pipers Poulty Portions for Pets\", \"spendDate\": \"2018-09-20T12:41:59.582Z\", \"spendAmount\": 21.765}"]}'

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" \ 
-e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" \ 
cli peer chaincode invoke -o $ORDERER -C $CHANNEL -n $CHAINCODENAME \ 
-c '{"Args":["createSpend","{\"oifpRegistrationNumber\": \"6323\", \"spendId\": \"6\", \"spendDescription\": \"Peter Pipers Poulty Portions for Pets\", \"spendDate\": \"2018-09-20T12:41:59.582Z\", \"spendAmount\": 625}"]}'

echo Query all investors

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" \ 
-e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" \ 
cli peer chaincode query -C $CHANNEL -n $CHAINCODENAME -c '{"Args":["queryAllInvestors"]}'

echo Query specific investor

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" \ 
-e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" \ 
cli peer chaincode query -C $CHANNEL -n $CHAINCODENAME -c '{"Args":["queryInvestor","{\"investorUserName\": \"edge\"}"]}'

echo Query all OIFPs

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" \ 
-e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" \ 
cli peer chaincode query -C $CHANNEL -n $CHAINCODENAME -c '{"Args":["queryAllOIFPs"]}'

echo Query specific OIFP

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" \ 
-e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" \ 
cli peer chaincode query -C $CHANNEL -n $CHAINCODENAME -c '{"Args":["queryOIFP","{\"oifpRegistrationNumber\": \"6322\"}"]}'

echo Query all Investments

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" \ 
-e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" \ 
cli peer chaincode query -C $CHANNEL -n $CHAINCODENAME -c '{"Args":["queryAllInvestments"]}'

echo Query all Investments for OIFP

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" \ 
-e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" \ 
cli peer chaincode query -C $CHANNEL -n $CHAINCODENAME -c '{"Args":["queryInvestmentsForOIFP","{\"oifpRegistrationNumber\": \"6322\"}"]}'

echo Query all Spend

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" \ 
-e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" \ 
cli peer chaincode query -C $CHANNEL -n $CHAINCODENAME -c '{"Args":["queryAllSpends"]}'


echo Query all SpendAllocations

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" \ 
-e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" \ 
cli peer chaincode query -C $CHANNEL -n $CHAINCODENAME -c '{"Args":["queryAllSpendAllocations"]}'

echo Query SpendAllocations for a investment

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" \ 
-e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" \ 
cli peer chaincode query -C $CHANNEL -n $CHAINCODENAME -c '{"Args":["querySpendAllocationForInvestment","{\"investmentId\": \"2212\"}"]}'

echo Query SpendAllocations for a spend record

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" \ 
-e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" \ 
cli peer chaincode query -C $CHANNEL -n $CHAINCODENAME -c '{"Args":["querySpendAllocationForSpend","{\"spendId\": \"7\"}"]}'

echo Query history for a specific key

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" \ 
-e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" \ 
cli peer chaincode query -C $CHANNEL -n $CHAINCODENAME -c '{"Args":["queryHistoryForKey","{\"key\": \"136772b8c4bc84c09f86d8f936ae107a5fcbfbaa25b15d4a9ee7059dac1b312a-0\"}"]}'
