export interface IToken {
    id:number | null;
    value: string;
    type: string;
    created_at: Date | null;
    updated_at: Date | null;
}