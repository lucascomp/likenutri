export class Question {

  question: string;
  options: Option[];
  notification: string;
  category: string;

  constructor(
    question: string,
    options: Option[],
    notification: string,
    category: string
  ) {
    this.question = question;
    this.options = options;
    this.notification = notification;
    this.category = category;
  }

}

export class Option {

  description: string;
  value: number;
  feedback: string;

  constructor(
    description: string,
    value: number,
    feedback: string
  ) {
    this.description = description;
    this.value = value;
    this.feedback = feedback;
  }

}