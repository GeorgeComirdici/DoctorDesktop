import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  loginForm: FormGroup;
  returnUrl: string;
  constructor(private accountService: AccountService, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    // get the returnUrl from the query parameters of the activated route
    // if returnUrl is not provided, set it to '/shop'
    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl || '/shop';
    // initialize the login form when the LoginComponent is created
    this.createLoginForm();
  }

  // method to create the login form
  createLoginForm() {
    //create a new instance of FormGroup to represent the login form
    this.loginForm = new FormGroup({
      //new instance of the formControl for the email; required ensures that the field is not empty;
      //pattern is used to validate the email using a regular expression
      email: new FormControl('', [Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')]),
      //the initial value of the password is an empty string, required ensures that the field isnt empty
      password: new FormControl('', Validators.required)
    });
  }
  //redirect the user to the correct page depending on whether he is/is not logged in
  onSubmit() {
    this.accountService.login(this.loginForm.value).subscribe(() => {
      this.router.navigateByUrl(this.returnUrl);
    }, error => {
      console.log(error);
    });
  }
}
