import {Component, OnInit} from '@angular/core';
import {WordService} from '../../services/word.service';
import Word from '../models/word.model';
import Theme from '../models/theme.model';
import {ThemeService} from '../../services/theme.service';
import {AuthenticationService} from '../../services/authentication.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {SwPush} from '@angular/service-worker';
import {NewsletterService} from '../../services/newsletter.service';
import {FormControl} from '@angular/forms';
import 'rxjs-compat/add/operator/distinctUntilChanged';
import 'rxjs-compat/add/operator/debounceTime';
import {SearchService} from '../../services/search.service';

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

  displayResults: boolean;
  isDisplayOverlayMenu: boolean;
  isMenuOpen: boolean;
  queryField: FormControl = new FormControl ();

  constructor(private wordService: WordService,
              private themeService: ThemeService,
              private authService: AuthenticationService,
              private swPush: SwPush,
              private newsletterService: NewsletterService,
              private searchService: SearchService,
              ) {
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


    /** Détecte les changements dans le formulaire de recherche et effectue la recherche sur les mots et les thèmes
     */
    this.queryField.valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe (queryField => {
        // On affiche l'overlay et le résultat
        this.displayResults = true;

        this.searchService.search(queryField);
      });

    // On vérifie la compatibilité du navigateur aux notifications
    this.newsletterService.isBrowserCompatibleToNotif();
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
    const searchValue = (document.getElementById('header-menu-search') as HTMLInputElement).value;
    if (searchValue !== null && searchValue !== '') {
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

  // ********************************************************************** NOTIFICATIONS
  /**
   * Méthode appelée lorsque l'utilisateur clique sur le bouton "S'abonner aux notifications"
   */
  subscribeToNotifications() {
    this.newsletterService.subscribeToNotifications();
  }

  /**
   * Méthode permettant de désinscrire le naviagteur aux notifications. Puis on utilise la fonction unsubscriptionSuccessful
   * pour supprimer l'entrée concernant l'abonnement dans la Base de Données
   */
  unsubscribeToNotifications() {
    this.newsletterService.unsubscribeToNotifications();
  }

  getIsSubscriber() {
    return this.newsletterService.getIsSubscriber();
  }

  getNotification() {
    return this.newsletterService.getNotification();
  }

  getWords() {
    return this.searchService.getWords();
  }

  getThemes() {
    return this.searchService.getThemes();
  }
}
