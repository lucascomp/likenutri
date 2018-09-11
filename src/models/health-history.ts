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