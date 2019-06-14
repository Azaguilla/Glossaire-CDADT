import {Component, OnInit} from '@angular/core';
import {WordService} from '../../../services/word.service';
import Word from '../../models/word.model';
import {ActivatedRoute} from '@angular/router';
import { NgxIndexedDB } from 'ngx-indexed-db';

@Component({
  selector: 'app-single-word',
  templateUrl: './single-word.component.html',
  styleUrls: ['./single-word.component.css']
})
export class SingleWordComponent implements OnInit {

  db: any;

  constructor(private wordService: WordService,
              private route: ActivatedRoute) {

    // On crée le schéma de l'indexedDB (automatiquement il n'est pas récréé s'il existe déjà)
    this.db = new NgxIndexedDB('localGlossaire', 1);
    this.db.openDatabase(1, evt => {
      const objectStore = evt.currentTarget.result.createObjectStore('words');

      objectStore.createIndex('title', 'title', {unique : true});
      objectStore.createIndex('last_edit', 'last_edit', {unique : false});
      objectStore.createIndex('definition', 'definition', {unique : false});
      objectStore.createIndex('themes', 'themes', {unique : false});
      objectStore.createIndex('themes_words', 'themes_words', {unique : false});
      objectStore.createIndex('know_more', 'know_more', {unique : false});
    });

  }

  word: Word;
  ilya: string;
  open: boolean;

  ngOnInit() {
   this.route.params.subscribe(params => {
      this.wordService.getWordByTitle(params.title).subscribe((data: Word[]) => {
        this.word = data[0];
        this.ilya = this.wordService.getTimeIlya(this.word.last_edit);
        this.open = false;

        this.existWordIndexedDb(this.word).then(
            (exist) => {
              if (!exist) {
                this.addWordIndexedDb();
              }
            }
        );
      });
    });

    /*this.route.params.subscribe(params => {
      this.db.openDatabase(1).then(() => {
        this.db.getByKey('words', params.title).then(
            word => {
              this.word = word;
              this.ilya = this.wordService.getTimeIlya(this.word.last_edit);
              this.open = false;

              if (!this.existWordIndexedDb(this.word)) {
                this.addWordIndexedDb();
              }
            },
            error => {
              console.log(error);
            }
        );
      });
    });*/
  }

  /**
   * Indique si la partie "En savoir plus" est ouverte ou non
   */
  onDisplayKnowMore() {
    if (this.open === true) {
      this.open = false;
    } else {
      this.open = true;
    }
  }

  /**
   * Ajoute un mot dans l'indexedDb
   */
  addWordIndexedDb() {
    this.db.openDatabase(1).then(() => {
      this.db.add('words', {title: this.word.title,
            last_edit: this.word.last_edit,
            definition: this.word.definition,
            themes: this.word.themes,
            themes_word: this.word.themes_words,
            know_more: this.word.know_more},
          this.word.title).then(
          () => {

          },
          error => {
            console.log(error);
          }
      );
    });
  }

  /**
   * Vérifie si un mot est déjà présent dans l'indexedDb
   */
  async existWordIndexedDb(word: Word): Promise<boolean> {

    return new Promise<boolean>(resolve => {
      this.db.openDatabase(1).then(() => {
        this.db.getByKey('words', word.title).then(
            wd => {
              if (wd) {
                console.log('existe');
                resolve(true);
              } else {
                console.log('existe pas');
                resolve(false);
              }
            },
            error => {
              console.log(error);
            }
        );
      });
    });
  }
}
