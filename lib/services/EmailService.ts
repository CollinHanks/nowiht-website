// lib/services/EmailService.ts
// Professional email service using Resend
// FIXED: Added sendOrderCancellation() and sendReturnConfirmation()

import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@updates.nowiht.com';
const BRAND_NAME = 'NOWIHT';

// ═══════════════════════════════════════════════════════════════
// Email Service Class
// ═══════════════════════════════════════════════════════════════

export class EmailServiceClass {
  /**
   * Send email using Resend
   */
  private async send({
    to,
    subject,
    html,
    text,
  }: {
    to: string;
    subject: string;
    html: string;
    text?: string;
  }) {
    try {
      const { data, error } = await resend.emails.send({
        from: `${BRAND_NAME} <${FROM_EMAIL}>`,
        to,
        subject,
        html,
        text,
      });

      if (error) {
        console.error('❌ Email send error:', error);
        throw new Error(`Failed to send email: ${error.message}`);
      }

      console.log('✅ Email sent successfully:', data?.id);
      return { success: true, id: data?.id };
    } catch (error) {
      console.error('🚨 Email exception:', error);
      return { success: false, error };
    }
  }

  /**
   * Send order confirmation email
   */
  async sendOrderConfirmation({
    to,
    orderNumber,
    customerName,
    items,
    total,
    shippingAddress,
  }: {
    to: string;
    orderNumber: string;
    customerName: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
      image: string;
    }>;
    total: number;
    shippingAddress: {
      street: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
  }) {
    const subject = `Order Confirmation - ${orderNumber}`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { 
      font-family: 'IBM Plex Mono', monospace, Arial, sans-serif; 
      line-height: 1.6; 
      color: #000000;
      background-color: #FFFFFF;
      margin: 0;
      padding: 0;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      padding: 40px 20px;
    }
    .header {
      text-align: center;
      border-bottom: 1px solid #E5E5E5;
      padding-bottom: 30px;
      margin-bottom: 40px;
    }
    .logo {
      font-size: 32px;
      font-weight: 300;
      letter-spacing: 0.2em;
      color: #000000;
    }
    h1 {
      font-size: 24px;
      font-weight: 300;
      letter-spacing: 0.1em;
      margin: 0 0 10px 0;
    }
    .order-number {
      font-size: 14px;
      color: #525252;
      letter-spacing: 0.05em;
    }
    .section {
      margin: 30px 0;
      padding: 20px 0;
      border-bottom: 1px solid #F5F5F5;
    }
    .section:last-child {
      border-bottom: none;
    }
    .label {
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #525252;
      margin-bottom: 10px;
    }
    .value {
      font-size: 14px;
      color: #000000;
    }
    .items {
      margin: 20px 0;
    }
    .item {
      display: flex;
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid #F5F5F5;
    }
    .item:last-child {
      border-bottom: none;
    }
    .item-image {
      width: 80px;
      height: 80px;
      object-fit: cover;
      margin-right: 15px;
    }
    .item-details {
      flex: 1;
    }
    .item-name {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 5px;
    }
    .item-meta {
      font-size: 12px;
      color: #525252;
    }
    .total {
      text-align: right;
      font-size: 20px;
      font-weight: 600;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 2px solid #000000;
    }
    .button {
      display: inline-block;
      background-color: #000000;
      color: #FFFFFF;
      padding: 15px 40px;
      text-decoration: none;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 30px;
      border-top: 1px solid #E5E5E5;
      font-size: 12px;
      color: #A3A3A3;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="logo">NOWIHT</div>
    </div>

    <!-- Main Content -->
    <h1>ORDER CONFIRMED</h1>
    <p class="order-number">Order ${orderNumber}</p>

    <div class="section">
      <p>Hi ${customerName},</p>
      <p>Thank you for your order. We've received your order and will notify you when it ships.</p>
    </div>

    <!-- Order Items -->
    <div class="section">
      <div class="label">Order Items</div>
      <div class="items">
        ${items
        .map(
          (item) => `
          <div class="item">
            <img src="${item.image}" alt="${item.name}" class="item-image" />
            <div class="item-details">
              <div class="item-name">${item.name}</div>
              <div class="item-meta">Quantity: ${item.quantity} × $${item.price.toFixed(2)}</div>
            </div>
          </div>
        `
        )
        .join('')}
      </div>
      <div class="total">Total: $${total.toFixed(2)}</div>
    </div>

    <!-- Shipping Address -->
    <div class="section">
      <div class="label">Shipping Address</div>
      <div class="value">
        ${shippingAddress.street}<br>
        ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zip}<br>
        ${shippingAddress.country}
      </div>
    </div>

    <!-- CTA -->
    <div style="text-align: center;">
      <a href="https://nowiht.com/account/orders" class="button">VIEW ORDER</a>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>© ${new Date().getFullYear()} NOWIHT. All rights reserved.</p>
      <p>Premium Organic Women's Fashion</p>
    </div>
  </div>
</body>
</html>
    `;

    const text = `
Order Confirmation - ${orderNumber}

Hi ${customerName},

Thank you for your order. We've received your order and will notify you when it ships.

ORDER ITEMS:
${items.map((item) => `${item.name} - Quantity: ${item.quantity} × $${item.price.toFixed(2)}`).join('\n')}

Total: $${total.toFixed(2)}

SHIPPING ADDRESS:
${shippingAddress.street}
${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zip}
${shippingAddress.country}

View your order: https://nowiht.com/account/orders

---
© ${new Date().getFullYear()} NOWIHT. All rights reserved.
    `;

    return this.send({ to, subject, html, text });
  }

  /**
   * Send shipping notification email
   */
  async sendShippingNotification({
    to,
    orderNumber,
    customerName,
    trackingNumber,
    carrier,
  }: {
    to: string;
    orderNumber: string;
    customerName: string;
    trackingNumber: string;
    carrier: string;
  }) {
    const subject = `Your Order Has Shipped - ${orderNumber}`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { 
      font-family: 'IBM Plex Mono', monospace, Arial, sans-serif; 
      line-height: 1.6; 
      color: #000000;
      background-color: #FFFFFF;
      margin: 0;
      padding: 0;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      padding: 40px 20px;
    }
    .header {
      text-align: center;
      border-bottom: 1px solid #E5E5E5;
      padding-bottom: 30px;
      margin-bottom: 40px;
    }
    .logo {
      font-size: 32px;
      font-weight: 300;
      letter-spacing: 0.2em;
      color: #000000;
    }
    h1 {
      font-size: 24px;
      font-weight: 300;
      letter-spacing: 0.1em;
      margin: 0 0 10px 0;
    }
    .tracking-box {
      background-color: #F5F5F5;
      padding: 20px;
      text-align: center;
      margin: 20px 0;
    }
    .tracking-number {
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 0.05em;
      margin: 10px 0;
    }
    .button {
      display: inline-block;
      background-color: #000000;
      color: #FFFFFF;
      padding: 15px 40px;
      text-decoration: none;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 30px;
      border-top: 1px solid #E5E5E5;
      font-size: 12px;
      color: #A3A3A3;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">NOWIHT</div>
    </div>

    <h1>YOUR ORDER HAS SHIPPED</h1>

    <div class="section">
      <p>Hi ${customerName},</p>
      <p>Great news! Your order ${orderNumber} has been shipped and is on its way to you.</p>
    </div>

    <div class="tracking-box">
      <p style="margin: 0; font-size: 12px; color: #525252;">TRACKING NUMBER</p>
      <div class="tracking-number">${trackingNumber}</div>
      <p style="margin: 0; font-size: 12px; color: #525252;">Carrier: ${carrier}</p>
    </div>

    <div style="text-align: center;">
      <a href="https://nowiht.com/track?tracking=${trackingNumber}" class="button">TRACK ORDER</a>
    </div>

    <div class="footer">
      <p>© ${new Date().getFullYear()} NOWIHT. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;

    const text = `
Your Order Has Shipped - ${orderNumber}

Hi ${customerName},

Great news! Your order ${orderNumber} has been shipped and is on its way to you.

TRACKING NUMBER: ${trackingNumber}
Carrier: ${carrier}

Track your order: https://nowiht.com/track?tracking=${trackingNumber}

---
© ${new Date().getFullYear()} NOWIHT. All rights reserved.
    `;

    return this.send({ to, subject, html, text });
  }

  /**
   * Send order cancellation email
   * NEW: Added for cancel functionality
   */
  async sendOrderCancellation({
    to,
    orderNumber,
    customerName,
    refundAmount,
  }: {
    to: string;
    orderNumber: string;
    customerName: string;
    refundAmount: number;
  }) {
    const subject = `Order Cancelled - ${orderNumber}`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { 
      font-family: 'IBM Plex Mono', monospace, Arial, sans-serif; 
      line-height: 1.6; 
      color: #000000;
      background-color: #FFFFFF;
      margin: 0;
      padding: 0;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      padding: 40px 20px;
    }
    .header {
      text-align: center;
      border-bottom: 1px solid #E5E5E5;
      padding-bottom: 30px;
      margin-bottom: 40px;
    }
    .logo {
      font-size: 32px;
      font-weight: 300;
      letter-spacing: 0.2em;
      color: #000000;
    }
    h1 {
      font-size: 24px;
      font-weight: 300;
      letter-spacing: 0.1em;
      margin: 0 0 10px 0;
    }
    .order-number {
      font-size: 14px;
      color: #525252;
      letter-spacing: 0.05em;
    }
    .refund-box {
      background-color: #F5F5F5;
      padding: 20px;
      text-align: center;
      margin: 20px 0;
    }
    .refund-amount {
      font-size: 24px;
      font-weight: 600;
      margin: 10px 0;
    }
    .button {
      display: inline-block;
      background-color: #000000;
      color: #FFFFFF;
      padding: 15px 40px;
      text-decoration: none;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 30px;
      border-top: 1px solid #E5E5E5;
      font-size: 12px;
      color: #A3A3A3;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">NOWIHT</div>
    </div>

    <h1>ORDER CANCELLED</h1>
    <p class="order-number">Order ${orderNumber}</p>

    <div style="margin: 30px 0;">
      <p>Hi ${customerName},</p>
      <p>Your order has been successfully cancelled as requested.</p>
    </div>

    <div class="refund-box">
      <p style="margin: 0; font-size: 12px; color: #525252;">REFUND AMOUNT</p>
      <div class="refund-amount">$${refundAmount.toFixed(2)}</div>
      <p style="margin: 0; font-size: 12px; color: #525252;">Your refund will be processed within 5-7 business days</p>
    </div>

    <div style="margin: 30px 0;">
      <p>If you have any questions about your cancellation or refund, please don't hesitate to contact our customer support team.</p>
    </div>

    <div style="text-align: center;">
      <a href="https://nowiht.com/contact" class="button">CONTACT SUPPORT</a>
    </div>

    <div class="footer">
      <p>© ${new Date().getFullYear()} NOWIHT. All rights reserved.</p>
      <p>Premium Organic Women's Fashion</p>
    </div>
  </div>
</body>
</html>
    `;

    const text = `
Order Cancelled - ${orderNumber}

Hi ${customerName},

Your order has been successfully cancelled as requested.

REFUND AMOUNT: $${refundAmount.toFixed(2)}
Your refund will be processed within 5-7 business days.

If you have any questions, contact us: https://nowiht.com/contact

---
© ${new Date().getFullYear()} NOWIHT. All rights reserved.
    `;

    return this.send({ to, subject, html, text });
  }

