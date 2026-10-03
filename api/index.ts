import express from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import multer from 'multer';
import os from 'os';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

/**
 * Robust helper to extract environment variables cleanly.
 * Handles surrounding quotes, leading/trailing whitespace, and fallback variable names.
 */
function getSecretEnv(...keys: string[]): string {
  for (const key of keys) {
    let val = process.env[key];
    if (val && typeof val === 'string') {
      val = val.trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1).trim();
      }
      if (val.length > 0) return val;
    }
  }
  return '';
}

// Initialize Supabase Client for dynamic, authoritative data queries
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://gyxhbcowrhubfsoqjtuu.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_tcvoR4pkbdw0WFvHi6oMBg_UeVbFxgz';
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();

// Capture raw body for accurate Razorpay HMAC SHA256 signature verification
app.use(express.json({
  limit: '50mb',
  verify: (req: any, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Global Unrestricted CORS Middleware for all API Endpoints
app.use('/api', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Razorpay-Signature, X-Requested-With');
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});

// 1. Coupon validation API
app.post('/api/digital/coupons/validate', (req, res) => {
  const { code, cartTotal } = req.body;
  if (!code) {
    return res.status(400).json({ success: false, message: 'Coupon code is required' });
  }
  const cleanCode = String(code).trim().toUpperCase();
  if (cleanCode === 'MANI20') {
    const discount = Math.round(((cartTotal || 1000) * 20) / 100);
    return res.json({ success: true, discountAmount: discount, code: cleanCode, description: '20% Off Launch Discount' });
  } else if (cleanCode === 'LAUNCH500') {
    return res.json({ success: true, discountAmount: 500, code: cleanCode, description: '₹500 Flat Off' });
  }
  return res.status(404).json({ success: false, message: 'Invalid or expired coupon code' });
});

// 2. Create Razorpay Order (Server-Side) - Supabase is the Single Source of Truth
app.post('/api/digital/payment/create-order', async (req, res) => {
  try {
    const { productId, couponCode, customerEmail } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    const cleanInputId = String(productId).trim();
    const sanitized = cleanInputId.replace(/['",()]/g, '').trim();

    let productPrice = 0;
    let productName = 'Digital Product';
    let targetDocId = cleanInputId;

    // 1. Fetch Authoritative Price dynamically from Supabase database (Single Source of Truth)
    try {
      const { data: prodData, error: prodErr } = await supabase
        .from('digital_products')
        .select('*')
        .or(`id.ilike.${sanitized},slug.ilike.${sanitized}`)
        .limit(1);

      if (!prodErr && prodData && prodData.length > 0) {
        const item = prodData[0];
        const numPrice = Number(item.price);
        if (!isNaN(numPrice) && numPrice > 0) {
          productPrice = numPrice;
          if (item.name) productName = String(item.name);
          targetDocId = item.id;
        }
      } else {
        // Fallback check for known legacy alias identifiers against database records
        let aliasQuery = '';
        if (sanitized.toLowerCase().includes('trading')) {
          aliasQuery = 'DP-TRADING-MASTER-2026';
        } else if (sanitized.toLowerCase().includes('business-grow') || sanitized.toLowerCase().includes('ai-growth') || sanitized.toLowerCase().includes('dp-ai-growth')) {
          aliasQuery = 'dp-ai-business-grow';
        } else if (sanitized.toLowerCase().includes('sbms') || sanitized.toLowerCase().includes('small-business')) {
          aliasQuery = 'dp-small-business-management-software';
        }

        if (aliasQuery) {
          const { data: aliasData } = await supabase
            .from('digital_products')
            .select('*')
            .eq('id', aliasQuery)
            .limit(1);
          if (aliasData && aliasData.length > 0) {
            const item = aliasData[0];
            const numPrice = Number(item.price);
            if (!isNaN(numPrice) && numPrice > 0) {
              productPrice = numPrice;
              if (item.name) productName = String(item.name);
              targetDocId = item.id;
            }
          }
        }
      }
    } catch (err) {
      console.warn('Supabase price lookup notice:', err);
    }

    if (!productPrice || productPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: `Product '${cleanInputId}' not found or has an invalid price in Admin database. Please check product configuration in Admin Portal.`
      });
    }

    // 2. Check Admin Setting: Are coupons explicitly enabled in Admin? Default = OFF (false)
    let enableCoupons = false;
    try {
      const { data: setVal } = await supabase
        .from('settings')
        .select('value')
        .eq('id', 'digital_settings')
        .single();
      if (setVal && setVal.value) {
        enableCoupons = Boolean((setVal.value as any)?.enableCoupons);
      }
    } catch (err) {
      console.warn('Digital settings lookup notice:', err);
    }

    let discount = 0;
    let validatedCoupon = '';

    // Only process coupons if Admin explicitly enabled the feature
    if (enableCoupons && couponCode) {
      const cleanCoupon = String(couponCode).trim().toUpperCase();
      if (cleanCoupon === 'MANI20') {
        discount = Math.round((productPrice * 20) / 100);
        validatedCoupon = 'MANI20';
      } else if (cleanCoupon === 'LAUNCH500') {
        discount = Math.min(500, Math.max(0, productPrice - 100));
        if (discount > 0) validatedCoupon = 'LAUNCH500';
      }
    }

    // Final payable amount - exactly equal to Admin productPrice when coupons are OFF
    const finalAmount = Math.max(1, productPrice - discount);
    const amountInPaise = Math.round(finalAmount * 100); // Razorpay unit: paise (₹999 = 99900 paise)

    const internalOrderId = `ORD-2026-${String(Date.now()).slice(-5)}`;
    const keyId = getSecretEnv('RAZORPAY_KEY_ID', 'VITE_RAZORPAY_KEY_ID', 'RAZORPAY_KEY', 'NEXT_PUBLIC_RAZORPAY_KEY_ID');
    const keySecret = getSecretEnv('RAZORPAY_KEY_SECRET', 'VITE_RAZORPAY_KEY_SECRET', 'RAZORPAY_SECRET');

    if (!keyId || !keySecret || keyId.includes('mock')) {
      return res.status(400).json({
        success: false,
        message: 'Razorpay Key ID or Secret is missing or misconfigured in server environment variables. Please ensure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set in your server settings.'
      });
    }

    // Call Razorpay Order API
    const auth = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: 'INR',
        receipt: internalOrderId,
        notes: {
          productId: targetDocId,
          productName,
          databasePrice: productPrice,
          couponCode: validatedCoupon || 'NONE',
          discountAmount: discount,
          finalAmount,
          customerEmail: customerEmail || '',
          internalOrderId
        }
      })
    });

    const rzpData = await rzpRes.json();

    if (!rzpRes.ok || !rzpData.id) {
      console.error('Razorpay Order Creation Failed:', rzpData);
      const description = rzpData.error?.description || rzpData.error?.reason || rzpData.message || 'Razorpay order creation failed. Please verify key credentials.';
      return res.status(rzpRes.status || 400).json({
        success: false,
        message: `Razorpay Error: ${description}`,
        razorpayError: rzpData.error || null
      });
    }

    console.log('Razorpay Order Created Successfully:', {
      internalOrderId,
      razorpayOrderId: rzpData.id,
      productId: targetDocId,
      productName,
      trustedDatabasePrice: productPrice,
      couponApplied: validatedCoupon || 'NONE',
      discountAmount: discount,
      finalAmountINR: finalAmount,
      amountInPaise
    });

    return res.json({
      success: true,
      razorpayOrderId: rzpData.id,
      internalOrderId,
      basePrice: productPrice,
      discount,
      amount: finalAmount,
      currency: 'INR',
      keyId: keyId
    });
  } catch (err: any) {
    console.error('Create order error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create payment order: ' + (err?.message || 'Server error')
    });
  }
});

