import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, IonicPageModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { Geolocation } from '@ionic-native/geolocation';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { UsersServiceProvider } from '../providers/users-service/users-service';
import { MapPage } from '../pages/map/map';
import { GroupPage } from '../pages/group/group';
import { HttpModule } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Camera } from '@ionic-native/camera';
import { GooglePlus } from '@ionic-native/google-plus';
import { IonicStorageModule } from '@ionic/storage';
import { Keyboard } from '@ionic-native/keyboard';
import { NativeStorage } from '@ionic-native/native-storage';
import { AddUserToGroupPage } from '../pages/add-user-to-group/add-user-to-group';
import { RadioButtonModule } from 'primeng/primeng';
import { ShowDitailGroupPage } from '../pages/show-ditail-group/show-ditail-group';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { ComponentsModule } from '../components/components.module'
import { EnterPage } from '../pages/enter/enter';
import { MbscModule } from '@mobiscroll/angular-lite';
import { LoginGroupPage } from '../pages/login-group/login-group';
import { ShowDitailUserPage } from '../pages/show-ditail-user/show-ditail-user';
import { OpenPage } from '../pages/open/open';
import { AngularFireModule } from "angularfire2";
import { AngularFireDatabaseModule } from "angularfire2/database";
import { EnterGroupPage } from '../pages/enter-group/enter-group';
import {Sim} from '@ionic-native/sim'
import { LocalNotifications } from '@ionic-native/local-notifications';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HomeManagmentPage } from '../pages/home-managment/home-managment';
import{ AnimateItemSlidingDirective} from '../directives/animate-item-sliding/animate-item-sliding';
import { AddNewGroupsPage } from '../pages/add-new-groups/add-new-groups';
import { AddNewGroupsPageModule } from '../pages/add-new-groups/add-new-groups.module';
import { BatteryStatus } from '../../node_modules/@ionic-native/battery-status';
import { Facebook } from '@ionic-native/facebook';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { TwitterService } from 'ng2-twitter';
import { TwitterProvider } from '../providers/twitter/twitter';
import { ChartsModule } from 'ng2-charts';
import { HistoryPage } from '../pages/history/history';
import { HistoryBarChartsPage } from '../pages/history-bar-charts/history-bar-charts';
import { HistoryDoughnutChartPage } from '../pages/history-doughnut-chart/history-doughnut-chart';
import { EditUserPage } from '../pages/edit-user/edit-user';
import { AddManagmentToGroupPage } from '../pages/add-managment-to-group/add-managment-to-group';
import { MapUserPage } from '../pages/map-user/map-user';
import { HistoriesPage } from '../pages/histories/histories';


const firebaseConfig = {
  apiKey: "AIzaSyDjyxiKCMOWYfvhctnSDKjZUAMgvYDIZoY",
  authDomain: "myproject-be30d.firebaseapp.com",
  databaseURL: "https://myproject-be30d.firebaseio.com",
  projectId: "myproject-be30d",
  storageBucket: "myproject-be30d.appspot.com",
  messagingSenderId: "537848810771"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,RegisterPage,MapPage,GroupPage,AddUserToGroupPage,AddNewGroupsPage, AnimateItemSlidingDirective,
    ShowDitailGroupPage,EnterPage,LoginGroupPage,ShowDitailUserPage,OpenPage,HistoryPage,
    EnterGroupPage,HomeManagmentPage,HistoryBarChartsPage,HistoryDoughnutChartPage,EditUserPage,AddManagmentToGroupPage,MapUserPage
    ,HistoriesPage
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp,{scrollAssist:false,autoFocusAssist:false}),
    IonicStorageModule.forRoot(),
    HttpModule,
    RadioButtonModule,
    AngularFireModule.initializeApp(firebaseConfig), // <-- firebase here
    AngularFireAuthModule,
    ComponentsModule, 
    MbscModule,
    BrowserModule,
    ChartsModule
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,HistoryPage,HistoryBarChartsPage,HistoryDoughnutChartPage,
    ListPage,RegisterPage,MapPage,GroupPage,AddUserToGroupPage,LoginGroupPage,AddNewGroupsPage,
    ShowDitailGroupPage,EnterPage,ShowDitailUserPage,OpenPage,EnterGroupPage,HomeManagmentPage,EditUserPage,
    AddManagmentToGroupPage,MapUserPage,HistoriesPage

  ],
  providers: [
    Facebook,
    StatusBar,
    BatteryStatus,
    LocalNotifications ,
    NativeStorage,
    SplashScreen,
    Camera,
    GooglePlus,
    IonicStorageModule,
    TwitterService,TwitterConnect,InAppBrowser,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    UsersServiceProvider, Geolocation, HttpClient, Keyboard,Sim,
    TwitterProvider
  ]
})
export class AppModule { }
