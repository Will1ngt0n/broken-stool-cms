import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth-services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email
  password
  loginForm
  emailPattern: string = "[a-zA-Z0-9-_.+#$!=%^&*/?]+[@][a-zA-Z0-9-]+[.][a-zA-Z0-9]+"

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private route: Router, public loadingCtrl: LoadingController, private alertController: AlertController) {
    this.loginForm = formBuilder.group({
      email: [this.email, Validators.compose([Validators.required])],
      password: [this.password, Validators.compose([Validators.required])]
    })
  }
  isOnline : boolean
  isCached : boolean
  ngOnInit() {
    if(navigator.onLine){
      this.isOnline = true
      this.isCached = true
    }else{
      this.isOnline = false
      this.isCached = false
    }
  }
  ionViewWillEnter(){
    console.log('ion view did enter');
    if(navigator.onLine){
      this.isOnline = true
      this.reload()
    }else{
      this.isOnline = false
    }
  }
  reload() {
    
  }
  resetPassword() {
    this.email = this.loginForm.get('email').value
    //this.password = this.loginForm.get('password').value
    return this.authService.passwordReset(this.email).then(result => {
      //  console.log(result);

    })
  }

  // async presentLoading() {
  //   const loading = await this.loadingCtrl.create({
  //     message: 'Hellooo',
  //     duration: 2000
  //   });
  //   await loading.present();

  //   const { role, data } = await loading.onDidDismiss();

  //   console.log('Loading dismissed!');
  // }
  loading
  login() {
    var errorMessage;
    var subHeader;
    this.loadingCtrl.create({
      message: "Logging In..."
    }).then((loading) => {
      loading.present()
      const alert = document.createElement('ion-alert');
      alert.header = 'Error';
      alert.subHeader = "Incorrect email and password";
      alert.message = "Please check your email and password then try again.";
      alert.buttons = ['OK'];

      document.body.appendChild(alert);
      this.email = this.loginForm.get('email').value
      this.password = this.loginForm.get('password').value
      console.log(this.email);

      return this.authService.loginWithEmail(this.email, this.password).then(result => {
        console.log(result);
        if (result && result.operationType) {
          if (result.operationType === "signIn") {
            loading.dismiss()
            setTimeout(() => {

              location.reload()
            }, 100);
            this.route.navigate(['/landing']);
          }
        } else if (result === undefined) {
          loading.dismiss()
          alert.present()
        } else {
          console.log(result);

        }
      }, (Error => {
        console.log(Error.code);
        loading.dismiss()
        if (Error.code == "auth/wrong-password") {
          alert.subHeader = "Incorrect Password"
          alert.message = "Check your details or reset your password."
        }
        alert.present();
      }))

    })

    // const loading = document.createElement('ion-loading');
    // loading.spinner = null;
    // loading.duration = 5000;
    // loading.message = 'Please wait...';
    // loading.translucent = true;
    // loading.cssClass = 'custom-class custom-loading';
    // document.body.appendChild(loading);
    // loading.present();

  }

  // userEmail;
  async presentAlertPrompt() {
    
    const alert = await this.alertController.create({
      header: 'Reset password',
      subHeader: 'Insert your email to reset your password',
      inputs: [
        {
          name: 'userEmail',
          type: 'email',
          placeholder: 'Email'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Reset Password',
          handler: (data) => {
            // console.log('Confirm Ok');

            // console.log(data.userEmail);
            
            return this.authService.passwordReset(data.userEmail).then(result => {
               console.log(data.userEmail);
               console.log(result);
               

            })
          }
        }
      ]
    });

    await alert.present();
  }
  showResetPrompt() {
    this.presentAlertPrompt();
  }
}