interface underPaymentEntity{
    id: number;
    paidAmount: number;
    service_id: number;
    service: serviceEntity;
    paymentDate: string;
}