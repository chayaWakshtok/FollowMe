import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { timestamp } from 'rxjs/operators';
import { HistoryDoughnutChartPage } from '../history-doughnut-chart/history-doughnut-chart';
import { HistoryBarChartsPage } from '../history-bar-charts/history-bar-charts';

/**
 * Generated class for the HistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {
//כמות ההתראות לפי קבוצות שרשום לפי חודשיםי 
  public lineChartData:Array<any> = [
    {data: [0, 8, 4, 6, 10, 16, 9,3,12,9,4,2,0], label: 'התראות על התרחקות מהקבוצה'},
    {data: [5, 0, 11, 0, 14, 3, 1,4,7,2,8,1,4], label: 'התראות על התרחקות מהקבוצה בה אתה מנהל'}
  ];
  public lineChartLabels:Array<any> = ['ינואר', 'פברואר', 'מרס', 'אפריל', 'מאי', 'יוני', 'יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
  public lineChartOptions:any = {
    responsive: true
  };
  public lineChartColors:Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  },
  { // dark grey
    backgroundColor: 'rgba(77,83,96,0.2)',
    borderColor: 'rgba(77,83,96,1)',
    pointBackgroundColor: 'rgba(77,83,96,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(77,83,96,1)'
  },
  { // grey
    backgroundColor: 'rgba(148,159,177,0.2)',
    borderColor: 'rgba(148,159,177,1)',
    pointBackgroundColor: 'rgba(148,159,177,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  }
];
public lineChartLegend:boolean = true;
public lineChartType:string = 'line';
public randomize():void {
  let _lineChartData:Array<any> = new Array(this.lineChartData.length);
  for (let i = 0; i < this.lineChartData.length; i++) {
    _lineChartData[i] = {data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label};
    for (let j = 0; j < this.lineChartData[i].data.length; j++) {
      _lineChartData[i].data[j] = Math.floor((Math.random() * 100) + 1);
    }
  }
  this.lineChartData = _lineChartData;
}

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
    console.log('ionViewDidLoad HistoryPage');
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
