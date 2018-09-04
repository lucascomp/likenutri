export class User {

  id: string;
  email: string;
  name: string;
  born: Date;
  weight: number;
  height: number;
  healthHistory: HealthHistory;
  alimentation: Alimentation;
  points: number;

  get imc(): number {
    return this.weight / (this.height * this.height);
  }

  get mustLookForNutri(): boolean {
    return this.imc > 24.9 || this.imc < 18.5 ||
      this.healthHistory.isDeseasePresent ||
      this.alimentation.isBad;
  }

}

export class HealthHistory {

  diabetes: boolean;
  hipertensao: boolean;
  dislipdemia: boolean;
  alergiasAlimentares: boolean;
  intoleranciaLactose: boolean;
  doencaCeliaca: boolean;
  fenilcetonuria: boolean;
  anemia: boolean;
  gastrite: boolean;
  doencaRenal: boolean;
  insuficienciaPancreatica: boolean;
  diverticulite: boolean;
  others: string;

  get isDeseasePresent(): boolean {
    return this.alergiasAlimentares ||
      this.anemia ||
      this.diabetes ||
      this.dislipdemia ||
      this.diverticulite ||
      this.doencaCeliaca ||
      this.doencaRenal ||
      this.fenilcetonuria ||
      this.gastrite ||
      this.hipertensao ||
      this.insuficienciaPancreatica ||
      this.intoleranciaLactose;
  }

}

export class Alimentation {

  fruitsPerDay: AlimentationFrequency;
  vegetablesPerDay: AlimentationFrequency;
  milkPerDay: AlimentationFrequency;
  beanPerWeek: AlimentationFrequency;
  friedPerWeek: AlimentationFrequency;
  saltyCookiePerWeek: AlimentationFrequency;
  sweetCookiePerWeek: AlimentationFrequency;
  hamburgerPerWeek: AlimentationFrequency;
  sodaPerWeek: AlimentationFrequency;

  get isBad(): boolean {
    return this.friedPerWeek >= AlimentationFrequency.TwoToThree ||
      this.saltyCookiePerWeek >= AlimentationFrequency.TwoToThree ||
      this.sweetCookiePerWeek >= AlimentationFrequency.TwoToThree ||
      this.hamburgerPerWeek >= AlimentationFrequency.TwoToThree ||
      this.sodaPerWeek >= AlimentationFrequency.TwoToThree
  }

}

export enum AlimentationFrequency {

  DotnEat,
  DontEatAllDays,
  OneToTwo,
  TwoToThree,
  ThreeOrMore,
  FourToFive,
  FiveOrMore,
  AllDays

}