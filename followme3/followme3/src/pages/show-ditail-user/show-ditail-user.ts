import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { UsersServiceProvider, User } from '../../providers/users-service/users-service';
import { EditUserPage } from '../edit-user/edit-user';

/**
 * Generated class for the ShowDitailUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-show-ditail-user',
  templateUrl: 'show-ditail-user.html',
})
export class ShowDitailUserPage {
  nameUser:any;
  user:User=new User();
  currentAdressPlace: string="";
  loading: any;

  constructor(public navCtrl: NavController,
     public navParams: NavParams, public loadingCtrl: LoadingController,
     private userService:UsersServiceProvider) {
  }


  private showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'המתן...'
    });
    this.loading.present();
  }


  ionViewDidLoad() {
    this.showLoading();
   this.userService.getUserInf(this.userService.userDetails).then(p=>{
     this.user=p;
     this.nameUser=p.FirstName+" "+p.LastName;
    try {
         this.getGeoLocation(this.user.Marker.Lat,this.user.Marker.Lng);
    } catch (error) {
  
    }
    
     
   },err=>{});

  }

  editUser()
  {
    this.navCtrl.push(EditUserPage);
  }


  getGeoLocation(lat: number, lng: number) {
    if (navigator.geolocation) {
        let geocoder = new google.maps.Geocoder();
        let latlng = new google.maps.LatLng(lat, lng);
        let request = { latLng: latlng };
    
        geocoder.geocode({'location': latlng}, (results, status) => {
          debugger;
          if (status == google.maps.GeocoderStatus.OK) {
            let result = results[0];
            this.currentAdressPlace = result.formatted_address;
            this.loading.dismiss();
            } else {
              alert("No address available!");
              this.loading.dismiss();
            }
          }
        );
    }
    else{
      this.loading.dismiss();
    }
    
    }

}
