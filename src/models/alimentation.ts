import { AlimentationFrequency } from '../enums/alimentation-frequency';

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
