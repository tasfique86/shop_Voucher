export interface ProductRow {
  id: string;
  serialNo: number;
  description: string;
  quantity: number | string;
  rate: number | string;
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

declare global {
  interface Window {
    electronAPI?: {
      savePdf: (arrayBuffer: ArrayBuffer, fileName: string) => Promise<{ success: boolean; canceled?: boolean; error?: string }>;
      isElectron: boolean;
    };
  }
}
