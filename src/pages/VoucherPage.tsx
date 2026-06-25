import React, { useState, useEffect } from "react";
import { useVoucherStorage } from "../hooks/useVoucherStorage";
import { ProductRow, VoucherData } from "../types";
import VoucherHeader from "../components/VoucherHeader";
import CustomerInfo from "../components/CustomerInfo";
import ProductTable from "../components/ProductTable";
import VoucherFooter from "../components/VoucherFooter";
import PdfGenerator from "../components/PdfGenerator";
import {
  Plus,
  Trash2,
  Printer,
  RotateCcw,
  Save,
  Search,
  Sparkles,
  Check,
  HelpCircle,
  Clock,
  BookOpen,
  Settings,
  X,
  FileSpreadsheet,
} from "lucide-react";

export interface PresetItem {
  nameBangali: string;
  nameEnglish: string;
  rate: number;
}

// Stationery preset items for quick insertion (Default fallback)
const DEFAULT_STATIONERY_PRESETS: PresetItem[] = [
  { nameBangali: "খাতা (Notebook)", nameEnglish: "Notebook", rate: 60 },
  {
    nameBangali: "বলপেন (Ballpoint Pen)",
    nameEnglish: "Ballpoint Pen",
    rate: 10,
  },
  {
    nameBangali: "এ ফোর পেপার (A4 Paper Box)",
    nameEnglish: "A4 Paper Box",
    rate: 450,
  },
  {
    nameBangali: "ফটোকপি পেপার (Photocopy Paper)",
    nameEnglish: "Photocopy Paper (Ream)",
    rate: 380,
  },
  {
    nameBangali: "সায়েন্টিফিক ক্যালকুলেটর (Calculator)",
    nameEnglish: "Scientific Calculator",
    rate: 1200,
  },
  {
    nameBangali: "জ্যামিতি বক্স (Geometry Box)",
    nameEnglish: "Geometry Box",
    rate: 150,
  },
  {
    nameBangali: "ফাইল ফোল্ডার (File Folder)",
    nameEnglish: "File Folder",
    rate: 45,
  },
  {
    nameBangali: "মার্কার পেন (Marker Pen)",
    nameEnglish: "Marker Pen",
    rate: 35,
  },
  {
    nameBangali: "পেন্সিল বক্স (Pencil Box)",
    nameEnglish: "Pencil Box",
    rate: 80,
  },
  { nameBangali: "আঠা (Glue Stick)", nameEnglish: "Glue Stick", rate: 25 },
];

