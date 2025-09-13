import { Component, OnInit, signal } from '@angular/core';
import { Navbar } from './navbar/navbar';
import { Footer } from './footer/footer';
import { Midleft } from "./midleft/midleft";
import { Findfundnumber } from './findfundnumber/findfundnumber';

@Component({
  selector: 'app-root',
  imports: [Navbar, Footer, Midleft, Findfundnumber],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private _showmain: boolean = true; //variable to control main content visibility
  ButtonTexttoshow: string = 'Find MF Scheme Code'; //button text variable
  protected readonly title = signal('mfanalysis');
  constructor() {
    this._showmain = true;
  }

  ChangeComponent() {
    this._showmain = !this._showmain;
    if (this._showmain) {
      this.ButtonTexttoshow = 'Find MF Scheme Code';
    } else {
      this.ButtonTexttoshow = 'Back to Fund Analysis';
    }
    return this._showmain;
  }
  get showmain() {
    return this._showmain;
  }
}
