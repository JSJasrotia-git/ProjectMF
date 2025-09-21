import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Readjson } from '../services/readjson';
import { mymfdatajson, MFdatenav, MfMeta, PosNegRollingRet_Nav, Inttakeaways, Intmfdetails} from '../interfaces/intdateprice';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-midleft',
  imports: [CommonModule],
  templateUrl: './midleft.html',
  styleUrl: './midleft.css'
})
export class Midleft{
  _apiservice = inject(Readjson); //to be able to call service functions, injecting the service.
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
  _mfdetails: Intmfdetails[] = [];
  _takeaways: PosNegRollingRet_Nav[] = [];
  _datatakeaways: Inttakeaways[] = [];
  _beginingtexttoshow = "There is a : ";
  _endingtexttoshow = " chance that your capital is at risk within ";
  _finaltexttoshow = "";
  _numofdays: number = 30;
  _mfnum: number = 0;
  _mymfdata: mymfdatajson[] = [];

  //Just a Async function to put in await for the data to be available.
  async loadDataAndProceed() {
    await this.LoadmfdataAsync();
  }
  //Function to get the JSON data using function getdata from readjson service
  async LoadmfdataAsync() {
    this._jsondataformf = await firstValueFrom(this._apiservice.getdata());
    this._navdata = this.extractNavData();
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
  //Function to reste the values to receive
  resetValues(){
    this._navdata.length = 0;   // Clear all elements from _navdata
    this._takeaways.length = 0;   // Clear all elements from _posrollingret
    this._datatakeaways.length = 0;   // Clear all elements from _posrollingret
    this._mfdetails.length = 0;   // Clear all elements from _posrollingret

  }
  //This function gets called once the User enters the MF number and Rolling Ret Number.
  async MFDetails(MfNum:any, Numofdays:any){
    //Trim both the MfNum and Numofdays
    // console.log("trimming will be: ", MfNum.Trim)  ;
      MfNum = MfNum.trim();
      Numofdays = Numofdays.trim();
    //validation for MF number
      if (!Number.isNaN(Number(MfNum))) {
        //we can move fwd, else we need to provide an error and return
        this._mfnum = Number(MfNum);
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
      this.resetValues(); //Reset the variables to receive the updated values.
      //Now call the service function and get the Data from JSON
      this._apiservice.setURL("/"+this._mfnum); //Set the MF Number
      await this.loadDataAndProceed(); //call the local async function.
      if(!this.checkmfexists()){
       //just continue   
        alert("Please cross check the scheme code, it should be a 6 digit code. Thanks.");   
        return;  
      }else{ //MF Code does not exit;
        //Get the rolling return
        if(this._navdata.length <= this._numofdays){
          alert("Pls provide a lower number of days for Rolling return. Data in the fund is less than the #of days of Rolling Return");
          return;
        }
        this._apiservice.initializetakeaways();
        this._apiservice.initializedatatakeaways();
        this._apiservice.setmfdetails();
        this._apiservice.calculateRollingRet(this._navdata, this._schemedetails, this._numofdays);
        this._takeaways = [...this._apiservice.gettakeaways()];
        // console.log("from component takeaways", this._takeaways);
        this._datatakeaways = [...this._apiservice.getdatatakeaways()];
        this._finaltexttoshow = this._apiservice.getfinaltext();  
        this._mfdetails = [...this._apiservice.getmfdetails()]; 
      }
  }
}
