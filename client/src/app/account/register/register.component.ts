import { Component, OnInit } from '@angular/core';
import { AsyncValidatorFn, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import { map, of, switchMap, timer } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
registerForm: FormGroup;
errors: string[];

  constructor(private fb: FormBuilder, private accountService: AccountService, private router: Router) {}

  ngOnInit() {
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      displayName: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')], //synchronous validators - happen instantly
    [this.validateEmailNotTaken()]   //async validator - only called if the sync ones have passed validation ; it is going to make the network request to the API
    ],
      password: [null, [Validators.required]]
    });
  }

  onSubmit() {
    //redirect new user to the shop page after he created an account
    this.accountService.register(this.registerForm.value).subscribe(response => {
      this.router.navigateByUrl('/shop');
    }, error => {
      console.log(error);
      this.errors = error.errors;
    });
  }

  //check if email exists using accountService(control.value is the input email - this value will be checked to see if it already exists)
  validateEmailNotTaken(): AsyncValidatorFn {
    return control => {
      return timer(500).pipe(switchMap(() => {
        if(!control.value) {
          return of(null);
        }
        return this.accountService.checkIfEmailExists(control.value).pipe(map(res => {
          return res ? {emailExists: true} : null;
        })
      );
      })
    );
    };
  }
}
