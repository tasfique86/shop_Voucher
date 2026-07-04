import React from "react";
import { ProductRow } from "../types";
import {
  toBengaliNumber,
  numberToBengaliWords,
  numberToEnglishWords,
} from "../utils/numberToWords";

interface ProductTableProps {
  products: ProductRow[];
  totalAmount: number;
  showEnglishLabels: boolean;
  useBengaliDigits: boolean;
}

export default function ProductTable({
  products,
  totalAmount,
  showEnglishLabels,
  useBengaliDigits,
}: ProductTableProps) {
  // Pad the table with empty rows to look like a real printed stationery book (usually has 10 lines)
  const MIN_ROWS = 15;
  const displayRows = [...products];
  while (displayRows.length < MIN_ROWS) {
    displayRows.push({
      id: `empty-${displayRows.length}`,
      serialNo: displayRows.length + 1,
      description: "",
      quantity: 0,
      rate: 0,
      amount: 0,
    });
  }

  const formatNumberValue = (val: number | string, isAmount = false) => {
    const numericVal = typeof val === "string" ? parseFloat(val) || 0 : val;
    if (numericVal === 0 && !isAmount) return "";
    if (numericVal === 0 && isAmount) return "";

    const formatted = numericVal.toFixed(2);
    return useBengaliDigits ? toBengaliNumber(formatted) : formatted;
  };

  const formatSerial = (num: number) => {
    return useBengaliDigits ? toBengaliNumber(num) : num;
  };

  return (
    <div
      className="w-full border-2 border-indigo-900 rounded-none overflow-hidden mb-4"
      id="product-table-print"
    >
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-indigo-900 text-white text-xs md:text-sm font-bold border-b-2 border-indigo-900 text-center">
            {/* Serial Number */}
            <th className="py-2 px-1 border-r border-white w-[10%] shrink-0">
              <div>ক্র: নং</div>
            </th>

            {/* Description of Goods */}
            <th className="py-2 px-3 border-r border-white w-[50%] text-left">
              <div>মালের বিবরণ</div>
            </th>

            {/* Quantity */}
            <th className="py-2 px-1 border-r border-white w-[12%] text-center">
              <div>পরিমাণ</div>
            </th>

            {/* Rate */}
            <th className="py-2 px-1 border-r border-white w-[13%] text-center">
              <div>দর</div>
            </th>

            {/* Amount (Taka) */}
            <th className="py-2 px-3 w-[15%] text-right">
              <div>টাকা</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {displayRows.map((row, index) => {
            const isEmpty = row.description === "";
            return (
              <tr
                key={row.id}
                className="border-b border-indigo-900 hover:bg-indigo-50/50 transition-colors text-xs md:text-sm h-8"
              >
                {/* Serial No */}
                <td className="text-center font-bold border-r border-indigo-900 py-1 text-indigo-950">
                  {formatSerial(index + 1)}
                </td>

                {/* Description */}
                <td className="px-3 border-r border-indigo-900 font-semibold text-indigo-950 truncate max-w-0">
                  {row.description}
                </td>

                {/* Quantity */}
                <td className="text-center border-r border-indigo-900 font-mono text-indigo-950 font-bold py-1">
                  {isEmpty ? "" : formatNumberValue(row.quantity)}
                </td>

                {/* Rate */}
                <td className="text-center border-r border-indigo-900 font-mono text-indigo-950 font-bold py-1">
                  {isEmpty ? "" : formatNumberValue(row.rate)}
                </td>

                {/* Amount */}
                <td className="text-right px-3 font-mono font-bold text-indigo-950 py-1">
                  {isEmpty ? "" : formatNumberValue(row.amount, true)}
                </td>
              </tr>
            );
          })}

          {/* Grand Total Row */}
          <tr className="border-t-2 border-indigo-900 bg-indigo-50/80 h-9 font-bold">
            <td
              colSpan={3}
              className="border-r border-indigo-900 py-1 px-3 text-left"
            >
              <div className="flex flex-col justify-center text-xs md:text-sm text-indigo-950">
                <div className="flex items-center gap-1">
                  <span className="font-extrabold text-indigo-950 whitespace-nowrap">
                    কথায় :
                  </span>
                  <span className="font-bold text-indigo-950">
                    {numberToBengaliWords(totalAmount)} মাত্র।
                  </span>
                </div>
              </div>
            </td>

            {/* Total Label inside Black Box */}
            <td className="bg-indigo-900 text-white text-center border-r border-indigo-900 py-1 text-xs md:text-sm font-extrabold flex items-center justify-center h-full min-h-[36px] uppercase">
              <span>মোট</span>
              {/* {showEnglishLabels && (
                <span className="text-[10px] font-normal italic ml-1">
                  (Total)
                </span>
              )} */}
            </td>

            {/* Total Amount Value */}
            <td className="text-right px-3 font-mono font-extrabold text-sm md:text-base text-indigo-950 bg-indigo-100/90">
              {useBengaliDigits
                ? toBengaliNumber(totalAmount.toFixed(2))
                : totalAmount.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
