import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Events } from 'ionic-angular';
import { GlobalsProvider } from '../../providers/globals/globals';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import * as _ from 'lodash';
/**
 * Generated class for the HouseRulesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-house-rules',
  templateUrl: 'house-rules.html',
})
export class HouseRulesPage {
  hasPdf: boolean = false;
  details: any;
  houseRules: any;
  addNew: boolean = false;
  infoDetails: boolean = false;
  name: any;
  desciption: any;
  uploadedPdfs: any = [];
  edit = false;
  editDetails: any;
  loading: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public globals: GlobalsProvider, public events: Events, public zone: NgZone, private firebase: FirebaseProvider) {
    this.houseRules = this.globals.houseRules;
    console.log(this.houseRules)
    this.events.subscribe('houseRulesupdated', () => {
      this.zone.run(() => {
        this.houseRules = this.globals.houseRules;
      });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HouseRulesPage');
  }
  addnew() {
    this.addNew = true;
    this.infoDetails = false;
  }

  submitInfo() {
    this.firebase.addHouseRules(this.name, this.desciption, this.uploadedPdfs).then(() => {
      this.houseRules = this.globals.houseRules;
      this.addNew = false;
      this.uploadedPdfs = [];
    })
  }

  uploadPdf() {
    document.getElementById('avatar').click();
  }

  upload() {
    this.loading = true;
    for (let selectedFile of [(<HTMLInputElement>document.getElementById('avatar')).files[0]]) {

      this.firebase.uploadPdf(selectedFile).then((data) => {
        this.uploadedPdfs.push({ 'pdf': data });
        this.loading = false;
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
    this.firebase.deleteHouseRules(buildingId).then((success) => {
      alert('House Rule Info Removed');
      this.infoDetails = false;
      this.houseRules = this.globals.houseRules;
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

    this.firebase.editHouseRules(this.editDetails).then(() => {
      this.uploadedPdfs = [];
      this.houseRules = this.globals.houseRules;
      this.edit = false;
    })
  }

}
