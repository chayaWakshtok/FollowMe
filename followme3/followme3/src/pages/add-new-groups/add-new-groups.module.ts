import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddNewGroupsPage } from './add-new-groups';

@NgModule({
  declarations: [
    AddNewGroupsPage,
  ],
  imports: [
    IonicPageModule.forChild(AddNewGroupsPage),
  ],
})
export class AddNewGroupsPageModule {}
