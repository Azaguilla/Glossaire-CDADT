import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {formatDate} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class WordService {

  uri = 'http://localhost:4000';

  constructor(private http: HttpClient) {
  }

  /**
   * Récupère la dernière définition ajoutée en passant par le serveur nodejs
   */
  getLastWord() {
    return this.http.get(`${this.uri}/word`);
  }

  /**
   * Récupère un mot et ses infos par son titre
   */
  getWordByTitle(title) {
    return this.http.get(`${this.uri}/word/${title}`, );
  }

  /**
   * Transforme le timestamp en un format de date du type : "il y a 2heures"
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
    } else if (editDatFormat === formatDate(editDate - 60 / 60 / 24, 'dd/MM/yyyy', 'en-US')) {
      return 'Hier à ' + formatDate(editDate, 'HH:mm', 'en-US');
    } else if (editDatFormat === formatDate(editDate - 60 / 60 / 48, 'dd/MM/yyyy', 'en-US')) {
      return 'Il y a 2 jours à ' + formatDate(editDate, 'HH:mm', 'en-US');
    } else {
      return 'Le ' + formatDate(editDate, 'dd/MM/yyyy', 'en-US') + ' à ' + formatDate(editDate, 'HH:mm', 'en-US');
    }
  }

  // addList(listTitle, listDescription) {
  //   const object = {
  //     listTitle,
  //     listDescription
  //   };
  //
  //   console.log(object);
  //   this.http.post(`${this.uri}/add`, object)
  //     .subscribe(res => console.log('Done'));
  // }


  // editList(id) {
  //   return this
  //     .http
  //     .get(`${this.uri}/edit/${id}`);
  // }
  //
  // updateList(listTitle, listDescription, id) {
  //   const object = {
  //     listTitle,
  //     listDescription
  //   };
  //   this.http.post(`${this.uri}/update/${id}`, object).subscribe(res => console.log('Update done'));
  // }
  //
  // deleteBusiness(id) {
  //   return this
  //     .http
  //     .get(`${this.uri}/delete/${id}`);
  // }
}
