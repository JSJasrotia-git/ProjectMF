import { Component, OnInit, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Readjson } from '../services/readjson';
import { SchemeNav} from '../interfaces/intdateprice';
@Component({
  selector: 'app-findfundnumber',
  imports: [],
  templateUrl: './findfundnumber.html',
  styleUrl: './findfundnumber.css'
})
export class Findfundnumber implements OnInit {
  _apiservice = inject(Readjson); //to be able to call service functions, injecting the service.
  navData: SchemeNav[] = []; // To store mapped SchemeNav data

 constructor() {}

  async ngOnInit() {
    //The code to check if the data is already loaded and is available in the service.

    // if(this._apiservice.getdata.length  0)
    // console.log("Currently the length:  ", );

    if(this._apiservice.getnavdata().length == 0){

      this._apiservice.setURL(''); // Set appropriate MF number or URL suffix if needed
      
      try {
        // Await HTTP getdata Observable converted to Promise
        const responseData = await firstValueFrom(this._apiservice.getdata());

        // Map incoming data to SchemeNav array here
        // Assuming responseData has array or object structure containing required fields:
        // e.g., if it's an array of objects with properties matching SchemeNav or similar
        
        this.navData = this.mapToSchemeNav(responseData);
        this._apiservice.setnavdata(this.navData); //set the data so that we can retrive this fast next time.
        //console.log('Data loaded:', this.navData);
      } catch (error) {
        //console.error('Error loading NAV data:', error);
      }
    }else{
      this.navData = this._apiservice.getnavdata();
      // console.log("already found the data");
    }
  }

  private mapToSchemeNav(data: any): SchemeNav[] {
    // Example mapping - adjust based on actual response data structure
    if (Array.isArray(data)) {
      return data.map(item => ({
        schemeCode: item.schemeCode ?? '',
        schemeName: item.schemeName ?? ''
      }));
    }

    // If data is an object with nested array, adjust accordingly
    // For example:
    // return data.records.map(item => ({ ... }));

    return [];
  }
}
