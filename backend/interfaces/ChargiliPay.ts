
export interface ChargiliPaymentRequest {
    amount: number;
    clientEmail: string;
    clientName: string;
    paymentMethod: 'CIB' | 'EDAHABIYA';
    invoiceNumber: string;
    backUrl: string;
}
  
export  interface ChargiliPaymentResponse {
    id: string;
    checkout_url: string;
    status: string;
}

export interface ChargiliWebhookData {
    id: number;
    entity: string;
    type: "checkout.created" | "checkout.updated" | "checkout.paid" | "checkout.failed" | "checkout.canceled" | "checkout.expired" | "checkout.refunded" | "checkout.partially_refunded" | "checkout.partially_paid" | "checkout.partially_failed" | "checkout.partially_canceled" | "checkout.partially_expired" | "checkout.partially_refunded" | "checkout.partially_paid" | "checkout.partially_failed" | "checkout.partially_canceled" | "checkout.partially_expired" | "checkout.partially_refunded" | "checkout.partially_paid" | "checkout.partially_failed" | "checkout.partially_canceled" | "checkout.partially_expired";
    data: {
        id: number;
        fees: number;
        amount: number;
        entity: "checkout";
        locale: string;
        status: "paid" | "failed" | "pending" | string;
        currency: string;
        discount: number | null;
        livemode: boolean;
        metadata: Record<string, any> | null;
        created_at: number;
        updated_at: number;
        invoice_id: string | null;
        customer_id: string;
        description: string | null;
        failure_url: string;
        success_url: string;
        checkout_url: string;
        payment_method: "edahabia" | "cib" | string;
        payment_link_id: string | null;
        fees_on_customer: number;
        fees_on_merchant: number;
        shipping_address: {
            country: string;
        };
        webhook_endpoint: string | null;
        fulfillment_status: "unfulfilled" | "fulfilled" | string;
        pass_fees_to_customer: number;
        deposit_transaction_id: string | null;
        amount_without_discount: number;
        collect_shipping_address: number;
        chargily_pay_fees_allocation: string | null;
    };
    created_at: number;
    updated_at: number;
    account: ChargilyAccount;
    livemode: boolean;
}

export interface ChargilyAccount {
    id: string;
    name: string;
    company_name: string;
    logo: string;
    legal_status: string;
    address: {
        city: string;
        state: string;
        address: string;
        country: string;
    } | null;
    trade_register: string | null;
    nis: string;
    nif: string;
    status: "active" | "inactive" | string;
    verification_status: "verified" | "unverified" | string;
    mode: "test" | "live";
    webhook_endpoint: string;
    created_at: number;
    updated_at: number;
    website: string;
    support_phone: string;
}

export interface PaymentStatusResponse {
    id: string;
    status: 'paid' | 'failed' | 'canceled' | string;
    amount: number;
    currency: string;
    payment_method: string;
    customer_id: string;
    description: string;
    created_at: number;
    updated_at: number;
}