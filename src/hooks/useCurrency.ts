import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addCurrency as addCurrencyThunk } from "@/store/slices/currencySlice";

export const useCurrency = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => (state as any)?.getCurrency?.data) as any[] | undefined;

  const addCurrency = async (args: { baseUrl: string; token: string; data: any }) => {
    // Expose an API that callers can use without importing dispatch
    return await dispatch(addCurrencyThunk(args)).unwrap();
  };

  return {
    currencies: Array.isArray(data) ? data : [],
    addCurrency,
  };
};
