import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { GlobalsProvider } from '../../providers/globals/globals';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  newsCount: any;
  usersCount: any;
  localsCount: any;
  businessArr: any;
  businessCount: any;
  usersArr: any;

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, public globals: GlobalsProvider) {
    this.getCounts();

    

  }
  ionViewWillEnter() {
    this.menuCtrl.enable(true);
    this.getCounts();
  }

  getCounts(){
    this.newsCount = this.globals.newsCount;
    this.localsCount = this.globals.localsCount;

    this.businessArr = [];
    for (let i = 0; i < this.globals.neighboursData.length; i++) {
      if (this.globals.neighboursData[i].userType == 'business') {
        this.businessArr.push(this.globals.neighboursData[i]);
      }
    }
    this.businessCount = this.businessArr.length;

    this.usersArr = [];
    for (let i = 0; i < this.globals.neighboursData.length; i++) {
      if (this.globals.neighboursData[i].userType == 'owner' || this.globals.neighboursData[i].userType == 'renting') {
        this.usersArr.push(this.globals.neighboursData[i]);
      }
    }
    this.usersCount = this.usersArr.length;
  }

}
