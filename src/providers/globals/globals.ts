// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the GlobalsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GlobalsProvider {
  houseRules: any;
  buildingInfo: any;
  userId: any;
  neighboursData: any;
  locals: any;
  news: any;
  userData: any;
  newsCount: number = 0;
  localsCount: number = 0;
  usersCount: number = 0;
  
  constructor() {
    console.log('Hello GlobalsProvider Provider');
  }
  clear(){
    this.userId = undefined;
    this.neighboursData = undefined;
    this.locals = undefined;
    this.news = undefined;
    this.userData = undefined;
    this.newsCount = 0;
    this.localsCount = 0;
    this.usersCount = 0;
    this.houseRules = undefined;
    this.buildingInfo = undefined;
  }

}
