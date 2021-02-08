import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { UsersServiceProvider, User } from '../../providers/users-service/users-service';
import { HomePage } from '../home/home';



@IonicPage()
@Component({
  selector: 'page-edit-user',
  templateUrl: 'edit-user.html',
})
export class EditUserPage {
  user:User=new User();
  nameUser:string="";
  loading: any;
  constructor(public navCtrl: NavController, public navParams: NavParams
  , public userService:UsersServiceProvider,public loadingCtrl: LoadingController,
  private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    this.showLoading();
    this.userService.getUserInf(this.userService.userDetails).then(p=>{
      this.user=p;
      this.nameUser=p.FirstName+" "+p.LastName; 
      this.loading.dismiss();
    },err=>{this.loading.dismiss();});
  }

  private showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'המתן...'
    });
    this.loading.present();
  }

    updateUser()
    {
         this.userService.updateUser(this.user).subscribe(data=>{
           this.userService.setPhoneUser(this.user.Phone);
         this.presentToast();
            
         },err=>{})
    }

    presentToast() {
      let toast = this.toastCtrl.create({
        message: 'עדכון פרטי המשתמש נשמרו בהצלחה',
        duration: 2000,
        position: 'top'
      });
    
      toast.onDidDismiss(() => {
        this.navCtrl.setRoot(HomePage);
      });
    
      toast.present();
    }
 
   }

