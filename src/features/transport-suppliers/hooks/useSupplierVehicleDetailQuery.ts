import { useQuery } from "@tanstack/react-query";
import { fetchSupplierVehicle } from "../api/transportVehiclesApi";
import { supplierVehiclesQueryKey } from "./useSupplierVehiclesQuery";

export function useSupplierVehicleDetailQuery(supplierId: number, vehicleId: number | null) {
  return useQuery({
    queryKey: [...supplierVehiclesQueryKey(supplierId), "detail", vehicleId ?? 0],
    queryFn: () => fetchSupplierVehicle(supplierId, vehicleId as number),
    enabled: vehicleId !== null,
    refetchOnWindowFocus: false,
  });
}
