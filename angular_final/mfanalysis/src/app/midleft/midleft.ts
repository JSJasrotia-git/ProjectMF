import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Readjson } from '../services/readjson';
import { Intdateprice, Inttakeaways, Intmfdetails} from '../interfaces/intdateprice';
import { firstValueFrom, take } from 'rxjs';
import { mymfdata } from '../../assets/mfdetails.json';

@Component({
  selector: 'app-midleft',
  imports: [CommonModule],
  templateUrl: './midleft.html',
  styleUrl: './midleft.css'
})
export class Midleft implements OnInit{
  data: Intdateprice[] = []; // to get Json data from Service
  takeaways: Inttakeaways[] = []; //to populate takeaways
  mfdetails: Intmfdetails[] = []; // to populate mf details
  _mfdata: any;
  _numofdays: number = 30;
  _mfnum: number = 0;
  _beginingtexttoshow = "There is a : ";
  _endingtexttoshow = " chance that your capital is at risk within ";
  _finaltexttoshow = "";
  //Constructor
  constructor(private _filename:Readjson){
  }

  ngOnInit(): void {
    this._mfdata = mymfdata
   // console.log(this.data);
  }


  MFDetails(MfNum:any, Numofdays:any){
    //validation for MF number
      if (!Number.isNaN(Number(MfNum))) {
        //we can move fwd, else we need to provide an error and return
       } else {
        alert("Please enter valid MF number");
        return;
       }
    //Validation for Num of days
      if (!Number.isNaN(Number(Numofdays)) && (Number(Numofdays) >= 2) && (Number(Numofdays) <= 1000)) {
        //we can move fwd, else we need to provide an error and return
      } else {
        alert("Please enter valid number of days between 2 and 1000");
        return;
      }
      //Check if the file exists or not
      this._filename.getfilename(MfNum).subscribe(response => {
        if (response === null) {
          alert("Sorry Data does not exist for this MF Code");
          return;
        }
      });
      if (this.takeaways.length > 0) {
        this.takeaways.length = 0;   // Clear all elements from takeaways
      }

      if (this.mfdetails.length > 0) {
        this.mfdetails.length = 0;   // Clear all elements from mfdetails
      }

      this._numofdays = Number(Numofdays);
      this._mfnum = Number(MfNum);
      this.fillmfdata(this._mfnum); //Call a function to load the data
      this.loadData();
  }
  
    async loadData() {
      this.data = await firstValueFrom(this._filename.getData());
      this.calculateRollingRet();
    }  
// Function to set background color based on the rolling return value
    getRollingRetColor(rollingret: string): string {
      if (rollingret === 'N.A') return 'grey';
      return parseFloat(rollingret) > 0 ? 'green' : 'red';
    }

    //function to call rolling return
    calculateRollingRet() {
      let arraylength: number = this.data.length;
      let positivevals: number = 0;
      let negativevals: number = 0;
      console.log("value of negativevals is : " + negativevals);
      if(this.data.length <= this._numofdays){
        alert("Pls provide a lower number of days for Rolling return. Data in the fund is less than the #of days of Rolling Return");
        return;
      }
      for (let i = 0; i < (this.data.length); i++) {
        if(i <= (this.data.length - (this._numofdays+1))){
          const currentNav = parseFloat(this.data[i].nav);
          const nextNav = parseFloat(this.data[i + this._numofdays].nav);
          // Calculate rollingret as difference (current - next)
          this.data[i].rollingret = (currentNav - nextNav).toFixed(5);
          // Calculate takeaways
          if ((currentNav - nextNav) > 0) {
            positivevals += 1;
          }else {
            negativevals += 1;
          } 
        }else{
          this.data[i].rollingret = 'N.A';
        }
      }
      // Handle last item explicitly if needed
      if (this.data.length > 0) {
        this.data[this.data.length - 1].rollingret = 'N.A'; // or whatever default
      }
      let loctakeaway: Inttakeaways[] = [];
      loctakeaway.push( {
        rollingretdays: this._numofdays,
        totdatapoints: arraylength,
        applicabledatapoints: (arraylength - this._numofdays),
        postiverollingreturn: positivevals,
        negativeRollingReturns: negativevals,
        notapplicableRollingReturns: this._numofdays
      });
      this.takeaways.push(...loctakeaway);
      //build final message to show
      this._finaltexttoshow = this._beginingtexttoshow + (((loctakeaway[0].negativeRollingReturns*100)/loctakeaway[0].applicabledatapoints).toFixed(2)) + this._endingtexttoshow +loctakeaway[0].rollingretdays+ " days";
  }

  ///for splitting the data into 2
  get leftData(): any[] {
  return this.data.slice(0, Math.ceil(this.data.length / 2));
  }

  get rightData(): any[] {
  return this.data.slice(Math.ceil(this.data.length / 2));
  }


  //Call a function to load the data
  fillmfdata(mfnum: number) {
    // Implementation for filling MF data
    // Check the record id that matces with the current MFNum
    for (let i = 0; i < this._mfdata.length; i++) {
      if (Number(this._mfdata[i].schemecode) == mfnum) {
        let locmfdetails: Intmfdetails[] = [];
          locmfdetails.push({
            schemecode: this._mfdata[i].schemecode,
            schemename: this._mfdata[i].schemename,
            schemecategory: this._mfdata[i].schemecategory,
            date: this._mfdata[i].latestnavdate,
            nav: this._mfdata[i].latestnav
          });
          this.mfdetails.push(...locmfdetails);
        return;
      }
      }
  }
}
