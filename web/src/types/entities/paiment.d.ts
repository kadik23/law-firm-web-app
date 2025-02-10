interface paimentEntity{
    id: number;
    totalAmount: number;
    paidAmount: number;
    service_id: number;
    service: serviceEntity;
    paymentDate: number;
    status: 'finished' | 'unfinished';
}