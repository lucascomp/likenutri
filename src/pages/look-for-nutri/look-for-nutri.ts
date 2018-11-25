import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Profile } from '../../models/profile';

@IonicPage()
@Component({
  selector: 'page-look-for-nutri',
  templateUrl: 'look-for-nutri.html',
})
export class LookForNutriPage {

  public profile: Profile;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {}

  ionViewDidLoad() {
    this.profile = this.navParams.get('profile');
  }

  get lookForNutri() {
    return this.profile.imc > 24.9 || this.profile.imc < 18.5;
  }

}
