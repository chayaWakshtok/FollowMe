import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { User, UsersServiceProvider, marker } from '../../providers/users-service/users-service';
import { HomePage } from '../home/home';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { GooglePlus } from '@ionic-native/google-plus';
import { Storage } from '@ionic/storage';
import { NativeStorage } from '@ionic-native/native-storage';
//import { File } from '@ionic-native/file';
import { EnterGroupPage } from '../enter-group/enter-group';
import { Sim } from '@ionic-native/sim'
import { Geolocation } from '@ionic-native/geolocation';
import { registerModuleFactory } from '../../../node_modules/@angular/core/src/linker/ng_module_factory_loader';
import { GroupPage } from '../group/group';
import { AddNewGroupsPage } from '../add-new-groups/add-new-groups';
import { AddUserToGroupPage } from '../add-user-to-group/add-user-to-group';
import { MapPage } from '../map/map';
import { ShowDitailGroupPage } from '../show-ditail-group/show-ditail-group';
import { ShowDitailUserPage } from '../show-ditail-user/show-ditail-user';
import { Facebook } from '@ionic-native/facebook';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { TwitterProvider } from '../../providers/twitter/twitter';
import firebase from 'firebase';
declare var cordova: any; // global variable for paths

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  isLoggedIn: boolean = false;
  users: any;
  images: Array<{ src: String }>;
  imgSrc: string
  user: User;
  phone: string;
  marker: marker;
  loading: any;
  userProfile: any = null;;

  constructor(public nav: NavController,

    private twitter: TwitterConnect,
    private twitterProvider: TwitterProvider,
    private fb: Facebook,
    public userService: UsersServiceProvider,
    public navParams: NavParams,
    private serviceUser: UsersServiceProvider,
    private camera: Camera,
    public loadingCtrl: LoadingController,
    public googlePlus: GooglePlus,
    private geolocation: Geolocation,
    private storage: Storage, private nativeStorage: NativeStorage,
    public sim: Sim,
    public alertCtrl: AlertController) {
    this.user = new User();
    this.images = [];
   

    fb.getLoginStatus()
      .then(res => {
        console.log(res.status);
        if (res.status === "connect") {
          this.isLoggedIn = true;
        } else {
          this.isLoggedIn = false;
        }
      })
      .catch(e => console.log(e));
  }

  takePicture() {
    const options: CameraOptions = {

      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.PNG,
      saveToPhotoAlbum: false,
      targetWidth: 200,
      targetHeight: 200
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.imgSrc = imageData;
      this.user.Image = imageData;

    }, (err) => {
      alert("שגיאה בלקיחת התמונה");
    });
  }

  getProfileImageStyle() {
    return 'url(' + this.user.Image + ')'
  }


  getPhoneFromSim(): any {
    this.sim.getSimInfo().then(
      (info) => {
        console.log('sim info:', info);
        this.user.Phone = info;
        return true
      },
      (err) => {
        console.log('Unable to get sim info:', err);
        this.presentPrompt();
        return false;
      }
    );

  }


  presentPrompt() {
    let alert = this.alertCtrl.create({
      title: 'שגיאה בקבלת מספר הפלאפון נא הקש זאת ידנית',
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
          text: 'ביטול',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'אישור',
          handler: data => {
            this.user.Phone = data.phone;
            this.register();
            return true;
          }
        }
      ]
    });
    alert.present();
  }

  enterRegister() {
    this.getPhoneFromSim();
  }

  getLocation()
  {
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp);
      this.marker = new marker();
      this.marker.Lat = resp.coords.latitude;
      this.marker.Lng = resp.coords.longitude;
      this.userService.updateMarker(this.userService.getPhoneUser(), this.marker).subscribe();
    }, err => { console.log('Error getting location', err); })
    console.log("update markers")
  }

  getCurrectLocation() {
    this.getLocation();
    setInterval(() => {
      this.getLocation();
    }, 20000);

    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      this.marker = new marker();
      this.marker.Lat = data.coords.latitude;
      this.marker.Lng = data.coords.longitude;
      this.userService.updateMarker(this.userService.getPhoneUser(), this.marker).subscribe(data => {console.log(data+" register location") }, err => { });
    });

  }


  register() {
    this.user.Marker = new marker();
    this.user.Marker = this.getMyLocation();
    this.serviceUser.addUser(this.user).then((res) => {
      this.serviceUser.isManagment = false;
      this.serviceUser.setPhoneUser(this.user.Phone);
      this.getCurrectLocation();
      console.log(res.text());
      if (new String(res.text()).includes("true")) {
        this.storage.set("myPhone", this.user.Phone).then(p => console.log(p));
        this.nativeStorage.setItem('myPhone', this.user.Phone)
          .then(
            () => console.log('Stored item!'),
            error => console.error('Error storing item' + error)
          );
        this.nav.setRoot(HomePage);
      }
    }, (err) => {
      alert("כניסת משתמש חדש נכשלה")
    });

  }
  getMyLocation(): marker {
    var myMarker: marker=new marker();

    this.geolocation.getCurrentPosition().then((resp) => {
      myMarker.Lat = resp.coords.latitude;
      myMarker.Lng = resp.coords.longitude;
    }).catch((error) => {
      console.log(error);
    });
    //myMarker.name=this.user.firstName+" "+this.user.lastName;
    return myMarker;
  }



  doGoogleLogin() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.googlePlus.login({
      'scopes': 'profile email', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
      'webClientId': '163120186497-27q1e2b6mskj23scue1fik5udebsjn5c.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
      'offline': true
    })
      .then((userr) => {

        this.storage.set("myPhone", userr.phone).then(p => console.log(p));
        this.nativeStorage.setItem('myPhone', userr.phone)
          .then(
            () => console.log('Stored item!'),
            error => console.error('Error storing item', error)
          );
        loading.dismiss();

        this.serviceUser.setPhoneUser(userr.phone);
        this.nav.push(EnterGroupPage)
      }, (error) => {
        loading.dismiss();
        alert("לא היתה אפשרות לרישום הלקוח עי חשבון גוגל");
      });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  login() {
    this.fb.login(['public_profile', 'user_friends', 'email'])
      .then(res => {
        if (res.status === "connected") {
          this.isLoggedIn = true;
          this.getUserDetail(res.authResponse.userID);
        } else {
          this.isLoggedIn = false;
        }
      })
      .catch(e => console.log('Error logging into Facebook', e));
  }

  logout() {
    this.fb.logout()
      .then(res => this.isLoggedIn = false)
      .catch(e => console.log('Error logout from Facebook', e));
  }

  getUserDetail(userid) {
    this.fb.api("/" + userid + "/?fields=name,email,first_name,picture.width(720).height(720).as(picture_large)", ["public_profile"])
      .then(res => {
        let userData = { email: res['email'], first_name: res['first_name'], picture: res['picture_large']['data']['url'], username: res['name'] }
        console.log(res);
        this.users = res;
      })
      .catch(e => {
        console.log(e);
      });
  }

  public loginWithTwitter() {
    this.showLoading();
    this.twitter.login().then((data) => {
      this.twitterProvider.setTokens(data.token, data.secret);
      this.loading.dismiss().then(() => {
        this.nav.setRoot('TimelinePage');
      });
    }, error => {
      this.showError(error);
    });
  }

  private showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

  private showError(text) {
    this.loading.dismiss().then(() => {
      let alert = this.alertCtrl.create({
        title: 'Fail',
        message: text + '\nMake sure to setup Twitter account on your device.',
        buttons: ['OK']
      });
      alert.present();
    });
  }

  twLogin(): void {
    this.twitter.login().then(response => {
      const twitterCredential = firebase.auth.TwitterAuthProvider
        .credential(response.token, response.secret);

      firebase.auth().signInWithCredential(twitterCredential)
        .then(userProfile => {
          this.userProfile = userProfile;
          this.userProfile.twName = response.userName;
          console.log(this.userProfile);
        }, error => {
          console.log(error);
        });
    }, error => {
      this.showError(error);
    });
  }




}
