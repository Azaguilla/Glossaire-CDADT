import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {SingleWordComponent} from './word/single-word/single-word.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'definition/:title',
    component: SingleWordComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
