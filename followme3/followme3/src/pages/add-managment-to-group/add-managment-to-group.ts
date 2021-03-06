import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { group, User, userInGroup, UsersServiceProvider, DefinitionUser, managmentInGroup } from '../../providers/users-service/users-service';
import { HomePage } from '../home/home';

/**
 * Generated class for the AddManagmentToGroupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-managment-to-group',
  templateUrl: 'add-managment-to-group.html',
})
export class AddManagmentToGroupPage {
  loading: any;
  group: group;
  users: User[];
  allUsers: User[];
  selectUser: userInGroup;
  selectedUser: User;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alert: AlertController
    , public userServise: UsersServiceProvider, public loadingCtrl: LoadingController) {

  }
  showLoader() {
    this.loading = this.loadingCtrl.create({
      content: '...המתן'
    });
    this.loading.present();
  }
  addToGroup(user: User) {
    this.selectUser = new userInGroup();
    this.selectUser.UserPhoneGroup = user.Phone;
    this.selectUser.Definition = new DefinitionUser();
    this.selectUser.Definition.SeeMeALL = true;
    this.users.push(user);
    let i: number;
    for (i = 0; i < this.group.Users.length; i++) {
      if (this.allUsers[i] == user) {
        this.allUsers.splice(i, 1);

      }
    }
  }
  removeItem(item) {

    let i: number;
    for (i = 0; i < this.group.Users.length; i++) {
      if (this.group.Users[i] == item) {
        this.group.Users.splice(i, 1);
      }
    }
  }

  saveUser() {
    let userIn: managmentInGroup[] = [];
    this.users.forEach(e => {
      let inin: managmentInGroup = new managmentInGroup();
      inin.PhoneManagment = e.Phone;
      inin.ComeToTrip=true;
      userIn.push(inin);
    });
    this.userServise.group.ListManagment = userIn;
    this.userServise.saveGroupManagers().then(p => {
      this.navCtrl.push(HomePage);
      this.navCtrl.setRoot(HomePage);
    }, (error) => {
      let alert = this.alert.create({
        title: 'טעות',
        subTitle: 'תקלה בשמירת הנתונים' + error,
        buttons: [{
          text: 'אישור',
          role: 'cancel',
          handler: data => {
          }
        }]
      });
      alert.present();
    });
  }

  ionViewDidLoad() {
    this.group = this.userServise.getGroup();
    this.showLoader();
    debugger;
    this.userServise.getUsersOfGroup().then(p => {
      this.loading.dismiss();
      debugger;
      if (p == undefined)
        p = [];
      this.users = p;
      this.group.Users = p;
    }).catch(error => {
      this.loading.dismiss();
      let alert = this.alert.create({
        title: 'טעות',
        subTitle: 'תקלה בקבלת המשתמשים לקבוצה זו' + error,
        buttons: [{
          text: 'אישור',
          role: 'cancel',
          handler: data => {
          }
        }]
      });
      alert.present();
    });
    this.userServise.getAllUsers().then(p => {
      debugger
      this.allUsers = p;
    }).catch(error => {
      let alert = this.alert.create({
        title: 'טעות',
        subTitle: 'תקלה בקבלת כל המשתמשים' + error,
        buttons: [{
          text: 'אישור',
          role: 'cancel',
          handler: data => {
          }
        }]
      });
      alert.present();
    });

  }

}
