import React from "react";

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
  return (
    <div className="space-y-6 mt-2" id="voucher-footer">
      {/* Signatures & Greetings Row */}
      <div className="pt-12 flex justify-between items-end text-center text-xs md:text-sm text-indigo-950">
        {/* Buyer Signature */}
        <div className="w-[30%]">
          <div className="border-t border-indigo-900 pt-1.5 font-bold text-indigo-950 tracking-wide">
            ক্রেতার স্বাক্ষর
          </div>
          {showEnglishLabels && (
            <div className="text-[10px] text-gray-500 italic font-medium">
              Buyer's Signature
            </div>
          )}
        </div>

        {/* Center Thank You greeting */}
        <div className="w-[35%] pb-1">
          <div className="font-extrabold text-indigo-950 text-xs md:text-sm tracking-wide px-4 py-1.5 inline-block">
            ধন্যবাদ আবার আসবেন।
          </div>
        </div>

        {/* Seller Signature */}
        <div className="w-[30%]">
          <div className="border-t border-indigo-900 pt-1.5 font-bold text-indigo-950 tracking-wide">
            বিক্রেতার স্বাক্ষর
          </div>
          {showEnglishLabels && (
            <div className="text-[10px] text-gray-500 italic font-medium">
              Seller's Signature
            </div>
          )}
        </div>
      </div>
      {/* Remarks Section (if provided) */}
      {/* {customRemarks && (
        <div className="border border-indigo-900 p-2.5 text-xs text-indigo-950 leading-normal rounded-none bg-indigo-50/50">
          <span className="font-bold uppercase tracking-wider block mb-0.5">
            শর্তাবলী :
          </span>
          {customRemarks}
        </div>
      )} */}
    </div>
  );
}
