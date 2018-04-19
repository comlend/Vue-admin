import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, MenuController, Events } from 'ionic-angular';
import { GlobalsProvider } from '../../providers/globals/globals';
import { FirebaseProvider } from '../../providers/firebase/firebase';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  usersArr: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController, public globals: GlobalsProvider, public firebase: FirebaseProvider, public events: Events, public zone: NgZone) {
    
    this.loadUserData();

    this.events.subscribe('userDeleted', () => {
      this.zone.run(() => {
        this.loadUserData();
      });
    });
    // console.log(this.usersArr);
  }
  loadUserData(){
    this.usersArr = [];
    for (let i = 0; i < this.globals.neighboursData.length; i++) {
      if (this.globals.neighboursData[i].userType == 'owner' || this.globals.neighboursData[i].userType == 'renting') {
        this.usersArr.push(this.globals.neighboursData[i]);
      }
    }
  }
  ionViewWillEnter(){
    this.menuCtrl.enable(true);
  }
  removeUser(user){
    this.firebase.deleteUser(user.uId).then( (success)=> {
      alert('User Removed');
    });
  }
}
