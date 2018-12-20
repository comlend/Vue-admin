import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HouseRulesPage } from './house-rules';

@NgModule({
  declarations: [
    HouseRulesPage,
  ],
  imports: [
    IonicPageModule.forChild(HouseRulesPage),
  ],
})
export class HouseRulesPageModule {}
