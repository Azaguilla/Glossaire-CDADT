import {Component, OnInit} from '@angular/core';
import {WordService} from '../../services/word.service';
import Word from '../models/word.model';
import Theme from '../models/theme.model';
import {ThemeService} from '../../services/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  private searchValue: string;
  word: Word[];
  theme: Theme[];
  displayResults: boolean;

  constructor(private wordService: WordService, private themeService: ThemeService) {
    // L'overlay et le résultat de la recherche ne sont pas affichés par défaut
    this.displayResults = false;
  }

  ngOnInit() {
  }

  /**
   * Méthode qui effectue une recherche sur les mots et les thèmes
   */
  onSearch() {
    // On affiche l'overlay et le résultat
    this.displayResults = true;

    // On initialise les résultats à null pour qu'il ne garde pas la dernière recherche en mémoire (reste affichée sinon)
    this.word = null;
    this.theme = null;

    // On récupère la valeur de la recherche
    this.searchValue = (document.getElementById('header-menu-search') as HTMLInputElement).value;

    // On fait appel au service pour récupérer les mots correspondants à la recherche
    this.wordService.getWordsLikeByTitle(this.searchValue).subscribe((data: Word[]) => {
      this.word = data;
    });

    // On fait appel au service pour récupérer les thèmes correspondants à la recherche
    this.themeService.getThemesLikeByTitle(this.searchValue).subscribe((data: Theme[]) => {
      this.theme = data;
    });
  }

  /**
   * Méthode permettant d'avertir s'il faut afficher ou non l'overlay  et le résultat de la recherche
   */
  onDisplayNone() {
    this.displayResults = false;
  }


  onDisplayResult() {
    this.searchValue = (document.getElementById('header-menu-search') as HTMLInputElement).value;
    if (this.searchValue !== null && this.searchValue !== '') {
      this.onSearch();
    }
  }
}
