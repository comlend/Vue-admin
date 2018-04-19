import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, MenuController } from 'ionic-angular';
import { GlobalsProvider } from '../../providers/globals/globals';
import { NewsDetailsPage } from '../news-details/news-details';
import { FirebaseProvider } from '../../providers/firebase/firebase';

/**
 * Generated class for the NewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
})
export class NewsPage {
  news:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public globals: GlobalsProvider, public firebase: FirebaseProvider, public events: Events, public zone: NgZone, public menuCtrl: MenuController) {
    this.news = this.globals.news;

    this.events.subscribe('newsupdated', () => {
      this.zone.run(() => {
        this.news = this.globals.news;
      });
    });
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
    console.log('ionViewDidLoad NewsPage');
  }
  newsDetails(news){
    this.navCtrl.push(NewsDetailsPage, {'news':news});
  }
  deleteNews(news){
    this.firebase.deleteNews(news.id).then((success) => {
      alert('News Removed');
    });
  }

}
