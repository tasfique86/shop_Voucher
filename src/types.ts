export interface ProductRow {
  id: string;
  serialNo: number;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface VoucherData {
  voucherNumber: string;
  date: string;
  customerName: string;
  customerAddress: string;
  products: ProductRow[];
  totalAmount: number;
  remarks: string;
  inWordsBengali: string;
  inWordsEnglish: string;
}
