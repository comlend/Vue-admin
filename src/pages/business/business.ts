import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { GlobalsProvider } from '../../providers/globals/globals';

/**
 * Generated class for the BusinessPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-business',
  templateUrl: 'business.html',
})
export class BusinessPage {
  usersArr: any =[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public globals: GlobalsProvider, public menuCtrl: MenuController) {
    this.usersArr = [];
    for (let i = 0; i < this.globals.neighboursData.length; i++) {
      if (this.globals.neighboursData[i].userType == 'business') {
        this.usersArr.push(this.globals.neighboursData[i]);
      }
    }
    console.log(this.usersArr);
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }
  removeUser(user) {

  }

}
