// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Events } from 'ionic-angular';
import { GlobalsProvider } from '../globals/globals';

/*
  Generated class for the FirebaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirebaseProvider {

  constructor(public event: Events, public global: GlobalsProvider) {
    console.log('Hello FirebaseProvider Provider');
  }

  loginData(email: string, password: string) {
    // this.globals.reinitializeGlobals();
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }
  deleteUser(userId){
    return new Promise((resolve, reject) => {
      firebase.database().ref('/users/').child(userId).remove();
      this.event.publish('userDeleted');
      resolve();
    });
  }
  deleteNews(newsId) {
    return new Promise((resolve, reject) => {
      firebase.database().ref('/news/').child(newsId).remove();
      resolve();
    });
  }
  
  deleteLocals(localId) {
    return new Promise((resolve, reject) => {
      firebase.database().ref('/locals/').child(localId).remove();
      resolve();
    });
  }
  logout() {
    return new Promise((resolve, reject) => {
      firebase.auth().signOut().then(() => {
        this.global.clear();
        resolve();
      }, function (error) {
        reject();
      });
    });
  }

}
