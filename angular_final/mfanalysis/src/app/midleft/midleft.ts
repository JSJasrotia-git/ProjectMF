import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Readjson } from '../services/readjson';
import { mymfdatajson, MFdatenav, MfMeta, PosNegRollingRet_Nav, Inttakeaways, Intmfdetails} from '../interfaces/intdateprice';
import { firstValueFrom, take } from 'rxjs';
import { mymfdata } from '../../assets/mfdetails.json'; //this will supply the initial mf numbers to be validated.

@Component({
  selector: 'app-midleft',
  imports: [CommonModule],
  templateUrl: './midleft.html',
  styleUrl: './midleft.css'
})
export class Midleft{
  _apiservice = inject(Readjson); //to be able to call service functions, injecting the service.
  _navdata: MFdatenav[] = []; // to get Json data from Service
  _schemedetails: MfMeta = {} as MfMeta; //to get meta data for the scheme
  _jsondataformf: any = []; //to hold data from the getdata function from readjson service
  _mfdetails: Intmfdetails[] = [];
  _takeaways: PosNegRollingRet_Nav[] = [];
  _datatakeaways: Inttakeaways[] = [];
  _beginingtexttoshow = "There is a : ";
  _endingtexttoshow = " chance that your capital is at risk within ";
  _finaltexttoshow = "";
  _numofdays: number = 30;
  _mfnum: number = 0;
  _mymfdata: mymfdatajson[] = [];

  //loading the mymfdata to validate the MF number
  ngOnInit(): void {
    this._mymfdata = mymfdata;
   // console.log(this.data);
  } 

  //Just a Async function to put in await for the data to be available.
  async loadDataAndProceed() {
    await this.LoadmfdataAsync();
  }
  //Function to get the JSON data using function getdata from readjson service
  async LoadmfdataAsync() {
    this._jsondataformf = await firstValueFrom(this._apiservice.getdata());
    this._navdata = this.extractNavData();
    this._schemedetails = this._jsondataformf?.meta ?? {} as MfMeta;
  }
  //Function to extract Dat Nav from response
  extractNavData(): MFdatenav[] {
  return this._jsondataformf?.data ?? [];
  }
  //Function to extract meta data or Scheme Infomation from response
  // extractMFmeta(): MfMeta[] {
  // return this._schemedetails = this._jsondataformf?.meta ?? {} as MfMeta;
  // }

  addvaluestotakeaways(_date: string, _nav: string, _rollingret: string, _percentage: string ){
      let locmfdetails: PosNegRollingRet_Nav[] = [];
      locmfdetails.push( {
      date: _date,
      nav: _nav,
      rollingret: _rollingret,
      percentage: _percentage
    });
    this._takeaways.push(...locmfdetails);
  }

  //Function to check if MF exists in our mymfdata
  checkmfexists(){
    // add the code to check if the mfnumber mathces with the allowed DataTransferItemList.
    let _exists: boolean = false;
    for (let i = 0; i < (this._mymfdata.length); i++){
      if(this._mymfdata[i].schemecode === this._mfnum){
        _exists = true;
        break;
      }
    }
    console.log(this._mfnum);
    return _exists;
  }
  // Function to set background color based on the rolling return value
  getRollingRetColor(rollingret: string): string {
    if (rollingret === 'N.A') return 'grey';
    return parseFloat(rollingret) > 0 ? 'green' : 'red';
  }

    ///for splitting the data into 2
  get leftData(): any[] {
  return this._takeaways.slice(0, Math.ceil(this._takeaways.length / 2));
  }

  get rightData(): any[] {
  return this._takeaways.slice(Math.ceil(this._takeaways.length / 2));
  }

