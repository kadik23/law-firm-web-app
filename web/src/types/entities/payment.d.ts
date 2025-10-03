interface PaymentEntity {
  id: number;
  request_service_id: number;
  total_amount: number;
  paid_amount: number;
  remaining_balance: number;
  payment_method: 'CIB' | 'EDAHABIYA' | 'FREE_CONSULTATION';
  payment_status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  payment_type: 'FULL' | 'PARTIAL';
  chargili_payment_id?: string;
  chargili_checkout_url?: string;
  chargili_webhook_data?: object;
  client_id: number;
  service_id: number;
  created_at: string;
  updated_at: string;
  service?: ServiceEntity;
  client?: UserEntity;
  transactions?: PaymentTransactionEntity[];
}

interface PaymentTransactionEntity {
  id: number;
  payment_id: number;
  transaction_amount: number;
  transaction_date: string;
  chargili_transaction_id?: string;
  chargili_status?: string;
  chargili_response_data?: object;
  created_at: string;
  updated_at: string;
}

interface PaymentMethodEntity {
  id: number;
  name: 'CIB' | 'EDAHABIYA';
  display_name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface CreatePaymentRequest {
  request_service_id: number;
  payment_method: 'CIB' | 'EDAHABIYA' | 'FREE_CONSULTATION';
  payment_type: 'FULL' | 'PARTIAL';
  amount: number;
}

interface CreatePaymentResponse {
  message: string;
  payment: PaymentEntity;
  checkout_url?: string;
}

