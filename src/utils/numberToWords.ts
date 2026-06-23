export function numberToEnglishWords(num: number): string {
  if (num === 0) return "Zero Taka Only";

  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];
  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
  ];

  function convertLessThanThousand(n: number): string {
    if (n < 20) return ones[n];
    const digit = n % 10;
    if (n < 100) return tens[Math.floor(n / 10)] + (digit ? "-" + ones[digit] : "");
    const hundredDigit = Math.floor(n / 100);
    const remainder = n % 100;
    return ones[hundredDigit] + " Hundred" + (remainder ? " and " + convertLessThanThousand(remainder) : "");
  }

  let words = "";
  let temp = Math.floor(num);

  // In Indian numbering system (Crore, Lakh, Thousand) which fits Taka formatting:
  const crore = Math.floor(temp / 10000000);
  temp %= 10000000;
  
  const lakh = Math.floor(temp / 100000);
  temp %= 100000;

  const thousand = Math.floor(temp / 1000);
  temp %= 1000;

  if (crore > 0) {
    words += convertLessThanThousand(crore) + " Crore ";
  }
  if (lakh > 0) {
    words += convertLessThanThousand(lakh) + " Lakh ";
  }
  if (thousand > 0) {
    words += convertLessThanThousand(thousand) + " Thousand ";
  }
  if (temp > 0) {
    words += convertLessThanThousand(temp) + " ";
  }

  const paisa = Math.round((num - Math.floor(num)) * 100);
  let paisaWords = "";
  if (paisa > 0) {
    paisaWords = " and " + convertLessThanThousand(paisa) + " Paisa";
  }

  return (words.trim() + " Taka" + paisaWords + " Only").trim();
}

export function numberToBengaliWords(num: number): string {
  if (num === 0) return "শূন্য টাকা মাত্র";

  const ones: { [key: number]: string } = {
    0: "শূন্য", 1: "এক", 2: "দুই", 3: "তিন", 4: "চার", 5: "পাঁচ", 6: "ছয়", 7: "সাত", 8: "আট", 9: "নয়",
    10: "দশ", 11: "এগারো", 12: "বারো", 13: "তেরো", 14: "চৌদ্দ", 15: "পনেরো", 16: "ষোলো", 17: "সতেরো", 18: "আঠারো", 19: "উনিশ",
    20: "বিশ", 21: "একুশ", 22: "বাইশ", 23: "তেইশ", 24: "চব্বিশ", 25: "পঁচিশ", 26: "ছাব্বিশ", 27: "সাতাশ", 28: "আটাশ", 29: "উনত্রিশ",
    30: "ত্রিশ", 31: "একত্রিশ", 32: "বত্রিশ", 33: "তেত্রিশ", 34: "চৌত্রিশ", 35: "পঁয়ত্রিশ", 36: "ছত্রিশ", 37: "সাতত্রিশ", 38: "আটত্রিশ", 39: "ঊনচল্লিশ",
    40: "চল্লিশ", 41: "একচল্লিশ", 42: "বিয়াল্লিশ", 43: "তিতাল্লিশ", 44: "চৌয়াল্লিশ", 45: "পঁয়তাল্লিশ", 46: "চল্লিশ", 47: "সাতচল্লিশ", 48: "আটচল্লিশ", 49: "ঊনপঞ্চাশ",
    50: "পঞ্চাশ", 51: "একান্ন", 52: "বায়ান্ন", 53: "তিপ্পান্ন", 54: "চৌয়ান্ন", 55: "পঞ্চান্ন", 56: "ছাপ্পান্ন", 57: "সাতান্ন", 58: "আটান্ন", 59: "ঊনষাট",
    60: "ষাট", 61: "একষট্টি", 62: "বাষট্টি", 63: "তেষট্টি", 64: "চৌষট্টি", 65: "পঁয়ষট্টি", 66: "ছেষট্টি", 67: "সাতষট্টি", 68: "আটষট্টি", 69: "ঊনসত্তর",
    70: "সত্তর", 71: "একাত্তর", 72: "বাহাত্তর", 73: "তিয়াত্তর", 74: "চৌহাত্তর", 75: "পঁচাত্তর", 76: "ছিয়াত্তর", 77: "সাতাত্তর", 78: "আটাত্তর", 79: "ঊনআশি",
    80: "আশি", 81: "একাশি", 82: "বিয়াশি", 83: "তিরাশি", 84: "চৌরাশি", 85: "পঁচাশি", 86: "ছিয়াশি", 87: "সাতাশি", 88: "অষ্টআশি", 89: "ঊননব্বই",
    90: "নব্বই", 91: "একানব্বই", 92: "বিয়ানব্বই", 93: "তিরানব্বই", 94: "চৌরানব্বই", 95: "পঁচানব্বই", 96: "ছিয়ানব্বই", 97: "সাতানব্বই", 98: "আটানব্বই", 99: "নিরানব্বই"
  };

  function convertLessThanHundred(n: number): string {
    return ones[n] || "";
  }

  function convertLessThanThousand(n: number): string {
    let result = "";
    if (n >= 100) {
      const hundredDigit = Math.floor(n / 100);
      result += ones[hundredDigit] + " শত ";
      n %= 100;
    }
    if (n > 0) {
      result += convertLessThanHundred(n);
    }
    return result.trim();
  }

  let words = "";
  let temp = Math.floor(num);

  const koti = Math.floor(temp / 10000000);
  temp %= 10000000;

  const lokkho = Math.floor(temp / 100000);
  temp %= 100000;

  const hajar = Math.floor(temp / 1000);
  temp %= 1000;

  if (koti > 0) {
    words += convertLessThanThousand(koti) + " কোটি ";
  }
  if (lokkho > 0) {
    words += convertLessThanThousand(lokkho) + " লাখ ";
  }
  if (hajar > 0) {
    words += convertLessThanThousand(hajar) + " হাজার ";
  }
  if (temp > 0) {
    words += convertLessThanThousand(temp) + " ";
  }

  const paisa = Math.round((num - Math.floor(num)) * 100);
  let paisaWords = "";
  if (paisa > 0) {
    paisaWords = " এবং " + convertLessThanThousand(paisa) + " পয়সা";
  }

  return (words.trim() + " টাকা" + paisaWords + " মাত্র").trim();
}

// Convert numbers in string to Bengali digits
export function toBengaliNumber(num: number | string): string {
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(num).replace(/[0-9]/g, (digit) => bengaliDigits[parseInt(digit, 10)]);
}
