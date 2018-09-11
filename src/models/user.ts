import { Alimentation } from './alimentation';
import { HealthHistory } from './health-history';

export class User {

  id: string;
  token: string;
  weight: number;
  height: number;
  healthHistory: HealthHistory;
  alimentation: Alimentation;
  points: number;

  get imc(): number {
    return this.weight / (this.height * this.height);
  }

  get mustLookForNutri(): boolean {
    return this.imc > 24.9 || this.imc < 18.5 || this.healthHistory.isDeseasePresent || this.alimentation.isBad;
  }

}
