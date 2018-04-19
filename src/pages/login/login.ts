import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController, Events } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { GlobalsProvider } from '../../providers/globals/globals';
import * as firebase from 'firebase';
import * as _ from 'lodash';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginForm: any;
  user: { email?: any, password?: any } = {};
  loading: any;
  returnInvalid: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public menuCtrl: MenuController, public loadingCtrl: LoadingController, private firebase: FirebaseProvider, public globals: GlobalsProvider, public event: Events) {
    this.initializeForm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.menuCtrl.enable(false);
  }
  initializeForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])]
    });
  }
  loginUser(): void {
      this.firebase.loginData(this.loginForm.value.email, this.loginForm.value.password).then(authData => {
        console.log('AuthData ', authData);
        this.loading.dismiss().then(() => {
          this.globals.userId = authData.uid;
          
          console.log('new user ->', this.globals.userId);
          var promises = [this.getUserData(), this.getNeighbours()];
          Promise.all(promises).then((values) => {
            this.getAllNews();
            this.getAllLocals();
          }).catch((err) => {
            console.log('Promise.all ', err);
          });
        });
      }, error => {
        this.loading.dismiss().then(() => {
          this.returnInvalid = true;
        });
      });

      this.loading = this.loadingCtrl.create({ content: 'Logging you in...' });
      this.loading.present();
    }

  clearErrors() {
    if (this.user.email == "" || this.user.password == "") {
      this.returnInvalid = false;
    }
  }
  getUserData() {
    var userId = this.globals.userId;
    return new Promise((resolve, reject) => {
      var dbRef = firebase.database().ref('/users/' + userId);
      var userArr = [];
      dbRef.once('value', (data) => {

        if (data.val() != 'default') {
          userArr = data.val();
          this.globals.userData = userArr;
          console.warn(' Component User Data ', this.globals.userData);
          resolve(userArr);
        } else {
          reject({ msg: 'No Users Found' });
        }
      });
    });
  }
  getNeighbours() {
    var userId = this.globals.userId;
    return new Promise((resolve, reject) => {
      var dbRef = firebase.database().ref('/users/');
      var neighboursArr = [];
      dbRef.once('value', (data) => {

        if (data.val() != 'default') {
          neighboursArr = _.toArray(data.val());
          _.remove(neighboursArr, { 'uId': userId });

          console.log('neighboursArray ', neighboursArr);
          this.globals.neighboursData = neighboursArr;
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
          this.globals.locals = localsArr;
          console.log('all localss in globalss', this.globals.locals);
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
          this.globals.news = newsArr;
          console.log('all news in globalss', this.globals.news);
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
  


}
