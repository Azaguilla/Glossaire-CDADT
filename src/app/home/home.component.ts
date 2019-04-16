import {Component, OnInit} from '@angular/core';
import Word from '../models/word.model';
import {WordService} from '../../services/word.service';
import {DatePipe, formatDate} from '@angular/common';
import Theme from '../models/theme.model';
import {ThemeService} from '../../services/theme.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  word: Word;
  ilya: string;
  private searchValue: string;
  words: Word[];
  theme: Theme[];
  displayResults: boolean;

  constructor(private wordService: WordService, private themeService: ThemeService) {
    // L'overlay et le résultat de la recherche ne sont pas affichés par défaut
    this.displayResults = false;
  }

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

  /**
   * Méthode qui effectue une recherche sur les mots et les thèmes
   */
  onSearch() {
    // On affiche l'overlay et le résultat
    this.displayResults = true;

    // On initialise les résultats à null pour qu'il ne garde pas la dernière recherche en mémoire (reste affichée sinon)
    this.words = null;
    this.theme = null;

    // On récupère la valeur de la recherche
    const inputSearch = (document.getElementById('home-search') as HTMLInputElement);
    this.searchValue = inputSearch.value;

    // On position les résultats en fonction de l'input
    const inputOffsetLeft = inputSearch.offsetLeft;
    const heightInputSearch =  inputSearch.offsetHeight;
    const inputOffsetTop = heightInputSearch + inputSearch.offsetTop + 5;

    const divResults = (document.getElementById('home-search-results') as HTMLInputElement);
    divResults.style.top = inputOffsetTop + 'px';
    divResults.style.left = inputOffsetLeft + 'px';

    // On fait appel au service pour récupérer les mots correspondants à la recherche
    this.wordService.getWordsLikeByTitle(this.searchValue).subscribe((data: Word[]) => {
      this.words = data;
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
    this.searchValue = (document.getElementById('home-search') as HTMLInputElement).value;
    if (this.searchValue !== null && this.searchValue !== '') {
      this.displayResults = true;
    }
  }

}
