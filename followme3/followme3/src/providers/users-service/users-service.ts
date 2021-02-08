
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { DateTime } from 'ionic-angular/umd';
import { Http } from '@angular/http';
import { Observable, Subject } from 'rxjs';

export class MessageGroup {
  CodeError?: number;
  MessageError?: string;
  constructor(){}
}

export class MessageUser {
  Message?: MessageGroup;
  Group?: group;
  UserName?: string;
  constructor(){}
}

export class ErrorMessage {
  KodError: number;
  MessageError: string;
}

export class User {
  Id?: number;
  Email?: string;
  FirstName?: string;
  LastName?: string;
  Phone?: string;
  Image?: string;
  Marker?: marker;
  Status?: boolean;
 

  constructor() {
  }
}
export class marker {
  Lng?: number;
  Lat?: number;
  NameAndPhone?: string;
  constructor() {


  }
}
export class GoogleStatus {
  code?: number;
  status?: string;
  constructor() {
  }

}

export class DefinitionGroup {
  Distance?: number;
  GoogleStatus?: GoogleStatus;
  eWhenStatusOpen: number;
  constructor() {
  }
}
export class DefinitionUser {
  SeeMeALL?: boolean;
  constructor() {
  }

}
export class userInGroup {
  UserPhoneGroup?: string;
  Definition?: DefinitionUser;
  constructor() { }
}

export class managmentInGroup {
  PhoneManagment?: string;
  ComeToTrip?: boolean;
  constructor() { }
}

export class MarkerUser
{
   marker?:marker;
   image?:string
   distanceLessManagment:number;
   statusDistance:boolean;
}

export class group {
  Id?: number;
  Name?: string;
  Code?: string;
  Description?: string;
  Password?: string;
  Users?: userInGroup[];
  UserOk?: userInGroup[];
  Status?: boolean;
  DateBegin?: Date;
  DateEnd?: Date;
  ListManagment?: managmentInGroup[];
  DefinitionGroup?: DefinitionGroup;

  constructor() {
  }
}

export class Histories{
 
 DateError:Date 
  Group:group 
 User:string 
  Message:MessageGroup
  UserMarker:marker
  constructor() {
  }
}

@Injectable()
export class UsersServiceProvider {
  updateGroup(Password: string): Promise<any> {
   return this.http.get(this.baseUrl+"updateOkUser/"+Password).toPromise();
  }

  
  updateUser(user: User): Observable<any> {
  return this.http.post(this.baseUrl+"updateUser",user);
  }

  getAllUsers(): any {
    return this.http.get(this.baseUrl+"getAllUsersNotInGroup/"+this.group.Password).map(p => p.json()).toPromise();;
  }
  
  sendMessgeComplex(message:MessageUser): Observable<any> {
    message.Group=this.getGroup();
    console.log(message);
   return this.http.post(this.baseUrl+'sendMessageComplex',message);
  }
 
  userDetails:string;
  isManagment: boolean;
  groupMangment: group;
  baseUrl: string = "http://localhost:54599/api/";
  managment: Array<string>;
  answer: string;
  phoneUser: string;
  subject=new Subject();

  groupSubject=new Subject();

  getMarkerUsers(gr: group): Promise<MarkerUser[]> {
    
    return this.http.post('http://localhost:54599/api/getUsersMarker', gr).map(p => p.json()).toPromise();
    
  }
  getMarkerManagments(gr: group): Promise<MarkerUser[]> {
  console.log(gr+" service group");
    return this.http.post('http://localhost:54599/api/getManagmentsMarker', gr).map(p => p.json()).toPromise();
    
  }
  checkKod(kod: string): Promise<any> {
    return this.http.get(this.baseUrl + "AgreeToAddGroup/" + kod + '/' + this.getPhoneUser()).toPromise();
  }

  getHistoriesUser():Promise<any>
  {
    debugger;
    return this.http.get(this.baseUrl+"getHistoriesUser/"+this.phoneUser).map(p => p.json()).toPromise();
  }

  getManagmentGroup(phone: string): Promise<group[]> {
    return this.http.get(this.baseUrl + "getManagmentGroup/" + phone).map(p => p.json()).toPromise();
  }
  setGroupManagment(group1: group) {
    this.groupMangment = group1;
  }
  getGroupManagment(): group {
    return this.groupMangment;
  }

  groups: group[];

  currentUser: User;
  users: User[];
  group: group;
  constructor(private http: Http) {
    this.users = [];
    this.managment = [];
  };
  setPhoneManagment(phone: string) {
    this.managment.push(phone);
  }

