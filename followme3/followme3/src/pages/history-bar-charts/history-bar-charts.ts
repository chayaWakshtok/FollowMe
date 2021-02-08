import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HistoryDoughnutChartPage } from '../history-doughnut-chart/history-doughnut-chart';
import { HistoryPage } from '../history/history';

/**
 * Generated class for the HistoryBarChartsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-history-bar-charts',
  templateUrl: 'history-bar-charts.html',
})
export class HistoryBarChartsPage {
  //השנה האחרונה כמה התראות היו כל חודש בתור מנהל ובתור משתמש
  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  //לשנה הנוכחית חודשים
  public barChartLabels:string[] = ['2018'];
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;
  
  public barChartData:any[] = [
    {data: [20], label: 'זכרון מאיר'},
    {data: [28], label: 'טיול יוסי גרין'},
    {data: [ 40], label: 'מרום האלה'},
    {data: [ 12], label: 'טיול 20.10'}

  ];
  
  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
  
  public chartHovered(e:any):void {
    console.log(e);
  }
  public randomize():void {
    // Only Change 3 values
    let data = [
      Math.round(Math.random() * 100),
      59,
      80,
      (Math.random() * 100),
      56,
      (Math.random() * 100),
      40];
    let clone = JSON.parse(JSON.stringify(this.barChartData));
    clone[0].data = data;
    this.barChartData = clone;
    /**
     * (My guess), for Angular to recognize the change in the dataset
     * it has to change the dataset variable directly,
     * so one way around it, is to clone the data, change it and then
     * assign it;
     */
  }
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HistoryBarChartsPage');
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
