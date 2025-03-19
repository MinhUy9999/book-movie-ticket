// Strategy Pattern Implementation for Payment Processing

// Payment Context
export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  message: string;
}

// Strategy Interface
export interface PaymentStrategy {
  pay(amount: number, currency: string, userData: any): Promise<PaymentResult>;
  refund(transactionId: string, amount: number): Promise<PaymentResult>;
}

// Concrete Strategy: Credit Card Payment
export class CreditCardPayment implements PaymentStrategy {
  async pay(amount: number, currency: string, userData: any): Promise<PaymentResult> {
    try {
      // In a real application, this would connect to a payment gateway
      console.log(`Processing credit card payment of ${amount} ${currency}`);
      console.log(`Card Number: ${userData.cardNumber}`);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const transactionId = `cc_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      
      return {
        success: true,
        transactionId,
        message: "Credit card payment successful"
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Credit card payment failed"
      };
    }
  }

  async refund(transactionId: string, amount: number): Promise<PaymentResult> {
    try {
      // Simulate refund processing
      console.log(`Refunding ${amount} from transaction ${transactionId}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        transactionId,
        message: "Credit card refund successful"
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Credit card refund failed"
      };
    }
  }
}

// Concrete Strategy: PayPal Payment
export class PayPalPayment implements PaymentStrategy {
  async pay(amount: number, currency: string, userData: any): Promise<PaymentResult> {
    try {
      // In a real application, this would connect to PayPal's API
      console.log(`Processing PayPal payment of ${amount} ${currency}`);
      console.log(`PayPal Email: ${userData.email}`);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const transactionId = `pp_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      
      return {
        success: true,
        transactionId,
        message: "PayPal payment successful"
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "PayPal payment failed"
      };
    }
  }

  async refund(transactionId: string, amount: number): Promise<PaymentResult> {
    try {
      // Simulate refund processing
      console.log(`Refunding ${amount} from PayPal transaction ${transactionId}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        transactionId,
        message: "PayPal refund successful"
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "PayPal refund failed"
      };
    }
  }
}

// Context
export class PaymentProcessor {
  private strategy: PaymentStrategy;

  constructor(strategy: PaymentStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: PaymentStrategy): void {
    this.strategy = strategy;
  }

  async processPayment(amount: number, currency: string, userData: any): Promise<PaymentResult> {
    return this.strategy.pay(amount, currency, userData);
  }

  async processRefund(transactionId: string, amount: number): Promise<PaymentResult> {
    return this.strategy.refund(transactionId, amount);
  }
}