  //This function gets called once the User enters the MF number and Rolling Ret Number.
  async MFDetails(MfNum:any, Numofdays:any){
    //validation for MF number
      if (!Number.isNaN(Number(MfNum))) {
        //we can move fwd, else we need to provide an error and return
        this._numofdays = Number(Numofdays);
       } else {
        alert("Please enter valid MF number");
        return;
       }
    //Validation for Num of days
      if (!Number.isNaN(Number(Numofdays)) && (Number(Numofdays) >= 2)) {
        //we can move fwd, else we need to provide an error and return
        this._mfnum = Number(MfNum);
      } else {
        alert("Speficy 2 or more");
        return;
      }

      //We need a function to map the provided MFnum with the JSON mymfdata..this should contain just the numbers.
      if(!this.checkmfexists()){
        alert("The MF is not in valid");   
        return;     
      }


      //Clear the Nav values from previous calls
      if (this._navdata.length > 0) {
        this._navdata.length = 0;   // Clear all elements from _navdata
      }
      //Clear the Meta values from previous calls.
      this._schemedetails = {} as MfMeta;
      //Clear the takeaways returns values from previous calls.
      if (this._takeaways.length > 0) {
        this._takeaways.length = 0;   // Clear all elements from _posrollingret
      }
      //Clear the summary returns values from previous calls.
      if (this._datatakeaways.length > 0) {
        this._datatakeaways.length = 0;   // Clear all elements from _posrollingret
      }
       //Clear the mfdetails returns values from previous calls.
      if (this._mfdetails.length > 0) {
        this._mfdetails.length = 0;   // Clear all elements from _posrollingret
      }
      //Now call the service function and get the Data from JSON
      this._apiservice.setURL(MfNum); //Set the MF Number
      await this.loadDataAndProceed(); //call the local async function.
      //this.extractNavData(); //Extract the Data and NAV. Now data is available int the 2 variables _navdata and _schemedetails.
      //Move fwd with processing the data now.
      // this.extractMFmeta();
      console.log("immediately after getting values",this._schemedetails);
      this.calculateRollingRet();
  }

    //function to call rolling return
    calculateRollingRet() {
      let arraylength: number = this._navdata.length;
      let positivevals: number = 0;
      let negativevals: number = 0;
      let aggpostivepercentage: number = 0;
      let aggnegativepercentage: number = 0;
      //console.log("value of negativevals is : " + negativevals);
      if(this._navdata.length <= this._numofdays){
        alert("Pls provide a lower number of days for Rolling return. Data in the fund is less than the #of days of Rolling Return");
        return;
      }
      for (let i = 0; i < (this._navdata.length); i++) {
        if(i <= (this._navdata.length - (this._numofdays+1))){
          const currentNav = parseFloat(this._navdata[i].nav);
          const nextNav = parseFloat(this._navdata[i + this._numofdays].nav);
          const rollingret = currentNav - nextNav; // number
          const percentage = rollingret / nextNav; // number division
          // Format for display only
          const formattedRollingret = rollingret.toFixed(5);
          const formattedPercentage = (percentage * 100).toFixed(5);
          // We now have everything to populate the variable takeaways
          this.addvaluestotakeaways(this._navdata[i].date, this._navdata[i].nav, formattedRollingret, formattedPercentage)
          // Calculate takeaways
          if ((currentNav - nextNav) >= 0) {
            positivevals += 1;
            aggpostivepercentage += percentage;
          }else {
            negativevals += 1;
            aggnegativepercentage += percentage;
          } 
        }else{
          // this._navdata[i].rollingret = 'N.A';
          this.addvaluestotakeaways(this._navdata[i].date, this._navdata[i].nav, 'N.A', 'N.A');
        }
      }
      //Start filling the data that will shown in frontend HTML page
      let loctakeaway: Inttakeaways[] = [];
      loctakeaway.push( {
        rollingretdays: this._numofdays,
        totdatapoints: arraylength,
        applicabledatapoints: (arraylength - this._numofdays),
        postiverollingreturn: positivevals + ' / '+ (aggpostivepercentage/positivevals).toFixed(5) +'%',
        negativeRollingReturns: negativevals + ' / '+ (aggnegativepercentage/negativevals).toFixed(5) +'%',
        notapplicableRollingReturns: this._numofdays
      });
      this._datatakeaways.push(...loctakeaway);
      //build final message to show
      this._finaltexttoshow = this._beginingtexttoshow + (((negativevals*100)/loctakeaway[0].applicabledatapoints).toFixed(2)) + this._endingtexttoshow +loctakeaway[0].rollingretdays+ " days";
      //fill in the Intmfdetails details
      //console.log("Before filling in the values",this._schemedetails);
      const {
            fund_house,
            scheme_type,
            scheme_category,
            scheme_code,
            scheme_name,
            isin_growth,
            isin_div_reinvestment
          } = this._schemedetails;
      
      let FillmfDetails: Intmfdetails[] = [];
      FillmfDetails.push( {
        schemecode: String(scheme_code),
        schemename: scheme_name,
        schemecategory: scheme_category,
        date: this._navdata[0].date,
        nav: this._navdata[0].nav,
        retsummary: "For " + this._numofdays + " days, avg Positive rertun is: " + (aggpostivepercentage/positivevals).toFixed(5) +'%' + " Avg Negative return is: " + (aggnegativepercentage/negativevals).toFixed(5) +'%'
        });
      this._mfdetails.push(...FillmfDetails);
      console.log(this._mfdetails);
  }
}
