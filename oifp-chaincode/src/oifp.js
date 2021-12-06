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

'use strict';
const shim = require('fabric-shim');
const util = require('util');

/************************************************************************************************
 * 
 * GENERAL FUNCTIONS 
 * 
 ************************************************************************************************/

/**
 * Executes a query using a specific key
 * 
 * @param {*} key - the key to use in the query
 */
async function queryByKey(stub, key) {
  console.log('============= START : queryByKey ===========');
  console.log('##### queryByKey key: ' + key);

  let resultAsBytes = await stub.getState(key); 
  if (!resultAsBytes || resultAsBytes.toString().length <= 0) {
    throw new Error('##### queryByKey key: ' + key + ' does not exist');
  }
  console.log('##### queryByKey response: ' + resultAsBytes);
  console.log('============= END : queryByKey ===========');
  return resultAsBytes;
}

/**
 * Executes a query based on a provided queryString
 * 
 * I originally wrote this function to handle rich queries via CouchDB, but subsequently needed
 * to support LevelDB range queries where CouchDB was not available.
 * 
 * @param {*} queryString - the query string to execute
 */
async function queryByString(stub, queryString) {
  console.log('============= START : queryByString ===========');
  console.log("##### queryByString queryString: " + queryString);

  // CouchDB Query
  // let iterator = await stub.getQueryResult(queryString);

  // Equivalent LevelDB Query. We need to parse queryString to determine what is being queried
  // In this chaincode, all queries will either query ALL records for a specific docType, or
  // they will filter ALL the records looking for a specific OIFP, Investor, Investment, etc. So far, 
  // in this chaincode there is a maximum of one filter parameter in addition to the docType.
  let docType = "";
  let startKey = "";
  let endKey = "";
  let jsonQueryString = JSON.parse(queryString);
  if (jsonQueryString['selector'] && jsonQueryString['selector']['docType']) {
    docType = jsonQueryString['selector']['docType'];
    startKey = docType + "0";
    endKey = docType + "z";
  }
  else {
    throw new Error('##### queryByString - Cannot call queryByString without a docType element: ' + queryString);   
  }

  let iterator = await stub.getStateByRange(startKey, endKey);

  // Iterator handling is identical for both CouchDB and LevelDB result sets, with the 
  // exception of the filter handling in the commented section below
  let allResults = [];
  while (true) {
    let res = await iterator.next();

    if (res.value && res.value.value.toString()) {
      let jsonRes = {};
      console.log('##### queryByString iterator: ' + res.value.value.toString('utf8'));

      jsonRes.Key = res.value.key;
      try {
        jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
      } 
      catch (err) {
        console.log('##### queryByString error: ' + err);
        jsonRes.Record = res.value.value.toString('utf8');
      }
      // ******************* LevelDB filter handling ******************************************
      // LevelDB: additional code required to filter out records we don't need
      // Check that each filter condition in jsonQueryString can be found in the iterator json
      // If we are using CouchDB, this isn't required as rich query supports selectors
      let jsonRecord = jsonQueryString['selector'];
      // If there is only a docType, no need to filter, just return all
      console.log('##### queryByString jsonRecord - number of JSON keys: ' + Object.keys(jsonRecord).length);
      if (Object.keys(jsonRecord).length == 1) {
        allResults.push(jsonRes);
        continue;
      }
      for (var key in jsonRecord) {
        if (jsonRecord.hasOwnProperty(key)) {
          console.log('##### queryByString jsonRecord key: ' + key + " value: " + jsonRecord[key]);
          if (key == "docType") {
            continue;
          }
          console.log('##### queryByString json iterator has key: ' + jsonRes.Record[key]);
          if (!(jsonRes.Record[key] && jsonRes.Record[key] == jsonRecord[key])) {
            // we do not want this record as it does not match the filter criteria
            continue;
          }
          allResults.push(jsonRes);
        }
      }
      // ******************* End LevelDB filter handling ******************************************
      // For CouchDB, push all results
      // allResults.push(jsonRes);
    }
    if (res.done) {
      await iterator.close();
      console.log('##### queryByString all results: ' + JSON.stringify(allResults));
      console.log('============= END : queryByString ===========');
      return Buffer.from(JSON.stringify(allResults));
    }
  }
}

/**
 * Record spend made by an OIFP
 * 
 * This functions allocates the spend amongst the investors, so each investor can see how their 
 * investments are spent. The logic works as follows:
 * 
 *    - Get the investments made to this OIFP
 *    - Get the spend per investment, to calculate how much of the investment amount is still available for spending
 *    - Calculate the total amount spent by this OIFP
 *    - If there are sufficient investments available, create a SPEND record
 *    - Allocate the spend between all the investments and create SPENDALLOCATION records
 * 
 * @param {*} spend - the spend amount to be recorded. This will be JSON, as follows:
 * {
 *   "docType": "spend",
 *   "spendId": "1234",
 *   "spendAmount": 100,
 *   "spendDate": "2018-09-20T12:41:59.582Z",
 *   "spendDescription": "Delias Dainty Delights",
 *   "oifpRegistrationNumber": "1234"
 * }
 */
