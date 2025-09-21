import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { SchemeNav, MFdatenav, PosNegRollingRet_Nav, Inttakeaways, Intmfdetails, MfMeta} from '../interfaces/intdateprice';

@Injectable({
  providedIn: 'root'
})
export class Readjson {
  private readonly _baseUrl = 'https://api.mfapi.in/mf';
  private _urltofetch = "";
  private finaltexttoshow = "";
  private http = inject(HttpClient);
  private _navdata : SchemeNav[] = []; // To store mapped SchemeNav data
  private takeaways: PosNegRollingRet_Nav[] = [];
  private datatakeaways: Inttakeaways[] = [];
  private mfdetails: Intmfdetails[] = [];
  // private navdata: MFdatenav[] = []; // to get Json data from Service
  //Set MF Details
  constructor(){
    this.datatakeaways.length = 0;
  }
  setmfdetails(){
    this.mfdetails.length = 0;
  }
  getmfdetails(){
    return this.mfdetails;
  }
  //Set the finaltext.
  setfinaltext(finaltext:string){
    this.finaltexttoshow = finaltext;
  }
  getfinaltext(){
    return this.finaltexttoshow;
  }
  //function to set the datatakeaways
  initializedatatakeaways(){
    this.datatakeaways.length = 0;
  }
  getdatatakeaways(){
    // console.log("From service data takeaways is :", this.datatakeaways)
    return this.datatakeaways;
  }

  //Function to set the URL that we want to fetch.
  initializetakeaways(){
    this.takeaways.length = 0;
  }
  gettakeaways(){
    // console.log("current value of takeways from service is: ", this.takeaways);
    return this.takeaways;
  }
  
  //function to set the URL we want.
  setURL(mfnum: string){
    this._urltofetch = this._baseUrl+mfnum;
    // console.log("the URL to fetch is: ", this._urltofetch);
  }
  getdata() {
    return this.http.get<any>(this._urltofetch);
  }
  setnavdata(navdat:SchemeNav[]){
    this._navdata = navdat;
    // console.log("Navdata is now set to: ", this._navdata);
  }
  getnavdata(){
    return this._navdata;
  }
  //Add values to takeaways.
  addvaluestotakeaways(_date: string, _nav: string, _rollingret: string, _percentage: string ){
      // console.log("Value of date passed  is: ", _date, "Nav is: ", _nav, "rolling return is: ", _rollingret );
      let locmfdetails: PosNegRollingRet_Nav[] = [];
      locmfdetails.push( {
      date: _date,
      nav: _nav,
      rollingret: _rollingret,
      percentage: _percentage
    });
    this.takeaways.push(...locmfdetails);
    // console.log("Value of locmfdetails is: ", locmfdetails);
    // console.log("While adding value of takeways from service is: ", this.takeaways);
  }
  //Function to calculate rolling returns.
  calculateRollingRet(navdata: MFdatenav[], schemedetails: MfMeta, numofdays:number, restrictdatapoints?: number) {
        // console.log("I am in calculaterolling return..service function")
        // console.log("data passed is: ", navdata, "and Number of daya:", numofdays)
        let beginingtexttoshow = "There is a : ";
        let endingtexttoshow = " chance that your capital is at risk within ";
        const maxDataPoints = restrictdatapoints ?? navdata.length;
        let arraylength: number = maxDataPoints;
        let positivevals: number = 0;
        let negativevals: number = 0;
        let aggpostivepercentage: number = 0;
        let aggnegativepercentage: number = 0;
        if(restrictdatapoints != null){

        }

        //console.log("value of negativevals is : " + negativevals);
        //Assume #of days check is in the component code itself
        for (let i = 0; i < (maxDataPoints); i++) {
          if(i <= (maxDataPoints - (numofdays+1))){
            // console.log("If condition meets inside calculaterolling ret");
            const currentNav = parseFloat(navdata[i].nav);
            const nextNav = parseFloat(navdata[i + numofdays].nav);
            const rollingret = currentNav - nextNav; // number
            // console.log("rolling return:", rollingret);
            const percentage = rollingret / nextNav; // number division
            // Format for display only
            const formattedRollingret = rollingret.toFixed(3);
            const formattedPercentage = (percentage * 100).toFixed(3);
            // We now have everything to populate the variable 
            // console.log("calling addvaluestotakeaways");
            this.addvaluestotakeaways(navdata[i].date, navdata[i].nav, formattedRollingret, formattedPercentage)
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
            this.addvaluestotakeaways(navdata[i].date, navdata[i].nav, 'N.A', 'N.A');
          }
        }
        //Start filling the data that will shown in frontend HTML page
        let loctakeaway: Inttakeaways[] = [];
        loctakeaway.push( {
          rollingretdays: numofdays,
          totdatapoints: arraylength,
          applicabledatapoints: (arraylength - numofdays),
          postiverollingreturn: positivevals + ' / '+ (aggpostivepercentage*100/positivevals).toFixed(3) +'%',
          negativeRollingReturns: negativevals + ' / '+ (aggnegativepercentage*100/negativevals).toFixed(3) +'%',
          notapplicableRollingReturns: numofdays
        });
        this.datatakeaways.push(...loctakeaway);
        //build final message to show
        this.setfinaltext(beginingtexttoshow + (((negativevals*100)/loctakeaway[0].applicabledatapoints).toFixed(3)) + endingtexttoshow + loctakeaway[0].rollingretdays+ " days");
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
            } = schemedetails;
        
        let FillmfDetails: Intmfdetails[] = [];
        FillmfDetails.push( {
          schemecode: String(scheme_code),
          schemename: scheme_name,
          schemecategory: scheme_category,
          date: navdata[0].date,
          nav: navdata[0].nav,
          retsummary: "For " + numofdays + " days, avg Positive return is: " + (aggpostivepercentage*100/positivevals).toFixed(3) +'%' + " Avg Negative return is: " + (aggnegativepercentage*100/negativevals).toFixed(3) +'%'
          });
        this.mfdetails.push(...FillmfDetails);
        // console.log(this._mfdetails);
    }
}
