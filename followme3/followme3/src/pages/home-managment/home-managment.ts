import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { group, UsersServiceProvider } from '../../providers/users-service/users-service';
import { HomePage } from '../home/home';
import { GroupPage } from '../group/group';
import { AddUserToGroupPage } from '../add-user-to-group/add-user-to-group';
import { MapPage } from '../map/map';
import { ShowDitailGroupPage } from '../show-ditail-group/show-ditail-group';
import { ShowDitailUserPage } from '../show-ditail-user/show-ditail-user';

/**
 * Generated class for the HomeManagmentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home-managment',
  templateUrl: 'home-managment.html',
})
export class HomeManagmentPage {
group:group;

  constructor(public navCtrl: NavController, public navParams: NavParams,public userService:UsersServiceProvider) {
  
  }

  ionViewDidLoad() {
  this.group= this.userService.getGroupManagment();
    console.log('ionViewDidLoad HomeManagmentPage');
  }


}