async function allocateSpend(stub, spend) {
  console.log('============= START : allocateSpend ===========');
  console.log('##### allocateSpend - Spend received: ' + JSON.stringify(spend));

  // validate we have a valid SPEND object and a valid amount
  if (!(spend && spend['spendAmount'] && typeof spend['spendAmount'] === 'number' && isFinite(spend['spendAmount']))) {
    throw new Error('##### allocateSpend - Spend Amount is not a valid number: ' + spend['spendAmount']);   
  }
  // validate we have a valid SPEND object and a valid SPEND ID
  if (!(spend && spend['spendId'])) {
    throw new Error('##### allocateSpend - Spend Id is required but does not exist in the spend message');   
  }

  // validate that we have a valid OIFP
  let oifp = spend['oifpRegistrationNumber'];
  let oifpKey = 'oifp' + oifp;
  let oifpQuery = await queryByKey(stub, oifpKey);
  if (!oifpQuery.toString()) {
    throw new Error('##### allocateSpend - Cannot create spend allocation record as the OIFP does not exist: ' + json['oifpRegistrationNumber']);
  }

  // first, get the total amount of investments donated to this OIFP
  let totalInvestments = 0;
  const investmentMap = new Map();
  let queryString = '{"selector": {"docType": "investment", "oifpRegistrationNumber": "' + oifp + '"}}';
  let investmentsForOIFP = await queryByString(stub, queryString);
  console.log('##### allocateSpend - allocateSpend - getInvestmentsForOIFP: ' + investmentsForOIFP);
  investmentsForOIFP = JSON.parse(investmentsForOIFP.toString());
  console.log('##### allocateSpend - getInvestmentsForOIFP as JSON: ' + investmentsForOIFP);

  // store all investments for the OIFP in a map. Each entry in the map will look as follows:
  //
  // {"Key":"investment2211","Record":{"docType":"investment","investmentAmount":100,"investmentDate":"2018-09-20T12:41:59.582Z","investmentId":"2211","investorUserName":"edge","oifpRegistrationNumber":"6322"}}
  for (let n = 0; n < investmentsForOIFP.length; n++) {
    let investment = investmentsForOIFP[n];
    console.log('##### allocateSpend - getInvestmentsForOIFP Investment: ' + JSON.stringify(investment));
    totalInvestments += investment['Record']['investmentAmount'];
    // store the investments made
    investmentMap.set(investment['Record']['investmentId'], investment);
    console.log('##### allocateSpend - investmentMap - adding new investment entry for investor: ' + investment['Record']['investmentId'] + ', values: ' + JSON.stringify(investment));
  }
  console.log('##### allocateSpend - Total investments for this oifp are: ' + totalInvestments);
  for (let investment of investmentMap) {
    console.log('##### allocateSpend - Total investment for this investment ID: ' + investment[0] + ', amount: ' + investment[1]['Record']['investmentAmount'] + ', entry: ' + JSON.stringify(investment[1]));
  }

  // next, get the spend by Investment, i.e. the amount of each Investment that has already been spent
  let totalSpend = 0;
  const investmentSpendMap = new Map();
  queryString = '{"selector": {"docType": "spendAllocation", "oifpRegistrationNumber": "' + oifp + '"}}';
  let spendAllocations = await queryByString(stub, queryString);
  spendAllocations = JSON.parse(spendAllocations.toString());
  for (let n = 0; n < spendAllocations.length; n++) {
    let spendAllocation = spendAllocations[n]['Record'];
    totalSpend += spendAllocation['spendAllocationAmount'];
    // store the spend made per Investment
    if (investmentSpendMap.has(spendAllocation['investmentId'])) {
      let spendAmt = investmentSpendMap.get(spendAllocation['investmentId']);
      spendAmt += spendAllocation['spendAllocationAmount'];
      investmentSpendMap.set(spendAllocation['investmentId'], spendAmt);
      console.log('##### allocateSpend - investmentSpendMap - updating investment entry for investment ID: ' + spendAllocation['investmentId'] + ' amount: ' + spendAllocation['spendAllocationAmount'] + ' total amt: ' + spendAmt);
    }
    else {
      investmentSpendMap.set(spendAllocation['investmentId'], spendAllocation['spendAllocationAmount']);
      console.log('##### allocateSpend - investmentSpendMap - adding new investment entry for investment ID: ' + spendAllocation['investmentId'] + ' amount: ' + spendAllocation['spendAllocationAmount']);
    }
  }
  console.log('##### allocateSpend - Total spend for this oifp is: ' + totalSpend);
  for (let investment of investmentSpendMap) {
    console.log('##### allocateSpend - Total spend against this investment ID: ' + investment[0] + ', spend amount: ' + investment[1] + ', entry: ' + investment);  
    if (investmentMap.has(investment[0])) {
      console.log('##### allocateSpend - The matching investment for this investment ID: ' + investment[0] + ', investment amount: ' + investmentMap.get(investment[0]));  
    }
    else {
      console.log('##### allocateSpend - ERROR - cannot find the matching investment for this spend record for investment ID: ' + investment[0]);  
    }
  }

  // at this point we have the total amount of investments made by investors to each OIFP. We also have the total spend
  // spent by an OIFP with a breakdown per investment. 

  // confirm whether the OIFP has sufficient available funds to cover the new spend
  let totalAvailable = totalInvestments - totalSpend;
  if (spend['spendAmount'] > totalAvailable) {
    // Execution stops at this point; the transaction fails and rolls back.
    // Any updates made by the transaction processor function are discarded.
    // Transaction processor functions are atomic; all changes are committed,
    // or no changes are committed.
    console.log('##### allocateSpend - OIFP ' + oifp + ' does not have sufficient funds available to cover this spend. Spend amount is: ' + spend['spendAmount'] + '. Available funds are currently: ' + totalAvailable + '. Total investments are: ' + totalInvestments + ', total spend is: ' + totalSpend);
    throw new Error('OIFP ' + oifp + ' does not have sufficient funds available to cover this spend. Spend amount is: ' + spend['spendAmount'] + '. Available funds are currently: ' + totalAvailable);
  }

  // since the OIFP has sufficient funds available, add the new spend record
  spend['docType'] = 'spend';
  let key = 'spend' + spend['spendId'];
  console.log('##### allocateSpend - Adding the spend record to OIFPSpend. Spend record is: ' + JSON.stringify(spend) + ' key is: ' + key);
  await stub.putState(key, Buffer.from(JSON.stringify(spend)));

  // allocate the spend as equally as possible to all the investments
  console.log('##### allocateSpend - Allocating the spend amount amongst the investments from investors who donated funds to this OIFP');
  let spendAmount = spend.spendAmount;
  let numberOfInvestments = 0;
  let spendAmountForInvestor = 0;
  let recordCounter = 0;

  while (true) {
    // spendAmount will be reduced as the spend is allocated to OIFPSpendInvestmentAllocation records. 
    // Once it reaches 0 we stop allocating. This caters for cases where the full allocation cannot
    // be allocated to a investment record. In this case, only the remaining domation amount is allocated 
    // (see variable amountAllocatedToInvestment below).
    // The remaining amount must be allocated to investment records with sufficient available funds.
    if (spendAmount <= 0) {
      break;
    }
    // calculate the number of investments still available, i.e. investments which still have funds available for spending. 
    // as the spending reduces the investments there may be fewer and fewer investments available to split the spending between
    // 
    // all investments for the OIFP are in investmentMap. Each entry in the map will look as follows:
    //
    // {"Key":"investment2211","Record":{"docType":"investment","investmentAmount":100,"investmentDate":"2018-09-20T12:41:59.582Z","investmentId":"2211","investorUserName":"edge","oifpRegistrationNumber":"6322"}}
    numberOfInvestments = 0;
    for (let investment of investmentMap) {
      console.log('##### allocateSpend - Investment record, key is: ' +  investment[0] + ' value is: ' + JSON.stringify(investment[1]));
      if (investmentSpendMap.has(investment[0])) {
        spendAmountForInvestor = investmentSpendMap.get(investment[0]);
      }
      else {
        spendAmountForInvestor = 0;
      }
      let availableAmountForInvestor = investment[1]['Record']['investmentAmount'] - spendAmountForInvestor;
      console.log('##### allocateSpend - Checking number of investments available for allocation. Investment ID: ' +  investment[0] + ' has spent: ' + spendAmountForInvestor + ' and has the following amount available for spending: ' + availableAmountForInvestor);
      if (availableAmountForInvestor > 0) {
        numberOfInvestments++;
      }
    }
    //Validate that we have a valid spendAmount, numberOfInvestments and spendAmountForInvestor
    //Invalid values could be caused by a bug in this function, or invalid values passed to this function
    //that were not caught by the validation process earlier.
    if (!(spendAmount && typeof spendAmount === 'number' && isFinite(spendAmount))) {
      throw new Error('##### allocateSpend - spendAmount is not a valid number: ' + spendAmount);   
    }
    if (!(numberOfInvestments && typeof numberOfInvestments === 'number' && numberOfInvestments > 0)) {
      throw new Error('##### allocateSpend - numberOfInvestments is not a valid number or is < 1: ' + numberOfInvestments);   
    }
    //calculate how much spend to allocate to each investment
    let spendPerInvestment = spendAmount / numberOfInvestments;
    console.log('##### allocateSpend - Allocating the total spend amount of: ' + spendAmount + ', to ' + numberOfInvestments + ' investments, resulting in ' + spendPerInvestment + ' per investment');

    if (!(spendPerInvestment && typeof spendPerInvestment === 'number' && isFinite(spendPerInvestment))) {
      throw new Error('##### allocateSpend - spendPerInvestment is not a valid number: ' + spendPerInvestment);   
    }

    // create the SPENDALLOCATION records. Each record looks as follows:
    //
    // {
    //   "docType":"spendAllocation",
    //   "spendAllocationId":"c5b39e938a29a80c225d10e8327caaf817f76aecd381c868263c4f59a45daf62-1",
    //   "spendAllocationAmount":38.5,
    //   "spendAllocationDate":"2018-09-20T12:41:59.582Z",
    //   "spendAllocationDescription":"Peter Pipers Poulty Portions for Pets",
    //   "investmentId":"FFF6A68D-DB19-4CD3-97B0-01C1A793ED3B",
    //   "oifpRegistrationNumber":"D0884B20-385D-489E-A9FD-2B6DBE5FEA43",
    //   "spendId": "1234"
    // }

    for (let investment of investmentMap) {
      let investmentId = investment[0];
      let investmentInfo = investment[1]['Record'];
      //calculate how much of the investment's amount remains available for spending
      let investmentAmount = investmentInfo['investmentAmount'];
      if (investmentSpendMap.has(investmentId)) {
        spendAmountForInvestor = investmentSpendMap.get(investmentId);
      }
      else {
        spendAmountForInvestor = 0;
      }
      let availableAmountForInvestor = investmentAmount - spendAmountForInvestor;
      //if the investment does not have sufficient funds to cover their allocation, then allocate
      //all of the outstanding investment funds
      let amountAllocatedToInvestment = 0;
      if (availableAmountForInvestor >= spendPerInvestment) {
        amountAllocatedToInvestment = spendPerInvestment;
        console.log('##### allocateSpend - investment ID ' + investmentId + ' has sufficient funds to cover full allocation. Allocating: ' + amountAllocatedToInvestment);
      }
      else if (availableAmountForInvestor > 0) {
        amountAllocatedToInvestment = availableAmountForInvestor;
        // reduce the number of investments available since this investment record is fully allocated
        numberOfInvestments -= 1;
        console.log('##### allocateSpend - investment ID ' + investmentId + ' does not have sufficient funds to cover full allocation. Using all available funds: ' + amountAllocatedToInvestment);
      }
      else {
        // reduce the number of investments available since this investment record is fully allocated
        numberOfInvestments -= 1;
        console.log('##### allocateSpend - investment ID ' + investmentId + ' has no funds available at all. Available amount: ' + availableAmountForInvestor + '. This investment ID will be ignored');
        continue;
      }
      // add a new spendAllocation record containing the portion of a investment allocated to this spend
      //
      // spendAllocationId is (hopefully) using an ID created in a deterministic manner, meaning it should
      // be identical on all endorsing peer nodes. If it isn't, the transaction validation process will fail
      // when Fabric compares the write-sets for each transaction and discovers there is are different values.
      let spendAllocationId = stub.getTxID() + '-' + recordCounter;
      recordCounter++;
      let key = 'spendAllocation' + spendAllocationId;
      let spendAllocationRecord = {
        docType: 'spendAllocation',
        spendAllocationId: spendAllocationId,
        spendAllocationAmount: amountAllocatedToInvestment,
        spendAllocationDate: spend['spendDate'],
        spendAllocationDescription: spend['spendDescription'],
        investmentId: investmentId,
        oifpRegistrationNumber: oifp,
        spendId: spend['spendId']
      }; 

      console.log('##### allocateSpend - creating spendAllocationRecord record: ' + JSON.stringify(spendAllocationRecord));
      await stub.putState(key, Buffer.from(JSON.stringify(spendAllocationRecord)));

      //reduce the total spend amount by the amount just spent in the OIFPSpendInvestmentAllocation record
      spendAmount -= amountAllocatedToInvestment;

      //update the spending map entry for this OIFP. There may be no existing spend, in which case we'll create an entry in the map
      if (investmentSpendMap.has(investmentId)) {
        let spendAmt = investmentSpendMap.get(investmentId);
        spendAmt += amountAllocatedToInvestment;
        investmentSpendMap.set(investmentId, spendAmt);
        console.log('##### allocateSpend - investmentSpendMap - updating spend entry for investment Id: ' + investmentId + ' with spent amount allocated to investment: ' + amountAllocatedToInvestment + ' - total amount of this investment now spent is: ' + spendAmt);
      }
      else {
        investmentSpendMap.set(investmentId, amountAllocatedToInvestment);
        console.log('##### allocateSpend - investmentSpendMap - adding new spend entry for investment ID: ' + investmentId + ' with spent amount allocated to investment: ' + amountAllocatedToInvestment);
      }
    }
  }
  console.log('============= END : allocateSpend ===========');
}  