export default function VoucherPage() {
  const {
    voucher,
    updateVoucher,
    savedVouchers,
    finalizeVoucherAndIncrement,
    loadVoucher,
    deleteSavedVoucher,
    startNewVoucher,
    getNextVoucherNumberStr,
  } = useVoucherStorage();

  // Settings
  const [showEnglishLabels, setShowEnglishLabels] = useState(true);
  const [useBengaliDigits, setUseBengaliDigits] = useState(false);
  const [customRemarks, setCustomRemarks] = useState("");
  const [paperSize, setPaperSize] = useState<"a4" | "a5">("a5");

  // Dynamic Presets State
  const [presets, setPresets] = useState<PresetItem[]>(() => {
    try {
      const saved = localStorage.getItem("sonali_stationery_presets");
      return saved ? JSON.parse(saved) : DEFAULT_STATIONERY_PRESETS;
    } catch {
      return DEFAULT_STATIONERY_PRESETS;
    }
  });

  // Form for creating new presets
  const [activePresetTab, setActivePresetTab] = useState<"list" | "manage">(
    "list",
  );
  const [newPresetBangali, setNewPresetBangali] = useState("");
  const [newPresetEnglish, setNewPresetEnglish] = useState("");
  const [newPresetRate, setNewPresetRate] = useState<string>("");
  const [presetFormError, setPresetFormError] = useState("");

  // Persist presets whenever changed
  useEffect(() => {
    localStorage.setItem("sonali_stationery_presets", JSON.stringify(presets));
  }, [presets]);

  // Form Validation & Errors
  const [errors, setErrors] = useState<{
    customerName?: string;
    products?: string;
    productRows?: {
      [key: string]: { description?: string; quantity?: string; rate?: string };
    };
  }>({});

  // Search & History Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showPresetInfo, setShowPresetInfo] = useState(false);

  // Form Field Changers
  const handleCustomerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    updateVoucher({ customerName: val });
    if (val.trim()) {
      setErrors((prev) => ({ ...prev, customerName: undefined }));
    }
  };

  const handleCustomerAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    updateVoucher({ customerAddress: e.target.value });
  };

  const handleVoucherNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    updateVoucher({ voucherNumber: e.target.value });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateVoucher({ date: e.target.value });
  };

  // Product Row Operations
  const handleRowChange = (id: string, field: keyof ProductRow, value: any) => {
    updateVoucher((prev) => {
      const updatedProducts = prev.products.map((p) => {
        if (p.id === id) {
          const newVal =
            field === "description" ? value : parseFloat(value) || 0;
          return { ...p, [field]: newVal };
        }
        return p;
      });
      return { ...prev, products: updatedProducts };
    });

    // Clear specific error for this row
    if (errors.productRows?.[id]) {
      setErrors((prev) => {
        const copy = { ...prev };
        if (copy.productRows) {
          delete copy.productRows[id];
        }
        return copy;
      });
    }
  };

  const addProductRow = () => {
    const newId = crypto.randomUUID();
    updateVoucher((prev) => {
      const newRow: ProductRow = {
        id: newId,
        serialNo: prev.products.length + 1,
        description: "",
        quantity: 0,
        rate: 0,
        amount: 0,
      };
      return {
        ...prev,
        products: [...prev.products, newRow],
      };
    });
  };

  const deleteProductRow = (id: string) => {
    if (voucher.products.length <= 1) {
      setErrors((prev) => ({
        ...prev,
        products: "ভাউচারে অন্তত একটি পণ্য থাকতে হবে।",
      }));
      return;
    }
    updateVoucher((prev) => {
      const filtered = prev.products.filter((p) => p.id !== id);
      return {
        ...prev,
        products: filtered,
      };
    });
  };

  // Add Preset Stationery
  const insertPresetItem = (preset: PresetItem) => {
    // Find an empty row to replace, or append a new one
    const emptyRowIdx = voucher.products.findIndex(
      (p) => p.description.trim() === "" && p.quantity === 0 && p.rate === 0,
    );
    const desc = showEnglishLabels
      ? `${preset.nameBangali} / ${preset.nameEnglish}`
      : preset.nameBangali;

    if (emptyRowIdx !== -1) {
      const targetId = voucher.products[emptyRowIdx].id;
      handleRowChange(targetId, "description", desc);
      handleRowChange(targetId, "quantity", 1);
      handleRowChange(targetId, "rate", preset.rate);
    } else {
      updateVoucher((prev) => {
        const newRow: ProductRow = {
          id: crypto.randomUUID(),
          serialNo: prev.products.length + 1,
          description: desc,
          quantity: 1,
          rate: preset.rate,
          amount: preset.rate,
        };
        return {
          ...prev,
          products: [...prev.products, newRow],
        };
      });
    }
    setErrors((prev) => ({ ...prev, products: undefined }));
  };

  // Add custom stationery preset item
  const addCustomPreset = (e: React.FormEvent) => {
    e.preventDefault();
    setPresetFormError("");

    if (!newPresetBangali.trim()) {
      setPresetFormError("পণ্যটির বাংলা নাম লিখুন (e.g. খাতা)");
      return;
    }
    if (!newPresetEnglish.trim()) {
      setPresetFormError("পণ্যটির ইংরেজী নাম লিখুন (e.g. Notebook)");
      return;
    }
    const rateVal = parseFloat(newPresetRate);
    if (isNaN(rateVal) || rateVal <= 0) {
      setPresetFormError("পণ্যটির সঠিক দর লিখুন (e.g. 60)");
      return;
    }

    const newPreset: PresetItem = {
      nameBangali: newPresetBangali.trim(),
      nameEnglish: newPresetEnglish.trim(),
      rate: rateVal,
    };

    setPresets((prev) => [...prev, newPreset]);
    setNewPresetBangali("");
    setNewPresetEnglish("");
    setNewPresetRate("");
  };

  // Delete a stationery preset item
  const deletePresetItem = (indexToDelete: number) => {
    setPresets((prev) => prev.filter((_, idx) => idx !== indexToDelete));
  };

  // Reset presets list to default presets list
  const resetPresetsToDefault = () => {
    if (
      window.confirm(
        "আপনি কি সত্যিই পণ্য তালিকাটি ডিফল্ট তালিকায় রিসেট করতে চান?",
      )
    ) {
      setPresets(DEFAULT_STATIONERY_PRESETS);
    }
  };

  // Run full validation
  const validateForm = (): boolean => {
    const currentErrors: typeof errors = {};
    let isValid = true;

    // Validate Customer Name
    if (!voucher.customerName.trim()) {
      currentErrors.customerName =
        "ক্রেতার নাম আবশ্যক (Customer Name is required)";
      isValid = false;
    }

    // Validate product rows count
    const activeProducts = voucher.products.filter(
      (p) => p.description.trim() !== "",
    );
    if (activeProducts.length === 0) {
      currentErrors.products =
        "ভাউচারে অন্তত একটি মালের বিবরণ থাকতে হবে (At least one valid product is required)";
      isValid = false;
    }

    // Validate quantities and rates
    const productRowErrors: {
      [key: string]: { description?: string; quantity?: string; rate?: string };
    } = {};
    voucher.products.forEach((p) => {
      if (p.description.trim() !== "") {
        const rowErr: {
          description?: string;
          quantity?: string;
          rate?: string;
        } = {};
        if (p.quantity <= 0) {
          rowErr.quantity = "১ বা তার বেশি হতে হবে";
          isValid = false;
        }
        if (p.rate <= 0) {
          rowErr.rate = "০ এর বেশি হতে হবে";
          isValid = false;
        }
        if (Object.keys(rowErr).length > 0) {
          productRowErrors[p.id] = rowErr;
        }
      }
    });

    if (Object.keys(productRowErrors).length > 0) {
      currentErrors.productRows = productRowErrors;
    }

    setErrors(currentErrors);
    return isValid;
  };

  // Handle Save / Finalize Action
  const handleFinalize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      alert(
        "দয়া করে ভুলের স্থানগুলো সংশোধন করুন। (Please correct form validation errors before proceeding)",
      );
      return;
    }

    finalizeVoucherAndIncrement();
    alert(
      "ভাউচারটি সফলভাবে সংরক্ষণ করা হয়েছে এবং নতুন ভাউচার নম্বর বরাদ্দ করা হয়েছে! (Voucher finalized successfully!)",
    );
  };

  // Keyboard friendly quick print
  const handlePrint = () => {
    if (!validateForm()) {
      const confirmPrint = window.confirm(
        "ভাউচারে কিছু তথ্য অসম্পূর্ণ রয়েছে। তবুও কি প্রিন্ট করতে চান? (Some fields are missing. Print anyway?)",
      );
      if (!confirmPrint) return;
    }
    window.print();
  };

  // Filter history
  const filteredHistory = savedVouchers.filter((v) => {
    const query = searchQuery.toLowerCase();
    return (
      v.customerName.toLowerCase().includes(query) ||
      v.voucherNumber.toLowerCase().includes(query) ||
      v.customerAddress.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col justify-between font-sans selection:bg-indigo-500 selection:text-white">
      {/* Upper Navigation/Header Bar */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-40 shadow-sm no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-2.5 rounded-lg font-black tracking-tighter text-lg shadow-sm">
              SP&S
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight flex items-center gap-1.5 text-slate-900">
                সোনালী ক্যাশ মেমো জেনারেটর
                <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full border border-indigo-100/50 font-mono font-medium">
                  v1.2
                </span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Sonali Paper & Stationery - Voucher Generator System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Presets Info Toggle */}
            <button
              onClick={() => setShowPresetInfo(!showPresetInfo)}
              className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 active:bg-slate-200/80 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer border border-slate-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>স্টেশনারী তালিকা (Presets)</span>
            </button>

            {/* History Button */}
            <button
              onClick={() => setShowHistoryModal(true)}
              className="relative px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer border border-indigo-100/50"
            >
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span>সংরক্ষিত ভাউচার ({savedVouchers.length})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-6 md:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Creator Panel (Left Side - 5/12 columns) */}
        <div className="lg:col-span-5 space-y-6 no-print">
          {/* Quick Preset Floating Sheet if enabled */}
          {showPresetInfo && (
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-md relative animate-in fade-in slide-in-from-top-4 duration-200">
              <button
                onClick={() => setShowPresetInfo(false)}
                className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-105 transition cursor-pointer"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Tab Header */}
              <div className="flex border-b border-slate-200 mb-4 gap-4">
                <button
                  type="button"
                  onClick={() => setActivePresetTab("list")}
                  className={`pb-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                    activePresetTab === "list"
                      ? "border-indigo-650 text-indigo-600"
                      : "border-transparent text-slate-400 hover:text-slate-500"
                  }`}
                >
                  পণ্য তালিকা (Select)
                </button>
                <button
                  type="button"
                  onClick={() => setActivePresetTab("manage")}
                  className={`pb-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                    activePresetTab === "manage"
                      ? "border-indigo-650 text-indigo-600"
                      : "border-transparent text-slate-400 hover:text-slate-500"
                  }`}
                >
                  পরিচালনা (Manage)
                </button>
              </div>

              {activePresetTab === "list" ? (
                <>
                  <h3 className="text-xs font-bold text-indigo-600 flex items-center gap-1.5 mb-2 uppercase tracking-wide">
                    <Sparkles className="w-4 h-4" />
                    দ্রুত পণ্য সংযোজন (Quick Stationery Presets)
                  </h3>
                  <p className="text-[11px] text-slate-500 mb-3">
                    পণ্যটিতে ক্লিক করলেই তা সাথে সাথে ভাউচারে যোগ হয়ে যাবে এবং
                    মূল্য স্বয়ংক্রিয়ভাবে হিসাব হবে।
                  </p>

                  {presets.length === 0 ? (
                    <div className="text-center py-6 border border-dashed border-slate-200 rounded-lg text-slate-400 text-xs font-semibold">
                      কোন সংরক্ষিত পণ্য নেই। পরিচালনা ট্যাব থেকে যোগ করুন।
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 max-h-[180px] overflow-y-auto pr-1">
                      {presets.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => insertPresetItem(p)}
                          className="text-[11px] bg-slate-50 hover:bg-indigo-600 hover:text-white px-2.5 py-1.5 rounded-md border border-slate-200 hover:border-indigo-500 text-slate-700 font-semibold transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                        >
                          <span>{p.nameBangali}</span>
                          <span className="opacity-70 font-mono font-medium">
                            ({p.rate}৳)
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4 animate-in fade-in duration-150">
                  {/* Preset Add Form */}
                  <form
                    onSubmit={addCustomPreset}
                    className="bg-slate-50 p-3 rounded-lg border border-slate-200/60 space-y-2"
                  >
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      নতুন পণ্য যুক্ত করুন (Add Preset)
                    </div>
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        placeholder="বাংলা নাম (e.g. খাতা)"
                        value={newPresetBangali}
                        onChange={(e) => setNewPresetBangali(e.target.value)}
                        className="bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm"
                      />
                      <input
                        type="text"
                        placeholder="ইংরেজী নাম (e.g. Notebook)"
                        value={newPresetEnglish}
                        onChange={(e) => setNewPresetEnglish(e.target.value)}
                        className="bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm"
                      />
                    </div>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        placeholder="দর (Rate in Taka)"
                        value={newPresetRate}
                        onChange={(e) => setNewPresetRate(e.target.value)}
                        className="bg-white border border-slate-200 rounded-md px-2 py-1 text-xs font-mono text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm w-40"
                      />
                      <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1 cursor-pointer shadow-sm transition ml-auto"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        যোগ করুন
                      </button>
                    </div>
                    {presetFormError && (
                      <div className="text-[10px] text-red-500 font-semibold">
                        {presetFormError}
                      </div>
                    )}
                  </form>

                  {/* Preset Items List to Delete */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <span>বিদ্যমান পণ্য তালিকা ({presets.length})</span>
                      <button
                        type="button"
                        onClick={resetPresetsToDefault}
                        className="text-[10px] text-indigo-600 hover:text-indigo-700 hover:underline font-bold transition cursor-pointer"
                      >
                        রিসেট (Reset Defaults)
                      </button>
                    </div>

                    <div className="max-h-[140px] overflow-y-auto space-y-1 pr-1 border border-slate-200/60 rounded-md p-1.5 bg-white">
                      {presets.length === 0 ? (
                        <div className="text-center py-4 text-slate-400 text-xs font-medium">
                          কোন পণ্য নেই
                        </div>
                      ) : (
                        presets.map((p, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center text-xs p-1.5 bg-slate-50 rounded border border-slate-105 hover:bg-slate-100/50 transition"
                          >
                            <div className="flex flex-col">
                              <span className="font-semibold text-slate-850 text-[11px]">
                                {p.nameBangali}
                              </span>
                              <span className="text-[9px] text-slate-400 font-medium">
                                {p.nameEnglish}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[11px] font-bold text-indigo-650 bg-indigo-50/50 px-1.5 py-0.5 rounded border border-indigo-100/20">
                                {p.rate}৳
                              </span>
                              <button
                                type="button"
                                onClick={() => deletePresetItem(idx)}
                                className="text-slate-400 hover:text-red-500 p-0.5 rounded hover:bg-slate-200/60 transition cursor-pointer"
                                title="Delete preset"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Form Creator Card */}
          <div className="bg-white rounded-xl p-5 md:p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <h2 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                ভাউচার তথ্য এন্ট্রি (Voucher Form)
              </h2>
              <button
                onClick={startNewVoucher}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 cursor-pointer transition"
                title="Reset active voucher to a fresh blank document"
              >
                <RotateCcw className="w-3 h-3" />
                নতুন খসড়া (New Draft)
              </button>
            </div>

            <form onSubmit={handleFinalize} className="space-y-6">
              {/* Voucher Meta Group */}
              <div className="grid grid-cols-2 gap-4">
                {/* Voucher Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">
                    ভাউচার নং (Voucher No)
                  </label>
                  <input
                    type="text"
                    value={voucher.voucherNumber}
                    disabled={true}
                    onChange={handleVoucherNumberChange}
                    placeholder="V-0001"
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-3 py-2 text-sm font-mono text-slate-850 font-bold tracking-wider transition-all"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">
                    তারিখ (Date)
                  </label>
                  <input
                    type="date"
                    value={voucher.date}
                    onChange={handleDateChange}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 transition-all"
                  />
                </div>
              </div>

              {/* Customer Details Group */}
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">
                    ক্রেতার নাম (Customer Name){" "}
                    <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={voucher.customerName}
                    onChange={handleCustomerNameChange}
                    placeholder="উদা: আব্দুল করিম (e.g. Abdul Karim)"
                    className={`w-full bg-slate-50 border ${errors.customerName ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:bg-white focus:border-indigo-500"} focus:ring-1 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-800 transition-all`}
                  />
                  {errors.customerName && (
                    <span className="text-red-500 text-xs font-medium block mt-1">
                      {errors.customerName}
                    </span>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">
                    ঠিকানা (Customer Address)
                  </label>
                  <input
                    type="text"
                    value={voucher.customerAddress}
                    onChange={handleCustomerAddressChange}
                    placeholder="উদা: লালদীঘি, কক্সবাজার"
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-800 transition-all"
                  />
                </div>
              </div>

              {/* Products Rows Editor */}
              <div className="space-y-3">
                <div className="flex justify-between items-center border-t border-slate-100 pt-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    মালের তালিকা (Product Items)
                  </span>
                  <button
                    type="button"
                    onClick={addProductRow}
                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-md flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>আইটেম যোগ করুন (Add Row)</span>
                  </button>
                </div>

                {errors.products && (
                  <div className="bg-red-50 border border-red-200 p-2.5 rounded-lg text-red-500 text-xs font-semibold">
                    {errors.products}
                  </div>
                )}

                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                  {voucher.products.map((row, index) => (
                    <div
                      key={row.id}
                      className="p-3 bg-slate-50 border border-slate-200/60 rounded-lg relative space-y-2 group hover:border-slate-300 hover:bg-white transition-all animate-in fade-in duration-100"
                    >
                      {/* Row 1: Row indicator + Description input + Delete button */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold font-mono text-slate-400 bg-slate-200/50 px-2 py-1.5 rounded border border-slate-200 shrink-0">
                          #{index + 1}
                        </span>

                        <div className="flex-grow">
                          <input
                            type="text"
                            value={row.description}
                            onChange={(e) =>
                              handleRowChange(
                                row.id,
                                "description",
                                e.target.value,
                              )
                            }
                            placeholder="মালের বিবরণ (Item Details)"
                            className="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 rounded-md px-2.5 py-1.5 text-xs text-slate-800 font-semibold shadow-sm"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => deleteProductRow(row.id)}
                          disabled={voucher.products.length <= 1}
                          className="text-slate-400 hover:text-red-500 disabled:opacity-30 disabled:hover:text-slate-400 p-1.5 rounded hover:bg-slate-200/50 cursor-pointer shrink-0 transition"
                          title="Delete product row"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Row 2: Qty + Rate + Amount (Three column layout) */}
                      <div className="grid grid-cols-12 gap-2">
                        {/* Qty */}
                        <div className="col-span-4 relative flex items-center">
                          <span className="absolute left-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider select-none">
                            পরিমাণ
                          </span>
                          <input
                            type="number"
                            min="1"
                            value={row.quantity || ""}
                            onChange={(e) =>
                              handleRowChange(
                                row.id,
                                "quantity",
                                e.target.value,
                              )
                            }
                            placeholder="Qty"
                            className={`w-full bg-white border ${errors.productRows?.[row.id]?.quantity ? "border-red-500" : "border-slate-200"} focus:border-indigo-500 focus:ring-1 rounded-md pl-11 pr-1.5 py-1.5 text-xs text-center font-mono text-slate-800 shadow-sm`}
                            title="Quantity (positive number)"
                          />
                        </div>

                        {/* Rate */}
                        <div className="col-span-4 relative flex items-center">
                          <span className="absolute left-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider select-none">
                            দর
                          </span>
                          <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={row.rate || ""}
                            onChange={(e) =>
                              handleRowChange(row.id, "rate", e.target.value)
                            }
                            placeholder="Rate"
                            className={`w-full bg-white border ${errors.productRows?.[row.id]?.rate ? "border-red-500" : "border-slate-200"} focus:border-indigo-500 focus:ring-1 rounded-md pl-7 pr-1.5 py-1.5 text-xs text-center font-mono text-slate-800 shadow-sm`}
                            title="Rate (positive number)"
                          />
                        </div>

                        {/* Total Amount Output */}
                        <div className="col-span-4 flex items-center justify-between px-2.5 font-mono font-bold text-xs text-indigo-600 bg-indigo-50/50 rounded border border-indigo-100/40">
                          <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wider select-none">
                            মোট
                          </span>
                          <span>{row.amount.toFixed(1)}৳</span>
                        </div>
                      </div>

                      {/* Row validation errors */}
                      {errors.productRows?.[row.id] && (
                        <div className="text-[10px] text-red-500 flex justify-between px-1">
                          {errors.productRows[row.id].quantity && (
                            <span>
                              পরিমাণ: {errors.productRows[row.id].quantity}
                            </span>
                          )}
                          {errors.productRows[row.id].rate && (
                            <span>দর: {errors.productRows[row.id].rate}</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Preference / Display toggles inside Creator form */}
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  প্রিন্ট ও ডিসপ্লে কনফিগারেশন (Preview Options)
                </span>

                <div className="space-y-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {/* Paper Size Selector */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      কাগজের সাইজ (Paper Size)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaperSize("a4")}
                        className={`py-1.5 px-3 rounded text-xs font-bold transition-all border cursor-pointer ${
                          paperSize === "a4"
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        A4 (Standard)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaperSize("a5")}
                        className={`py-1.5 px-3 rounded text-xs font-bold transition-all border cursor-pointer ${
                          paperSize === "a5"
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        A5 (Half Size)
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-slate-200/60 pt-2.5 grid grid-cols-2 gap-3">
                    {/* English Labels Toggle */}
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={showEnglishLabels}
                        onChange={(e) => setShowEnglishLabels(e.target.checked)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 bg-white"
                      />
                      <span className="text-xs font-semibold text-slate-700">
                        ইংরেজী লেবেল সহ
                      </span>
                    </label>

                    {/* Bengali digits toggle */}
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={useBengaliDigits}
                        onChange={(e) => setUseBengaliDigits(e.target.checked)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 bg-white"
                      />
                      <span className="text-xs font-semibold text-slate-700">
                        বাংলা সংখ্যা ফরম্যাট
                      </span>
                    </label>
                  </div>
                </div>

                {/* Remarks Field */}
                {/* <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">
                    শর্তাবলী
                  </label>
                  <input
                    type="text"
                    value={customRemarks}
                    onChange={(e) => setCustomRemarks(e.target.value)}
                    placeholder="পণ্য ক্রয়ের ৭ দিনের মধ্যে পরিবর্তনযোগ্য।"
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 transition-all"
                  />
                </div> */}
              </div>

              {/* Action row: Save Finalized */}
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white py-3.5 px-4 rounded-lg font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                title="Save this completed voucher and load next serial number"
              >
                <Save className="w-4 h-4" />
                <span>ভাউচারটি সাবমিট করুন (Submit & Next)</span>
              </button>
            </form>
          </div>
        </div>

        {/* Invoice Canvas Preview Column (Right Side - 7/12 columns) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          {/* Inject dynamic print styles for switching page sizes */}
          <style>{`
            @media print {
              @page {
                size: ${paperSize === "a5" ? "A5" : "A4"} portrait !important;
                margin: ${paperSize === "a5" ? "10mm" : "15mm"} !important;
              }
            }
          `}</style>

          {/* Real-time PDF & Print action buttons above the paper preview */}
          <div className="w-full flex flex-wrap justify-between items-center gap-3 mb-4 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm no-print">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              লাইভ প্রিভিউ ({paperSize === "a5" ? "A5" : "A4"} Print Preview)
            </div>

            <div className="flex items-center gap-2">
              {/* PDF button */}
              <PdfGenerator
                elementId="printable-voucher-root"
                voucherNumber={voucher.voucherNumber}
                customerName={voucher.customerName}
                paperSize={paperSize}
              />

              {/* Print Button */}
              <button
                onClick={handlePrint}
                className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg shadow-sm hover:shadow-md text-sm font-semibold transition flex items-center gap-2 cursor-pointer"
                title="Open standard browser print dialog for paper layout"
              >
                <Printer className="w-4 h-4" />
                <span>প্রিন্ট করুন (Print / Save PDF)</span>
              </button>
            </div>
          </div>

          {/* Interactive Digital Paper Preview Canvas Container */}
          <div className="w-full overflow-x-auto pb-4 no-print flex justify-center">
            {/* Aspect ratio container simulating A4/A5 paper look at standard resolution */}
            <div
              id="printable-voucher-root"
              className={`${
                paperSize === "a5"
                  ? "w-[559px] min-h-[794px] p-6"
                  : "w-[794px] min-h-[1123px] p-12"
              } bg-white text-black shadow-xl relative rounded-none border-2 border-black select-none flex flex-col justify-between`}
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
                boxSizing: "border-box",
              }}
            >
              {/* Outer watermark background style to match fancy voucher pads */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.02] border border-black m-2"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, #000000 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />

              {/* Inner Layout */}
              <div className="relative z-10 flex-grow flex flex-col justify-between">
                <div>
                  {/* Voucher Header Component */}
                  <VoucherHeader
                    voucherNumber={voucher.voucherNumber}
                    date={voucher.date}
                    showEnglishLabels={showEnglishLabels}
                  />

                  {/* Customer Information Component */}
                  <CustomerInfo
                    customerName={voucher.customerName}
                    customerAddress={voucher.customerAddress}
                    showEnglishLabels={showEnglishLabels}
                  />

                  {/* Product Table Component */}
                  <ProductTable
                    products={voucher.products.filter(
                      (p) =>
                        p.description.trim() !== "" ||
                        p.quantity > 0 ||
                        p.rate > 0,
                    )}
                    totalAmount={voucher.totalAmount}
                    showEnglishLabels={showEnglishLabels}
                    useBengaliDigits={useBengaliDigits}
                  />
                </div>

                {/* Footer and word conversion Component */}
                <VoucherFooter
                  totalAmount={voucher.totalAmount}
                  showEnglishLabels={showEnglishLabels}
                  customRemarks={customRemarks}
                />
              </div>
            </div>
          </div>

          {/* Absolute printable area duplicate - only rendered during actual native browser window print.
              This guarantees that the preview layout is pristine and avoids styling issues! */}
          <div
            className="hidden print:block print:absolute print:inset-0 print:bg-white print:text-black w-full"
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            <div
              className={`w-full min-h-screen bg-white text-black ${
                paperSize === "a5" ? "p-6" : "p-8"
              } flex flex-col justify-between`}
              style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
            >
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <VoucherHeader
                    voucherNumber={voucher.voucherNumber}
                    date={voucher.date}
                    showEnglishLabels={showEnglishLabels}
                  />

                  <CustomerInfo
                    customerName={voucher.customerName}
                    customerAddress={voucher.customerAddress}
                    showEnglishLabels={showEnglishLabels}
                  />

                  <ProductTable
                    products={voucher.products.filter(
                      (p) =>
                        p.description.trim() !== "" ||
                        p.quantity > 0 ||
                        p.rate > 0,
                    )}
                    totalAmount={voucher.totalAmount}
                    showEnglishLabels={showEnglishLabels}
                    useBengaliDigits={useBengaliDigits}
                  />
                </div>

                <VoucherFooter
                  totalAmount={voucher.totalAmount}
                  showEnglishLabels={showEnglishLabels}
                  customRemarks={customRemarks}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* History modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full shadow-lg overflow-hidden animate-in zoom-in-95 duration-150 text-slate-800">
            {/* Header */}
            <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  সংরক্ষিত ভাউচার রেকর্ডস (Saved Voucher Ledger)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  লোকাল স্টোরেজে সংরক্ষিত বিগত ক্যাশ মেমোর তালিকা
                </p>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content & Search */}
            <div className="p-5 space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="ক্রেতার নাম বা ভাউচার নম্বর দিয়ে খুঁজুন (Search by name or voucher number...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* List */}
              <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
                {filteredHistory.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-xs font-semibold">
                    কোন সংরক্ষিত ভাউচার পাওয়া যায়নি। (No records match the
                    search)
                  </div>
                ) : (
                  filteredHistory.map((item) => (
                    <div
                      key={item.voucherNumber}
                      className="p-3.5 bg-slate-50 hover:bg-white border border-slate-200 rounded-lg flex items-center justify-between gap-4 transition-all hover:shadow-sm"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-100/50">
                            {item.voucherNumber}
                          </span>
                          <span className="font-bold text-slate-800 text-xs">
                            {item.customerName}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1 flex gap-3">
                          <span>তারিখ: {item.date}</span>
                          <span>
                            পরিমাণ:{" "}
                            {
                              item.products.filter(
                                (p) => p.description.trim() !== "",
                              ).length
                            }
                            টি পণ্য
                          </span>
                          <span className="font-mono font-bold text-indigo-600">
                            মোট: {item.totalAmount}৳
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {/* Load Button */}
                        <button
                          onClick={() => {
                            loadVoucher(item);
                            setShowHistoryModal(false);
                          }}
                          className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded transition cursor-pointer shadow-sm"
                        >
                          দেখুন (Load)
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => {
                            if (
                              confirm(
                                `আপনি কি সত্যিই ভাউচার ${item.voucherNumber} মুছে ফেলতে চান?`,
                              )
                            ) {
                              deleteSavedVoucher(item.voucherNumber);
                            }
                          }}
                          className="p-1.5 bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded transition border border-slate-200 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 text-right text-[11px] text-slate-500">
              পরবর্তী বরাদ্দকৃত নম্বর:{" "}
              <strong className="font-mono text-indigo-600 font-bold">
                {getNextVoucherNumberStr()}
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* Footer copyright */}
      <footer className="bg-white py-5 text-center border-t border-slate-200 text-xs text-slate-500 no-print mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <p>
            © {new Date().getFullYear()} সোনালী পেপার এন্ড স্টেশনারী। সর্বস্বত্ব
            সংরক্ষিত।
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Designed with A4 printing pixel accuracy and automatic offline cache
            integration.
          </p>
        </div>
      </footer>
    </div>
  );
}
