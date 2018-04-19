import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { FirebaseProvider } from '../providers/firebase/firebase';
import { GlobalsProvider } from '../providers/globals/globals';
import { BusinessPage } from '../pages/business/business';
import { NewsPage } from '../pages/news/news';
import { NewsDetailsPage } from '../pages/news-details/news-details';
import { LocalPage } from '../pages/local/local';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    BusinessPage,
    NewsPage,
    NewsDetailsPage,
    LocalPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, { mode: 'ios' }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    BusinessPage,
    NewsPage,
    NewsDetailsPage,
    LocalPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FirebaseProvider,
    GlobalsProvider
  ]
})
export class AppModule {}
