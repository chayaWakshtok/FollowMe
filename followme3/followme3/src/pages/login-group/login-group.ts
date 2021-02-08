import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { group, User, UsersServiceProvider } from '../../providers/users-service/users-service';
import { ShowDitailGroupPage } from '../show-ditail-group/show-ditail-group';

/**
 * Generated class for the LoginGroupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login-group',
  templateUrl: 'login-group.html',
})
export class LoginGroupPage {
  passGroup:string;
 nameGroup:string;
  constructor(public navCtrl: NavController, public navParams: NavParams,public userService:UsersServiceProvider) {
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginGroupPage');
    this.nameGroup=this.userService.getGroup().Name;
  }
  checkPassGroup1()
  {
    
    if(this.userService.checkPassGroup(this.passGroup)!=true)
      {
       this.navCtrl.push(ShowDitailGroupPage);
       this.navCtrl.setRoot(ShowDitailGroupPage);
      }
    else { alert("שגיאה בפרטי הקבוצה");}
  }

}
