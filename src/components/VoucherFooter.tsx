import React from 'react';
import { numberToBengaliWords, numberToEnglishWords } from '../utils/numberToWords';

interface VoucherFooterProps {
  totalAmount: number;
  remarks?: string;
  showEnglishLabels: boolean;
  customRemarks?: string;
}

export default function VoucherFooter({
  totalAmount,
  showEnglishLabels,
  customRemarks,
}: VoucherFooterProps) {
  const bengaliWords = numberToBengaliWords(totalAmount);
  const englishWords = numberToEnglishWords(totalAmount);

  return (
    <div className="space-y-6 mt-6" id="voucher-footer">
      {/* In Words Section */}
      <div className="flex items-start w-full gap-2 border-b border-dotted border-black pb-2 text-black">
        <span className="font-extrabold text-black whitespace-nowrap text-base">
          কথায় :
        </span>
        <div className="flex-1 font-bold text-black text-base leading-relaxed pl-2">
          <span>{bengaliWords} মাত্র।</span>
          {showEnglishLabels && (
            <div className="text-[11px] text-gray-500 italic mt-0.5 font-normal">
              In Words: {englishWords} Only
            </div>
          )}
        </div>
      </div>

      {/* Remarks Section (if provided) */}
      {customRemarks && (
        <div className="border border-black p-2.5 text-xs text-black leading-normal rounded-none bg-gray-50/50">
          <span className="font-bold uppercase tracking-wider block mb-0.5">শর্তাবলী / Remarks:</span>
          {customRemarks}
        </div>
      )}

      {/* Signatures & Greetings Row */}
      <div className="pt-12 flex justify-between items-end text-center text-xs md:text-sm text-black">
        {/* Buyer Signature */}
        <div className="w-[30%]">
          <div className="border-t border-black pt-1.5 font-bold text-black tracking-wide">
            ক্রেতার স্বাক্ষর
          </div>
          {showEnglishLabels && <div className="text-[10px] text-gray-500 italic font-medium">Buyer's Signature</div>}
        </div>

        {/* Center Thank You greeting */}
        <div className="w-[35%] pb-1">
          <div className="font-extrabold text-black text-sm md:text-base tracking-wide bg-gray-100/80 px-4 py-1.5 rounded-none border border-black inline-block">
            ধন্যবাদ আবার আসবেন।
          </div>
          {showEnglishLabels && (
            <div className="text-[10px] text-gray-500 italic mt-1">Thank You, Visit Again!</div>
          )}
        </div>

        {/* Seller Signature */}
        <div className="w-[30%]">
          <div className="border-t border-black pt-1.5 font-bold text-black tracking-wide">
            বিক্রেতার স্বাক্ষর
          </div>
          {showEnglishLabels && <div className="text-[10px] text-gray-500 italic font-medium">Seller's Signature</div>}
        </div>
      </div>
    </div>
  );
}
