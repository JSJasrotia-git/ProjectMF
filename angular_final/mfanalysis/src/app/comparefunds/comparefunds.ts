import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Readjson } from '../services/readjson';
import { mymfdatajson, MFdatenav, MfMeta, PosNegRollingRet_Nav, Inttakeaways, Intmfdetails} from '../interfaces/intdateprice';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-comparefunds',
  imports: [CommonModule],
  templateUrl: './comparefunds.html',
  styleUrl: './comparefunds.css'
})
export class Comparefunds {
  _apiservice = inject(Readjson); //to be able to call service functions, injecting the service.
  _numofdays: number = 30;
  _mfnum1: number = 0;
  _mfnum2: number = 0;
  _navdata: MFdatenav[] = []; // to get Json data from Service
  _schemedetails: MfMeta = {
    fund_house: '',
    scheme_type: '',
    scheme_category: '',
    scheme_code: 0,
    scheme_name: '',
    isin_growth: null,
    isin_div_reinvestment: null
  };
  _jsondataformf: any = []; //to hold data from the getdata function from readjson service
  _mfdetailsfundone: Intmfdetails[] = [];
  _mfdetailsfundtwo: Intmfdetails[] = [];
  _takeaways: PosNegRollingRet_Nav[] = [];
  _datatakeaways: Inttakeaways[] = [];
  _fundonedatatakeaways: Inttakeaways[] = [];
  _fundtwodatatakeaways: Inttakeaways[] = [];
  _beginingtexttoshow = "There is a : ";
  _endingtexttoshow = " chance that your capital is at risk within ";
  _finaltexttoshow = "";
  _mymfdata: mymfdatajson[] = [];
  _totaldatapointsone:number = 0;
  _totaldatapointstwo:number = 0;
  _restrictdatapoints:number = 0;

  // Function to set background color based on the rolling return value
  getRollingRetColor(rollingret: string): string {
    if (rollingret === 'N.A') return 'grey';
    return parseFloat(rollingret) > 0 ? 'green' : 'red';
  }

  //Function to reste the values to receive
  resetValues(){
    // this._navdata.length = 0;   // Initialized within the Loadmfdata function
    this._takeaways.length = 0;   // Clear all elements from takeaways
    this._datatakeaways.length = 0;   // Clear all elements from datatakeaways
    this._mfdetailsfundone.length = 0;   // Clear all elements from fundonedetails
    this._mfdetailsfundtwo.length = 0;   // Clear all elements from fundtwodetails
    this._fundonedatatakeaways.length = 0; // Clear all the data that has to come in takeaways one
    this._fundtwodatatakeaways.length = 0; //Clear all the data that has to come in takeaways two
    this._totaldatapointsone = 0;
    this._totaldatapointstwo = 0;
  }

    //Just a Async function to put in await for the data to be available.
    async loadDataAndProceed() {
      await this.LoadmfdataAsync();
    }

    //This function checks the data in both the given MF numbers and reeturns the time period to restrict this data to
    async getmaxdatapoints(mf1:number, mf2:number, numofdays:number){
      this._apiservice.setURL("/"+mf1); //Set the MF Number
      // console.log("checking for fund 1", this._mfnum1);
      await this.loadDataAndProceed(); //call the local async function.
      if(!this.checkmfexists()){
       //just continue   
        alert("Please cross check the scheme code 1, it should be a 6 digit code. Thanks.");   
        return false;  
      }
      this._restrictdatapoints = this._navdata.length;
      this._totaldatapointsone = this._navdata.length;
      //Call to check the length of fund 2
      this._apiservice.setURL("/"+mf2); //Set the MF Number
      // console.log("checking for fund 1", this._mfnum1);
      await this.loadDataAndProceed(); //call the local async function.
      if(!this.checkmfexists()){
       //just continue   
        alert("Please cross check the scheme code 2, it should be a 6 digit code. Thanks.");   
        return false;  
      }
      if(this._restrictdatapoints > this._navdata.length){
        //set the restricted data points to lower value
        this._restrictdatapoints = this._navdata.length;
      }
      this._totaldatapointstwo = this._navdata.length;
      //check number of days, should eb less than the restrictdatapoints
      if(this._restrictdatapoints <= numofdays){
        //return false and ask user to agin puch in a lower number for # of days
        alert("Please provide a lower number for rolling return, it's more than the data available in the atleast one of the funds . Thanks."); 
        return false;
      }
      this._totaldatapointstwo = this._navdata.length;
      return true;
    }
    //Function to get the JSON data using function getdata from readjson service
    async LoadmfdataAsync() {
      // console.log("currently in LoadmfdataAsync function");
      this._navdata.length = 0; //Initialize where we will get the data.
      // this._schemedetails.length = 0;
      this._jsondataformf = await firstValueFrom(this._apiservice.getdata());
      this._navdata = this.extractNavData();
      // console.log("The navdata is: ", this._navdata);
      // console.log("The data in nav from load function is:", this._navdata);
      this._schemedetails = this._jsondataformf?.meta ?? {
        fund_house: '',
        scheme_type: '',
        scheme_category: '',
        scheme_code: 0,
        scheme_name: '',
        isin_growth: null,
        isin_div_reinvestment: null
      };
    }
    //Function to extract Dat Nav from response
    extractNavData(): MFdatenav[] {
    return this._jsondataformf?.data ?? [];
    }
  
