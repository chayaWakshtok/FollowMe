import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HistoryBarChartsPage } from '../history-bar-charts/history-bar-charts';
import { HistoryPage } from '../history/history';

/**
 * Generated class for the HistoryDoughnutChartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-history-doughnut-chart',
  templateUrl: 'history-doughnut-chart.html',
})
export class HistoryDoughnutChartPage {
// Doughnut
//כל קבוצה  כמה התראות היו לה במשך 30 יום האחרונים או לפי שנה

//TODO:קבלת כל הקבוצות
public doughnutChartLabels:string[] = ['מרום האלה', 'טיול יוסי גרין', 'זכרון מאיר'];
//כמות ההתראות לכל קבוצה
public doughnutChartData:number[] = [20, 11, 4];
public doughnutChartType:string = 'doughnut';

// events
public chartClicked(e:any):void {
  console.log(e);
}

public chartHovered(e:any):void {
  console.log(e);
}
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HistoryDoughnutChartPage');
  }
  historyDougt()
  {
    this.navCtrl.setRoot(HistoryDoughnutChartPage);  
  }
  historyLine()
  {
     this.navCtrl.setRoot(HistoryBarChartsPage);
  }
  history()
  { 
    this.navCtrl.setRoot(HistoryPage);
  }

}