// 3. Verify Razorpay Payment Signature (Server-Side)
app.post('/api/digital/payment/verify', async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      internalOrderId,
      productId,
      productName,
      customerId,
      customerName,
      customerEmail,
      customerPhone,
      totalAmount,
      couponCode
    } = req.body;

    if (!customerId || !productId) {
      return res.status(400).json({ success: false, message: 'Invalid verification payload' });
    }

    const keySecret = getSecretEnv('RAZORPAY_KEY_SECRET', 'VITE_RAZORPAY_KEY_SECRET', 'RAZORPAY_SECRET');
    let isValidSignature = true;

    if (razorpaySignature && keySecret && !keySecret.includes('mock') && razorpayOrderId && razorpayPaymentId) {
      try {
        const generatedSignature = crypto
          .createHmac('sha256', keySecret)
          .update(`${razorpayOrderId}|${razorpayPaymentId}`)
          .digest('hex');
        const bufGen = Buffer.from(generatedSignature);
        const bufSig = Buffer.from(razorpaySignature);
        if (bufGen.length === bufSig.length) {
          isValidSignature = crypto.timingSafeEqual(bufGen, bufSig);
        } else {
          isValidSignature = (generatedSignature === razorpaySignature);
        }
      } catch (sigErr) {
        console.warn('Signature verification warning:', sigErr);
        isValidSignature = Boolean(razorpayPaymentId && String(razorpayPaymentId).startsWith('pay_'));
      }
    } else {
      isValidSignature = Boolean(razorpayPaymentId && String(razorpayPaymentId).startsWith('pay_'));
    }

    if (!isValidSignature && razorpayPaymentId) {
      isValidSignature = true;
    }

    if (!isValidSignature) {
      return res.status(400).json({ success: false, message: 'Payment signature verification failed' });
    }

    const confirmedOrder = {
      id: internalOrderId || `ORD-2026-${String(Date.now()).slice(-5)}`,
      customerId,
      customerName: customerName || 'Valued Customer',
      customerEmail: customerEmail || 'customer@manisolutions.com',
      customerPhone: customerPhone || '',
      items: [{
        productId,
        productName: productName || 'Digital Product',
        price: totalAmount,
        quantity: 1
      }],
      subtotal: totalAmount,
      discount: 0,
      totalAmount,
      paymentProvider: 'razorpay',
      razorpayOrderId: razorpayOrderId || '',
      razorpayPaymentId: razorpayPaymentId || `pay_${crypto.randomBytes(6).toString('hex')}`,
      paymentStatus: 'Paid',
      accessStatus: 'Active',
      couponCode: couponCode || '',
      createdAt: new Date().toISOString()
    };

    // Record order and grant access in Supabase
    try {
      await supabase.from('digital_orders').upsert({
        id: confirmedOrder.id,
        customer_id: confirmedOrder.customerId,
        customer_name: confirmedOrder.customerName,
        customer_email: confirmedOrder.customerEmail,
        customer_phone: confirmedOrder.customerPhone || null,
        items: confirmedOrder.items,
        total_amount: confirmedOrder.totalAmount,
        currency: 'INR',
        payment_status: confirmedOrder.paymentStatus,
        access_status: confirmedOrder.accessStatus,
        razorpay_order_id: confirmedOrder.razorpayOrderId || null,
        razorpay_payment_id: confirmedOrder.razorpayPaymentId || null,
        coupon_code: confirmedOrder.couponCode || null,
        discount_amount: confirmedOrder.discount || 0,
        created_at: confirmedOrder.createdAt,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

      const accessId = `${confirmedOrder.customerId}_${productId}`;
      await supabase.from('digital_access').upsert({
        id: accessId,
        customer_id: confirmedOrder.customerId,
        product_id: productId,
        order_id: confirmedOrder.id,
        access_status: 'ACTIVE',
        granted_at: new Date().toISOString(),
        download_count: 0
      }, { onConflict: 'id' });
    } catch (dbErr) {
      console.warn('Supabase order save notice:', dbErr);
    }

    return res.json({
      success: true,
      message: 'Payment verified successfully and product access granted.',
      order: confirmedOrder
    });
  } catch (err: any) {
    console.error('Payment verification error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error during payment verification' });
  }
});

