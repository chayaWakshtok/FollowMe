import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { marker, UsersServiceProvider, group, User, MessageUser, MessageGroup, MarkerUser } from '../../providers/users-service/users-service';
import { Observable } from 'Rxjs/rx';
import { Subscription } from "rxjs/Subscription";
import { google } from "google-maps";
import 'rxjs/add/operator/map';
import { LoginGroupPage } from '../login-group/login-group';
import { GroupPage } from '../group/group';
import { HomePage } from '../home/home';
import { ShowDitailUserPage } from '../show-ditail-user/show-ditail-user';
import { Message } from '../../../node_modules/@angular/compiler/src/i18n/i18n_ast';
import { MapUserPage } from '../map-user/map-user';
declare var google;
/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})

export class MapPage {



  public latitude: number;
  public longitude: number;
  mar: marker[];

  public zoom: number;
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  markers = [];
  timeUpload: number = 0;
  group: group = new group();
  loading: any;
  myLocation: marker;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private geolocation: Geolocation,
    private userService: UsersServiceProvider,
    public loadingCtrl: LoadingController,
    private _ngZone: NgZone,
    private alertCtrl: AlertController) {


  }

  showLoader() {

    this.loading = this.loadingCtrl.create({
      content: '...המתן'
    });

    this.loading.present();

  }

  myAddMarker = () => {
    var iconUser = '../../assets/imgs/trip1.png';
    var iconManagment = "../../assets/imgs/managmentIcon.png";
    //קבלת כל מקומי מנהלי הקבוצה 
    this.userService.getMarkerManagments(this.group).then((res: MarkerUser[]) => {
      //פונקציה למחיקת כל הנקודות על המפה כדי לעדכן את המפה
      this.deleteMarkers();
      let markers: MarkerUser[] = res;
      //מעבר על כל מיקום
      markers.forEach(element => {
        if (element.statusDistance == true)
          //TODO:לשנות לתמונה
          iconManagment = "../../assets/imgs/managmentIcon.png"//yellow
        else iconManagment = "../../assets/imgs/managmentIcon.png";//grey
        //יצירת האיקון 
        var icon = {
          url: iconManagment, // url
          scaledSize: new google.maps.Size(30, 30), // scaled size
          origin: new google.maps.Point(0, 0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
        };
        //יצירת נקודה על המפה
        var myCenter: any = new google.maps.LatLng(element.marker.Lat, element.marker.Lng);
        //יצירת מרקר
        var marker = new google.maps.Marker({ position: myCenter, icon: icon });
        //הוספת הנקודה למפה
        marker.setMap(this.map);
        this.markers.push(marker);
        let image = "../assets/imgs/avatar.jpg";

        if (element.image != null && element.image != undefined && element.image != "")
          image = element.image;
        //הוספת אירוע- כאשר לוחצים על המרקר מוצגים פרטי המטייל או המנהל שנמצאים בנקודה זו
        google.maps.event.addListener(marker, 'click', () => {
          let infor = "<p class='name'>" + element.marker.NameAndPhone.substring(0, element.marker.NameAndPhone.length - 11) + '</p></br> <div class="user-avatar"> <img src=' + image + '></div><button class="btn1" id="open" ></span> פרטי מנהל<button/> <button class="btn1" id="sendMessage" >שליחת הודעה</button>';


          //בדיקה אם זה הנקודה שלי אז לא מוצגים הפרטים אלא רק כתוב אני
          if (element.marker.NameAndPhone.substring(element.marker.NameAndPhone.length - 10) == this.userService.getPhoneUser())
            infor = "אני <p id='open'><p/><p id='sendMessage'><p/>";
          var infowindow = new google.maps.InfoWindow({
            content: infor,
            maxWidth: 300
          });
          infowindow.open(this.map, marker);
          //infowindowלחיצה על כפתור הצגת פרטים מורכבים שנמצא על 
          google.maps.event.addListenerOnce(infowindow, 'domready', () => {
            //מעבר לדף פרטי מטייל- משתמש
            document.getElementById('open').addEventListener('click', () => {
              this.userService.userDetails = element.marker.NameAndPhone.substring(element.marker.NameAndPhone.length - 10);
              this.navCtrl.push(MapUserPage, {
                marker: element,
              });
            });
            //infowindowלחיצה על כפתור שליחת הודעה שנמצא על 
            document.getElementById('sendMessage').addEventListener('click', () => {
              let message: MessageUser;
              this.sendMessage(element.marker.NameAndPhone)
            });
          });
        });
      });
      //לשנות כדי שהפונקציו יהיו תקינות
      //קבלת כל מקומי המטיילים
      this.userService.getMarkerUsers(this.group).then(res => {
        let markers: MarkerUser[] = res;


        markers.forEach(element => {

          if (element.statusDistance == false)
            //TODO:לשנות לתמונה
            iconManagment = "../../assets/imgs/managmentIcon.png"//grey
          else {
            if (element.distanceLessManagment > this.group.DefinitionGroup.Distance)
              iconManagment = "../../assets/imgs/managmentIcon.png";//red
            else if (element.distanceLessManagment + 100 >= this.group.DefinitionGroup.Distance)
              iconManagment = "../../assets/imgs/managmentIcon.png";//orange
            else if (element.distanceLessManagment < this.group.DefinitionGroup.Distance)
              iconManagment = "../../assets/imgs/managmentIcon.png";//green
          }
          var icon = {
            url: iconUser, // url
            scaledSize: new google.maps.Size(30, 30), // scaled size
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
          };
          var myCenter: any = new google.maps.LatLng(element.marker.Lat, element.marker.Lng);
          var marker = new google.maps.Marker({ position: myCenter, icon: icon });
          marker.setMap(this.map);
          this.markers.push(marker);

          google.maps.event.addListener(marker, 'click', () => {
            let distance = this.getDistanceFromLatLonInMeter(this.myLocation.Lat, this.myLocation.Lng, element.marker.Lat, element.marker.Lng);
            let image = "../assets/imgs/avatar.jpg";

            if (element.image != null && element.image != undefined && element.image != "")
              image = element.image;
            console.log(image);
            let infor = "<p class='name'>" + element.marker.NameAndPhone.substring(0, element.marker.NameAndPhone.length - 11) + '</p></br> <div class="user-avatar"> <img src=' + image + '></div><p>' + distance + '  מטר ממך</p><button class="btn1" id="open" ></span> פרטי מטייל<button/> <button class="btn1" id="sendMessage" >שליחת הודעה</button>';
            if (element.marker.NameAndPhone.substring(element.marker.NameAndPhone.length - 10) == this.userService.getPhoneUser())
              infor = "<p class='me1 name'>אני<p/><div class='user-avatar me'> <img src=" + image + "></div> <p id='open'><p/><p id='sendMessage'><p/>";
            var infowindow = new google.maps.InfoWindow({
              content: infor
            });
            infowindow.open(this.map, marker);
            google.maps.event.addListenerOnce(infowindow, 'domready', () => {
              document.getElementById('open').addEventListener('click', () => {
                this.userService.userDetails = element.marker.NameAndPhone.substring(element.marker.NameAndPhone.length - 10);
                this.navCtrl.push(MapUserPage, {
                  marker: element,
                });
              });
              document.getElementById('sendMessage').addEventListener('click', () => {
                let message: MessageUser;
                this.sendMessage(element.marker.NameAndPhone)
              });
            });
          });

        });
      }, err => {
        this.loading.dismiss();
        alert(err);
        console.log(err)
      }
      );
    }, err => {
      this.loading.dismiss();
      alert(err);
      console.log(err)
    }
    );
    if (this.timeUpload == 0) {
      this.loading.dismiss();
      this.timeUpload++;
    }
  }

  mapInterval() {
    this.myAddMarker();
    setInterval(this.myAddMarker, 20000000);
  }


  sendMessage(user: string) {
    let message: MessageUser = new MessageUser();
    // message.Group=this.userService.getGroup();
    message.UserName = user;
    message.Message = new MessageGroup();
    message.Message.CodeError = 9;
    message.Message.MessageError = "";
    console.log(message);
    let alert = this.alertCtrl.create({
      title: ' שליחת הודעה ל' + user.substring(0, user.length - 11),
      inputs: [
        {
          name: 'textMassage',
          placeholder: 'תוכן ההודעה',
          type: 'text'
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
          text: 'שלח הודעה',
          handler: data => {
            console.log(data);
            message.Message.MessageError = data.textMassage;
            this.userService.sendMessgeComplex(message).subscribe(p => {
              console.log("ok");
            }, err => { console.log(err) })
          }
        }
      ]
    });
    alert.present();
  }


  clearAllMarker() {

  }



  initMap() {
    console.log("map");
    try {
      this.geolocation.getCurrentPosition({ maximumAge: 3600, timeout: 5000, enableHighAccuracy: true }).then((resp) => {
        this.myLocation = new marker();
        this.myLocation.Lat = resp.coords.latitude;
        this.myLocation.Lng = resp.coords.longitude;
        let mylocation = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
        this.map = new google.maps.Map(this.mapElement.nativeElement, {
          zoom: 16,
          center: mylocation
        });
        this.mapInterval();
      });
    } catch{
      console.log("error in map")
    }
  }



  ionViewDidLoad() {
    this.group = new group();
    this.group = this.userService.getGroup();
    if (this.group == null || this.group == undefined)
      this.group = this.userService.getGroupManagment();

    if ((this.userService.getGroup() == null || this.userService.getGroup() == undefined) && (this.userService.getGroupManagment() == null || this.userService.getGroupManagment() == undefined)) {
      this.navCtrl.setRoot(HomePage);
      this.navCtrl.push(GroupPage);
    }
    this.showLoader();
    this.initMap();

  }



  setMapOnAll() {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
  }


  deleteMarkers() {
    this.setMapOnAll();
    this.markers = [];
  }

  init() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: new google.maps.LatLng(41.976816, -87.659916),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow({});

    var marker, i = -1;
    this.userService.getMarkerUsers(this.group).then(res => {
      this.loading.dismiss();
      let markers = res;
      markers.forEach(element => {
        i++;
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(element.marker.Lat, element.marker.Lng),
          map: this.map
        });
        google.maps.event.addListener(marker, 'click', (function (marker, i) {
          return function () {
            infowindow.setContent(element.marker.NameAndPhone);
            infowindow.open(this.map, marker);
          }
        })(marker, i));
        this.markers.push(marker);
      });
    }, err => { console.log(err) }
    );
  }


  getDistanceFromLatLonInMeter(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d * 1000;//return in Distance in meter
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180)
  }

}



