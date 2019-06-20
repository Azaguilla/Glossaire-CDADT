import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {formatDate} from '@angular/common';
import {SyncService} from "./sync.service";

@Injectable({
  providedIn: 'root'
})
export class WordService {

  uri = 'https://azaguilla.alwaysdata.net';

  constructor(private http: HttpClient, private syncService: SyncService) {
  }

  /**
   * Récupère la dernière définition ajoutée en passant par le serveur nodejs
   */
  getLastWord() {
    return this.http.get(`${this.uri}/word`);
  }

  /**
   * Récupère un mot et ses infos par son titre
   * @param title Le titre de la définition
   */
  getWordByTitle(title) {
    return this.http.get(`${this.uri}/word/${title}`, );
  }


  /**
   * Récupère une liste de mot pour la recherche
   * @param title Le mot à rechercher
   */
  getWordsLikeByTitle(title) {
    return this.http.get(`${this.uri}/word/search/${title}`, );
  }

  /**
   * Récupère une liste de définitions appartenant à un thème
   * @param title Le titre du thème
   */
  getWordsByThmTitle(title) {
    return this.http.get(`${this.uri}/word/thm/${title}`, );
  }

  /**
   * Ajoute une définition et ses informations dans la BDD
   * @param wordInfo La liste des infos du mot
   */
  addWord(wordInfo) {
    this.syncService.howToAdd({url: `${this.uri}/word/add`, params: wordInfo});
  }

  /**
   * Transforme le timestamp en un format de date du type : "il y a 2 heures"
   *
   * @param editDate la date d'édition au format timestamp
   */
  getTimeIlya(editDate) {
    const now = new Date().getTime();

    const nowFormat = formatDate(now, 'dd/MM/yyyy', 'en-US');
    const editDatFormat = formatDate(editDate, 'dd/MM/yyyy', 'en-US');

    if (nowFormat === editDatFormat) {
      const diff = now - editDate;
      if (diff < 60000) {
        /* moins de 60 secondes */
        const sec = Math.round(diff / 1000);
        if (sec > 1) {
          return 'Il y a ' + sec + ' secondes';
        } else {
          return 'Il y a ' + sec + ' seconde';
        }
      } else if (diff < 3600000) {
        /* moins d'une heure */
        const min = Math.round(diff / 60000);
        if (min > 1) {
          return 'Il y a ' + min + ' minutes';
        } else {
          return 'Il y a ' + min + ' minute';
        }
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
    } else if (editDatFormat === formatDate(now - 60 * 60 * 24000, 'dd/MM/yyyy', 'en-US')) {
      return 'Hier à ' + formatDate(editDate, 'HH:mm', 'en-US');
    } else if (editDatFormat === formatDate(now - 60 * 60 * 48000, 'dd/MM/yyyy', 'en-US')) {
      return 'Il y a 2 jours à ' + formatDate(editDate, 'HH:mm', 'en-US');
    } else {
      return 'Le ' + formatDate(editDate, 'dd/MM/yyyy', 'en-US') + ' à ' + formatDate(editDate, 'HH:mm', 'en-US');
    }
  }
}
