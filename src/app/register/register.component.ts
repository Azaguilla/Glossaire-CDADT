import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService, TokenPayload} from '../../services/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public authForm: FormGroup;
  errorMessage: string;
  credentials: TokenPayload = {
    email: '',
    password: '',
    firstname: '',
    lastname: '',
  };

  constructor(private formBuilder: FormBuilder,
              private authService: AuthenticationService,
              private router: Router) {
  }

  ngOnInit() {
    this.initForm();
  }

  /**
   * Initialisation du formulaire de connexion avec la méthide réactive
   */
  initForm() {
    this.authForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]],
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
    });
  }

  /**
   * A la soumission du formulaire on récupère les données et on authentifie l'utilisateur
   * Une fois l'utilisateur authentifié on le redirige vers la page dashboard
   * Sinon on affiche l'erreur
   */
  onSubmitForm() {
    const email = this.authForm.get('email').value;
    const password = this.authForm.get('password').value;
    const firstname = this.authForm.get('firstname').value;
    const lastname = this.authForm.get('lastname').value;

    this.credentials.email = email;
    this.credentials.password = password;
    this.credentials.firstname = firstname;
    this.credentials.lastname = lastname;

    this.authService.register(this.credentials).subscribe(() => {
      this.router.navigateByUrl('/dashboard');
    }, (err) => {
      console.error(err);
    });
  }

}
