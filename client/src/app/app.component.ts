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
    this.loadBasket();
    console.log('ngOnInit called');
    this.loadCurrentUser();
  }
  loadCurrentUser() {
    const token = localStorage.getItem('token');
      this.accountService.loadCurrentUser(token).subscribe(() => {
        console.log('User successfully loaded');
      }, error => {
        console.log(error);
      });
}
  loadBasket() {
    const basketId = localStorage.getItem('basket_id');
    if(basketId) {
      this.basketService.getBasket(basketId).subscribe(() => {
        console.log('initialised basket');
      }, error => {
        console.log(error);
      });
    }
  }
}
