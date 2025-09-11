import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Intdateprice } from '../interfaces/intdateprice';
import { catchError, of } from 'rxjs';
import { Inttakeaways, Intmfdetails } from '../interfaces/intdateprice';

@Injectable({
  providedIn: 'root'
})
export class Readjson {
  private readonly _path = '../../assets/';
  private readonly _fileext = '.json';
  private _jsonfiletoread:string =  this._path+"1"+this._fileext; //'../../assets/1.json';
  public _jsonData: any = null; // local variable to hold data
  //Constructor.
  constructor(private http: HttpClient){
  this._jsonfiletoread =  this._path+"1"+this._fileext;
    //console.log(this._jsonfiletoread)
  }
  getfilename(_fileName: string){
    this._jsonfiletoread = this._path+_fileName+this._fileext;
    //Check if File exists.
    return this.http.head(this._jsonfiletoread, { observe: 'response' }).pipe(
      catchError(() => of(null)) // Return null if not found or error
    );
    

  }
  //function to read the file.
   getData(): Observable<Intdateprice[]> {
   return this.http.get<Intdateprice[]>(this._jsonfiletoread);
  }

}
