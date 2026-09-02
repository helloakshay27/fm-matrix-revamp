/**
 * RULE ENGINE — SHARED DESIGN TOKENS
 * ----------------------------------
 * Pehle Rule Engine ke har file me apna `const T = {...}` tha (8 copies), aur
 * wo dheere-dheere alag ho gaye the — kahin primary `#DA7756` to kahin
 * `#C4B89D`, do alag green, do alag border grey. Isliye ek hi module ke andar
 * tabs alag-alag dikhte the.
 *
 * Ab sab yahi se import karte hain. Values `src/styles/theme.css` ke brand
 * tokens se map hoti hain (comment me variable name diya hai) — koi naya brand
 * color introduce nahi kiya gaya.
 *
 * NOTE: ye plain hex isliye hai (CSS var nahi) kyunki ye tokens inline
 * `style={{ ... }}` me use hote hain jahan Tailwind ke brand-* classes nahi
 * chal sakte. Brand color badle to yahan bhi badalna hoga.
 */
export const T = {
  /** --color-primary */
  primary: "#DA7756",
  /** --color-primary-hover ka solid equivalent */
  primaryHov: "#c9673f",
  /** primary ka sabse halka tint — selected/soft backgrounds ke liye */
  primaryBg: "#fdf9f7",
  /** cards aur inputs ka default border */
  primaryBord: "#e8e3de",
  /** --color-bg — page/raised surface */
  pageBg: "#f6f4ee",
  /** --color-card-white */
  cardBg: "#ffffff",

  textMain: "#1a1a1a",
  textMuted: "#6b7280",
  borderLgt: "#ebebeb",

  /** --color-growth-solid — success / completed */
  done: "#108c72",
  /** warning text (light --color-warning text ke liye padhne layak nahi hai) */
  warn: "#b45309",
  /** error text (light --color-error text ke liye padhne layak nahi hai) */
  danger: "#b91c1c",
  /** --color-error — error fills / borders ke liye */
  dangerSoft: "#e7848e",

  /** RuleCanvas node accents — chart palette se */
  /** --color-info */
  trigger: "#6b9bcc",
  /** --color-warning */
  condition: "#edc488",
  /** --color-secondary-green */
  action: "#798c5e",

  font: "'Poppins', sans-serif",
} as const;

export default T;

/**
 * Text inputs / selects ka common inline style. Ye pehle module ke 7 files me
 * bilkul same copy-paste tha — ab yahi se aata hai.
 */
export const inputStyle = {
  borderColor: T.primaryBord,
  color: T.textMain,
  background: T.cardBg,
} as const;
