import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { UsersServiceProvider, User, MarkerUser } from '../../providers/users-service/users-service';


/**
 * Generated class for the MapUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-map-user',
  templateUrl: 'map-user.html',
})
export class MapUserPage {

  nameUser:any;
  user:User=new User();
  info: MarkerUser;
  currentAdressPlace: string;
  loading: any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public userService:UsersServiceProvider,public load:LoadingController) {
  }

  ionViewDidLoad() {
    this.showLoading();
   this.info=  this.navParams.get("marker");
   console.log(this.info.distanceLessManagment);
    this.userService.getUserInf(this.userService.userDetails).then(p=>{
      this.user=p;
      this.nameUser=p.FirstName+" "+p.LastName;
      this.getGeoLocation(this.user.Marker.Lat,this.user.Marker.Lng)
    });
 
   }

   private showLoading() {
    this.loading = this.load.create({
      content: 'המתן...'
    });
    this.loading.present();
  }


   getGeoLocation(lat: number, lng: number) {
    if (navigator.geolocation) {
        let geocoder = new google.maps.Geocoder();
        let latlng = new google.maps.LatLng(lat, lng);
        let request = { latLng: latlng };
    
        geocoder.geocode({'location': latlng}, (results, status) => {
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

    getTimeBetwwenPoint()
    {
//       var origin = new google.maps.LatLng( location.latitude, location.longitude ); // using google.maps.LatLng class
// var destination = target.latitude + ', ' + target.longitude; // using string

// var directionsService = new google.maps.DirectionsService();
// var request = {
//     origin: origin, // LatLng|string
//     destination: destination, // LatLng|string
//     travelMode: google.maps.DirectionsTravelMode.DRIVING
// };

// directionsService.route( request, function( response, status ) {

//     if ( status === 'OK' ) {
//         var point = response.routes[0].legs[0];
//         $( '#travel_data' ).html( 'Estimated travel time: ' + point.duration.text + ' (' + point.distance.text + ')' );
//     }
// } );
    }

}
