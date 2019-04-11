import {Component, OnInit} from '@angular/core';
import Word from '../models/word.model';
import {WordService} from '../../services/word.service';
import {DatePipe, formatDate} from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private wordService: WordService) {
  }

  word: Word;
  ilya: string;

  /**
   * Transforme le timestamp en un format de date du type : "il y a 2heures"
   *
   * @param editDate la date d'édition au format timestamp
   */
  getTimeIlya(editDate) {
    const now = new Date().getTime();
    const pipe = new DatePipe('en-US');

    const nowFormat = pipe.transform(now, 'dd/MM/yyyy');
    const editDatFormat = pipe.transform(editDate, 'dd/MM/yyyy');

    if (nowFormat === editDatFormat) {
      const diff = now - editDate;
      if (diff < 60000) {
        /* moins de 60 secondes */
        return 'Il y a ' + diff + ' secondes';
      } else if (diff < 3600000) {
        /* moins d'une heure */
        return 'Il y a ' + Math.round(diff / 60000) + ' minutes';
      } else if (diff < 10800000) {
        /* moins de 3 heures */
        const hour = Math.round(diff / 3600000);
        if (hour > 1) {
          return 'Il y a ' + hour + ' heures';
        } else {
          return 'Il y a ' + hour + ' heure';
        }
      } else {
        /*  si plus de 3 heures */
        return 'Aujourd\'hui à ' + formatDate(editDate, 'HH:mm', 'en-US');
      }
    } else if (editDatFormat === pipe.transform(editDate - 60 / 60 / 24, 'dd/MM/yyyy')) {
      return 'Hier à ' + formatDate(editDate, 'HH:mm', 'en-US');
    } else if (editDatFormat === pipe.transform(editDate - 60 / 60 / 48, 'dd/MM/yyyy')) {
      return 'Il y a 2 jours à ' + formatDate(editDate, 'HH:mm', 'en-US');
    } else {
      return 'Le ' + formatDate(editDate, 'dd/MM/yyyy', 'en-US') + ' à ' + formatDate(editDate, 'HH:mm', 'en-US');
    }
  }

  /**
   * Fonction appelée à l'initialisation du composant
   * Récupère la dernière définition ajoutée
   */
  ngOnInit() {
    this.wordService.getLastWord().subscribe((data: Word[]) => {
      this.word = data[0];
      this.ilya = this.getTimeIlya(this.word.last_edit);
    });
  }

}
