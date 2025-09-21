import { Component, OnInit, signal } from '@angular/core';
import { Navbar } from './navbar/navbar';
import { Footer } from './footer/footer';
import { Midleft } from "./midleft/midleft";
import { Findfundnumber } from './findfundnumber/findfundnumber';
import { Comparefunds } from './comparefunds/comparefunds';

@Component({
  selector: 'app-root',
  imports: [Navbar, Footer, Midleft, Findfundnumber, Comparefunds],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private _showmain: number = 1; //variable to control main content visibility
  private _showleft:boolean = true;
  private _showfindfund:boolean = false;
  private _showcompare:boolean = false;
  private _firstbuttontext: string = 'Find MF Scheme Code'; //First button text variable
  private _secondbuttontext: string = 'Compare Funds'; // Second Button to show compare screens
  private _thirdbuttontext: string = 'Analyse MF Scheme' // Text to swap.
  texttoshowbutton1:string = this._firstbuttontext;
  texttoshowbutton2:string = this._secondbuttontext;
  protected readonly title = signal('mfanalysis');
  constructor() {
    this._showmain = 1;
    this._showleft = true;
    this._showfindfund = false;
    this._showcompare = false;
    this.texttoshowbutton1 = this._firstbuttontext;
    this.texttoshowbutton2 = this._secondbuttontext;
  }
  // This is for finding MF schemes.
  callfromfirstbutton() {
    // alert("I am in callfromfirst");
    if((this._showmain == 1)){
      // alert("I am in inside as showmain is 1");
      this.gottostate2();
    } else if(this._showmain == 2){
      this.gottostate1();
    } else if(this._showmain == 3){
      this.gottostate2();
    }
  }
  
    // This is for comparing MF schemes.
  callfromsecondbutton() {
   if((this._showmain == 1)){
      // alert("I am in inside as showmain is 1");
      this.gottostate3();
    } else if(this._showmain == 2){
      this.gottostate3();
    } else if(this._showmain == 3){
      this.gottostate1();
    }
  }
  gottostate1(){
      this._showmain = 1;
      this.texttoshowbutton1 = this._firstbuttontext
      this.texttoshowbutton2 = this._secondbuttontext;
      this._showcompare = false; //Invert findfund
      this._showfindfund = false;
      this._showleft = true; //Invert showleft. Set this condition in the end, otherwise the sync issues happens
  }
  gottostate2(){
      this._showmain = 2;
      this.texttoshowbutton1 = this._thirdbuttontext
      this.texttoshowbutton2 = this._secondbuttontext;
      this._showcompare = false; //Invert findfund
      this._showfindfund = true;
      this._showleft = false; //Invert showleft. Set this condition in the end, otherwise the sync issues happens
  }
  gottostate3(){
      this._showmain = 3;
      this.texttoshowbutton1 = this._firstbuttontext
      this.texttoshowbutton2 = this._thirdbuttontext;
      this._showcompare = true; //Invert findfund
      this._showfindfund = false;
      this._showleft = false; //Invert showleft. Set this condition in the end, otherwise the sync issues happens
  }
  //show the components based on values.
  get showleft() {
    return this._showleft;
  }
//show the components based on values.
  get showfindfund() {
    return this._showfindfund;
  }
//show the components based on values.
  get showcompare() {
    return this._showcompare;
  }

}
