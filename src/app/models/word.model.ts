export default class Word {
  _id: any;
  title: string;
  last_edit: number;
  definition: string;
  themes: [{
    _id: any;
    title: string;
  }];
  know_more: string;

  constructor() {
  }
}