  getPhonesManagment() {
    return this.managment;
  }
  setPhoneUser(string: string) {
    this.subject.next(string);
    this.phoneUser = string;
  }

  getPhoneUser() {
    return this.phoneUser;
  }

  setGroup(gr: group) {
    this.group = gr;
    this.groupSubject.next(gr.Name);
  }

  getGroup() {
    return this.group;
  }


  getGroups(phone: string): Promise<any> {
    return this.http.get(this.baseUrl + "groupOfUser/" + phone).map(pp => pp.json()).toPromise();
  }


  login(phone: string): Promise<any> {
    return this.http.get('http://localhost:54599/api/login/' + phone).toPromise();
  }

  addUser(user: User): Promise<any> {
    console.log("addUser")
    return this.http.post('http://localhost:54599/api/register', user).toPromise();
    // this.users.push(user);
  }
  addNewGroup(group: group): Promise<any> {
    // this.groups.push(group);
    return this.http.post('http://localhost:54599/api/addGroup', group).map(p => p.json()).toPromise();
  }

  getUsersOfGroup(): Promise<any> {
    return this.http.get("http://localhost:54599/api/UsersOfGroup/" + this.getGroup().Password).map(p =>p.json() ).toPromise();
  }

  openGroupSendMessage(group: group): Promise<any> {
    return this.http.post("http://localhost:54599/api/updateGroup", group).toPromise();
  }


  updateMarker(phone: string, marker: marker): Observable<any> {
    let help = { phone: phone, lat: marker.Lat, lng: marker.Lng };
    return this.http.post("http://localhost:54599/api/updateMarker", help);
  }

  getAllUsersNotInGroup(): Promise<User[]> {
    return this.http.get("http://localhost:54599/api/getAllUsersNotInGroup/" + this.getGroup().Password).map(p => p.json()).toPromise();
  }

  checkPassGroup(pass: string) {
    if (this.getGroup().Password == pass) {
      let userManagment = { group: this.getGroup(), phoneUser: this.getPhoneUser() }
      var group = this.getGroup();
      return this.http.get('http://localhost:54599/api/AddManagment/' + group.Password + '/' + this.getPhoneUser()).toPromise();
    }

    return false;
  }

  CheckDistance(): Promise<group[]> {
    let phone:string = this.getPhoneUser();
    return this.http.get("http://localhost:54599/api/CheckDistance/"+ phone).map(p => p.json()).toPromise();
  }

  checkOpenGroupAndConfirm(): Promise<group[]> {
    let phone = this.getPhoneUser();
    return this.http.get('http://localhost:54599/api/checkOpenGroupAndConfirm/' + phone).map(p => p.json()).toPromise();
  }

  agreeToAddGroup(pass: string): Promise<any> {
    let phone = this.getPhoneUser();
    return this.http.get('http://localhost:54599/api/AgreeToAddGroup/' + pass + '/' + phone).toPromise().then(p => {
      console.log(p);
    });
  }
  saveGroupUsers(): Promise<any> {
    console.log(this.getGroup());
    return this.http.post(`${this.baseUrl}updateUsersGroup`, this.getGroup()).toPromise();
  }
  saveGroupManagers(): Promise<any> {
    console.log(this.getGroup());
    return this.http.post(`${this.baseUrl}updateManagersGroup`, this.getGroup()).toPromise();
  }
  getAllGroup(): Promise<any> {
    return this.http.get(this.baseUrl + "getAllGroups").map(p => p.json()).toPromise();
  }

  getUserInf(phone:string):Promise<User> {
    console.log(phone); 
    return this.http.get(this.baseUrl+"getUserInf/"+phone).map(p=>p.json()).toPromise();
  }

  getMyMessage():Promise<any>
  {
    if(this.getPhoneUser())
      return this.http.get(this.baseUrl+"CheckIfHaveMessage/"+this.getPhoneUser()).map(data=>data.json()).toPromise();
    return null;
  }

  groupOfUserStatusFalse():Observable<any>
  {
    return this.http.get(this.baseUrl+'groupOfUserStatusFalse/'+this.getPhoneUser()).map(p=>p.json());
  }

  getManagmentGroupFalse():Observable<any>
  {
    return this.http.get(this.baseUrl+'getManagmentGroupFalse/'+this.getPhoneUser()).map(p=>p.json());
  }

  deleteGroup(password: string): Observable<any> {
    return this.http.delete(this.baseUrl+'deleteGroup/'+password);
  }

  updateUserStatus()
  {
    return this.http.get(this.baseUrl+"updateStatusUser/"+this.getPhoneUser());
  }

}
