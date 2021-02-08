import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { UsersServiceProvider, Histories } from '../../providers/users-service/users-service';

/**
 * Generated class for the HistoriesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-histories',
  templateUrl: 'histories.html',
})
export class HistoriesPage {
  histories: Histories[] = [];
  helpHistories: Histories[] = [];
  loading: any;
  fullName: string = "";
  constructor(public navCtrl: NavController, public navParams: NavParams, public userService: UsersServiceProvider,
    public loadingCtrl: LoadingController) {
  }

  showLoader() {

    this.loading = this.loadingCtrl.create({
      content: '...המתן'
    });

    this.loading.present();

  }

  ionViewDidLoad() {
    this.showLoader();

    this.userService.getHistoriesUser().then((p: Histories[]) => {
      debugger;
      if (p.length) {
        this.fullName = p[0].User;
        console.log(p);
      }

      this.histories = p;
      this.histories.forEach(element => {
        this.helpHistories.push(element);
      });

    }, err => { })
    this.loading.dismiss();
  }

}
