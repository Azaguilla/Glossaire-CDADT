import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {

  private db: any;

  constructor(private http: HttpClient) {
    this.createDatabase();
  }

  /**
   * Méthode qui crée la database pour stocker les requêtes dans l'indexedDb.
   */
  private createDatabase() {
    this.db = new Dexie('queriesDatabase');
    this.db.version(1).stores({
      queries: 'id, value, done'
    });
  }

  /**
   * Méthode qui permet d'ajouter une requête dans l'indexedDB.
   * @param query: la requête à ajouter.
   */
  public addToIndexedDb(query: any) {
    this.db.queries.add(query).then(async () => {
      const allItems: any[] = await this.db.queries.toArrays();
      console.log('Requête enregistré dans l\'indexedDB. Nouvel état : ', allItems);
    }).catch(e => {
      alert('Erreur: ' + (e.stack || e));
    });
  }

  /**
   * Méthode qui permet de supprimer une requête de l'indexedDb.
   * @param query: la requête à supprimer.
   */
  public deleteItemFromIndexedDb(query: any) {
    this.db.queries.delete(query).then(() => {
      console.log('Requête supprimé de l\'indexedDb');
    });
  }

  /**
   * Méthode qui permet de renvoyer toutes les requêtes stockées dans l'indexedDb.
   * Utilisée par le syncService lorsque l'application est de nouveau en ligne.
   * C'est le syncService qui vérifie l'état online avec le onlineOfflineService.
   */
  public commitStockedQueries() {
    this.db.queries.toArrays().forEach((query: any) => {
      this.commitQuery(query).then(() => {
        this.deleteItemFromIndexedDb(query);
      });
    });
  }

  /**
   * Méthode qui permet d'envoyer une requête http.
   * @param query: la requête à envoyer.
   */
  private async commitQuery(query: any) {
    console.log('Envoi d\'une requête (indexedDbService)');
    this.http.post(query.url, query.params).subscribe(res => console.log('Done'));
    console.log('Requête envoyée (indexedDbService)');
  }
}
