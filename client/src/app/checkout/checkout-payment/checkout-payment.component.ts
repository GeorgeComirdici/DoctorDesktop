import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BasketService } from 'src/app/basket/basket.service';
import { CheckoutService } from '../checkout.service';
import { ToastrService } from 'ngx-toastr';
import { IBasket } from 'src/app/shared/models/basket';
import { IOrder } from 'src/app/shared/models/order';
import { NavigationExtras, Router } from '@angular/router';
declare var Stripe;

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements AfterViewInit, OnDestroy {
  @Input() checkoutForm: FormGroup;
  @ViewChild('cardNumber', {static: true}) cardNumberElement: ElementRef;
  @ViewChild('cardExpiry', {static: true}) cardExpiryElement: ElementRef;
  @ViewChild('cardCvc', {static: true}) cardCvcElement: ElementRef;
  stripe: any;
  cardNumber: any;
  cardExpiry: any;
  cardCvc: any;
  cardErrors: any;
  cardHandler = this.onChange.bind(this);
  loading = false;

  constructor(private basketService: BasketService, private checkoutService: CheckoutService, private toastr: ToastrService, private router: Router) {}

  ngAfterViewInit() {
    this.stripe = Stripe('pk_test_51NEXmaE7rVcrjgAYYDEFzb895pfzsAW0HLwwId3uCdYqyiQ3oUJdC5Apbm5ESGholERQutzi9XnCQOHBtBvrtOXb00ZfosXhFC');
    const elements = this.stripe.elements();
    this.cardNumber = elements.create('cardNumber');
    this.cardNumber.mount(this.cardNumberElement.nativeElement);
    this.cardNumber.addEventListener('change', this.cardHandler);

    this.cardExpiry = elements.create('cardExpiry');
    this.cardExpiry.mount(this.cardExpiryElement.nativeElement);
    this.cardExpiry.addEventListener('change', this.cardHandler);

    this.cardCvc = elements.create('cardCvc');
    this.cardCvc.mount(this.cardCvcElement.nativeElement);
    this.cardCvc.addEventListener('change', this.cardHandler);
}

ngOnDestroy() {
  this.cardNumber.destroy();
  this.cardExpiry.destroy();
  this.cardCvc.destroy();
}

onChange({error}) {
  if(error) {
    this.cardErrors = error.message;
  }else {
    this.cardErrors = null;
  }
}

async submitOrder(){
  this.loading = true;
  const basket = this.basketService.getCurrentBasketValue();
  try {
    const createdOrder = await this.createOrder(basket);
    const paymentResult = await this.stripePaymentConfirmation(basket);

    if(paymentResult.paymentIntent) {
      this.basketService.deleteLocalBasket(basket.id);
      const navigationExtras: NavigationExtras = {state: createdOrder};
      this.router.navigate(['checkout/success'], navigationExtras);
    }else {
      this.toastr.error(paymentResult.error.message);
    }
    this.loading = false;
  }catch (error) {
    console.log(error);
    this.loading = false;
  }
}

  private async stripePaymentConfirmation(basket) {
    return this.stripe.confirmCardPayment(basket.clientSecret, {
      payment_method: {
        card: this.cardNumber,
        billing_details: {
          name: this.checkoutForm.get('paymentForm').get('nameOnCard').value
        }
      }
    });
  }
  private async createOrder(basket: IBasket) {
    const orderToCreate = this.getOrderToCreate(basket);
    return this.checkoutService.createOrder(orderToCreate).toPromise();
  }
  private getOrderToCreate(basket: IBasket) {
    return {
      basketId: basket.id,
      deliveryMethodId: +this.checkoutForm.get('deliveryForm').get('deliveryMethod').value,
      shipToAddress: this.checkoutForm.get('addressForm').value
    };
  }
}
