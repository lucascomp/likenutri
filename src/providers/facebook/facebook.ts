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
    return this.facebook.login(['email', 'user_birthday', 'user_friends']);
  }

  logout(): Promise<any> {
    return this.facebook.logout();
  }

  getFriendList(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.facebook.api('me/friends', ['user_friends'])
        .then(resolve)
        .catch(error => {
          console.log('error', error);
          if (error.errorCode === '190') { //TODO: devolver reject e tratar este erro em quem está chamando o método
            console.log('Já está deslogado do facebook. Enviar usuário para tela de login');
          }
          else {
            console.log('Falta de conexão');
          }
        });
    });
  }

}