    //Function to check if MF exists in our mymfdata
    checkmfexists(){
      // add the code to check if the mfnumber mathces with the allowed DataTransferItemList.
      let _exists: boolean = true;
      // console.log("Reached here, data in fund house is: ", this._schemedetails.fund_house);
      if(this._schemedetails.fund_house == undefined){ //returns undefined in the case of wrong fund code.
        _exists = false;
      }
      // console.log("Going to Return ", _exists);
      return _exists;
    }
//This function gets called once the User enters the MF number and Rolling Ret Number.
  async comparefunds(MfNum1:any, MfNum2:any, Numofdays:any){
    //Trim both the MfNum and Numofdays
    // console.log("trimming will be: ", MfNum.Trim)  ;
      MfNum1 = MfNum1.trim();
      MfNum2 = MfNum2.trim();
      Numofdays = Numofdays.trim();
    //validation for MF number1
      if (!Number.isNaN(Number(MfNum1))) {
        //we can move fwd, else we need to provide an error and return
        this._mfnum1 = Number(MfNum1);
       } else {
        alert("Please enter valid MF number");
        return;
       }
       //validation for MF number2
      if (!Number.isNaN(Number(MfNum2))) {
        //we can move fwd, else we need to provide an error and return
        this._mfnum2 = Number(MfNum2);
       } else {
        alert("Please enter valid MF number");
        return;
       }
    //Validation for Num of days
      if (!Number.isNaN(Number(Numofdays)) && (Number(Numofdays) >= 2)) {
        //we can move fwd, else we need to provide an error and return
        this._numofdays = Number(Numofdays);
      } else {
        alert("Speficy 2 or more");
        return;
      }

      //We need a function to map the provided MFnum with the JSON mymfdata..this should contain just the numbers.
      //Before we reset the data, we need to get the data once and then proceed.
      this._restrictdatapoints = 0;

      if(!this.getmaxdatapoints(this._mfnum1, this._mfnum2, this._numofdays)){
        //return if the MF code is not proper.
        return;
      };

      this.resetValues();
       this._apiservice.setURL("/"+ this._mfnum1); //Set the MF Number
      // console.log("checking for fund 1", this._mfnum1);
      await this.loadDataAndProceed(); //call the local async function.     
      this._apiservice.initializetakeaways();
      this._apiservice.initializedatatakeaways();
      this._apiservice.setmfdetails();
      // Get Rolling return
      this._apiservice.calculateRollingRet(this._navdata, this._schemedetails, this._numofdays, this._restrictdatapoints);
      //Get takeaways
      this._fundonedatatakeaways = [...this._apiservice.getdatatakeaways()]; // Clone array now to get clean data
      //Get fund details.
      this._mfdetailsfundone = [...this._apiservice.getmfdetails()];  // This we need only first time.
    
      ///Now get the data for Fund 2
      //Now call the service function and get the Data from JSON
      this._apiservice.setURL("/"+this._mfnum2); //Set the MF Number
      await this.loadDataAndProceed(); //call the local async function.     
      this._apiservice.initializetakeaways();
      this._apiservice.initializedatatakeaways();
      this._apiservice.getdatatakeaways(); //This we need
      this._apiservice.setmfdetails();
      //Calculate Rolling return for Fund 2
      this._apiservice.calculateRollingRet(this._navdata, this._schemedetails, this._numofdays, this._restrictdatapoints);
      //Get the fund 2 takeaways
      this._fundtwodatatakeaways = [...this._apiservice.getdatatakeaways()]; // Clone array now to ensure we get a clean data
      //Get the fund 2 mf details.
      this._mfdetailsfundtwo = [...this._apiservice.getmfdetails()];  // This we need only first time.
      }
  }
