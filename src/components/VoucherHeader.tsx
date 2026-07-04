import React from "react";
import { toBengaliNumber } from "../utils/numberToWords";

interface VoucherHeaderProps {
  voucherNumber: string;
  date: string;
  showEnglishLabels: boolean;
}

export default function VoucherHeader({
  voucherNumber,
  date,
  showEnglishLabels,
}: VoucherHeaderProps) {
  // Format date parts for the individual boxes in Bengali/English
  const dateObj = date ? new Date(date) : new Date();
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = String(dateObj.getFullYear());

  const formattedDay = showEnglishLabels ? day : toBengaliNumber(day);
  const formattedMonth = showEnglishLabels ? month : toBengaliNumber(month);
  const formattedYear = showEnglishLabels ? year : toBengaliNumber(year);

  return (
    <div
      className="relative border-b-2 border-black pb-4 mb-4"
      id="voucher-header"
    >
      {/* Cash Memo Diagonal Ribbon on Top Right */}
      <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-black text-white text-[11px] font-bold tracking-wider px-3 py-1 shadow-sm border border-black uppercase">
        ক্যাশ মেমো{" "}
        <span className="text-[9px] font-mono block text-center font-normal">
          CASH MEMO
        </span>
      </div>

      {/* Main Header Row */}
      <div className="text-left">
        <h1 className="text-3xl font-extrabold text-black tracking-tight mb-1 font-sans">
          সোনালী পেপার এন্ড স্টেশনারী
        </h1>
        <p className="text-xs  font-bold text-black max-w-3xl mx-auto leading-relaxed text-center">
          এখানে যাবতীয় অফিস, স্কুল কলেজের খাতা-কলম, কাগজ ফটোকপি পেপার ও মেশিনের
          কালি, ক্যালকুলেটর ও স্টেশনারী মালামাল পাইকারী ও খুচরা বিক্রয় করা হয়।
        </p>
        {/* {showEnglishLabels && (
          <p className="text-[10px] text-gray-500 italic mt-0.5">
            Sonali Paper & Stationery — Premium wholesale & retail supplier of
            stationery, paper books & calculators.
          </p>
        )} */}
      </div>

      {/* Address & Contacts Banner */}
      <div className="bg-black text-white mt-4 flex flex-col sm:flex-row justify-between items-center px-4 py-2.5 text-xs font-semibold rounded-none">
        {/* Address */}
        <div className="flex items-center">
          <span className="text-yellow-400 mr-2 font-bold">ঠিকানা:</span>
          <span>বড় বাজার, কক্সবাজার।</span>
          {/* {showEnglishLabels && (
            <span className="text-[9px] text-gray-300 ml-1 italic">(Boro Bazar, Cox's Bazar)</span>
          )} */}
        </div>

        {/* Contact Numbers */}
        <div className="flex items-center gap-3 font-mono text-[11px] mt-1 sm:mt-0">
          <span className="text-yellow-400 font-bold font-sans">মোবাইল:</span>
          <span>01998-867755</span>
          <span className="text-gray-400">|</span>
          <span>01982-870736</span>
        </div>
      </div>

      {/* Voucher Meta row: Number & Date */}
      <div className="mt-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Voucher No */}
        <div className="flex items-end gap-1.5">
          <span className="font-extrabold text-black text-base">নং :</span>
          <span className="font-mono border-b border-black px-2 pb-0.5 font-bold text-black text-base tracking-wider min-w-[80px]">
            {voucherNumber}
          </span>
          {/* {showEnglishLabels && (
            <span className="text-[10px] text-gray-500 italic">(No.)</span>
          )} */}
        </div>

        {/* Date Boxes matching the image */}
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-black text-base">তারিখ :</span>
          {/* {showEnglishLabels && (
            <span className="text-[10px] text-gray-500 italic mr-1">
              (Date)
            </span>
          )} */}

          <div className="flex items-center">
            {/* Day Boxes */}
            <div className="flex border border-black bg-white">
              <span className="w-6 h-7 flex items-center justify-center font-bold text-black border-r border-black text-sm">
                {formattedDay[0] || "0"}
              </span>
              <span className="w-6 h-7 flex items-center justify-center font-bold text-black text-sm">
                {formattedDay[1] || "0"}
              </span>
            </div>

            <span className="mx-1.5 text-black font-bold">/</span>

            {/* Month Boxes */}
            <div className="flex border border-black bg-white">
              <span className="w-6 h-7 flex items-center justify-center font-bold text-black border-r border-black text-sm">
                {formattedMonth[0] || "0"}
              </span>
              <span className="w-6 h-7 flex items-center justify-center font-bold text-black text-sm">
                {formattedMonth[1] || "0"}
              </span>
            </div>

            <span className="mx-1.5 text-black font-bold">/</span>

            {/* Year Boxes */}
            <div className="flex border border-black bg-white">
              <span className="w-6 h-7 flex items-center justify-center font-bold text-black border-r border-black text-sm">
                {formattedYear[0] || "2"}
              </span>
              <span className="w-6 h-7 flex items-center justify-center font-bold text-black border-r border-black text-sm">
                {formattedYear[1] || "0"}
              </span>
              <span className="w-6 h-7 flex items-center justify-center font-bold text-black border-r border-black text-sm">
                {formattedYear[2] || "2"}
              </span>
              <span className="w-6 h-7 flex items-center justify-center font-bold text-black text-sm">
                {formattedYear[3] || "6"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
