import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


import { AuthenticationService } from '@/_services';
import * as customValidators from '@/custom-validators';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';

  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private authenticationService: AuthenticationService,
      private http: HttpClient
  ) { 
  }

  ngOnInit() {
      this.changePasswordForm = this.formBuilder.group({
          password1: ['', [Validators.required,customValidators.passwordValidator()]],
          password2: ['', customValidators.matchOtherValidator('password1')],
      });
      
      // get return url from route parameters or default to '/'
      this.returnUrl = '/restaurant';
  }

  // convenience getter for easy access to form fields
  get f() { return this.changePasswordForm.controls; }

  onSubmit() {
      this.submitted = true;
      if (this.changePasswordForm.invalid) {
          return;
      }
      var password = this.f.password1.value;
      this.http.post(`http://localhost:3000/user/changePassword`, {password})
      .pipe(first())
          .subscribe(
              data => {
                  if (data){
                    this.router.navigate([this.returnUrl]);
                    return;
                  }
              },
              error => {
                  this.error = error;
                  this.loading = false;
                  return;
              }
          );
  }

}
