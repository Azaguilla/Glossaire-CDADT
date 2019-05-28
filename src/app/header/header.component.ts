import {Component, OnInit} from '@angular/core';
import {WordService} from '../../services/word.service';
import Word from '../models/word.model';
import Theme from '../models/theme.model';
import {ThemeService} from '../../services/theme.service';
import {AuthenticationService} from '../../services/authentication.service';

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

  constructor(private wordService: WordService,
              private themeService: ThemeService,
              private authService: AuthenticationService) {
    // L'overlay et le résultat de la recherche ne sont pas affichés par défaut
    this.displayResults = false;
  }

  ngOnInit() {
    // Fixe une taille minimum au menu
    const winHeight = window.innerHeight;
    const elem = document.getElementById('header-menu-burger');
    const header = document.getElementById('header-menu').offsetHeight;

    elem.style.height = `${winHeight - header}px`;
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


  /**
   * Méthode permettant d'afficher les résultats de la recherche si une recherche est effectuée
   * si le résultat n'est pas vide
   */
  onDisplayResult() {
    this.searchValue = (document.getElementById('header-menu-search') as HTMLInputElement).value;
    if (this.searchValue !== null && this.searchValue !== '') {
      this.displayResults = true;
    }
  }

  /**
   * Affiche le menu burger
   */
  onDisplayMenu() {
    const elem = document.getElementById('header-menu-burger');
    const overlay = document.getElementById('overlay-menu');

    if (elem.className === 'header-menu-burger open') {
      elem.className = 'header-menu-burger';

      overlay.style.display = 'none';

      // On affiche le menu
      elem.animate([
        // keyframes
        {left: '30vw'},
        {left: '-100%'}
      ], {
        // timing options
        duration: 300,
        fill: 'forwards'
      });
    } else {
      elem.className = 'header-menu-burger open';

      overlay.style.display = 'block';

      overlay.animate([
        // keyframes
        {opacity: '0'},
        {opacity: '1'}
      ], {
        // timing options
        duration: 150,
        fill: 'forwards'
      });

      elem.animate([
        // keyframes
        {left: '-100%'},
        {left: '30vw'}
      ], {
        // timing options
        duration: 300,
        fill: 'forwards'
      });
    }
  }

  onDisplayMenuNone() {
    const elem = document.getElementById('header-menu-burger');
    const overlay = document.getElementById('overlay-menu');

    if (elem.className === 'header-menu-burger open') {
      elem.className = 'header-menu-burger';

      overlay.style.display = 'none';

      // On affiche le menu
      elem.animate([
        // keyframes
        {left: '30vw'},
        {left: '-100%'}
      ], {
        // timing options
        duration: 300,
        fill: 'forwards'
      });
    }

  }

  /**
   * Méthode permettant de savoir si l'utilisateur est connecté ou non
   */
  isLoggedIn() {
    return this.authService.isLoggedIn();
  }
}
