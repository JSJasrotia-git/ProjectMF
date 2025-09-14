import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Readjson {
  private readonly _baseUrl = 'https://api.mfapi.in/mf/';
  private _urltofetch = "";
  private http = inject(HttpClient);
  //Function to set the URL that we want to fetch.
  setURL(mfnum: string){
    this._urltofetch = this._baseUrl+mfnum;
    console.log("the URL to fetche is: ", this._urltofetch);
  }
  getdata() {
    return this.http.get<any>(this._urltofetch);
  }
}
