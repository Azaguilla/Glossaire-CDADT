import { Injectable } from '@angular/core';
import {WordService} from './word.service';
import {ThemeService} from './theme.service';
import Word from '../app/models/word.model';
import Theme from '../app/models/theme.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private words: any[];
  private themes: any[];

  constructor(private wordService: WordService,
              private themeService: ThemeService) { }


  /**
   * Méthode permettant de trier les résultats de la recherche : les résultats commençant par
   * la chaîne de charactères saisie apparaîtront en premier ceux contenant cette chaîne apparaîtront ensuite
   * @param tab Le tableau à trier
   * @param search Le contenu de a recherche
   */
  sortSearchTable(tab: any[], search) {
    const beginTab = [];
    const elseTab = [];

    tab.forEach(value => {
      if (value.title.substr(0, search.length).toLowerCase() === search.toLowerCase()) {
        beginTab.push(value);
      } else {
        elseTab.push(value);
      }
    });

    return beginTab.concat(elseTab);
  }

  /**
   * Méthode permettant de faire une recherche sur les mots et les thèmes
   * @param queryField La recherche effectuée
   */
  search(queryField) {
    this.themes = null;
    this.words = null;

    // On fait appel au service pour récupérer les mots correspondants à la recherche
    this.wordService.getWordsLikeByTitle(queryField).subscribe((data: Word[]) => {
      const dataSorted = this.sortSearchTable(data, queryField);
      this.words = dataSorted.slice(0, 4);
    });

    this.themeService.getThemesLikeByTitle(queryField).subscribe((data: Theme[]) => {
      const dataSorted = this.sortSearchTable(data, queryField);
      this.themes = dataSorted.slice(0, 2);
    });
  }

  getThemes() {
    return this.themes;
  }

  getWords() {
    return this.words;
  }

}
