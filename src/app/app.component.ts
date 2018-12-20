import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import * as firebase from 'firebase';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { GlobalsProvider } from '../providers/globals/globals';
import * as _ from 'lodash';
import { BusinessPage } from '../pages/business/business';
import { NewsPage } from '../pages/news/news';
import { LocalPage } from '../pages/local/local';
import { FirebaseProvider } from '../providers/firebase/firebase';
import { BuildingInfoPage } from '../pages/building-info/building-info';
import { HouseRulesPage } from '../pages/house-rules/house-rules';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public global: GlobalsProvider, public event: Events, public firebase: FirebaseProvider) {
    this.initializeFirebase();
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Users', component: ListPage },
      { title: 'Businesses', component: BusinessPage },
      { title: 'News', component: NewsPage},
      { title: 'Local', component: LocalPage},
      { title: 'Building Info', component: BuildingInfoPage }, 
      { title: 'House Rules', component: HouseRulesPage },
      { title: 'Log Out', component: LoginPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }


  openPage(page) {
    if (page.title == 'Log Out') {
      this.firebase.logout().then(() => {
        this.nav.setRoot(page.component);
      });
    } else {
      // Reset the content nav to have just this page
      // we wouldn't want the back button to show in this scenario
      this.nav.setRoot(page.component);
    }
  }
  initializeFirebase() {
    var config = {
      apiKey: "AIzaSyAG4SM1ihvr7fPqU5C6mG2B2TZyVZImDkU",
      authDomain: "vue-admin-85ef1.firebaseapp.com",
      databaseURL: "https://vue-admin-85ef1.firebaseio.com",
      projectId: "vue-admin-85ef1",
      storageBucket: "vue-admin-85ef1.appspot.com",
      messagingSenderId: "167187753572"
    };
    firebase.initializeApp(config);
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        this.rootPage = LoginPage;
        // unsubscribe();
      }

      else {
        this.global.userId = user.uid;

        console.log('new user ->', this.global.userId);
        var promises = [this.getUserData(), this.getNeighbours(), this.getAllNews(),this.getAllLocals()];
        Promise.all(promises).then((values) => {
          this.fetchBuildinginfo();
          this.fetchHouseRules();
          this.rootPage = HomePage;
        }).catch((err) => {
          console.log('Promise.all ', err);
        });
      }
    });
  }

  getUserData() {
    var userId = this.global.userId;
    return new Promise((resolve, reject) => {
      var dbRef = firebase.database().ref('/users/' + userId);
      var userArr = [];
      dbRef.once('value', (data) => {

        if (data.val() != 'default') {
          userArr = data.val();
          this.global.userData = userArr;
          console.warn(' Component User Data ', this.global.userData);
          resolve(userArr);
        } else {
          reject({ msg: 'No Users Found' });
        }
      });
    });
  }
  getNeighbours() {
    var userId = this.global.userId;
    return new Promise((resolve, reject) => {
      var dbRef = firebase.database().ref('/users/');
      var neighboursArr = [];
      dbRef.on('value', (data) => {

        if (data.val() != 'default') {
          neighboursArr = _.toArray(data.val());
          this.global.usersCount = neighboursArr.length;

          _.remove(neighboursArr, { 'uId': userId });

          // console.log('neighboursArray ', neighboursArr);
          this.global.neighboursData = neighboursArr;
          this.global.usersCount = neighboursArr.length;
          this.event.publish('neighboursUpdated');

          resolve();

        } else {
          reject({ msg: 'No Users Found' });
        }
      });
    });
  }
  getAllLocals() {
    return new Promise((resolve, reject) => {
      var dbRef = firebase.database().ref('/locals/');
      var localsArr = [];
      dbRef.on('value', (data) => {
        if (data.val() != 'default') {
          localsArr = _.toArray(data.val()).reverse();
          this.global.locals = localsArr;
          this.global.localsCount = localsArr.length;
          console.log('all localss in globals', this.global.locals);
          this.event.publish('localsupdated');

          resolve();

        } else {
          reject();
        }
      });
    });
  }

  getAllNews() {
    return new Promise((resolve, reject) => {
      var dbRef = firebase.database().ref('/news/');
      var newsArr = [];
      var comments = [];
      dbRef.on('value', (data) => {

        if (data.val() != 'default') {
          newsArr = _.toArray(data.val()).reverse();
          this.global.news = newsArr;
          this.global.newsCount = newsArr.length;
          console.log('all news in globals', this.global.news);
          this.event.publish('newsupdated');
          for (let index = 0; index < newsArr.length; index++) {
            var news = newsArr[index];
            var custNewsData = {};

            if (news.hasOwnProperty('comments')) {
              var commentKeys = Object.keys(news.comments);
              var commentsNumber = Object.keys(news.comments).length;
              var lastCommentKey = commentKeys[commentsNumber - 1];

              var lastComment = news.comments[lastCommentKey];
              // console.log('Last Comment ', lastComment)
              custNewsData['commentsNumber'] = commentsNumber;
              custNewsData['lastComment'] = lastComment;
              news.custNewsData = custNewsData;
            }

            if (news.hasOwnProperty('likes')) {
              var likesNumber = Object.keys(news.likes).length;
              custNewsData['likes'] = _.toArray(news.likes);
              custNewsData['likesNumber'] = likesNumber;
              news.custNewsData = custNewsData;
            }
            // console.log('News Modified Data Form ', news);
            // if (newsArr[index].id == newsArr[index].comments.newsId) {
            // comments.push(_.toArray(newsArr[index].comments.length));
            // }
          }
          // console.log('all comments',comments);
          resolve();

        } else {
          reject();
        }
      });
    });
  }

  fetchBuildinginfo() {
    return new Promise((resolve, reject) => {
      var dbRef = firebase.database().ref('/buildingInfo/');
      var buildingInfo = [];
      dbRef.on('value', (data) => {
        if (data.val() != 'default') {
          buildingInfo = _.toArray(data.val()).reverse();
          this.global.buildingInfo = buildingInfo;
          // this.global.localsCount = localsArr.length;
          console.log('all building info in globals', this.global.buildingInfo);
          this.event.publish('buildingInfoupdated');

          resolve();

        } else {
          reject();
        }
      });
    });
  }
  fetchHouseRules() {
    return new Promise((resolve, reject) => {
      var dbRef = firebase.database().ref('/houseRules/');
      var houseRules = [];
      dbRef.on('value', (data) => {
        if (data.val() != 'default') {
          houseRules = _.toArray(data.val()).reverse();
          this.global.houseRules = houseRules;
          // this.global.localsCount = localsArr.length;
          console.log('all house rules info in globals', this.global.houseRules);
          this.event.publish('houseRulesupdated');

          resolve();

        } else {
          reject();
        }
      });
    });
  }
}
