import { Component, OnInit } from '@angular/core';
import { BasketService } from './basket/basket.service';
import { AccountService } from './account/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'DoctorDesktop';

  constructor(private basketService: BasketService, private accountService: AccountService) { }

  ngOnInit(): void {
    // call the loadBasket and loadCurrentUser methods when the component initializes
    this.loadBasket();
    console.log('ngOnInit called');
    this.loadCurrentUser();
  }
  // method to load the current user's information
  loadCurrentUser() {
     // retrieve the token from the local storage
    const token = localStorage.getItem('token');
    // call the loadCurrentUser method of the AccountService and subscribe to the response
    if(token){
      this.accountService.loadCurrentUser(token).subscribe(() => {
        console.log('User successfully loaded');
      }, error => {
        console.log(error);
      });
    }
}
// method to load the user's basket
  loadBasket() {
    // retrieve the basketID from the local storage
    const basketId = localStorage.getItem('basket_id');
    // If a basketID exists, call the getBasket method of the BasketService and subscribe to the response
    if(basketId) {
      this.basketService.getBasket(basketId).subscribe(() => {
        console.log('initialised basket');
      }, error => {
        console.log(error);
      });
    }
  }
}
