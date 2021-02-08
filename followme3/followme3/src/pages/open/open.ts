import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { UsersServiceProvider, group } from '../../providers/users-service/users-service';
import { HomePage } from '../home/home';

/**
 * Generated class for the OpenPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-open',
  templateUrl: 'open.html',
})
export class OpenPage {

  phone:string;
  groups:group[];
  load:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private userService:UsersServiceProvider,private loader:LoadingController) {


  }
  openHome(group:group)
  {
    console.log(group);
    this.userService.setGroup(group);
    this.navCtrl.push(HomePage,{gr:group,phone:this.phone});
    this.navCtrl.setRoot(HomePage,{gr:group,phone:this.phone});
  }
  ionViewDidLoad() {
    
    this.phone= this.userService.getPhoneUser();
    console.log(this.phone);
     this.userService.getGroups(this.phone).then(p=>{
       this.groups=p;
       // if(!this.groups)
       // {
       //   this.navCtrl.setRoot(HomePage,{gr:group,phone:this.phone});
       //   this.navCtrl.push(HomePage,{gr:group,phone:this.phone});
       // }
     });
  if(this.phone==undefined)
  {
    this.phone=this.userService.getPhoneUser();
    console.log(this.phone+"ionViewDidLoad");
  }
  this.userService.getGroups(this.phone).then(p=>{
       this.groups=p;
     });
  }
  // ngOnInit()
  // {
  //   alert("ngOnInit");
  //   //this.phone= this.navParams.get('phone')
  //   console.log(this.phone);
  //    this.userService.getGroups(this.phone).then(p=>{
  //      this.groups=p;
  //    });
  // }

}
