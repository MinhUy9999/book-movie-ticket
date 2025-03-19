// Observer Pattern Implementation for Notifications

// Event types
export type NotificationEvent = 'booking.created' | 'booking.cancelled' | 'booking.confirmed' | 'payment.success' | 'payment.failed';

// Event data
export interface NotificationData {
  userId?: string;
  email?: string;
  phone?: string;
  bookingId?: string;
  movieTitle?: string;
  theaterName?: string;
  showtime?: Date;
  seats?: string[];
  amount?: number;
  [key: string]: any; // Allow for additional properties
}

// Observer interface
export interface NotificationObserver {
  update(event: NotificationEvent, data: NotificationData): Promise<void>;
}

// Concrete Observers
export class EmailNotification implements NotificationObserver {
  async update(event: NotificationEvent, data: NotificationData): Promise<void> {
    if (!data.email) {
      console.log("Email notification skipped: No email provided");
      return;
    }
    
    // In a real application, this would send an email via a service
    console.log(`Sending email notification for ${event} to ${data.email}`);
    
    let subject = '';
    let message = '';
    
    switch(event) {
      case 'booking.created':
        subject = 'Your booking has been created';
        message = `Dear customer, your booking for ${data.movieTitle} at ${data.theaterName} on ${data.showtime} has been created.`;
        break;
      case 'booking.confirmed':
        subject = 'Your booking has been confirmed';
        message = `Dear customer, your booking for ${data.movieTitle} at ${data.theaterName} on ${data.showtime} has been confirmed.`;
        break;
      case 'booking.cancelled':
        subject = 'Your booking has been cancelled';
        message = `Dear customer, your booking for ${data.movieTitle} at ${data.theaterName} on ${data.showtime} has been cancelled.`;
        break;
      case 'payment.success':
        subject = 'Payment successful';
        message = `Dear customer, your payment of ${data.amount} for booking ${data.bookingId} has been successful.`;
        break;
      case 'payment.failed':
        subject = 'Payment failed';
        message = `Dear customer, your payment of ${data.amount} for booking ${data.bookingId} has failed.`;
        break;
    }
    
    console.log(`Email Subject: ${subject}`);
    console.log(`Email Message: ${message}`);
    
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Email notification sent to ${data.email}`);
  }
}

export class SMSNotification implements NotificationObserver {
  async update(event: NotificationEvent, data: NotificationData): Promise<void> {
    if (!data.phone) {
      console.log("SMS notification skipped: No phone number provided");
      return;
    }
    
    // In a real application, this would send an SMS via a service
    console.log(`Sending SMS notification for ${event} to ${data.phone}`);
    
    let message = '';
    
    switch(event) {
      case 'booking.created':
        message = `Your booking for ${data.movieTitle} on ${data.showtime} has been created.`;
        break;
      case 'booking.confirmed':
        message = `Your booking for ${data.movieTitle} on ${data.showtime} has been confirmed.`;
        break;
      case 'booking.cancelled':
        message = `Your booking for ${data.movieTitle} on ${data.showtime} has been cancelled.`;
        break;
      case 'payment.success':
        message = `Your payment of ${data.amount} for booking ${data.bookingId} has been successful.`;
        break;
      case 'payment.failed':
        message = `Your payment of ${data.amount} for booking ${data.bookingId} has failed.`;
        break;
    }
    
    console.log(`SMS Message: ${message}`);
    
    // Simulate SMS sending
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`SMS notification sent to ${data.phone}`);
  }
}

// Push Notification Observer
export class PushNotification implements NotificationObserver {
  async update(event: NotificationEvent, data: NotificationData): Promise<void> {
    if (!data.userId) {
      console.log("Push notification skipped: No user ID provided");
      return;
    }
    
    // In a real application, this would send a push notification
    console.log(`Sending push notification for ${event} to user ${data.userId}`);
    
    let title = '';
    let message = '';
    
    switch(event) {
      case 'booking.created':
        title = 'Booking Created';
        message = `Your booking for ${data.movieTitle} has been created.`;
        break;
      case 'booking.confirmed':
        title = 'Booking Confirmed';
        message = `Your booking for ${data.movieTitle} has been confirmed.`;
        break;
      case 'booking.cancelled':
        title = 'Booking Cancelled';
        message = `Your booking for ${data.movieTitle} has been cancelled.`;
        break;
      case 'payment.success':
        title = 'Payment Successful';
        message = `Your payment of ${data.amount} has been successful.`;
        break;
      case 'payment.failed':
        title = 'Payment Failed';
        message = `Your payment of ${data.amount} has failed.`;
        break;
    }
    
    console.log(`Push Notification Title: ${title}`);
    console.log(`Push Notification Message: ${message}`);
    
    // Simulate push notification sending
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Push notification sent to user ${data.userId}`);
  }
}

// Subject
export class NotificationService {
  private observers: Map<NotificationEvent, NotificationObserver[]> = new Map();
  private static instance: NotificationService;

  // Singleton pattern
  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  subscribe(event: NotificationEvent, observer: NotificationObserver): void {
    if (!this.observers.has(event)) {
      this.observers.set(event, []);
    }
    
    const observers = this.observers.get(event);
    
    if (observers && !observers.includes(observer)) {
      observers.push(observer);
    }
  }

  unsubscribe(event: NotificationEvent, observer: NotificationObserver): void {
    if (!this.observers.has(event)) {
      return;
    }
    
    const observers = this.observers.get(event);
    
    if (observers) {
      const index = observers.indexOf(observer);
      if (index !== -1) {
        observers.splice(index, 1);
      }
    }
  }

  async notify(event: NotificationEvent, data: NotificationData): Promise<void> {
    if (!this.observers.has(event)) {
      return;
    }
    
    const observers = this.observers.get(event);
    
    if (observers) {
      const notificationPromises = observers.map(observer => observer.update(event, data));
      await Promise.all(notificationPromises);
    }
  }
}

// Export a default instance
export const notificationService = NotificationService.getInstance();
