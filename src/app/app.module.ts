import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
//import { Location } from '@angular/common'
import * as firebase from 'firebase'
import {NgxWebstorageModule} from 'ngx-webstorage';
// var firebaseConfig = {
//   apiKey: "AIzaSyDOthq8-7ipC4rQYCh_R8_oC9fL0F0Oz5g",
//   authDomain: "fir-crud-11c1f.firebaseapp.com",
//   databaseURL: "https://fir-crud-11c1f.firebaseio.com",
//   projectId: "fir-crud-11c1f",
//   storageBucket: "fir-crud-11c1f.appspot.com",
//   messagingSenderId: "704929489176",
//   appId: "1:704929489176:web:334d209d3679ed5d8a3e6d",
//   measurementId: "G-BYBG8HFL6W"
// };

// var firebaseConfig = {
//   apiKey: "AIzaSyC9Edgr1Yl4b2VHU98wSlm4xBtj2or51Vg",
//   authDomain: "broken-stool.firebaseapp.com",
//   databaseURL: "https://broken-stool.firebaseio.com",
//   projectId: "broken-stool",
//   storageBucket: "broken-stool.appspot.com",
//   messagingSenderId: "918311615055",
//   appId: "1:918311615055:web:374b3a771e9870a4c8083a",
//   measurementId: "G-YKQ4BTFTS9"
// };


var firebaseConfig = {
  apiKey: "AIzaSyBK6kckSYAyPrY_H8dfKxzoi4d95YkSfdU",
  authDomain: "broken-stool-flat.firebaseapp.com",
  databaseURL: "https://broken-stool-flat.firebaseio.com",
  projectId: "broken-stool-flat",
  storageBucket: "broken-stool-flat.appspot.com",
  messagingSenderId: "160738006805",
  appId: "1:160738006805:web:e6e0210eb8f5470d403b1c",
  measurementId: "G-JSFZR301ZQ"
};
// this is where we Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, FormsModule, ReactiveFormsModule, NgxWebstorageModule.forRoot()],
  providers: [
    StatusBar,
    SplashScreen,
    // AuthGuard,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
