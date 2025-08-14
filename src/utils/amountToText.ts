export function numberToIndianCurrencyWords(amount) {
    if (isNaN(amount)) return "Invalid amount";

    const a = [
        "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
        "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
        "Sixteen", "Seventeen", "Eighteen", "Nineteen"
    ];
    const b = [
        "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
    ];

    const numToWords = (n, suffix) => {
        let str = "";
        if (n > 19) {
            str += b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
        } else {
            str += a[n];
        }
        return str ? str + (suffix ? " " + suffix : "") + " " : "";
    };

    const convert = (num) => {
        let output = "";
        output += numToWords(Math.floor(num / 10000000), "Crore");
        output += numToWords(Math.floor((num / 100000) % 100), "Lakh");
        output += numToWords(Math.floor((num / 1000) % 100), "Thousand");
        output += numToWords(Math.floor((num / 100) % 10), "Hundred");
        if (num > 100 && num % 100 > 0) output += "and ";
        output += numToWords(num % 100, "");
        return output.trim();
    };

    const [rupeesPart, paisePart] = amount.toString().split(".").map(Number);

    let result = "";
    if (rupeesPart > 0) {
        result += convert(rupeesPart) + " Rupees ";
    }
    if (paisePart > 0) {
        result += convert(paisePart) + " Paise ";
    }
    return result.trim() + " Only";
}
