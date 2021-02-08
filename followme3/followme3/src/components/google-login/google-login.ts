import { Component } from '@angular/core';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';

import { GooglePlus } from '@ionic-native/google-plus';
import { Platform, NavController, AlertController } from 'ionic-angular';
import { HomePage } from '../../pages/home/home';
import { User, UsersServiceProvider } from '../../providers/users-service/users-service';
import { Input } from '@angular/core';
import { Storage } from '../../../node_modules/@ionic/storage';
import { NativeStorage } from '../../../node_modules/@ionic-native/native-storage';
import { Sim } from '../../../node_modules/@ionic-native/sim';



@Component({
  selector: 'google-login',
  templateUrl: 'google-login.html'
})
export class GoogleLoginComponent {
  @Input()
  phone: string;
  user: Observable<firebase.User>;
  costomerUser: any;

  constructor(private afAuth: AngularFireAuth,
    private gplus: GooglePlus,
    private platform: Platform,
    public nav: NavController,
    public userService: UsersServiceProvider,
    public storage: Storage,
    public nativeStorage: NativeStorage,
    public alertCtrl: AlertController,
    public sim: Sim) {

    this.user = this.afAuth.authState;

  }

  /// Our login Methods will go here
  async nativeGoogleLogin(): Promise<any> {
    try {

      const gplusUser = await this.gplus.login({
        'webClientId': 'yountId-XYZ.apps.googleusercontent.comr-webClie',
        'offline': true,
        'scopes': 'profile email'
      })

      return await this.afAuth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken))

    } catch (err) {
      console.log(err)
    }
  }


  presentPrompt1() {

    let alert = this.alertCtrl.create({
      title: 'תקלה בקבלת מספר הפלאפון נא הכנס אותו ידנית',
      inputs: [
        {
          name: 'phone',
          placeholder: 'פלאפון',
          type: 'text',
          value: this.phone
        },
      ],
      buttons: [
        {
          text: 'אישור',
          role: 'ok',
          handler: data => {

            if (data) {
              console.log(data.phone);
              this.phone = data.phone;
              this.register();

            } else {
            }
          }
        },


        {
          text: 'ביטול',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        }

      ]
    });
    alert.present();
  }

  getPhoneFromSim1() {
    debugger;
    this.sim.getSimInfo().then(
      (info) => {
        console.log('sim info:', info);
        this.phone = info;
        this.register()
      },
      async (err) => {
        console.log('Unable to get sim info:', err);
        await this.presentPrompt1();
      });

    this.sim.hasReadPermission().then(
      () => console.log('Permission granted'),
      () => console.log('premission denied')
    );

    this.sim.requestReadPermission().then(
      () => console.log('premetion granted'),
      () => console.log('premetion denied')
    );
  }


  async webGoogleLogin(): Promise<void> {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const credential = await this.afAuth.auth.signInWithPopup(provider);
      const loggedIn: any = credential.additionalUserInfo.profile;

      this.costomerUser = {
        email: loggedIn.email, firstName: loggedIn.given_name, lastName: loggedIn.family_name,
        image: loggedIn.picture, phone: this.phone
      };
      this.getPhoneFromSim1();
    } catch (err) {
      console.log(err)
    }
  }

  register() {
    this.costomerUser.phone = this.phone;
    this.userService.addUser(this.costomerUser).then(p => {
      this.userService.isManagment = false;
      this.userService.setPhoneUser(this.phone);
      this.storage.set("myPhone", this.phone).then(p => console.log(p));
      this.nativeStorage.setItem('myPhone', this.phone)
        .then(
          () => console.log('Stored item!'),
          error => console.error('Error storing item', error)
        );
      this.nav.push(HomePage);
      this.nav.setRoot(HomePage)
    })
      ;
  }

  googleLogin() {
    if (this.platform.is('cordova')) {
      this.nativeGoogleLogin();
    } else {
      this.webGoogleLogin();
    }
  }

  signOut() {
    this.afAuth.auth.signOut();
    if (this.platform.is('cordova')) {
      this.gplus.logout();
    }
  }

}