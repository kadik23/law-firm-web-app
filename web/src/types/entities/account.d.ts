interface Account{
    id: string;
    name: string;
    surname: string;
    email: string;
    password: string;
    age: number;
    gender: string;
    created_at: string;
    account_type: 'Admin' | 'Attorney' | 'Client';
    telephone: number;
    city: string;
}