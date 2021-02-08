import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, DateTime } from 'ionic-angular';
import { ShowDitailGroupPage } from '../show-ditail-group/show-ditail-group';
import { HomePage } from '../home/home';
import { NativeStorage } from '../../../node_modules/@ionic-native/native-storage';
import { UsersServiceProvider, managmentInGroup, group } from '../../providers/users-service/users-service';
import { FormControl, FormGroup, Validators,ValidatorFn,AbstractControl, FormBuilder } from '@angular/forms';
import { OnInit } from '@angular/core';
import { PasswordValidator } from '../../validators/password.validator';
import { UsernameValidator } from '../../validators/username.validator';
/**
 * Generated class for the AddNewGroupsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-new-groups',
  templateUrl: 'add-new-groups.html',
})
export class AddNewGroupsPage  {
  validations_form: FormGroup;
  matching_passwords_group: FormGroup;

group:group;

phone:any;
value: Date;
 comeTo:boolean;
 loading: any;
 myDate: String = new Date().toISOString();
  constructor(public formBuilder: FormBuilder,public navCtrl: NavController, public navParams: NavParams,
    public userServise:UsersServiceProvider,public nav:NavController,public alert:AlertController,public alertCtrl:AlertController,
    public loadingCtrl:LoadingController ) {
  this.group=new group();
  this.phone= this.userServise.getPhoneUser();
  

  this.matching_passwords_group = new FormGroup({
    password: new FormControl('', Validators.compose([
      Validators.minLength(5),
      Validators.required,
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
    ])),
    confirm_password: new FormControl('', Validators.required)
  }, (formGroup: FormGroup) => {
    return PasswordValidator.areEqual(formGroup);
  });

 

  this.validations_form = this.formBuilder.group({
    username: new FormControl('', Validators.compose([
      Validators.maxLength(25),
      Validators.minLength(5),
      Validators.required
    ])
  ),
    matching_passwords: this.matching_passwords_group,
    trip_description: new FormControl('', Validators.compose([
      Validators.minLength(2),
    ])),
    date_begin: new FormControl('', Validators.compose([
    ]) ), 
    date_end: new FormControl('', Validators.compose([
    ])
  ), come_trip: new FormControl('', Validators.compose([
  ])
)
  });
  }

  ionViewDidLoad() {
    this.group=new group();
    this.phone= this.userServise.getPhoneUser();
    this.group.Password="";
    console.log(this.group);

  }

  addGroup(){
     var userIn=new managmentInGroup();
     userIn.PhoneManagment=this.phone;
     userIn.ComeToTrip=this.comeTo;
     debugger;
      this.group.ListManagment=[];
      this.group.ListManagment.push(userIn);
      this.group.Users=[];
      this.group.UserOk=[];
      this.showLoader();
      this.userServise.addNewGroup(this.group).then(p=>{
        this.userServise.setGroupManagment(p);
        console.log(p);
        this.group=p;
        console.log(this.group);
        this.loading.dismiss();
        this.userServise.setGroup(this.group);//check if good because he is managment
        this.presentAlert(p.Code);
     }).catch(error=>{
      this.loading.dismiss();
      let alert = this.alert.create({
        title: 'טעות',
        subTitle: 'תקלה בהוספת הקבוצה'+error,
        buttons: [  {
          text: 'אישור',
          role: 'cancel',
          handler: data => {
          }
        }]
      });
      alert.present();
     });
  };

  presentAlert(num:string) {
    let alert = this.alert.create({
      title: 'אישור הוספת קבוצה',
      subTitle: 'קבוצתך נוספה בהצלחה קוד הקבוצה הוא'+" "+num,
      buttons: [  {
        text: 'דף הבית',
        role: 'cancel',
        handler: data => { 
          this.nav.push(HomePage);
          this.nav.setRoot(HomePage);
        }
      },
      {
        text: 'הגדרות קבוצה מתקדמות',
        handler: data => { 
          this.nav.setRoot(HomePage);
          this.nav.push(ShowDitailGroupPage);
         
        }
      }]
    });
    alert.present();
  }
  showLoader(){
 
    this.loading = this.loadingCtrl.create({
        content: '...המתן'
    });

    this.loading.present();

}


validation_messages = {
  'username': [
    { type: 'required', message: 'שם קבוצה שדה חובה.' },
    { type: 'minlength', message: 'שם קבוצה חיב להיות בעל 5 תווים לפחות' },
    { type: 'maxlength', message: 'שם קבוצה לא יכול להכיל יותר מ25 תווים' }
  ],
  'password': [
    { type: 'required', message: 'סיסמה שדה חובה' },
    { type: 'minlength', message: 'סיסמה חיבת להכיל 5 תווים לפחות' },
    { type: 'pattern', message: 'סיסמה חיבת להכיל לפחות אות גדולה אחת באנגלית, אות קטנה אחת באנגלית וספרה' }
  ],
  'confirm_password': [
    { type: 'required', message: 'אימות סיסמה שדה חובה' }
  ],
  'matching_passwords': [
    { type: 'areEqual', message: 'סיסמאות לא תואמות' }
  ],
};

onSubmit(values){
 
this.group.Password=values.matching_passwords.password;
this.group.Name= this.validations_form.get('username').value;
this.group.Description= this.validations_form.get('trip_description').value;
this.comeTo= this.validations_form.get('come_trip').value;
this.group.DateEnd=new Date( this.validations_form.get('date_end').value);
this.group.DateBegin=new Date( this.validations_form.get('date_begin').value);

  this.addGroup();
}
  

}
