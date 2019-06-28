import {Component, OnInit} from '@angular/core';
import Word from '../models/word.model';
import {WordService} from '../../services/word.service';
import Theme from '../models/theme.model';
import {ThemeService} from '../../services/theme.service';
import {AuthenticationService} from '../../services/authentication.service';
import {SwPush} from '@angular/service-worker';
import {NewsletterService} from '../../services/newsletter.service';
import {TimeagoIntl} from 'ngx-timeago';
import {strings as FrenchStrings} from 'ngx-timeago/language-strings/fr';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {FormControl} from '@angular/forms';
import 'rxjs-compat/add/operator/distinctUntilChanged';
import 'rxjs-compat/add/operator/debounceTime';
import {SearchService} from '../../services/search.service';

@Component({
  selector: 'app-home',
  animations: [
    trigger('openClose', [
      state('open', style({
        top: '0',
      })),
      state('closed', style({
        top: '-100%',
      })),
      transition('open => closed', [
        animate('0.5s')
      ]),
      transition('closed => open', [
        animate('0.5s')
      ]),
    ]),
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  word: Word;
  displayResults: boolean;
  isOpenSuccess: boolean;
  isOpenError: boolean;
  live: true;
  queryField: FormControl = new FormControl ();

  constructor(private wordService: WordService,
              private themeService: ThemeService,
              private authService: AuthenticationService,
              private swPush: SwPush,
              private newsletterService: NewsletterService,
              private searchService: SearchService,
              intl: TimeagoIntl
  ) {
    // L'overlay et le résultat de la recherche ne sont pas affichés par défaut
    this.displayResults = false;

    // Les messages d'erreur sont masqués par défaut
    this.isOpenSuccess = false;
    this.isOpenError = false;

    // Les fichiers de langue pour le module Ilya(Timeago)
    intl.strings = FrenchStrings;
    intl.changes.next();
  }

  /**
   * Fonction appelée à l'initialisation du composant
   * Récupère la dernière définition ajoutée
   */
  ngOnInit() {
    this.wordService.getLastWord().subscribe((data: Word[]) => {
      this.word = data[0];
    });

    /** Détecte les changements dans le formulaire de recherche et effectue la recherche sur les mots et les thèmes
     */
    this.queryField.valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(queryField => {
        // On affiche l'overlay et le résultat
        this.displayResults = true;

        // ****** Positionne les résultats de la recherche en fonction de l'input ****** //
        // On récupère le champ de recherche
        const inputSearch = (document.getElementById('home-search') as HTMLInputElement);

        // On position les résultats en fonction de l'input
        const inputOffsetLeft = inputSearch.offsetLeft;
        const heightInputSearch = inputSearch.offsetHeight;
        const inputOffsetTop = heightInputSearch + inputSearch.offsetTop + 5;

        const divResults = (document.getElementById('home-search-results') as HTMLInputElement);
        divResults.style.top = inputOffsetTop + 'px';
        divResults.style.left = inputOffsetLeft + 'px';
        // ****** Positionne les résultats de la recherche en fonction de l'input ****** //

        this.searchService.search(queryField);
      });

    // On vérifie la compatibilité du navigateur aux notifications
    this.newsletterService.isBrowserCompatibleToNotif();
  }

  /**
   * Méthode permettant d'avertir s'il faut afficher ou non l'overlay  et le résultat de la recherche
   */
  onDisplayResultsNone() {
    this.displayResults = false;
  }

  /**
   * Méthode qui permet d'afficher le résulats de la recherche au clic sur la barre de recherche si celle-ci n'est pas vide
   */
  onDisplayResult() {
    if (this.queryField.value !== null && this.queryField.value !== '') {
      this.displayResults = true;
    }
  }

  /**
   * Méthode permettant de savoir si l'utilisateur est connecté ou non
   */
  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  /**
   * Méthode permettant de fermer la fenêtre d'information "Abonnement effectué" ou "Abonnement rejeté"
   */
  onClose() {
    this.isOpenSuccess = false;
    this.isOpenError = false;
  }
// ********************************************************************** NOTIFICATIONS

  /**
   * Méthode appelée lorsque l'utilisateur clique sur le bouton "S'abonner aux notifications"
   */
  subscribeToNotifications() {
    this.newsletterService.subscribeToNotifications();
    if (this.newsletterService.getErrorWhenSubscribe()) {
      this.isOpenError = true;
    } else {
      this.isOpenSuccess = true;
    }
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
