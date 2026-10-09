import { toast, type ExternalToast } from "sonner";

/**
 * Accounting feedback toast: bottom-centred ink toast (styled by
 * `.acc-toast` in src/styles/accounting.css). Same API as sonner's `toast`.
 */
const withDefaults = (data?: ExternalToast): ExternalToast => ({
  position: "bottom-center",
  duration: 2400,
  ...data,
  className: ["acc-toast", data?.className].filter(Boolean).join(" "),
});

type Message = Parameters<typeof toast>[0];

export const accountingToast = Object.assign(
  (message: Message, data?: ExternalToast) => toast(message, withDefaults(data)),
  {
    success: (message: Message, data?: ExternalToast) =>
      toast.success(message, withDefaults(data)),
    error: (message: Message, data?: ExternalToast) =>
      toast.error(message, withDefaults(data)),
    warning: (message: Message, data?: ExternalToast) =>
      toast.warning(message, withDefaults(data)),
    info: (message: Message, data?: ExternalToast) =>
      toast.info(message, withDefaults(data)),
    message: (message: Message, data?: ExternalToast) =>
      toast.message(message, withDefaults(data)),
    loading: (message: Message, data?: ExternalToast) =>
      toast.loading(message, withDefaults(data)),
    dismiss: toast.dismiss,
  }
);
