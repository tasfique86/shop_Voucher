import React from "react";

interface CustomerInfoProps {
  customerName: string;
  customerAddress: string;
  showEnglishLabels: boolean;
}

export default function CustomerInfo({
  customerName,
  customerAddress,
  showEnglishLabels,
}: CustomerInfoProps) {
  return (
    <div className="space-y-4 mb-5" id="customer-info">
      {/* Name Input Line */}
      <div className="flex items-end w-full gap-2 text-black">
        <span className="font-extrabold text-black whitespace-nowrap text-base">
          নাম :
        </span>
        {/* {showEnglishLabels && (
          <span className="text-xs text-gray-500 italic whitespace-nowrap mr-1">
            (Name):
          </span>
        )} */}
        <div className="flex-1 border-b border-dotted border-black pb-0.5 text-black font-extrabold px-2 text-base min-h-[28px] overflow-hidden truncate">
          {customerName || (
            <span className="text-gray-300 font-normal italic">
              ................................................................................................
            </span>
          )}
        </div>
      </div>

      {/* Address Input Line */}
      <div className="flex items-end w-full gap-2 text-black">
        <span className="font-extrabold text-black whitespace-nowrap text-base">
          ঠিকানা :
        </span>
        {/* {showEnglishLabels && (
          <span className="text-xs text-gray-500 italic whitespace-nowrap mr-1">
            (Address):
          </span>
        )} */}
        <div className="flex-1 border-b border-dotted border-black pb-0.5 text-black font-bold px-2 text-base min-h-[28px] overflow-hidden truncate">
          {customerAddress || (
            <span className="text-gray-300 font-normal italic">
              ................................................................................................
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