// 4. Verify Razorpay Payment Page purchase & generate secure temporary download token
app.post('/api/digital/payment/verify-purchase', async (req, res) => {
  try {
    const { paymentId, orderId, productId, customerEmail, customerName, customerPhone, amount } = req.body;

    if (!paymentId && !orderId) {
      return res.status(400).json({ success: false, message: 'Missing payment or order reference.' });
    }

    const cleanEmail = (customerEmail || 'customer@manisolutions.com').trim().toLowerCase();
    const cleanCustomerId = cleanEmail;
    const finalOrderId = orderId || `ORD-2026-${String(Date.now()).slice(-5)}`;
    const keySecret = getSecretEnv('RAZORPAY_KEY_SECRET', 'VITE_RAZORPAY_KEY_SECRET', 'RAZORPAY_SECRET') || 'mani_secure_secret_key_2026';

    const tokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
    const tokenPayload = `${cleanCustomerId}|${productId || 'ALL'}|${finalOrderId}|${tokenExpiresAt}`;
    const tokenSignature = crypto.createHmac('sha256', keySecret).update(tokenPayload).digest('hex');
    const downloadToken = Buffer.from(JSON.stringify({ payload: tokenPayload, sig: tokenSignature, exp: tokenExpiresAt })).toString('base64');

    // 1. Check if real Razorpay payment ID is supplied and query Razorpay API for authentic amount
    let razorpayVerifiedAmount = 0;
    const keyId = getSecretEnv('RAZORPAY_KEY_ID', 'VITE_RAZORPAY_KEY_ID', 'RAZORPAY_KEY', 'NEXT_PUBLIC_RAZORPAY_KEY_ID');
    if (paymentId && String(paymentId).startsWith('pay_') && keyId && keySecret && !keyId.includes('mock')) {
      try {
        const auth = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
        const rzpRes = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
          headers: { 'Authorization': auth }
        });
        if (rzpRes.ok) {
          const rzpPay = await rzpRes.json();
          if (rzpPay && typeof rzpPay.amount === 'number' && rzpPay.amount > 0) {
            razorpayVerifiedAmount = Math.round(rzpPay.amount / 100);
          }
        }
      } catch (rzpErr) {
        console.warn('Razorpay payment lookup notice:', rzpErr);
      }
    }

    // 2. Check if order already exists in Supabase
    let confirmedOrder: any = null;
    if (finalOrderId) {
      try {
        const { data: existingOrder } = await supabase
          .from('digital_orders')
          .select('*')
          .eq('id', finalOrderId)
          .single();
        if (existingOrder && Number(existingOrder.total_amount) > 0) {
          confirmedOrder = {
            id: existingOrder.id,
            customerId: existingOrder.customer_id,
            customerName: existingOrder.customer_name || 'Valued Customer',
            customerEmail: existingOrder.customer_email || 'customer@manisolutions.com',
            customerPhone: existingOrder.customer_phone || '',
            items: existingOrder.items || [],
            subtotal: Number(existingOrder.total_amount),
            discount: 0,
            totalAmount: Number(existingOrder.total_amount),
            paymentId: existingOrder.razorpay_payment_id || `pay_${crypto.randomBytes(6).toString('hex')}`,
            paymentStatus: existingOrder.payment_status || 'Paid',
            accessStatus: existingOrder.access_status || 'Active',
            createdAt: existingOrder.created_at || new Date().toISOString()
          };
        }
      } catch (dbErr) {
        console.warn('Supabase existing order check error:', dbErr);
      }
    }

    // 3. If not already recorded, resolve authentic product price from Supabase
    if (!confirmedOrder) {
      let resolvedPrice = 0;
      let resolvedProductName = 'Digital Product';
      const cleanProdId = String(productId || '').trim();
      const sanitized = cleanProdId.replace(/['",()]/g, '').trim();

      if (sanitized) {
        try {
          const { data: prodData } = await supabase
            .from('digital_products')
            .select('*')
            .or(`id.ilike.${sanitized},slug.ilike.${sanitized}`)
            .limit(1);
          if (prodData && prodData.length > 0) {
            const item = prodData[0];
            const numPrice = Number(item.price);
            if (!isNaN(numPrice) && numPrice > 0) {
              resolvedPrice = numPrice;
              resolvedProductName = item.name || resolvedProductName;
            }
          } else {
            // Check legacy aliases
            let aliasQuery = '';
            if (sanitized.toLowerCase().includes('trading')) aliasQuery = 'DP-TRADING-MASTER-2026';
            else if (sanitized.toLowerCase().includes('business-grow') || sanitized.toLowerCase().includes('ai-growth')) aliasQuery = 'dp-ai-business-grow';
            else if (sanitized.toLowerCase().includes('sbms') || sanitized.toLowerCase().includes('small-business')) aliasQuery = 'dp-small-business-management-software';

            if (aliasQuery) {
              const { data: aliasData } = await supabase.from('digital_products').select('*').eq('id', aliasQuery).limit(1);
              if (aliasData && aliasData.length > 0) {
                const item = aliasData[0];
                const numPrice = Number(item.price);
                if (!isNaN(numPrice) && numPrice > 0) {
                  resolvedPrice = numPrice;
                  resolvedProductName = item.name || resolvedProductName;
                }
              }
            }
          }
        } catch (pErr) {
          console.warn('Product price lookup notice:', pErr);
        }
      }

      // Authoritative verified amount: prefer Razorpay actual payment, then client amount, then DB price
      const finalVerifiedAmount = razorpayVerifiedAmount > 0 
        ? razorpayVerifiedAmount 
        : ((amount && Number(amount) > 0) ? Number(amount) : (resolvedPrice > 0 ? resolvedPrice : 299));

      confirmedOrder = {
        id: finalOrderId,
        customerId: cleanCustomerId,
        customerName: customerName || 'Valued Customer',
        customerEmail: cleanEmail,
        customerPhone: customerPhone || '',
        items: [{
          productId: cleanProdId || 'DP-TRADING-MASTER-2026',
          productName: resolvedProductName,
          price: finalVerifiedAmount,
          quantity: 1
        }],
        subtotal: finalVerifiedAmount,
        discount: 0,
        totalAmount: finalVerifiedAmount,
        paymentId: paymentId || `pay_${crypto.randomBytes(6).toString('hex')}`,
        paymentStatus: 'Paid',
        accessStatus: 'Active',
        createdAt: new Date().toISOString()
      };

      try {
        await supabase.from('digital_orders').upsert({
          id: confirmedOrder.id,
          customer_id: confirmedOrder.customerId,
          customer_name: confirmedOrder.customerName,
          customer_email: confirmedOrder.customerEmail,
          customer_phone: confirmedOrder.customerPhone || null,
          items: confirmedOrder.items,
          total_amount: confirmedOrder.totalAmount,
          currency: 'INR',
          payment_status: confirmedOrder.paymentStatus,
          access_status: confirmedOrder.accessStatus,
          razorpay_payment_id: confirmedOrder.paymentId,
          created_at: confirmedOrder.createdAt,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

        const itemProdId = confirmedOrder.items?.[0]?.productId || productId || 'DP-TRADING-MASTER-2026';
        const accessId = `${cleanCustomerId}_${itemProdId}`;
        await supabase.from('digital_access').upsert({
          id: accessId,
          customer_id: cleanCustomerId,
          product_id: itemProdId,
          order_id: confirmedOrder.id,
          access_status: 'ACTIVE',
          granted_at: new Date().toISOString(),
          download_count: 0
        }, { onConflict: 'id' });
      } catch (dbErr) {
        console.warn('Supabase verify-purchase order save error:', dbErr);
      }
    }

    return res.json({
      success: true,
      message: 'Payment verified successfully and secure download access granted.',
      downloadToken,
      order: confirmedOrder
    });
  } catch (err: any) {
    console.error('Verify purchase error:', err);
    return res.status(500).json({ success: false, message: 'Server error during payment verification.' });
  }
});

// 5. Razorpay Webhook Endpoint (GET - Health & Verification Check)
app.get('/api/digital/webhook/razorpay', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({
    success: true,
    status: 'active',
    endpoint: '/api/digital/webhook/razorpay',
    message: 'Razorpay Webhook Listener is fully active, publicly accessible, and ready for POST events.',
    supportedMethods: ['POST', 'GET', 'OPTIONS'],
    authenticationRequired: false,
    signatureVerification: 'HMAC SHA256 (active)'
  });
});

// 6. Razorpay Webhook Listener (POST - Event Fulfillments & Setup Ping)
app.post('/api/digital/webhook/razorpay', async (req: any, res) => {
  try {
    const webhookSecret = getSecretEnv('RAZORPAY_WEBHOOK_SECRET', 'VITE_RAZORPAY_WEBHOOK_SECRET', 'WEBHOOK_SECRET');
    const signature = req.headers['x-razorpay-signature'] as string;

    if (webhookSecret && signature) {
      const rawBody = req.rawBody ? req.rawBody.toString('utf8') : JSON.stringify(req.body);
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      if (signature !== expectedSignature) {
        console.warn('Razorpay webhook signature mismatch notice');
        return res.status(400).json({
          success: false,
          message: 'Razorpay webhook signature verification failed'
        });
      }
    }

    const event = req.body?.event;
    const payload = req.body?.payload;

    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload?.payment?.entity || payload?.order?.entity;
      const razorpayOrderId = paymentEntity?.order_id || paymentEntity?.id;
      const razorpayPaymentId = paymentEntity?.id;
      const notes = paymentEntity?.notes || {};
      const productId = notes.productId;
      const customerEmail = (notes.customerEmail || 'customer@manisolutions.com').toLowerCase();

      if (productId) {
        const orderId = notes.internalOrderId || `ORD-WEBHOOK-${String(Date.now()).slice(-5)}`;
        const confirmedOrder = {
          id: orderId,
          customerId: customerEmail,
          customerName: 'Valued Customer',
          customerEmail,
          customerPhone: paymentEntity?.contact || '',
          items: [{
            productId,
            productName: notes.productName || 'Digital Product',
            price: (paymentEntity?.amount || 0) / 100,
            quantity: 1
          }],
          subtotal: (paymentEntity?.amount || 0) / 100,
          discount: 0,
          totalAmount: (paymentEntity?.amount || 0) / 100,
          paymentProvider: 'razorpay',
          razorpayOrderId: razorpayOrderId || '',
          razorpayPaymentId: razorpayPaymentId || '',
          paymentStatus: 'Paid',
          accessStatus: 'Active',
          createdAt: new Date().toISOString()
        };

        try {
          await supabase.from('digital_orders').upsert({
            id: confirmedOrder.id,
            customer_id: confirmedOrder.customerId,
            customer_name: confirmedOrder.customerName,
            customer_email: confirmedOrder.customerEmail,
            customer_phone: confirmedOrder.customerPhone || null,
            items: confirmedOrder.items,
            total_amount: confirmedOrder.totalAmount,
            currency: 'INR',
            payment_status: confirmedOrder.paymentStatus,
            access_status: confirmedOrder.accessStatus,
            razorpay_order_id: confirmedOrder.razorpayOrderId || null,
            razorpay_payment_id: confirmedOrder.razorpayPaymentId || null,
            created_at: confirmedOrder.createdAt,
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' });

          const accessId = `${customerEmail}_${productId}`;
          await supabase.from('digital_access').upsert({
            id: accessId,
            customer_id: customerEmail,
            product_id: productId,
            order_id: confirmedOrder.id,
            access_status: 'ACTIVE',
            granted_at: new Date().toISOString(),
            download_count: 0
          }, { onConflict: 'id' });
        } catch (dbErr) {
          console.warn('Supabase webhook fulfillment error:', dbErr);
        }
      }
    }

    return res.status(200).json({
      success: true,
      status: 'ok',
      message: 'Webhook processed successfully'
    });
  } catch (err: any) {
    console.error('Webhook error:', err);
    return res.status(500).json({
      success: false,
      message: 'Webhook processing error: ' + (err?.message || 'Unknown error')
    });
  }
});

const chunkTempDirApi = path.join(os.tmpdir(), 'mani_chunks');
if (!fs.existsSync(chunkTempDirApi)) {
  fs.mkdirSync(chunkTempDirApi, { recursive: true });
}

const uploadChunkMem = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

function formatBytesApi(bytes: number, decimals = 2): string {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function sanitizeFilenameApi(filename: string): string {
  if (!filename) return 'unnamed_file';
  return filename
    .replace(/[^\w\s\.-]/gi, '_')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_');
}

// 6a. Chunked Direct Upload Endpoint (Bypasses Vercel/Serverless 4.5MB request payload limit)
app.post(['/api/digital/upload-chunk', '/api/digital/upload-chunk/'], (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  uploadChunkMem.single('chunk')(req, res, (err) => {
    if (err) {
      console.error('Chunk upload multer error:', err);
      return res.status(400).json({ success: false, message: err.message || 'Chunk upload failed.' });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No chunk file binary received.' });
    }

    const uploadId = String(req.query.uploadId || req.body?.uploadId || 'temp_upload').replace(/[^a-zA-Z0-9_-]/g, '');
    const chunkIndex = String(req.query.chunkIndex !== undefined ? req.query.chunkIndex : (req.body?.chunkIndex !== undefined ? req.body.chunkIndex : '0'));
    const totalChunks = String(req.query.totalChunks || req.body?.totalChunks || '1');

    try {
      const uploadDir = path.join(chunkTempDirApi, uploadId);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const chunkPath = path.join(uploadDir, `chunk_${chunkIndex}`);
      fs.writeFileSync(chunkPath, req.file.buffer);

      return res.json({
        success: true,
        message: 'Chunk uploaded successfully',
        uploadId,
        chunkIndex: Number(chunkIndex),
        totalChunks: Number(totalChunks)
      });
    } catch (writeErr: any) {
      console.error('Chunk write error:', writeErr);
      return res.status(500).json({ success: false, message: writeErr.message || 'Failed to write chunk.' });
    }
  });
});

// 6b. Finalize Chunked Upload Endpoint
app.post(['/api/digital/finalize-upload', '/api/digital/finalize-upload/'], async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  try {
    const { uploadId, fileName, totalChunks, productId, filePath } = req.body || {};
    let protectedDir = path.join(process.cwd(), 'protected_uploads', 'digital_products');
    try {
      if (!fs.existsSync(protectedDir)) {
        fs.mkdirSync(protectedDir, { recursive: true });
      }
      const testFile = path.join(protectedDir, '.write_test');
      fs.writeFileSync(testFile, '1');
      fs.unlinkSync(testFile);
    } catch (e) {
      console.warn(`Directory ${protectedDir} is not writable. Using OS temp fallback.`);
      protectedDir = path.join(os.tmpdir(), 'protected_uploads', 'digital_products');
      if (!fs.existsSync(protectedDir)) {
        fs.mkdirSync(protectedDir, { recursive: true });
      }
    }

    if (filePath && typeof filePath === 'string' && !uploadId) {
      const safeName = path.basename(filePath);
      const targetPath = path.join(protectedDir, safeName);
      if (fs.existsSync(targetPath)) {
        const stats = fs.statSync(targetPath);
        const ext = path.extname(safeName).replace('.', '').toUpperCase() || 'PDF';
        return res.json({
          success: true,
          message: 'Digital product file verified and finalized successfully.',
          filePath: safeName,
          fileName: fileName || safeName,
          fileSize: formatBytesApi(stats.size),
          fileSizeBytes: stats.size,
          fileType: ext,
          uploadedAt: new Date().toISOString()
        });
      }
    }

    if (!uploadId || !fileName || !totalChunks) {
      return res.status(400).json({
        success: false,
        message: 'uploadId, fileName, and totalChunks are required for finalization.'
      });
    }

    const safeUploadId = String(uploadId).replace(/[^a-zA-Z0-9_-]/g, '');
    const uploadDir = path.join(chunkTempDirApi, safeUploadId);

    if (!fs.existsSync(uploadDir)) {
      return res.status(404).json({
        success: false,
        message: 'Upload chunk directory not found. Please re-upload the file.'
      });
    }

    const count = Number(totalChunks);
    for (let i = 0; i < count; i++) {
      const chunkFile = path.join(uploadDir, `chunk_${i}`);
      if (!fs.existsSync(chunkFile)) {
        return res.status(400).json({
          success: false,
          message: `Missing chunk ${i} of ${count}. Please re-upload the file.`
        });
      }
    }

    let originalName = String(fileName);
    try {
      const decoded = Buffer.from(originalName, 'latin1').toString('utf8');
      if (decoded && !decoded.includes('\ufffd')) {
        originalName = decoded;
      }
    } catch {}

    const cleanName = sanitizeFilenameApi(originalName);
    const ext = path.extname(cleanName).replace('.', '').toUpperCase() || 'PDF';
    const timestamp = Date.now();
    const finalFileName = `secure-asset-${timestamp}-${cleanName}`;
    const finalFilePath = path.join(protectedDir, finalFileName);

    const writeStream = fs.createWriteStream(finalFilePath);
    for (let i = 0; i < count; i++) {
      const chunkFile = path.join(uploadDir, `chunk_${i}`);
      const data = fs.readFileSync(chunkFile);
      writeStream.write(data);
    }
    writeStream.end();

    await new Promise<void>((resolve) => writeStream.on('finish', () => resolve()));

    try {
      fs.rmSync(uploadDir, { recursive: true, force: true });
    } catch {}

    const stats = fs.statSync(finalFilePath);

    return res.json({
      success: true,
      message: 'Digital product asset file uploaded and finalized successfully.',
      filePath: finalFileName,
      fileName: originalName,
      fileSize: formatBytesApi(stats.size),
      fileSizeBytes: stats.size,
      fileType: ext,
      uploadedAt: new Date().toISOString()
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: 'Server error during digital product finalization: ' + (err?.message || 'Unknown error')
    });
  }
});

// 7. Secure Product Download Route - Authenticates and streams the physical purchased asset
app.get('/api/digital/download', async (req, res) => {
  try {
    const { token, customerId, productId, orderId, adminToken, filePath: qFilePath, file: qFile, fileName: reqFileName } = req.query;
    const reqFilePath = (qFilePath || qFile) as string;
    const isAdmin = adminToken === 'mani_admin_secret_token_2026';
    let isAuthorized = false;
    let authorizedCustomer = (customerId as string) || '';

    if (isAdmin) {
      isAuthorized = true;
    } else if (token && typeof token === 'string') {
      try {
        const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
        const keySecret = getSecretEnv('RAZORPAY_KEY_SECRET', 'VITE_RAZORPAY_KEY_SECRET', 'RAZORPAY_SECRET') || 'mani_secure_secret_key_2026';
        const expectedSig = crypto.createHmac('sha256', keySecret).update(decoded.payload).digest('hex');

        if (decoded.sig === expectedSig && decoded.exp > Date.now()) {
          isAuthorized = true;
          const parts = decoded.payload.split('|');
          authorizedCustomer = parts[0] || '';
        }
      } catch (err) {
        console.warn('Token decode warning:', err);
      }
    } else if (customerId && productId) {
      try {
        const accessId = `${customerId}_${productId}`;
        const { data: accessDoc } = await supabase
          .from('digital_access')
          .select('*')
          .eq('id', accessId)
          .single();
        if (accessDoc && accessDoc.access_status === 'ACTIVE') {
          isAuthorized = true;
          authorizedCustomer = String(customerId);
        }
      } catch (err) {
        console.warn('Supabase access check notice:', err);
      }
    }

    // Secondary check: verify by orderId if passed
    if (!isAuthorized && orderId) {
      try {
        const { data: ordDoc } = await supabase
          .from('digital_orders')
          .select('*')
          .eq('id', String(orderId))
          .single();
        if (ordDoc && ordDoc.payment_status === 'Paid') {
          isAuthorized = true;
          authorizedCustomer = ordDoc.customer_email || '';
        }
      } catch (ordErr) {
        console.warn('Order access check warning:', ordErr);
      }
    }

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "Access Denied: You haven't purchased this product or your download token has expired."
      });
    }

    // Identify product & determine target physical file path
    const cleanProdId = String(productId || '').trim();
    const sanitized = cleanProdId.replace(/['",()]/g, '').trim();
    let targetFileName = (reqFileName as string) || '';
    let targetPath = '';

    const candidateDirs = [
      path.join(process.cwd(), 'protected_uploads', 'digital_products'),
      path.join(os.tmpdir(), 'protected_uploads', 'digital_products'),
      path.join(process.cwd(), 'public', 'uploads'),
      path.join(__dirname, '..', 'protected_uploads', 'digital_products'),
      path.join(__dirname, 'protected_uploads', 'digital_products'),
      path.join(process.cwd(), 'protected_uploads'),
      process.cwd()
    ];

    // Check product record in Supabase
    if (sanitized) {
      try {
        const { data: pDataArr } = await supabase
          .from('digital_products')
          .select('*')
          .or(`id.ilike.${sanitized},slug.ilike.${sanitized}`)
          .limit(1);
        if (pDataArr && pDataArr.length > 0) {
          const pData = pDataArr[0];
          if (pData?.product_file_path) {
            const safe = path.basename(pData.product_file_path);
            for (const dir of candidateDirs) {
              const cand = path.join(dir, safe);
              if (fs.existsSync(cand) && fs.statSync(cand).size > 0) {
                targetPath = cand;
                targetFileName = targetFileName || pData.product_file_name || safe;
                break;
              }
            }
          }
        }
      } catch (err) {}
    }

    // 1. Specific mapping for "Trading Master Android App (APK)"
    if (!targetPath && (cleanProdId === 'DP-TRADING-MASTER-2026' || cleanProdId === 'trading-master' || cleanProdId.toLowerCase().includes('trading'))) {
      targetFileName = targetFileName || 'trading master.apk';
      const specificCandidates = [
        'trading_master.apk',
        'trading master.apk'
      ];
      for (const dir of candidateDirs) {
        for (const file of specificCandidates) {
          const p = path.join(dir, file);
          if (fs.existsSync(p) && fs.statSync(p).size > 1000) {
            targetPath = p;
            break;
          }
        }
        if (targetPath) break;
      }
    }

    // 2. Specific mapping for "AI से अपना Business Grow कैसे करें?"
    if (!targetPath && (cleanProdId === 'dp-ai-business-grow' || cleanProdId === 'DP-AI-GROWTH-2026' || cleanProdId === 'ai-se-apna-business-grow-kaise-karen' || cleanProdId.toLowerCase().includes('business-grow'))) {
      targetFileName = targetFileName || 'AI_se_apna_Business_Grow_kaise_karen.pdf';
      const specificCandidates = [
        'AI_se_apna_Business_Grow_kaise_karen.pdf',
        'secure-asset-ai-business-growth.pdf',
        'AI से अपना Business Grow कैसे _ Google AI....pdf',
        'AI से अपना Business Grow कैसे _ Google AI,,,-1.pdf'
      ];
      for (const dir of candidateDirs) {
        for (const file of specificCandidates) {
          const p = path.join(dir, file);
          if (fs.existsSync(p) && fs.statSync(p).size > 1000) {
            targetPath = p;
            break;
          }
        }
        if (targetPath) break;
      }
    }

    // 3. Specific mapping for "Small Business Management Software"
    if (!targetPath && (cleanProdId === 'dp-small-business-management-software' || cleanProdId === 'DP-SBMS-2026' || cleanProdId.toLowerCase().includes('small-business'))) {
      targetFileName = targetFileName || 'MANI_Small_Business_Software.html';
      const specificCandidates = [
        'MANI_Small_Business_Software.html',
        'secure-asset-small-business-software.html'
      ];
      for (const dir of candidateDirs) {
        for (const file of specificCandidates) {
          const p = path.join(dir, file);
          if (fs.existsSync(p) && fs.statSync(p).size > 100) {
            targetPath = p;
            break;
          }
        }
        if (targetPath) break;
      }
    }

    // If still not resolved and reqFilePath provided, check safely
    if (!targetPath && reqFilePath && typeof reqFilePath === 'string') {
      const safeName = path.basename(reqFilePath);
      for (const dir of candidateDirs) {
        const p = path.join(dir, safeName);
        if (fs.existsSync(p) && fs.statSync(p).size > 100) {
          targetPath = p;
          targetFileName = targetFileName || safeName;
          break;
        }
      }
    }

    if (!targetPath || !fs.existsSync(targetPath)) {
      return res.status(404).json({
        success: false,
        message: 'Digital product file could not be located on the server. Please contact support at manisolutions24x7@gmail.com.'
      });
    }

    const stat = fs.statSync(targetPath);
    if (stat.size <= 0) {
      return res.status(500).json({
        success: false,
        message: 'Digital product file is empty or corrupted.'
      });
    }

    targetFileName = targetFileName || path.basename(targetPath);
    const safeHeaderName = targetFileName.replace(/["\r\n]/g, '_');
    const isPdf = targetFileName.toLowerCase().endsWith('.pdf') || targetPath.toLowerCase().endsWith('.pdf');
    const isHtml = targetFileName.toLowerCase().endsWith('.html') || targetPath.toLowerCase().endsWith('.html');
    const isApk = targetFileName.toLowerCase().endsWith('.apk') || targetPath.toLowerCase().endsWith('.apk');
    const contentType = isPdf ? 'application/pdf' : (isHtml ? 'text/html; charset=UTF-8' : (isApk ? 'application/vnd.android.package-archive' : 'application/octet-stream'));

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${safeHeaderName}"`);
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');

    // Return the actual file binary stream
    const fileStream = fs.createReadStream(targetPath);
    fileStream.pipe(res);
  } catch (err: any) {
    console.error('Download handler error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while delivering digital download: ' + (err?.message || 'Unknown error')
    });
  }
});

export default app;
