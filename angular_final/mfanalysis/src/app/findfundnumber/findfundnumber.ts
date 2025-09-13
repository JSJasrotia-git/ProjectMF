import { Component, OnInit } from '@angular/core';
import { mymfdata } from '../../assets/mfdetails.json';

@Component({
  selector: 'app-findfundnumber',
  imports: [],
  templateUrl: './findfundnumber.html',
  styleUrl: './findfundnumber.css'
})
export class Findfundnumber {
_mfcodes: any;

  ngOnInit(): void {
      this._mfcodes = mymfdata;
    // console.log(this.data);
    }
}
