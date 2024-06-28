import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class modService {
  mod: string = "";
  
  setMod(newMod: string){
    this.mod = newMod;
  }

  getMod(){
    return this.mod;
  }
}