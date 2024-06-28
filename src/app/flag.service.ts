import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FlagService {
  flag: string = "en";
  
  setFlag(newFlag: string){
    this.flag = newFlag;
  }

  getFlag(){
    return this.flag;
  }
}