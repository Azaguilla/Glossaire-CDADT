import {Component, OnInit} from '@angular/core';
import {WordService} from '../../services/word.service';
import Word from '../models/word.model';
import Theme from '../models/theme.model';
import {ThemeService} from '../../services/theme.service';
import {AuthenticationService} from '../../services/authentication.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-header',
  animations: [
    trigger('overlayDisplay', [
      state('open', style({
        opacity: '1',
      })),
      state('closed', style({
        opacity: '0',
      })),
      transition('open => closed', [
        animate('0.5s')
      ]),
      transition('closed => open', [
        animate('0.5s')
      ]),
    ]),
    trigger('menuDisplay', [
      state('open', style({
        left: '30vw',
      })),
      state('closed', style({
        left: '-100%',
      })),
      transition('open => closed', [
        animate('0.3s')
      ]),
      transition('closed => open', [
        animate('0.3s')
      ]),
    ]),
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  private searchValue: string;
  word: Word[];
  theme: Theme[];
  displayResults: boolean;
  isDisplayOverlayMenu: boolean;
  isMenuOpen: boolean;

  constructor(private wordService: WordService,
              private themeService: ThemeService,
              private authService: AuthenticationService) {
    // L'overlay et le résultat de la recherche ne sont pas affichés par défaut
    this.displayResults = false;
    this.isDisplayOverlayMenu = false;
    this.isMenuOpen = false;
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
   * Méthode permettant d'ouvrir le menu burger ou le fermer
   */
  onDisplayMenu() {
    const elem = document.getElementById('header-menu-burger');
    const overlay = document.getElementById('overlay-menu');

    if (elem.className === 'header-menu-burger open') {
      elem.className = 'header-menu-burger';

      overlay.style.display = 'none';
      this.isMenuOpen = false;
    } else {
      elem.className = 'header-menu-burger open';

      overlay.style.display = 'block';

      this.isDisplayOverlayMenu = true;
      this.isMenuOpen = true;
    }
  }

  /**
   * Méthode qui ferme le menu
   */
  onDisplayMenuNone() {
    const elem = document.getElementById('header-menu-burger');
    const overlay = document.getElementById('overlay-menu');

    if (elem.className === 'header-menu-burger open') {
      elem.className = 'header-menu-burger';

      overlay.style.display = 'none';

      this.isMenuOpen = false;
    }

  }

  /**
   * Méthode permettant de savoir si l'utilisateur est connecté ou non
   */
  isLoggedIn() {
    return this.authService.isLoggedIn();
  }
}
