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
    return new Promise((resolve, reject) => {
      this.facebook.api('me/friends', [])
        .then(resolve)
        .catch(error => {
          console.log('error', error);
          if (error.errorCode === '190') { //TODO: devolver reject e tratar este erro em quem está chamando o método
            console.log('Já está deslogado do facebook. Enviar usuário para tela de login');
          }
          else if(error.errorCode === '2500') {
            console.log('É necessário realizar o login pelo facebook');
          }
        });
    });
  }

}
