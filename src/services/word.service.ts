import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

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
