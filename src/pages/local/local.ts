import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, MenuController } from 'ionic-angular';
import { GlobalsProvider } from '../../providers/globals/globals';
import { FirebaseProvider } from '../../providers/firebase/firebase';

/**
 * Generated class for the LocalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-local',
  templateUrl: 'local.html',
})
export class LocalPage {
  locals: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public globals: GlobalsProvider, public events: Events, public zone: NgZone, public firebase: FirebaseProvider, public menuCtrl: MenuController) {
    this.locals = this.globals.locals;

    this.events.subscribe('localsupdated', () => {
      this.zone.run(() => {
        this.locals = this.globals.locals;
      });
    });
  }

  ionViewWillEnter() {
    console.log('ionViewDidLoad LocalPage');
    this.menuCtrl.enable(true);
  }
  deleteLocals(local) {
    this.firebase.deleteLocals(local.id).then((success) => {
      alert('Local Listing Removed');
    });
  }

}
