import { Alimentation } from './alimentation';
import { HealthHistory } from './health-history';

import firebase from 'firebase/app';

export class Profile {

  id: string;
  token: string;
  healthHistory: HealthHistory;
  alimentation: Alimentation;
  points: number;
  data: firebase.firestore.DocumentData;

  get imc(): number {
    return this.data.weight / (this.data.height * this.data.height);
  }

  get mustLookForNutri(): boolean {
    return this.imc > 24.9 || this.imc < 18.5 || this.healthHistory.isDeseasePresent || this.alimentation.isBad;
  }

  get isComplete(): boolean {
    return this.data.name != null && this.data.gender != null && this.data.birthday != null && this.data.weight != null && this.data.height != null;
  }

}
