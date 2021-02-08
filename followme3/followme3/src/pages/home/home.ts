import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { group, UsersServiceProvider } from '../../providers/users-service/users-service';
import { LoginGroupPage } from '../login-group/login-group';
import { EnterGroupPage } from '../enter-group/enter-group';
import { ShowDitailUserPage } from '../show-ditail-user/show-ditail-user';

import { LocalNotifications } from '@ionic-native/local-notifications';
import { HistoriesPage } from '../histories/histories';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
 
  phone:string;
  group:group;
 
  constructor(public navCtrl: NavController,public userService:UsersServiceProvider,public localNotification:LocalNotifications) {

  this.group=userService.getGroup();
  this.phone=userService.getPhoneUser();
  
  }
 
  ngOnInit(): void {

    this.group=this.userService.getGroup();
    console.log(this.group +" groupHome");
 
     this.phone=this.userService.getPhoneUser();
     console.log(this.phone+" phone")
  }

  
  addMeToKodGroup()
  {
    
    this.navCtrl.push(EnterGroupPage);
  }

  presentNotifications()
  {
    this.localNotification.getAll().then(p=>{
      console.log(p);
    },err=>{console.log("לא ניתן לקבל את כל ההתראות הטעות היא:",err);
  this.navCtrl.push(HistoriesPage);
  
  })


  }

  detailUser()
  {
    this.userService.userDetails=this.userService.getPhoneUser();
    this.navCtrl.push(ShowDitailUserPage);
  }
 
}
