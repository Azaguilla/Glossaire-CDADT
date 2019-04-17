import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {SingleWordComponent} from './word/single-word/single-word.component';
import {ListWordComponent} from './word/list-word/list-word.component';
import {AuthenticationComponent} from './authentication/authentication.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'definition/:title',
    component: SingleWordComponent
  },
  {
    path: 'theme/:title',
    component: ListWordComponent
  },
  {
    path: 'connexion',
    component: AuthenticationComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
