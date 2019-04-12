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
   * Fonction appelée à l'initialisation du composant
   * Récupère la dernière définition ajoutée
   */
  ngOnInit() {
    this.wordService.getLastWord().subscribe((data: Word[]) => {
      this.word = data[0];
      this.ilya = this.wordService.getTimeIlya(this.word.last_edit);
    });
  }

}
