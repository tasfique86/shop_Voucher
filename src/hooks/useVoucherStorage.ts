import { useState, useEffect } from 'react';
import { VoucherData, ProductRow } from '../types';

const DRAFT_KEY = 'sonali_voucher_draft_v1';
const LAST_VOUCHER_NUM_KEY = 'sonali_last_voucher_number';
const SAVED_VOUCHERS_KEY = 'sonali_saved_vouchers_list';

const INITIAL_PRODUCTS: ProductRow[] = [
  { id: '1', serialNo: 1, description: '', quantity: 0, rate: 0, amount: 0 }
];

export function useVoucherStorage() {
  const [voucher, setVoucher] = useState<VoucherData>(() => {
    // 1. Try to load draft first
    try {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed && Array.isArray(parsed.products)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Error parsing voucher draft", e);
    }

    // 2. No draft, create initial blank voucher with a fresh number
    const lastNumStr = localStorage.getItem(LAST_VOUCHER_NUM_KEY) || '0';
    const nextNum = parseInt(lastNumStr, 10) + 1;
    const padNum = String(nextNum).padStart(4, '0');
    const voucherNumber = `V-${padNum}`;

    const todayStr = new Date().toISOString().split('T')[0];

    return {
      voucherNumber,
      date: todayStr,
      customerName: '',
      customerAddress: '',
      products: INITIAL_PRODUCTS,
      totalAmount: 0,
      remarks: '',
      inWordsBengali: '',
      inWordsEnglish: '',
    };
  });

  const [savedVouchers, setSavedVouchers] = useState<VoucherData[]>(() => {
    try {
      const list = localStorage.getItem(SAVED_VOUCHERS_KEY);
      return list ? JSON.parse(list) : [];
    } catch {
      return [];
    }
  });

  // Save draft whenever voucher state changes
  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(voucher));
  }, [voucher]);

  // Save list of all finalized vouchers
  useEffect(() => {
    localStorage.setItem(SAVED_VOUCHERS_KEY, JSON.stringify(savedVouchers));
  }, [savedVouchers]);

  const updateVoucher = (updater: Partial<VoucherData> | ((prev: VoucherData) => VoucherData)) => {
    setVoucher((prev) => {
      const updated = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      
      // Calculate individual product row amounts and overall grand total
      const products = updated.products.map((p, idx) => {
        const qty = Math.max(0, p.quantity);
        const rate = Math.max(0, p.rate);
        return {
          ...p,
          serialNo: idx + 1,
          quantity: qty,
          rate: rate,
          amount: parseFloat((qty * rate).toFixed(2)),
        };
      });

      const totalAmount = parseFloat(products.reduce((acc, p) => acc + p.amount, 0).toFixed(2));

      return {
        ...updated,
        products,
        totalAmount,
      };
    });
  };

  const getNextVoucherNumberStr = (offset = 1) => {
    const lastNumStr = localStorage.getItem(LAST_VOUCHER_NUM_KEY) || '0';
    const nextNum = parseInt(lastNumStr, 10) + offset;
    return `V-${String(nextNum).padStart(4, '0')}`;
  };

  // Call this when the voucher is finalized/saved
  const finalizeVoucherAndIncrement = () => {
    const currentNumStr = voucher.voucherNumber;
    const match = currentNumStr.match(/V-(\d+)/);
    const num = match ? parseInt(match[1], 10) : 1;

    // Save to the finalized vouchers list
    setSavedVouchers((prev) => {
      // Avoid duplicate saves for the same voucher number by overwriting or adding
      const existingIdx = prev.findIndex(v => v.voucherNumber === currentNumStr);
      if (existingIdx !== -1) {
        const copy = [...prev];
        copy[existingIdx] = voucher;
        return copy;
      }
      return [voucher, ...prev];
    });

    // Update the last voucher number in localStorage
    const storedLast = parseInt(localStorage.getItem(LAST_VOUCHER_NUM_KEY) || '0', 10);
    if (num > storedLast) {
      localStorage.setItem(LAST_VOUCHER_NUM_KEY, String(num));
    }

    // Prepare a fresh voucher for the next entry
    const nextVNum = `V-${String(num + 1).padStart(4, '0')}`;
    const todayStr = new Date().toISOString().split('T')[0];

    const freshVoucher: VoucherData = {
      voucherNumber: nextVNum,
      date: todayStr,
      customerName: '',
      customerAddress: '',
      products: [
        { id: crypto.randomUUID(), serialNo: 1, description: '', quantity: 0, rate: 0, amount: 0 }
      ],
      totalAmount: 0,
      remarks: '',
      inWordsBengali: '',
      inWordsEnglish: '',
    };

    setVoucher(freshVoucher);
  };

  const loadVoucher = (targetVoucher: VoucherData) => {
    setVoucher(targetVoucher);
  };

  const deleteSavedVoucher = (voucherNum: string) => {
    setSavedVouchers((prev) => prev.filter(v => v.voucherNumber !== voucherNum));
  };

  const startNewVoucher = () => {
    const lastNumStr = localStorage.getItem(LAST_VOUCHER_NUM_KEY) || '0';
    const nextNum = parseInt(lastNumStr, 10) + 1;
    const padNum = String(nextNum).padStart(4, '0');
    const voucherNumber = `V-${padNum}`;
    const todayStr = new Date().toISOString().split('T')[0];

    setVoucher({
      voucherNumber,
      date: todayStr,
      customerName: '',
      customerAddress: '',
      products: [
        { id: crypto.randomUUID(), serialNo: 1, description: '', quantity: 0, rate: 0, amount: 0 }
      ],
      totalAmount: 0,
      remarks: '',
      inWordsBengali: '',
      inWordsEnglish: '',
    });
  };

  return {
    voucher,
    updateVoucher,
    savedVouchers,
    finalizeVoucherAndIncrement,
    loadVoucher,
    deleteSavedVoucher,
    startNewVoucher,
    getNextVoucherNumberStr
  };
}
