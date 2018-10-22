import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { GlobalsProvider } from '../../providers/globals/globals';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import * as _ from 'lodash';

/**
 * Generated class for the BuildingInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-building-info',
  templateUrl: 'building-info.html',
})
export class BuildingInfoPage {

  hasPdf: boolean = false;
  details: any;
  buildingInfo: any;
  addNew: boolean = false;
  infoDetails: boolean = false;
  name: any;
  desciption: any;
  uploadedPdfs: any = [];
  edit = false;
  editDetails: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public globals: GlobalsProvider, public events: Events, public zone: NgZone, private firebase: FirebaseProvider) {
    this.buildingInfo = this.globals.buildingInfo;
    console.log(this.buildingInfo)
    this.events.subscribe('localsupdated', () => {
      this.zone.run(() => {
        this.buildingInfo = this.globals.buildingInfo;
      });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BuildingInfoPage');
  }

  addnew() {
    this.addNew = true;
    this.infoDetails = false;
  }

  submitInfo() {
    this.firebase.addAmenity(this.name, this.desciption, this.uploadedPdfs).then(() => {
      this.buildingInfo = this.globals.buildingInfo;
      this.addNew = false;
    })
  }

  uploadPdf() {
    document.getElementById('avatar').click();
  }

  upload() {

    for (let selectedFile of [(<HTMLInputElement>document.getElementById('avatar')).files[0]]) {

      this.firebase.uploadPdf(selectedFile).then((data) => {
        this.uploadedPdfs.push({ 'pdf': data });
        this.hasPdf = true;
        console.log(this.uploadedPdfs);
      })
    }
  }

  viewDetails(info) {
    this.addNew = false;
    this.infoDetails = true;
    this.details = info;
  }

  deletePdf(index) {
    this.uploadedPdfs.splice(index, 1);
  }

  deleteBuildingInfo(buildingId) {
    this.firebase.deleteAmenity(buildingId).then((success) => {
      alert('Building Info Removed');
      this.infoDetails = false;
    });
  }

  editBuildingInfo(details) {
    this.edit = true;
    this.editDetails = details;
    console.log('Edit This Detail => ', this.editDetails);
  }

  cancelEdit() {
    this.edit = false;
    this.editDetails = null;
  }

  removePdf(pdf, i) {
    this.editDetails.pdf.splice(i, 1);
    // console.log('Remove Pdf => ', pdf, ' Index => ', i, ' editDetails => ', this.editDetails);
  }

  editInfo() {
    _.map(this.uploadedPdfs, (pdf) => {
      if (!this.editDetails.pdf) {
        this.editDetails['pdf'] = [];
      }

      this.editDetails.pdf.push(pdf);

    });

    this.firebase.editAmenity(this.editDetails).then(() => {
      this.uploadedPdfs = [];
      this.buildingInfo = this.globals.buildingInfo;
      this.edit = false;
    })
  }

}
