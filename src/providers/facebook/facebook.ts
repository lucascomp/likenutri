import { Injectable } from '@angular/core';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

@Injectable()
export class FacebookProvider {

  constructor(
    public facebook: Facebook
  ) {}

  getLoginStatus(): Promise<FacebookLoginResponse> {
    return this.facebook.getLoginStatus();
  }

  login(): Promise<FacebookLoginResponse> {
    return this.facebook.login(['email', 'user_gender', 'user_birthday', 'user_friends']);
  }

  logout(): Promise<any> {
    return this.facebook.logout();
  }

  getUserData(): Promise<any> {
    return this.facebook.api('me?fields=name,birthday,gender', []);
  }

  getUserFriends(): Promise<any> {
    return this.facebook.api('me/friends', []);
  }

}
