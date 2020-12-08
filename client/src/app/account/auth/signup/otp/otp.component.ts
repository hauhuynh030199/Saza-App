import { Component, OnInit, ViewChild, OnDestroy  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthfakeauthenticationService } from '../../../../core/services/authfake.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {WindowService} from '../window.service';
import * as firebase from 'firebase';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})

/**
 * OTP comoponent
 */
export class OTPComponent implements OnInit, OnDestroy {

  submitted = false;
  error = '';
  success = '';
  loading = false;
  windowRef : any;
  user : any;

  // set the currenr year
  year: number = new Date().getFullYear();

  destroy$: Subject<boolean> = new Subject<boolean>();

  // tslint:disable-next-line: max-line-length
  constructor(private route: ActivatedRoute,
     private router: Router, private routes: ActivatedRoute,
      public authFackservice: AuthfakeauthenticationService
      ,private win : WindowService) { }

  ngOnInit(): void {
    firebase.initializeApp(environment.firebaseConfig);
    this.windowRef = this.win.WindowRef;
    this.windowRef.recaptChaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    this.windowRef.recaptChaVerifier.render();

    
  }

  sendLoginCode(num){
    const appVerifier =  this.windowRef.recaptChaVerifier;
     //num = this.PhoneNumber.e84;
    firebase.auth().signInWithPhoneNumber(num,appVerifier)
    .then(result =>{
      this.windowRef.confirmationResult = result;

      console.log(result);
      
    })
    .catch(error => console.log(error)   );
  }

  verifyLoginCode(){
      this.windowRef.confirmationResult.confirm(this.otp)
      .then(result =>{
       if(this.otp.length < 6)
       return this.error = 'Mã OTP phải đủ 6 ký tự số'
     //Gửi và kiểm tra OTP
     //Chưa làm
     /********************** register ******************************/
         
     var username = this.routes.snapshot.paramMap.get('username')
     var password = this.routes.snapshot.paramMap.get('password')
     var fullname = this.routes.snapshot.paramMap.get('fullname')
     var email = this.routes.snapshot.paramMap.get('email')
     var phone = this.routes.snapshot.paramMap.get('phone')
     var birthday = this.routes.snapshot.paramMap.get('birthday')
 
     this.authFackservice.register(username, password, fullname, email, phone, birthday)
       .pipe(takeUntil(this.destroy$)).subscribe(data => {
         if (Object.values(data)[0] != null) {
           this.router.navigate(['/']);
         } else {
           this.error = Object.values(data)[1];
         }
       },
       error => {
         this.error = error ? error : '';
     });
    
      })
      .catch(error => {
        console.log(error ,'Incorrect code entered?');
        this.router.navigate(['/account/signup']);
        this.error = 'Mã OTP bạn vừa nhập không chính xác '
      }
        );
      

  }
  
   

  otp:string = '';
  showOtpComponent = true;
  @ViewChild('ngOtpInput', { static: false}) ngOtpInput: any;
  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '50px',
      'height': '50px'
    }
  };
  onOtpChange(otp) {
    this.otp = otp;
  }

  setVal(val) {
    this.ngOtpInput.setValue(val);
  }

  toggleDisable(){
    if(this.ngOtpInput.otpForm){
      if(this.ngOtpInput.otpForm.disabled){
        this.ngOtpInput.otpForm.enable();
      }else{
        this.ngOtpInput.otpForm.disable();
      }
    }
  }

  onConfigChange() {
    this.showOtpComponent = false;
    this.otp = null;
    setTimeout(() => {
      this.showOtpComponent = true;
    }, 0);
  }

  // convenience getter for easy access to form fields

  /**
   * On submit form
   */


  reSendOTP(){
    var username = this.routes.snapshot.paramMap.get('username');
    var numPhone = parseInt(username);
    var stringPhone = '+84' + numPhone.toString();
    console.log(stringPhone);
    
    this.sendLoginCode(stringPhone);
    this.success = 'Mã OTP đã được gửi'
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
