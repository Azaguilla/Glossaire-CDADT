import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {AppRoutingModule} from './app-routing.module';
import {FooterComponent} from './footer/footer.component';
import {HeaderComponent} from './header/header.component';
import {HttpClientModule} from '@angular/common/http';
import {WordService} from '../services/word.service';
import {SingleWordComponent} from './word/single-word/single-word.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ListWordComponent} from './word/list-word/list-word.component';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    HeaderComponent,
    SingleWordComponent,
    ListWordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production})
  ],
  providers: [
    WordService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
