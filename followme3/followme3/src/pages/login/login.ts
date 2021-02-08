import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController } from 'ionic-angular';
import { UsersServiceProvider } from '../../providers/users-service/users-service';
import { HomePage } from '../home/home';
import { Keyboard } from '@ionic-native/keyboard';
import { Storage } from '@ionic/storage';
import { RegisterPage } from '../register/register';
import { NativeStorage } from '@ionic-native/native-storage';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  [x: string]: any;
  loading: any;
   phone:string=null;
   user:string;
 cart:any;
  constructor(private nav: NavController,private keyboard: Keyboard,  private userService:UsersServiceProvider,
    public loadingCtrl: LoadingController,private storage: Storage,private nativeStorage: NativeStorage) {

         this.checkStorage();
     }

     checkStorage()
     {
      this.nativeStorage.getItem('myPhone')
      .then(
        data => this.nav.push(HomePage),
        error => this.nav.push(RegisterPage)
      );
      this.storage.get("myPhone").then(p=>{
        debugger;
      this.cart=p
      console.log(this.cart)
      if(this.cart!=undefined)
      {
       this.nav.push(HomePage);
       this.nav.setRoot(HomePage);
      }
      else {this.nav.push(RegisterPage);
      this.nav.setRoot(RegisterPage)}
    });
  }
 
  public login() {

    this.showLoader();
 
    this.userService.login(this.phone).then((res) => {
 
      console.log( res.text());
      this.loading.dismiss();
      if(new String( res.text()).includes("true") )
      {
        this.storage.set("myphone",this.phone);
        this.loading.dismiss();
      this.nav.push(HomePage);
        this.nav.setRoot(HomePage);
        }
  }, (err) => {
      console.log("Not find");
      this.loading.dismiss();
  }); 
  }
 
  ionViewDidLoad() {
   
    console.log('ionViewDidLoad LoginPage');
   
    this.keyboard.show();
    
   
    
  }

  public showKeyboard() {
    this.keyboard.show();
}


  showLoader(){
 
    this.loading = this.loadingCtrl.create({
        content: '...המתן'
    });

    this.loading.present();

}

}
