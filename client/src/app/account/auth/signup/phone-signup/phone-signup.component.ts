import { Component, OnInit } from '@angular/core';
import {WindowService} from '../window.service';
import * as firebase from 'firebase';

export class PhoneNumber{
  phoneNum : string;
  get e84(){
    var  num = '+84' + this.phoneNum;
    return num;
  }
}
@Component({
  selector: 'app-phone-signup',
  templateUrl: './phone-signup.component.html',
  styleUrls: ['./phone-signup.component.scss']
})
export class PhoneSignupComponent implements OnInit {
  windowRef : any;
  PhoneNumber  = new PhoneNumber();
  verificationCode : string;
  user : any;


  constructor(private win : WindowService) { }

  ngOnInit(): void {
    this.windowRef = this.win.WindowRef;
    this.windowRef.recaptChaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    this.windowRef.recaptChaVerifier.render();
  }

  sendLoginCode(num){
    const appVerifier =  this.windowRef.recaptChaVerifier;
     num = this.PhoneNumber.e84;
    firebase.auth().signInWithPhoneNumber(num,appVerifier)
    .then(result =>{
      this.windowRef.confirmationResult = result;
      
    })
    .catch(error => console.log(error)   );
  }

  verifyLoginCode(){
      this.windowRef.confirmationResult.comfirm(this.verificationCode)
      .then(result =>{
        this.user = result.user;
      })
      .catch(error => console.log(error ,'Incorrect code entered?'));
      
  }
  
}
