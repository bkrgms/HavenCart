import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Paper,
  TextField,
  FormControlLabel,
  Checkbox,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

// Stripe public key - Test mode
const stripePromise = loadStripe('pk_test_51XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');

const steps = ['Teslimat Bilgileri', 'Ödeme Yöntemi', 'Sipariş Onayı'];

// Stripe Card Element Component
const StripeCardElement = () => {
  const stripe = useStripe();
  const elements = useElements();

  return (
    <Box sx={{ mt: 2 }}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}
      />
    </Box>
  );
};

const Checkout = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [deliveryInfo, setDeliveryInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [orderTotal] = useState(499.98); // Example total

  const handleDeliveryInfoChange = (e) => {
    setDeliveryInfo({
      ...deliveryInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleStripeSubmit = async (event) => {
    event.preventDefault();
    // Simulate Stripe payment processing
    alert('Test ödeme başarılı! (Stripe)');
    navigate('/order-confirmation');
  };

  const handlePayPalSuccess = (data, actions) => {
    // Simulate PayPal payment processing
    alert('Test ödeme başarılı! (PayPal)');
    navigate('/order-confirmation');
  };

  const renderDeliveryForm = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Ad"
          name="firstName"
          value={deliveryInfo.firstName}
          onChange={handleDeliveryInfoChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Soyad"
          name="lastName"
          value={deliveryInfo.lastName}
          onChange={handleDeliveryInfoChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="E-posta"
          name="email"
          type="email"
          value={deliveryInfo.email}
          onChange={handleDeliveryInfoChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="Telefon"
          name="phone"
          value={deliveryInfo.phone}
          onChange={handleDeliveryInfoChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="Adres"
          name="address"
          multiline
          rows={3}
          value={deliveryInfo.address}
          onChange={handleDeliveryInfoChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Şehir"
          name="city"
          value={deliveryInfo.city}
          onChange={handleDeliveryInfoChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Posta Kodu"
          name="postalCode"
          value={deliveryInfo.postalCode}
          onChange={handleDeliveryInfoChange}
        />
      </Grid>
    </Grid>
  );

  const renderPaymentForm = () => (
    <Box>
      <FormControl component="fieldset" sx={{ mb: 3 }}>
        <FormLabel component="legend">Ödeme Yöntemi</FormLabel>
        <RadioGroup
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <FormControlLabel
            value="creditCard"
            control={<Radio />}
            label="Kredi Kartı (Stripe)"
          />
          <FormControlLabel
            value="paypal"
            control={<Radio />}
            label="PayPal"
          />
          <FormControlLabel
            value="bankTransfer"
            control={<Radio />}
            label="Banka Havalesi"
          />
        </RadioGroup>
      </FormControl>

      {paymentMethod === 'creditCard' && (
        <Elements stripe={stripePromise}>
          <form onSubmit={handleStripeSubmit}>
            <StripeCardElement />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
            >
              Ödemeyi Tamamla
            </Button>
          </form>
        </Elements>
      )}

      {paymentMethod === 'paypal' && (
        <PayPalScriptProvider options={{ 
          "client-id": "test_client_id",
          currency: "TRY"
        }}>
          <PayPalButtons
            style={{ layout: "vertical" }}
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: orderTotal.toString(),
                      currency_code: "TRY"
                    }
                  }
                ]
              });
            }}
            onApprove={handlePayPalSuccess}
          />
        </PayPalScriptProvider>
      )}

      {paymentMethod === 'bankTransfer' && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" gutterBottom>
            Banka Hesap Bilgileri:
          </Typography>
          <Typography variant="body2">
            Banka: Örnek Bank<br />
            IBAN: TR00 0000 0000 0000 0000 0000 00<br />
            Hesap Sahibi: HavenCart A.Ş.
          </Typography>
        </Box>
      )}
    </Box>
  );

  const renderOrderSummary = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Sipariş Özeti
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Typography>Ara Toplam</Typography>
          </Grid>
          <Grid item>
            <Typography>{orderTotal} TL</Typography>
          </Grid>
        </Grid>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Typography>Kargo</Typography>
          </Grid>
          <Grid item>
            <Typography>Ücretsiz</Typography>
          </Grid>
        </Grid>
        <Grid container justifyContent="space-between" sx={{ mt: 2 }}>
          <Grid item>
            <Typography variant="h6">Toplam</Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6">{orderTotal} TL</Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderDeliveryForm();
      case 1:
        return renderPaymentForm();
      case 2:
        return renderOrderSummary();
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Ödeme
        </Typography>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box>
          {activeStep === steps.length ? (
            <Box>
              <Typography variant="h5" gutterBottom>
                Siparişiniz alındı!
              </Typography>
              <Typography variant="subtitle1">
                Sipariş numaranız: #2001539
              </Typography>
            </Box>
          ) : (
            <Box>
              {getStepContent(activeStep)}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mr: 1 }}>
                    Geri
                  </Button>
                )}
                {activeStep !== steps.length - 1 && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                  >
                    İleri
                  </Button>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Checkout; 