/************************************************************************************************
 * 
 * CHAINCODE
 * 
 ************************************************************************************************/

let Chaincode = class {

  /**
   * Initialize the state when the chaincode is either instantiated or upgraded
   * 
   * @param {*} stub 
   */
  async Init(stub) {
    console.log('=========== Init: Instantiated / Upgraded oifp chaincode ===========');
    return shim.success();
  }

  /**
   * The Invoke method will call the methods below based on the method name passed by the calling
   * program.
   * 
   * @param {*} stub 
   */
  async Invoke(stub) {
    console.log('============= START : Invoke ===========');
    let ret = stub.getFunctionAndParameters();
    console.log('##### Invoke args: ' + JSON.stringify(ret));

    let method = this[ret.fcn];
    if (!method) {
      console.error('##### Invoke - error: no chaincode function with name: ' + ret.fcn + ' found');
      throw new Error('No chaincode function with name: ' + ret.fcn + ' found');
    }
    try {
      let response = await method(stub, ret.params);
      console.log('##### Invoke response payload: ' + response);
      return shim.success(response);
    } catch (err) {
      console.log('##### Invoke - error: ' + err);
      return shim.error(err);
    }
  }

  /**
   * Initialize the state. This should be explicitly called if required.
   * 
   * @param {*} stub 
   * @param {*} args 
   */
  async initLedger(stub, args) {
    console.log('============= START : Initialize Ledger ===========');
    console.log('============= END : Initialize Ledger ===========');
  }

  /************************************************************************************************
   * 
   * Investor functions 
   * 
   ************************************************************************************************/

   /**
   * Creates a new investor
   * 
   * @param {*} stub 
   * @param {*} args - JSON as follows:
   * {
   *    "investorUserName":"edge",
   *    "email":"edge@abc.com",
   *    "registeredDate":"2018-10-22T11:52:20.182Z"
   * }
   */
  async createInvestor(stub, args) {
    console.log('============= START : createInvestor ===========');
    console.log('##### createInvestor arguments: ' + JSON.stringify(args));

    // args is passed as a JSON string
    let json = JSON.parse(args);
    let key = 'investor' + json['investorUserName'];
    json['docType'] = 'investor';

    console.log('##### createInvestor payload: ' + JSON.stringify(json));

    // Check if the investor already exists
    let investorQuery = await stub.getState(key);
    if (investorQuery.toString()) {
      throw new Error('##### createInvestor - This investor already exists: ' + json['investorUserName']);
    }

    await stub.putState(key, Buffer.from(JSON.stringify(json)));
    console.log('============= END : createInvestor ===========');
  }

  /**
   * Retrieves a specfic investor
   * 
   * @param {*} stub 
   * @param {*} args 
   */
  async queryInvestor(stub, args) {
    console.log('============= START : queryInvestor ===========');
    console.log('##### queryInvestor arguments: ' + JSON.stringify(args));

    // args is passed as a JSON string
    let json = JSON.parse(args);
    let key = 'investor' + json['investorUserName'];
    console.log('##### queryInvestor key: ' + key);

    return queryByKey(stub, key);
  }

  /**
   * Retrieves all investors
   * 
   * @param {*} stub 
   * @param {*} args 
   */
  async queryAllInvestors(stub, args) {
    console.log('============= START : queryAllInvestors ===========');
    console.log('##### queryAllInvestors arguments: ' + JSON.stringify(args));
 
    let queryString = '{"selector": {"docType": "investor"}}';
    return queryByString(stub, queryString);
  }

  /************************************************************************************************
   * 
   * OIFP functions 
   * 
   ************************************************************************************************/

  /**
   * Creates a new OIFP
   * 
   * @param {*} stub 
   * @param {*} args - JSON as follows:
   * {
   *    "oifpRegistrationNumber":"6322",
   *    "oifpName":"Pets In Need",
   *    "oifpDescription":"We help pets in need",
   *    "address":"1 Pet street",
   *    "contactNumber":"82372837",
   *    "contactEmail":"pets@petco.com"
   * }
   */
  async createOIFP(stub, args) {
    console.log('============= START : createOIFP ===========');
    console.log('##### createOIFP arguments: ' + JSON.stringify(args));

    // args is passed as a JSON string
    let json = JSON.parse(args);
    let key = 'oifp' + json['oifpRegistrationNumber'];
    json['docType'] = 'oifp';

    console.log('##### createOIFP payload: ' + JSON.stringify(json));

    // Check if the OIFP already exists
    let oifpQuery = await stub.getState(key);
    if (oifpQuery.toString()) {
      throw new Error('##### createOIFP - This OIFP already exists: ' + json['oifpRegistrationNumber']);
    }

    await stub.putState(key, Buffer.from(JSON.stringify(json)));
    console.log('============= END : createOIFP ===========');
  }

  /**
   * Retrieves a specfic oifp
   * 
   * @param {*} stub 
   * @param {*} args 
   */
  async queryOIFP(stub, args) {
    console.log('============= START : queryOIFP ===========');
    console.log('##### queryOIFP arguments: ' + JSON.stringify(args));

    // args is passed as a JSON string
    let json = JSON.parse(args);
    let key = 'oifp' + json['oifpRegistrationNumber'];
    console.log('##### queryOIFP key: ' + key);

    return queryByKey(stub, key);
  }

  /**
   * Retrieves all oifps
   * 
   * @param {*} stub 
   * @param {*} args 
   */
  async queryAllOIFPs(stub, args) {
    console.log('============= START : queryAllOIFPs ===========');
    console.log('##### queryAllOIFPs arguments: ' + JSON.stringify(args));
 
    let queryString = '{"selector": {"docType": "oifp"}}';
    return queryByString(stub, queryString);
  }

  /************************************************************************************************
   * 
   * Investment functions 
   * 
   ************************************************************************************************/

  /**
   * Creates a new Investment
   * 
   * @param {*} stub 
   * @param {*} args - JSON as follows:
   * {
   *    "investmentId":"2211",
   *    "investmentAmount":100,
   *    "investmentDate":"2018-09-20T12:41:59.582Z",
   *    "investorUserName":"edge",
   *    "oifpRegistrationNumber":"6322"
   * }
   */
  async createInvestment(stub, args) {
    console.log('============= START : createInvestment ===========');
    console.log('##### createInvestment arguments: ' + JSON.stringify(args));

    // args is passed as a JSON string
    let json = JSON.parse(args);
    let key = 'investment' + json['investmentId'];
    json['docType'] = 'investment';

    console.log('##### createInvestment investment: ' + JSON.stringify(json));

    // Confirm the OIFP exists
    let oifpKey = 'oifp' + json['oifpRegistrationNumber'];
    let oifpQuery = await stub.getState(oifpKey);
    if (!oifpQuery.toString()) {
      throw new Error('##### createInvestment - Cannot create investment as the OIFP does not exist: ' + json['oifpRegistrationNumber']);
    }

    // Confirm the investor exists
    let investorKey = 'investor' + json['investorUserName'];
    let investorQuery = await stub.getState(investorKey);
    if (!investorQuery.toString()) {
      throw new Error('##### createInvestment - Cannot create investment as the Investor does not exist: ' + json['investorUserName']);
    }

    // Check if the Investment already exists
    let investmentQuery = await stub.getState(key);
    if (investmentQuery.toString()) {
      throw new Error('##### createInvestment - This Investment already exists: ' + json['investmentId']);
    }

    await stub.putState(key, Buffer.from(JSON.stringify(json)));
    console.log('============= END : createInvestment ===========');
  }

  /**
   * Retrieves a specfic investment
   * 
   * @param {*} stub 
   * @param {*} args 
   */
  async queryInvestment(stub, args) {
    console.log('============= START : queryInvestment ===========');
    console.log('##### queryInvestment arguments: ' + JSON.stringify(args));

    // args is passed as a JSON string
    let json = JSON.parse(args);
    let key = 'investment' + json['investmentId'];
    console.log('##### queryInvestment key: ' + key);
    return queryByKey(stub, key);
  }

  /**
   * Retrieves investments for a specfic investor
   * 
   * @param {*} stub 
   * @param {*} args 
   */
  async queryInvestmentsForInvestor(stub, args) {
    console.log('============= START : queryInvestmentsForInvestor ===========');
    console.log('##### queryInvestmentsForInvestor arguments: ' + JSON.stringify(args));

    // args is passed as a JSON string
    let json = JSON.parse(args);
    let queryString = '{"selector": {"docType": "investment", "investorUserName": "' + json['investorUserName'] + '"}}';
    return queryByString(stub, queryString);
  }

  /**
   * Retrieves investments for a specfic oifp
   * 
   * @param {*} stub 
   * @param {*} args 
   */
  async queryInvestmentsForOIFP(stub, args) {
    console.log('============= START : queryInvestmentsForOIFP ===========');
    console.log('##### queryInvestmentsForOIFP arguments: ' + JSON.stringify(args));

    // args is passed as a JSON string
    let json = JSON.parse(args);
    let queryString = '{"selector": {"docType": "investment", "oifpRegistrationNumber": "' + json['oifpRegistrationNumber'] + '"}}';
    return queryByString(stub, queryString);
  }

  /**
   * Retrieves all investments
   * 
   * @param {*} stub 
   * @param {*} args 
   */
  async queryAllInvestments(stub, args) {
    console.log('============= START : queryAllInvestments ===========');
    console.log('##### queryAllInvestments arguments: ' + JSON.stringify(args)); 
    let queryString = '{"selector": {"docType": "investment"}}';
    return queryByString(stub, queryString);
  }

  /************************************************************************************************
   * 
   * Spend functions 
   * 
   ************************************************************************************************/

  /**
   * Creates a new Spend
   * 
   * @param {*} stub 
   * @param {*} args - JSON as follows:
   * {
   *    "oifpRegistrationNumber":"6322",
   *    "spendId":"2",
   *    "spendDescription":"Peter Pipers Poulty Portions for Pets",
   *    "spendDate":"2018-09-20T12:41:59.582Z",
   *    "spendAmount":33,
   * }
   */
  async createSpend(stub, args) {
    console.log('============= START : createSpend ===========');
    console.log('##### createSpend arguments: ' + JSON.stringify(args));

    // args is passed as a JSON string
    let json = JSON.parse(args);
    let key = 'spend' + json['spendId'];
    json['docType'] = 'spend';

    console.log('##### createSpend spend: ' + JSON.stringify(json));

    // Confirm the OIFP exists
    let oifpKey = 'oifp' + json['oifpRegistrationNumber'];
    let oifpQuery = await stub.getState(oifpKey);
    if (!oifpQuery.toString()) {
      throw new Error('##### createInvestment - Cannot create spend record as the OIFP does not exist: ' + json['oifpRegistrationNumber']);
    }

    // Check if the Spend already exists
    let spendQuery = await stub.getState(key);
    if (spendQuery.toString()) {
      throw new Error('##### createSpend - This Spend already exists: ' + json['spendId']);
    }

    await allocateSpend(stub, json);

    await stub.putState(key, Buffer.from(JSON.stringify(json)));
    console.log('============= END : createSpend ===========');
  }

  /**
   * Retrieves a specfic spend
   * 
   * @param {*} stub 
   * @param {*} args 
   */
  async querySpend(stub, args) {
    console.log('============= START : querySpend ===========');
    console.log('##### querySpend arguments: ' + JSON.stringify(args));

    // args is passed as a JSON string
    let json = JSON.parse(args);
    let key = 'spend' + json['spendId'];
    console.log('##### querySpend key: ' + key);
    return queryByKey(stub, key);
  }

  /**
   * Retrieves spend for a specfic oifp
   * 
   * @param {*} stub 
   * @param {*} args 
   */
  async querySpendForOIFP(stub, args) {
    console.log('============= START : querySpendForOIFP ===========');
    console.log('##### querySpendForOIFP arguments: ' + JSON.stringify(args));

    // args is passed as a JSON string
    let json = JSON.parse(args);
    let queryString = '{"selector": {"docType": "spend", "oifpRegistrationNumber": "' + json['oifpRegistrationNumber'] + '"}}';
    return queryByString(stub, queryString);
  }

  /**
   * Retrieves all spend
   * 
   * @param {*} stub 
   * @param {*} args 
   */
  async queryAllSpend(stub, args) {
    console.log('============= START : queryAllSpends ===========');
    console.log('##### queryAllSpends arguments: ' + JSON.stringify(args)); 
    let queryString = '{"selector": {"docType": "spend"}}';
    return queryByString(stub, queryString);
  }

  /************************************************************************************************
   * 
   * SpendAllocation functions 
   * 
   ************************************************************************************************/

  /**
   * There is no CREATE SpendAllocation - the allocations are created in the function: allocateSpend
   * 
   * SPENDALLOCATION records look as follows:
   *
   * {
   *   "docType":"spendAllocation",
   *   "spendAllocationId":"c5b39e938a29a80c225d10e8327caaf817f76aecd381c868263c4f59a45daf62-1",
   *   "spendAllocationAmount":38.5,
   *   "spendAllocationDate":"2018-09-20T12:41:59.582Z",
   *   "spendAllocationDescription":"Peter Pipers Poulty Portions for Pets",
   *   "investmentId":"FFF6A68D-DB19-4CD3-97B0-01C1A793ED3B",
   *   "oifpRegistrationNumber":"D0884B20-385D-489E-A9FD-2B6DBE5FEA43",
   *   "spendId": "1234"
   * }
   */

  /**
   * Retrieves a specfic spendAllocation
   * 
   * @param {*} stub 
   * @param {*} args 
   */
  async querySpendAllocation(stub, args) {
    console.log('============= START : querySpendAllocation ===========');
    console.log('##### querySpendAllocation arguments: ' + JSON.stringify(args));

    // args is passed as a JSON string
    let json = JSON.parse(args);
    let key = 'spendAllocation' + json['spendAllocationId'];
    console.log('##### querySpendAllocation key: ' + key);
    return queryByKey(stub, key);
  }

  /**
   * Retrieves the spendAllocation records for a specific Investment
   * 
   * @param {*} stub 
   * @param {*} args 
   */
  async querySpendAllocationForInvestment(stub, args) {
    console.log('============= START : querySpendAllocationForInvestment ===========');
    console.log('##### querySpendAllocationForInvestment arguments: ' + JSON.stringify(args));

    // args is passed as a JSON string
    let json = JSON.parse(args);
    let queryString = '{"selector": {"docType": "spendAllocation", "investmentId": "' + json['investmentId'] + '"}}';
    return queryByString(stub, queryString);
  }

  /**
   * Retrieves the spendAllocation records for a specific Spend record
   * 
   * @param {*} stub 
   * @param {*} args 
   */
  async querySpendAllocationForSpend(stub, args) {
    console.log('============= START : querySpendAllocationForSpend ===========');
    console.log('##### querySpendAllocationForSpend arguments: ' + JSON.stringify(args));

    // args is passed as a JSON string
    let json = JSON.parse(args);
    let queryString = '{"selector": {"docType": "spendAllocation", "spendId": "' + json['spendId'] + '"}}';
    return queryByString(stub, queryString);
  }

  /**
   * Retrieves all spendAllocations
   * 
   * @param {*} stub 
   * @param {*} args 
   */
  async queryAllSpendAllocations(stub, args) {
    console.log('============= START : queryAllSpendAllocations ===========');
    console.log('##### queryAllSpendAllocations arguments: ' + JSON.stringify(args)); 
    let queryString = '{"selector": {"docType": "spendAllocation"}}';
    return queryByString(stub, queryString);
  }

  /************************************************************************************************
   * 
   * Ratings functions 
   * 
   ************************************************************************************************/

  /**
   * Creates a new Rating
   * 
   * @param {*} stub 
   * @param {*} args - JSON as follows:
   * {
   *    "oifpRegistrationNumber":"6322",
   *    "investorUserName":"edge",
   *    "rating":1,
   * }
   */
  async createRating(stub, args) {
    console.log('============= START : createRating ===========');
    console.log('##### createRating arguments: ' + JSON.stringify(args));

    // args is passed as a JSON string
    let json = JSON.parse(args);
    let key = 'rating' + json['oifpRegistrationNumber'] + json['investorUserName'];
    json['docType'] = 'rating';

    console.log('##### createRating payload: ' + JSON.stringify(json));

    // Check if the Rating already exists
    let ratingQuery = await stub.getState(key);
    if (ratingQuery.toString()) {
      throw new Error('##### createRating - Rating by investor: ' +  json['investorUserName'] + ' for OIFP: ' + json['oifpRegistrationNumber'] + ' already exists');
    }

    await stub.putState(key, Buffer.from(JSON.stringify(json)));
    console.log('============= END : createRating ===========');
  }

  /**
   * Retrieves ratings for a specfic oifp
   * 
   * @param {*} stub 
   * @param {*} args 
   */
  async queryRatingsForOIFP(stub, args) {
    console.log('============= START : queryRatingsForOIFP ===========');
    console.log('##### queryRatingsForOIFP arguments: ' + JSON.stringify(args));

    // args is passed as a JSON string
    let json = JSON.parse(args);
    let queryString = '{"selector": {"docType": "rating", "oifpRegistrationNumber": "' + json['oifpRegistrationNumber'] + '"}}';
    return queryByString(stub, queryString);
  }

  /**
   * Retrieves ratings for an oifp made by a specific investor
   * 
   * @param {*} stub 
   * @param {*} args 
   */
  async queryInvestorRatingsForOIFP(stub, args) {
    console.log('============= START : queryInvestorRatingsForOIFP ===========');
    console.log('##### queryInvestorRatingsForOIFP arguments: ' + JSON.stringify(args));

    // args is passed as a JSON string
    let json = JSON.parse(args);
    let key = 'rating' + json['oifpRegistrationNumber'] + json['investorUserName'];
    console.log('##### queryInvestorRatingsForOIFP key: ' + key);
    return queryByKey(stub, key);
  }

  /************************************************************************************************
   * 
   * Blockchain related functions 
   * 
   ************************************************************************************************/

  /**
   * Retrieves the Fabric block and transaction details for a key or an array of keys
   * 
   * @param {*} stub 
   * @param {*} args - JSON as follows:
   * [
   *    {"key": "a207aa1e124cc7cb350e9261018a9bd05fb4e0f7dcac5839bdcd0266af7e531d-1"}
   * ]
   * 
   */
  async queryHistoryForKey(stub, args) {
    console.log('============= START : queryHistoryForKey ===========');
    console.log('##### queryHistoryForKey arguments: ' + JSON.stringify(args));

    // args is passed as a JSON string
    let json = JSON.parse(args);
    let key = json['key'];
    let docType = json['docType']
    console.log('##### queryHistoryForKey key: ' + key);
    let historyIterator = await stub.getHistoryForKey(docType + key);
    console.log('##### queryHistoryForKey historyIterator: ' + util.inspect(historyIterator));
    let history = [];
    while (true) {
      let historyRecord = await historyIterator.next();
      console.log('##### queryHistoryForKey historyRecord: ' + util.inspect(historyRecord));
      if (historyRecord.value && historyRecord.value.value.toString()) {
        let jsonRes = {};
        console.log('##### queryHistoryForKey historyRecord.value.value: ' + historyRecord.value.value.toString('utf8'));
        jsonRes.TxId = historyRecord.value.tx_id;
        jsonRes.Timestamp = historyRecord.value.timestamp;
        jsonRes.IsDelete = historyRecord.value.is_delete.toString();
      try {
          jsonRes.Record = JSON.parse(historyRecord.value.value.toString('utf8'));
        } catch (err) {
          console.log('##### queryHistoryForKey error: ' + err);
          jsonRes.Record = historyRecord.value.value.toString('utf8');
        }
        console.log('##### queryHistoryForKey json: ' + util.inspect(jsonRes));
        history.push(jsonRes);
      }
      if (historyRecord.done) {
        await historyIterator.close();
        console.log('##### queryHistoryForKey all results: ' + JSON.stringify(history));
        console.log('============= END : queryHistoryForKey ===========');
        return Buffer.from(JSON.stringify(history));
      }
    }
  }
}
shim.start(new Chaincode());
