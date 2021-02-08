import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginGroupPage } from './login-group';

@NgModule({
  declarations: [
    LoginGroupPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginGroupPage),
  ],
})
export class LoginGroupPageModule {}
