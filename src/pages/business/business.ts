import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController } from 'ionic-angular';
import { GlobalsProvider } from '../../providers/globals/globals';
import { FirebaseProvider } from '../../providers/firebase/firebase';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public globals: GlobalsProvider, public menuCtrl: MenuController, public firebase: FirebaseProvider, public loadingCtrl: LoadingController) {
    this.loadBusinessUsers();
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }
  loadBusinessUsers(){
    this.usersArr = [];
    for (let i = 0; i < this.globals.neighboursData.length; i++) {
      if (this.globals.neighboursData[i].userType == 'business') {
        this.usersArr.push(this.globals.neighboursData[i]);
      }
    }
    console.log(this.usersArr);
  }
  removeUser(user) {
    let loading = this.loadingCtrl.create({
      spinner: 'crescent'
    });

    loading.present();

    this.firebase.deleteUser(user.uId).then((success) => {
      if (success) {
        loading.dismiss().then(()=>{
          alert('User Removed');
          this.loadBusinessUsers();
        }).catch((error) => {
          loading.dismiss();
          alert('User Not Removed');
        });
        
      }
    });
  }

}
