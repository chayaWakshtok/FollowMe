import { Component, ViewChild, NgZone } from '@angular/core';
import { Nav, Platform, LoadingController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { MapPage } from '../pages/map/map';
import { GroupPage } from '../pages/group/group';
import { GooglePlus } from '@ionic-native/google-plus';
import { ShowDitailGroupPage } from '../pages/show-ditail-group/show-ditail-group';
import { UsersServiceProvider, group, marker, MessageUser } from '../providers/users-service/users-service';
import { NativeStorage } from '@ionic-native/native-storage';
import { AddUserToGroupPage } from '../pages/add-user-to-group/add-user-to-group';
import { OpenPage } from '../pages/open/open';
import { ShowDitailUserPage } from '../pages/show-ditail-user/show-ditail-user';
import { LoginGroupPage } from '../pages/login-group/login-group';
import { EnterPage } from '../pages/enter/enter';
import { Storage } from '@ionic/storage';
import { EnterGroupPage } from '../pages/enter-group/enter-group';
import { AddNewGroupsPage } from '../pages/add-new-groups/add-new-groups';
import { Geolocation } from '@ionic-native/geolocation';
import { User } from '../../node_modules/firebase';
import { Keyboard } from '@ionic-native/keyboard';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { BatteryStatus } from '@ionic-native/battery-status';
import * as moment from 'moment';
import { HistoryPage } from '../pages/history/history';
import { HistoryBarChartsPage } from '../pages/history-bar-charts/history-bar-charts';
import { HistoryDoughnutChartPage } from '../pages/history-doughnut-chart/history-doughnut-chart';

export interface MenuItem {
  title: string;
  component: any;
  icon: string;
}

@Component({
  templateUrl: 'app.html'
})

export class MyApp {

  loading: any;
  cart: any;

  @ViewChild(Nav) nav: Nav;

  user: User;
  nameUser: string="";
  rootPage: any = HomePage;
  groupNow: group;
  pages: Array<MenuItem>;
  allGroup: group[];
  notifications: any[] = [];
  notifyTime = moment(new Date()).format();
  image: string="";
  nameGroup: string="";

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    private geolocation: Geolocation,
    public splashScreen: SplashScreen,
    public googlePlus: GooglePlus,
    public zone: NgZone,
    private storage: Storage,
    private userService: UsersServiceProvider,
    private nativeStorage: NativeStorage,
    private loader: LoadingController,
    public keyboard: Keyboard,
    private localNotifications: LocalNotifications,
    private batteryStatus: BatteryStatus,
    private alertCtrl: AlertController) {

    this.showLoader();
    this.checkStorage();
    this.initializeApp();


    // used for  ngFor and navigation

    this.pages = [
      { title: 'דף הבית', component: HomePage, icon: 'home' },
      { title: 'קבוצות ', component: GroupPage, icon: 'person' },
      { title: 'מפת טיול', component: MapPage, icon: 'map' },
      { title: 'היסטורית התראות', component: HistoryPage, icon: 'paper' },
    ];


    platform.pause.subscribe(e => {
     console.log("before close");
     this.userService.updateUserStatus();
    });
    
    window.addEventListener('beforeunload', () => {
      this.userService.updateUserStatus();
    });
  }
  ngOnInit() {
    this.batteryStatus.onChange().subscribe(status => {
      console.log(status.level, status.isPlugged);
    });

    this.userService.subject.subscribe(v=>{
      this.userService.getUserInf(v.toString()).then(p => {
        this.nameUser = p.LastName + " " + p.FirstName;
        this.image=p.Image;
      })
    })

    this.userService.groupSubject.subscribe(v=>{
      if(v)
        this.nameGroup=v.toString();
        else this.nameGroup="";
    })

    this.batteryStatus.onCritical().subscribe(status => {
      alert("Battery Level Critical " + status.level + "%\nRecharge Soon!");
      this.userService.getUserInf(this.userService.getPhoneUser()).then(data=>{
        let message=new MessageUser();
      message.Group= this.userService.getGroup();
      message.Message.CodeError=9;
      message.UserName=data.Marker.NameAndPhone;
         this.userService.sendMessgeComplex(message).subscribe(p=>{},err=>{"תקלה לא היה אפשרות לשליחת הודעה על כך שמסתימת הבטריה"});
      })
     
      this.userService.updateUserStatus();
    })
  }

  showLoader() {
    this.loading = this.loader.create({
      content: '...המתן'
    });
    this.loading.present();
  }

  initializeApp() {


    this.platform.ready().then(() => {


      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // this.platform.setDir();
      this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(true);
      //this.splashScreen.hide();
      this.zone.run(() => {
      });
      this.keyboard.show();
      this.keyboard.disableScroll(false);
    });
  }

  openPage(page) {
    if(page.title== "מפת טיול")
    {
      
      let group = this.userService.getGroup();
      if (group == null || group == undefined)
      {
      
        alert("לא נבחרה קבוצה") ;
       this.nav.setRoot(GroupPage);
      }
      else  this.nav.setRoot(MapPage);
    }
   
  else  this.nav.setRoot(page.component);
  }

  // addToGroup() {
  //   this.nav.push(EnterGroupPage);
  //   this.nav.setRoot(EnterGroupPage);
  // }
  marker: marker;

  updateMyLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.marker = new marker();
      this.marker.Lat = resp.coords.latitude;
      this.marker.Lng = resp.coords.longitude;
      this.userService.updateMarker(this.userService.getPhoneUser(), this.marker).subscribe(p => {
        console.log("ok");
        console.log(this.marker);
      },err=>{console.log("תקלה בעדכון מקומך")})
    },err => {console.log("בעיה בקבלת מקומך")});
  }




  getCurrectLocation() {
    this.updateMyLocation();
    setInterval(() => {

      this.updateMyLocation();
   

      this.userService.getMyMessage().then((mes: MessageUser[]) => {
        mes.forEach(element => {
          console.log(element);
          let massage = element.Message.MessageError;
          let titleMessage = element.Group.Name; 
          if(element.Message.CodeError!=4)
          {
          if (element.Message.CodeError == 1)
            massage += "מטייל: " + element.UserName;
          this.addNotification(titleMessage, massage);
        }else {
          let set=setInterval(()=>{ 
            let alert = this.alertCtrl.create({
            title: "אישור הצטרפות לטיול",
            subTitle: "נא לאשר את השתתפותך בטיול",
            buttons: [  {
              text: 'אישור',
              role: 'ok',
              handler: data => {
               element.Group.UserOk[element.Group.UserOk.length].UserPhoneGroup=this.user.phoneNumber;
               this.userService.updateGroup(element.Group.Password).then(p=>{
                  clearInterval(set);
               })
              }
             
            },{
              text: 'ביטול',
              role: 'cancel',
              handler: data => {
                
              }
            }]
          });
          alert.present();},60000)
         
        }
        }, err => { console.log(err) });

      }, err => console.log(err)).catch(err => { "לא היתה אפשרות לקבלת ההדעות שנשלחו למשתמש" })
     
    }, 60000);

    setInterval (()=>{
      this.userService.CheckDistance().then(p => { 
        console.log(p + " CheckDistance") }).catch(error => { console.log(error+"error") });
    },120000)  ;

    // let watch = this.geolocation.watchPosition();
    // watch.subscribe((data) => {
    //   this.marker = new marker();
    //   this.marker.lat = data.coords.latitude;
    //   this.marker.lng = data.coords.longitude;
    //   this.userService.updateMarker(this.userService.getPhoneUser(), this.marker).then(p=>{},err=>{}).catch(err=>{});
    // },err=>{console.log(err)});

  }


  checkStorage() {
    if (this.platform.is("cordova")) {

      this.nativeStorage.getItem('myPhone')
        .then(
          data => {
            console.log(data+ " getItem('myPhone')");
            this.userService.setPhoneUser(data);
            this.userService.getUserInf(data).then(p => {
              this.nameUser = p.LastName + " " + p.FirstName;
            })
            this.getCurrectLocation();
            this.checkCountGroup();
          },
          error => {
            this.loading.dismiss();
            this.nav.push(EnterPage);
            this.nav.setRoot(EnterPage);
          }
        );
    }
    else {
debugger;
      this.storage.get("myPhone").then(p => {
      
        this.cart = p
        if (this.cart != undefined) {
            console.log(p+ " getItem('myPhone')");
          this.userService.setPhoneUser(this.cart);

          this.userService.getUserInf(this.cart).then(p => {
           this.nameUser = p.LastName + " " + p.FirstName;
          })
          this.getCurrectLocation();
          this.checkCountGroup();
        }
        else {
          this.loading.dismiss();
          this.nav.push(EnterPage);
          this.nav.setRoot(EnterPage)
        }
      });
    }

  }

  checkCountGroup() {
    this.loading.dismiss();
    this.userService.getGroups(this.userService.getPhoneUser()).then(data => {
     
      this.allGroup = data;
      if (this.allGroup.length > 1) {
         this.nav.push(GroupPage);
        this.nav.setRoot(HomePage);
      }
      else if (this.allGroup.length == 1) {
        this.userService.setGroup(this.allGroup[0]);
        this.nav.setRoot(HomePage)
      }
      else {
        this.nav.setRoot(HomePage);
      }
    }, (eror) => {
      alert("שגיאה בקבלת הקבוצות שהמשתמש רשום עליהם");
    })
  }

  addNotification(title, message) {//notification

    this.localNotifications.schedule({
      title: title,
      text: message,
      led: 'FF0000',
      smallIcon: 'res://calendar',
      sound: this.setSound(),
    });

    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['אישור']
    });
    alert.present();
  }

  setSound() {
    if (this.platform.is('android')) {
      return 'file://assets/sounds/Rooster.mp3'
    } else {
      return 'file://assets/sounds/Rooster.caf'
    }
  }



}
