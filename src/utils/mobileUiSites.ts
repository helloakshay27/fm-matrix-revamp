/**
 * Mobile UI revamp — site gate
 * ----------------------------
 * Mobile view ke jo UI changes kiye gaye hain (EnhancedTable ka card/list view,
 * header ka sidebar hamburger, mobile logo, sidebar collapse band karna, task /
 * sprint detail pages ka responsive layout, login page) — wo SIRF neeche di gayi
 * sites par chalte hain. Baaki tenants (Oman, Vi, Club, Vendor, Pulse, Zycus,
 * Prime Support, ...) ka behaviour bilkul pehle jaisa rehta hai, aur laptop view
 * har jagah untouched hai.
 *
 * Host spellings: dono variants rakhe hain kyunki codebase me
 * "fm-matrix.lockated.com" / "lockated.gophygital.work" milte hain, jabki
 * inhe kabhi "fm.matrix.lockated.com" / "gophygital.lockated.work" bhi likha
 * jaata hai — jo bhi actual host ho, check fail nahi hona chahiye.
 */
const ENABLED_HOSTS = [
  "lockated.gophygital.work",
  "gophygital.lockated.work",
  "fm-matrix.lockated.com",
  "fm.matrix.lockated.com",
];

/**
 * Dev hosts — sirf apni machine par testing ke liye (localhost aur `npm run dev`
 * ka Network URL, jaise http://10.220.19.33:5173, jo phone se kholte waqt aata
 * hai). Agar dev par bhi ye changes nahi chahiye, DEV_HOSTS wali line aur
 * isPrivateLanHost wala check hata dein.
 */
const DEV_HOSTS = ["localhost", "127.0.0.1"];

const isPrivateLanHost = (host: string): boolean =>
  /^10\./.test(host) ||
  /^192\.168\./.test(host) ||
  /^172\.(1[6-9]|2\d|3[01])\./.test(host);

export const isMobileUiSite = (): boolean => {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return (
    ENABLED_HOSTS.some((h) => host.includes(h)) ||
    DEV_HOSTS.some((h) => host.includes(h)) ||
    isPrivateLanHost(host)
  );
};
