import { Injectable } from '@angular/core';
import {OnlineOfflineService} from './online-offline.service';
import {IndexedDbService} from './indexed-db.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SyncService {

  constructor(private http: HttpClient,
              private readonly onlineOfflineService: OnlineOfflineService,
              private indexedDBService: IndexedDbService) {
    this.checkBackOnline();
  }

  /**
   * Détermine le type de traitement de la requête selon si l'on est connecté ou non.
   * @param query: la requête à ajouter.
   */
  public howToAdd(query: any) {
    if(this.onlineOfflineService.isOnline) {
      console.log('Connexion ok');
      this.addOnline(query);
    } else {
      console.log('Connexion ko');
      this.addOffline(query);
    }
  }

  /**
   * Ajoute la requête dans l'indexedDb pour traitement ultérieur.
   * @param query: la requête à ajouter à l'indexedDb.
   */
  private addOffline(query: any) {
    this.indexedDBService.addToIndexedDb(query);
    console.log('Ajout de la requête dans l\indexedDb (syncService)');
  }

  /**
   * Lance la requête au serveur.
   * @param query: la requête à envoyer.
   */
  private addOnline(query: any) {
    console.log('Envoi de la requête (syncService)', query);
    console.log(this.http.post(query.url, query.params).subscribe(res => console.log('Done')));
  }

  private checkBackOnline() {
    this.onlineOfflineService.connectionChanged.subscribe(online => {
      if (online) {
        this.indexedDBService.commitStockedQueries();
        console.log('Connexion récupérée');
      }
    });
  }

}
