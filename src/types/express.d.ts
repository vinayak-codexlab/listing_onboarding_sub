export {};

declare global {
    namespace Express {
        interface Request{
            user?:{
                sub: string;
                firm_id: string;
            };
        }
    }
}
