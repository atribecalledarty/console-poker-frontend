import React from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useDispatch, useSelector } from 'react-redux';
import { addChips } from '../../../redux/dispatchActions';
import { useHistory } from 'react-router-dom';
import { BASE_URL } from '../../../utilities/BASE_URL';
import './StripeForm.css';

const CARD_OPTIONS = {
  iconStyle: 'solid',
  style: {
    base: {
      // iconColor: '#c4f0ff',
      // color: '#fff',
      width: '',
      fontWeight: 500,
      fontFamily: 'Atari Classic',
      fontSize: '16px',
      fontSmoothing: 'antialiased',
      ':-webkit-autofill': {
        // color: '#fce883',
      },
      '::placeholder': {
        // color: '#87bbfd',
      },
    },
    invalid: {
      // iconColor: '#ffc7ee',
      // color: '#ffc7ee',
    },
  },
};

const StripeForm = ({ clearMessages, setError, amount, name }) => {
  const user = useSelector(state => state.user);
  const history = useHistory();
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();

  const validateAmount = amount => {
    const cents = parseFloat(amount.replace(/,/g, ''))*100
    return (cents < 50 || cents > 99999999)
  }

  const submitHandler = async (event) => {
    event.preventDefault();
    clearMessages();

    if (!stripe || !elements) return // if not loaded

    const cents = parseFloat(amount.replace(/,/g, '')) * 100
    const resp = await fetch(`${BASE_URL}/secret/${cents}`)
    const secret = await resp.json()
    const result = await stripe.confirmCardPayment(secret.client_secret, {
    payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
        name: name,
        },
    }
    });

    if (result.error) {
    // Show error to your customer (e.g., insufficient funds)
      setError(result.error.message);
    } else {
    // The payment has been processed!
    if (result.paymentIntent.status === 'succeeded') {
      dispatch(addChips(result.paymentIntent.amount*100, user.id, history));
        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
    }
    }
  }
    
    return(
        <div className="stripeForm">
          <form onSubmit={submitHandler}>
            <span></span>
            <CardElement className='stripeForm__cardElement nes-input' options={CARD_OPTIONS}/>
            <br/>
              <button
                className={`stripeForm__button nes-btn ${!stripe || name === "" || !validateAmount(amount) ? 'is-disabled' : 'is-primary'}`} 
                type="submit" 
                disabled={!stripe || name === "" || !validateAmount(amount)}  
                onClick={submitHandler}
                value="Exchange Chips!">
                  Exchange Chips!
              </button>
          </form>
        </div>
    )
    
}

export default StripeForm;