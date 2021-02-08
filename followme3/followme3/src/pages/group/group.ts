import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { group, UsersServiceProvider } from '../../providers/users-service/users-service';
import { MapPage } from '../map/map';
import { HomePage } from '../home/home';
import { HomeManagmentPage } from '../home-managment/home-managment';
import { HomeManagmentPageModule } from '../home-managment/home-managment.module';
import { ShowDitailGroupPage } from '../show-ditail-group/show-ditail-group';
import { AddUserToGroupPage } from '../add-user-to-group/add-user-to-group';

import { AddNewGroupsPage } from '../add-new-groups/add-new-groups';

/**
 * Generated class for the GroupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-group',
  templateUrl: 'group.html',
})
export class GroupPage{
  
  shouldAnimate: boolean = true;
  loading: any;
  phone:string;
  groups:group[]=[];
  managmentGroup:group[]=[];
  groupDisable:group[]=[];
  managmentGroupDisable:group[]=[];
 
  constructor(public navCtrl: NavController, public navParams: NavParams,public alert:AlertController,
    private userService:UsersServiceProvider,public loadingCtrl:LoadingController,public  toastCtrl: ToastController) {
  }
  openHome(group:group)
  {
    console.log(group);
    this.userService.isManagment=false;
    this.userService.setGroup(group);
    this.navCtrl.push(HomePage,{gr:group,phone:this.phone});
    this.navCtrl.setRoot(HomePage,{gr:group,phone:this.phone});
  }

  openHomeManagment(group:group)
  {//לשנות לדף מנהל
    this.userService.isManagment=true;
      this.userService.setPhoneManagment(this.phone);
      this.userService.setGroupManagment(group);
      this.userService.setGroup(group);
      this.navCtrl.push(HomePage,{gr:group,phone:this.phone});
      this.navCtrl.setRoot(HomePage,{gr:group,phone:this.phone});
  }

  showLoader(){
 
    this.loading = this.loadingCtrl.create({
        content: '...המתן'
    });

    this.loading.present();

}
  ionViewDidLoad() {


    this.phone= this.userService.getPhoneUser();
    this.showLoader();
    this.userService.getGroups(this.phone).then(p=>{
      this.loading.dismiss();
    this.groups=p;
   }).catch(error=>{console.log(error+" תקלה בקבלת הקבוצות שהמשתמש רשום אליהם");
   let alert= this.createAlert(error," תקלה בקבלת הקבוצות שהמשתמש רשום אליהם");
   alert.present();
  }
  );
    this.userService.getManagmentGroup(this.phone).then(p=>{
    
    this.managmentGroup=p;
}).catch(error=>{

  let alert= this.createAlert(error," תקלה בקבלת הקבוצות שהמשתמש מנהל שלהם");
  alert.present();
  console.log(error+" תקלה בקבלת הקבוצות שהמשתמש מנהל בהם");
});
  this.userService.getManagmentGroupFalse().subscribe(
    data=>{
       this.managmentGroupDisable=data;
       console.log(data);
    },err=>{
     let alert= this.createAlert(err,"תקלה בקבלת הקבוצות שעדין לא נפתחו");
     alert.present();
    }
  );
  this.userService.groupOfUserStatusFalse().subscribe(data=>{
  this.groupDisable=data;
 console.log(data);
  },error=>{
     let alert=this.createAlert(error,"תקלה בקבלת הקבוצות שאתה מנהל בהם ועדין לא נפתחו")
  } )

  }



  createAlert(error,title): any {
  return  this.alert.create({
      title: title,
      subTitle: ''+error,
      buttons: [  {
        text: 'אישור',
        role: 'cancel',
        handler: data => {
        }
      }]
    });
  }

    


  settingGroup(group:group)
  {
    this.userService.setGroup(group);
    this.navCtrl.push(ShowDitailGroupPage)
  }

  addUsersToGroup(group:group)
  {
    this.userService.setGroup(group);
    this.navCtrl.push(AddUserToGroupPage);
  }

  deleteGroup(group:group)
  {
  let alert=  this.alert.create({
      title: "מחיקת קבוצה",
      subTitle: ' הכנס סיסמת קבוצה שברצונך למחוק  ',
      inputs: [
        {
          name: 'password',
          placeholder: 'סיסמה',
          type: 'password'
        }
      ],
      buttons: [  {
        text: 'אישור',
        role: 'ok',
        handler: data => {

          if(group.Password==data.password)
          {
            this.userService.deleteGroup(group.Password).subscribe(p=>{
             
              this.managmentGroup.splice(this.managmentGroup.indexOf(group),1);
             // createprompt
            })
          }
          else{
            this.showErrorToast('סיסמה לא תקינה');
          }
         
        }
      },{
        text: 'ביטול',
        role: 'cansel',
        handler: data => {
        }
      }]
    });
    alert.present();
  }
  
showErrorToast(data: any) {
    let toast = this.toastCtrl.create({
      message: data,
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  addGroup()
  {
    this.navCtrl.push(AddNewGroupsPage);
  }

  addToGroup()
  {
   let alert= this.alert.create({
      title: 'הצטרפות לקבוצה על ידי קוד קבוצה',
      subTitle: 'הכנס קוד קבוצה',
      inputs: [
        {
          name: 'code',
          placeholder: 'קוד קבוצה',
          type: 'password'
        }
      ],
      buttons: [  {
        text: 'אישור',
        role: 'ok',
        handler: data => {
          this.checkKodGroup(data.code);
        }
       
      },{
        text: 'ביטול',
        role: 'cancel',
        handler: data => {
        }
      }]
    });
    alert.present();
  }

  checkKodGroup(code:string)
  {
      this.userService.checkKod(code).then(
        p=>{ 
            this.userService.setGroup(p);
            this.navCtrl.setRoot(HomePage);
        },(eror)=>{let alert= this.createAlert(" קוד הקבוצה שהוכנס שגוי  ","שגיאה בקוד הקבוצה");
      alert.present();}
      );
  }

}
