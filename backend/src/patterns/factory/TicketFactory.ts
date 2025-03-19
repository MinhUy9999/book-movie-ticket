// Factory Pattern Implementation for Ticket creation

export interface Ticket {
  type: string;
  price: number;
  getDescription(): string;
  applyDiscount(percentage: number): void;
}

// Concrete Product: StandardTicket
class StandardTicket implements Ticket {
  type: string = 'standard';
  price: number;

  constructor(price: number) {
    this.price = price;
  }

  getDescription(): string {
    return `Standard Ticket - Regular seating, ${this.price} VND`;
  }

  applyDiscount(percentage: number): void {
    this.price = this.price - (this.price * (percentage / 100));
  }
}

// Concrete Product: PremiumTicket
class PremiumTicket implements Ticket {
  type: string = 'premium';
  price: number;

  constructor(price: number) {
    this.price = price;
  }

  getDescription(): string {
    return `Premium Ticket - Better seating with extra legroom, ${this.price} VND`;
  }

  applyDiscount(percentage: number): void {
    this.price = this.price - (this.price * (percentage / 100));
  }
}

// Concrete Product: VIPTicket
class VIPTicket implements Ticket {
  type: string = 'vip';
  price: number;

  constructor(price: number) {
    this.price = price;
  }

  getDescription(): string {
    return `VIP Ticket - Luxury recliner seating with food service, ${this.price} VND`;
  }

  applyDiscount(percentage: number): void {
    // VIP tickets might have a different discount rule
    const actualDiscount = Math.min(percentage, 15); // Max 15% discount for VIP
    this.price = this.price - (this.price * (actualDiscount / 100));
  }
}

// Factory class
export class TicketFactory {
  static createTicket(type: string, price: number): Ticket {
    switch (type.toLowerCase()) {
      case 'standard':
        return new StandardTicket(price);
      case 'premium':
        return new PremiumTicket(price);
      case 'vip':
        return new VIPTicket(price);
      default:
        throw new Error(`Ticket type ${type} is not supported.`);
    }
  }
}
