export interface IPayment {
  id?: number;
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
  created_at?: Date;
  updated_at?: Date;
}

export interface IPaymentTransaction {
  id?: number;
  payment_id: number;
  transaction_amount: number;
  transaction_date: Date;
  chargili_transaction_id?: string;
  chargili_status?: string;
  chargili_response_data?: object;
  created_at?: Date;
  updated_at?: Date;
}

export interface IPaymentMethod {
  id?: number;
  name: 'CIB' | 'EDAHABIYA';
  display_name: string;
  description?: string;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface IRequestService {
  id?: number;
  clientId: number;
  serviceId: number;
  attorneyId?: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  request_date: Date;
  estimated_cost?: number;
  actual_cost?: number;
  notes?: string;
  legal_case_number?: string;
  urgency_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  created_at?: Date;
  updated_at?: Date;
}