  /**
   * Send return confirmation email
   * NEW: Added for return functionality
   */
  async sendReturnConfirmation({
    to,
    orderNumber,
    customerName,
    returnReason,
  }: {
    to: string;
    orderNumber: string;
    customerName: string;
    returnReason?: string;
  }) {
    const subject = `Return Request Received - ${orderNumber}`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { 
      font-family: 'IBM Plex Mono', monospace, Arial, sans-serif; 
      line-height: 1.6; 
      color: #000000;
      background-color: #FFFFFF;
      margin: 0;
      padding: 0;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      padding: 40px 20px;
    }
    .header {
      text-align: center;
      border-bottom: 1px solid #E5E5E5;
      padding-bottom: 30px;
      margin-bottom: 40px;
    }
    .logo {
      font-size: 32px;
      font-weight: 300;
      letter-spacing: 0.2em;
      color: #000000;
    }
    h1 {
      font-size: 24px;
      font-weight: 300;
      letter-spacing: 0.1em;
      margin: 0 0 10px 0;
    }
    .order-number {
      font-size: 14px;
      color: #525252;
      letter-spacing: 0.05em;
    }
    .info-box {
      background-color: #F5F5F5;
      padding: 20px;
      margin: 20px 0;
      border-left: 4px solid #000000;
    }
    .step {
      margin: 15px 0;
    }
    .step-number {
      display: inline-block;
      width: 24px;
      height: 24px;
      background-color: #000000;
      color: #FFFFFF;
      text-align: center;
      line-height: 24px;
      border-radius: 50%;
      font-size: 12px;
      font-weight: 600;
      margin-right: 10px;
    }
    .button {
      display: inline-block;
      background-color: #000000;
      color: #FFFFFF;
      padding: 15px 40px;
      text-decoration: none;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 30px;
      border-top: 1px solid #E5E5E5;
      font-size: 12px;
      color: #A3A3A3;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">NOWIHT</div>
    </div>

    <h1>RETURN REQUEST RECEIVED</h1>
    <p class="order-number">Order ${orderNumber}</p>

    <div style="margin: 30px 0;">
      <p>Hi ${customerName},</p>
      <p>We've received your return request and our team is reviewing it. You'll receive a shipping label via email within 24 hours.</p>
    </div>

    ${returnReason ? `
    <div class="info-box">
      <strong>Return Reason:</strong><br>
      ${returnReason}
    </div>
    ` : ''}

    <div style="margin: 30px 0;">
      <h2 style="font-size: 16px; font-weight: 600; letter-spacing: 0.05em; margin-bottom: 20px;">NEXT STEPS</h2>
      
      <div class="step">
        <span class="step-number">1</span>
        <span>Wait for your prepaid return shipping label (arriving within 24 hours)</span>
      </div>
      
      <div class="step">
        <span class="step-number">2</span>
        <span>Pack your items securely in the original packaging</span>
      </div>
      
      <div class="step">
        <span class="step-number">3</span>
        <span>Attach the shipping label and drop off at your nearest carrier location</span>
      </div>
      
      <div class="step">
        <span class="step-number">4</span>
        <span>You'll receive your refund within 5-7 business days after we receive your return</span>
      </div>
    </div>

    <div style="text-align: center;">
      <a href="https://nowiht.com/account/orders" class="button">VIEW ORDER STATUS</a>
    </div>

    <div class="footer">
      <p>© ${new Date().getFullYear()} NOWIHT. All rights reserved.</p>
      <p>Premium Organic Women's Fashion</p>
    </div>
  </div>
</body>
</html>
    `;

    const text = `
Return Request Received - ${orderNumber}

Hi ${customerName},

We've received your return request and our team is reviewing it. You'll receive a shipping label via email within 24 hours.

${returnReason ? `Return Reason: ${returnReason}\n` : ''}
NEXT STEPS:
1. Wait for your prepaid return shipping label (arriving within 24 hours)
2. Pack your items securely in the original packaging
3. Attach the shipping label and drop off at your nearest carrier location
4. You'll receive your refund within 5-7 business days after we receive your return

View order status: https://nowiht.com/account/orders

---
© ${new Date().getFullYear()} NOWIHT. All rights reserved.
    `;

    return this.send({ to, subject, html, text });
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail({
    to,
    name,
  }: {
    to: string;
    name: string;
  }) {
    const subject = 'Welcome to NOWIHT';

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { 
      font-family: 'IBM Plex Mono', monospace, Arial, sans-serif; 
      line-height: 1.6; 
      color: #000000;
      background-color: #FFFFFF;
      margin: 0;
      padding: 0;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      padding: 40px 20px;
    }
    .header {
      text-align: center;
      border-bottom: 1px solid #E5E5E5;
      padding-bottom: 30px;
      margin-bottom: 40px;
    }
    .logo {
      font-size: 32px;
      font-weight: 300;
      letter-spacing: 0.2em;
      color: #000000;
    }
    h1 {
      font-size: 24px;
      font-weight: 300;
      letter-spacing: 0.1em;
      margin: 0 0 10px 0;
    }
    .button {
      display: inline-block;
      background-color: #000000;
      color: #FFFFFF;
      padding: 15px 40px;
      text-decoration: none;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 30px;
      border-top: 1px solid #E5E5E5;
      font-size: 12px;
      color: #A3A3A3;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">NOWIHT</div>
    </div>

    <h1>WELCOME TO NOWIHT</h1>

    <p>Hi ${name},</p>
    <p>Welcome to NOWIHT - where luxury meets sustainability. We're thrilled to have you join our community of conscious fashion lovers.</p>
    
    <p>Explore our collection of premium organic women's athleisure, crafted with care for you and the planet.</p>

    <div style="text-align: center;">
      <a href="https://nowiht.com/shop" class="button">START SHOPPING</a>
    </div>

    <div class="footer">
      <p>© ${new Date().getFullYear()} NOWIHT. All rights reserved.</p>
      <p>Premium Organic Women's Fashion</p>
    </div>
  </div>
</body>
</html>
    `;

    const text = `
Welcome to NOWIHT

Hi ${name},

Welcome to NOWIHT - where luxury meets sustainability. We're thrilled to have you join our community of conscious fashion lovers.

Explore our collection: https://nowiht.com/shop

---
© ${new Date().getFullYear()} NOWIHT. All rights reserved.
    `;

    return this.send({ to, subject, html, text });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail({
    to,
    resetToken,
  }: {
    to: string;
    resetToken: string;
  }) {
    const resetUrl = `https://nowiht.com/reset-password?token=${resetToken}`;
    const subject = 'Reset Your Password';

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { 
      font-family: 'IBM Plex Mono', monospace, Arial, sans-serif; 
      line-height: 1.6; 
      color: #000000;
      background-color: #FFFFFF;
      margin: 0;
      padding: 0;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      padding: 40px 20px;
    }
    .header {
      text-align: center;
      border-bottom: 1px solid #E5E5E5;
      padding-bottom: 30px;
      margin-bottom: 40px;
    }
    .logo {
      font-size: 32px;
      font-weight: 300;
      letter-spacing: 0.2em;
      color: #000000;
    }
    h1 {
      font-size: 24px;
      font-weight: 300;
      letter-spacing: 0.1em;
      margin: 0 0 10px 0;
    }
    .button {
      display: inline-block;
      background-color: #000000;
      color: #FFFFFF;
      padding: 15px 40px;
      text-decoration: none;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      margin: 20px 0;
    }
    .warning {
      background-color: #FEF3C7;
      border-left: 4px solid #F59E0B;
      padding: 15px;
      margin: 20px 0;
      font-size: 13px;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 30px;
      border-top: 1px solid #E5E5E5;
      font-size: 12px;
      color: #A3A3A3;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">NOWIHT</div>
    </div>

    <h1>RESET YOUR PASSWORD</h1>

    <p>We received a request to reset your password. Click the button below to create a new password:</p>

    <div style="text-align: center;">
      <a href="${resetUrl}" class="button">RESET PASSWORD</a>
    </div>

    <div class="warning">
      <strong>Security Notice:</strong><br>
      This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
    </div>

    <div class="footer">
      <p>© ${new Date().getFullYear()} NOWIHT. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;

    const text = `
Reset Your Password

We received a request to reset your password. Click the link below to create a new password:

${resetUrl}

This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.

---
© ${new Date().getFullYear()} NOWIHT. All rights reserved.
    `;

    return this.send({ to, subject, html, text });
  }
}

// Export singleton instance
export const EmailService = new EmailServiceClass();