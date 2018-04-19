import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';

/**
 * Generated class for the NewsDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-news-details',
  templateUrl: 'news-details.html',
})
export class NewsDetailsPage {
  newsDetails: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebase: FirebaseProvider) {
    this.newsDetails = this.navParams.get('news');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewsDetailsPage');
  }
  deleteNews(news) {
    this.firebase.deleteNews(news.id).then((success) => {
      alert('News Removed');
    });
  }

}
