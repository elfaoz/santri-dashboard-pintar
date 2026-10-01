export interface PaidPlan {
  id: string;
  name: string;
  price: number;
  period: string; // label shown next to price
  validityMonths: number; // masa berlaku di invoice
  validityLabel: string;
}

export const PAID_PLANS: PaidPlan[] = [
  { id: 'pro-3m', name: 'Paket Hemat', price: 50000, period: '3 bulan', validityMonths: 6, validityLabel: '6 bulan' },
  { id: 'pro-monthly', name: 'Paket Bulanan', price: 10000, period: 'bulan', validityMonths: 24, validityLabel: '2 tahun' },
];

export const getPaidPlan = (id?: string) => PAID_PLANS.find(p => p.id === id);
