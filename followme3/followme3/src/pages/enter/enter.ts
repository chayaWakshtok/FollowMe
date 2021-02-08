import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RegisterPage } from '../register/register';

/**
 * Generated class for the EnterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-enter',
  templateUrl: 'enter.html',
})
export class EnterPage {
  checkbox2:boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  moveRegister()
  {
    this.navCtrl.push(RegisterPage);
    this.navCtrl.setRoot(RegisterPage);
  }

  ionViewDidLoad() {
    
  }

}
