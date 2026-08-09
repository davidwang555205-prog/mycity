export interface PaymentProvider { createPayment(sessionId:string, amountCny:number): Promise<{ paymentId:string; status:"pending"|"paid" }>; confirmPayment(paymentId:string): Promise<"paid"> }
export class MockPaymentProvider implements PaymentProvider { async createPayment(sessionId:string, _amountCny:number){ return {paymentId:`mock-${sessionId}`,status:"pending" as const}; } async confirmPayment(_paymentId:string){return "paid" as const;} }
export const paymentProvider=new MockPaymentProvider();
