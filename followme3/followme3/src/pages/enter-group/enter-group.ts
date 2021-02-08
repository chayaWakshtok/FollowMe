import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UsersServiceProvider, group } from '../../providers/users-service/users-service';
import { GroupPage } from '../group/group';
import { HomePage } from '../home/home';

/**
 * Generated class for the EnterGroupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-enter-group',
  templateUrl: 'enter-group.html',
})
export class EnterGroupPage {
  kodGroup:string;
  group:group;
  constructor(public navCtrl: NavController, public navParams: NavParams,public userService:UsersServiceProvider) {
  }//load add to page

  checkKodGroup()
  {
      this.userService.checkKod(this.kodGroup).then(
        p=>{
          this.group=p;
          if(p!=null)
          {
            this.userService.setGroup(this.group);
            this.navCtrl.push(HomePage);
            this.navCtrl.setRoot(HomePage);
          }
          else{
            alert("שגיאה בקוד הקבוצה")
          }
        },(eror)=>console.log(eror)
      );
  }

  ionViewDidLoad() {
   
    console.log('ionViewDidLoad EnterGroupPage');
  }

}
