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

  addAmenity(name, description, pdf){
    return new Promise((resolve, reject) => {
      // var uid = this.globals.userId;
      // var createdAt = moment().format();
      var dbref = firebase.database().ref('/buildingInfo/').push();

      dbref.set({
        id: dbref.key,
        name: name,
        text: description,
        pdf: pdf,
      }).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });

    });
  }

  deleteAmenity(amenityId) {
    return new Promise((resolve, reject) => {
      firebase.database().ref('/buildingInfo/').child(amenityId).remove();
      resolve();
    });
  }

  public uploadPdf(data) {
    var filename = (new Date()).getTime() + '.pdf';
    let uploadTask = firebase.storage().ref('/pdf/' + filename).put(data);
    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed', (snapshot) => {

      }, (err) => {
        reject(false);
      }, () => {
        console.log(uploadTask.snapshot.downloadURL);

        resolve(uploadTask.snapshot.downloadURL);
        return;
      });
    });
  }

  editAmenity(details) {
    console.log('Edit Details => ', details);

    return new Promise((resolve, reject) => {
      var dbref = firebase.database().ref('/buildingInfo/').child(details.id);

      dbref.set({
        id: details.id,
        name: details.name,
        text: details.text,
        pdf: details.pdf,
      }).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });

    });
  }


}
