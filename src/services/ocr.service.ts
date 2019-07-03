import { Injectable } from '@angular/core';
import { TesseractWorker } from 'tesseract.js';

@Injectable({
  providedIn: 'root'
})
export class OcrService {

  private worker = new TesseractWorker();

  constructor() {
    this.readImage(null);
  }

  public readImage(myImage: any) {
    this.worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png', 'eng')
        .progress(progress => {
        console.log('progress', progress.progress);
      }).then(result => {
        console.log('result', result.text);
    });
  }
}
