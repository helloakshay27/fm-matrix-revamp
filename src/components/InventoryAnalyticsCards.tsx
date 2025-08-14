import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ItemsStatusData,
  CategoryWiseData,
  GreenConsumptionData,
  ConsumptionReportGreenData,
  ConsumptionReportNonGreenData,
  MinimumStockData
} from '@/store/slices/inventoryAnalyticsSlice';
import { Activity, Package, Leaf, BarChart3, AlertTriangle, CheckCircle } from 'lucide-react';

interface InventoryAnalyticsCardsProps {
  itemsStatus?: ItemsStatusData | null;
  categoryWise?: CategoryWiseData | null;
  greenConsumption?: GreenConsumptionData | null;
  consumptionReportGreen?: ConsumptionReportGreenData | null;
  consumptionReportNonGreen?: ConsumptionReportNonGreenData | null;
  minimumStockNonGreen?: MinimumStockData | null;
  minimumStockGreen?: MinimumStockData | null;
}

export function InventoryAnalyticsCards({
  itemsStatus,
  categoryWise,
  greenConsumption,
  consumptionReportGreen,
  consumptionReportNonGreen,
  minimumStockNonGreen,
  minimumStockGreen
}: InventoryAnalyticsCardsProps) {

  return (
    <div className="space-y-6">
      {/* Items Status Card */}
      {itemsStatus && (
        <Card className="bg-white border-[hsl(var(--analytics-border))]">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-[hsl(var(--analytics-text))] flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Items Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-700">{itemsStatus.count_of_active_items}</div>
                <div className="text-sm text-green-600">Active Items</div>
                <div className="text-xs text-green-500 mt-1">{itemsStatus.info_active_items}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-gray-700">{itemsStatus.count_of_inactive_items}</div>
                <div className="text-sm text-gray-600">Inactive Items</div>
                <div className="text-xs text-gray-500 mt-1">{itemsStatus.info_inactive_items}</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="text-2xl font-bold text-red-700">{itemsStatus.count_of_critical_items}</div>
                <div className="text-sm text-red-600">Critical Items</div>
                <div className="text-xs text-red-500 mt-1">{itemsStatus.info_critical_items}</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-700">{itemsStatus.count_of_non_critical_items}</div>
                <div className="text-sm text-blue-600">Non-Critical Items</div>
                <div className="text-xs text-blue-500 mt-1">{itemsStatus.info_non_critical_items}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Green Consumption Card */}
      {greenConsumption && (
        <Card className="bg-white border-[hsl(var(--analytics-border))]">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-[hsl(var(--analytics-text))] flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-600" />
              Green Product Consumption
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-700">{greenConsumption.info.info}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[hsl(var(--analytics-border))]">
                    <th className="text-left p-2 font-medium text-[hsl(var(--analytics-text))]">Date</th>
                    <th className="text-left p-2 font-medium text-[hsl(var(--analytics-text))]">Product</th>
                    <th className="text-left p-2 font-medium text-[hsl(var(--analytics-text))]">Opening</th>
                    <th className="text-left p-2 font-medium text-[hsl(var(--analytics-text))]">Addition</th>
                    <th className="text-left p-2 font-medium text-[hsl(var(--analytics-text))]">Consumption</th>
                    <th className="text-left p-2 font-medium text-[hsl(var(--analytics-text))]">Current Stock</th>
                    <th className="text-left p-2 font-medium text-[hsl(var(--analytics-text))]">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {greenConsumption.response.slice(0, 5).map((item, index) => (
                    <tr key={index} className="border-b border-[hsl(var(--analytics-border))]/30">
                      <td className="p-2 text-[hsl(var(--analytics-text))]">{item.date}</td>
                      <td className="p-2 text-[hsl(var(--analytics-text))] font-medium">{item.product}</td>
                      <td className="p-2 text-[hsl(var(--analytics-text))]">{item.opening} {item.unit}</td>
                      <td className="p-2 text-green-600">+{item.addition} {item.unit}</td>
                      <td className="p-2 text-red-600">-{item.consumption} {item.unit}</td>
                      <td className="p-2 text-[hsl(var(--analytics-text))] font-medium">{item.current_stock} {item.unit}</td>
                      <td className="p-2 text-[hsl(var(--analytics-text))]">{localStorage.getItem('currency')}{item.cost.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {greenConsumption.response.length > 5 && (
                <div className="text-center p-3 text-sm text-[hsl(var(--muted-foreground))]">
                  Showing 5 of {greenConsumption.response.length} entries
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Consumption Report Green Card */}
      {consumptionReportGreen && (
        <Card className="bg-white border-[hsl(var(--analytics-border))]">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-[hsl(var(--analytics-text))] flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              Green Products Consumption Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-700">{consumptionReportGreen.info.info}</p>
            </div>
            <div className="grid gap-3">
              {Object.entries(consumptionReportGreen.response).map(([product, consumption]) => (
                <div key={product} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-[hsl(var(--analytics-text))]">{product}</span>
                  </div>
                  <span className="text-lg font-bold text-green-700">{consumption} units</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Minimum Stock Cards */}
      {(minimumStockGreen || minimumStockNonGreen) && (
        <div className="grid lg:grid-cols-2 gap-6">
          {minimumStockGreen && (
            <Card className="bg-white border-[hsl(var(--analytics-border))]">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-[hsl(var(--analytics-text))] flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Green Products Stock Levels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {minimumStockGreen.response.map((item, index) => {
                    const [productName, stockData] = Object.entries(item)[0];
                    const isLowStock = stockData.Current_Stock < parseFloat(stockData.Minimum_Stock);
                    return (
                      <div key={index} className={`p-3 rounded-lg border ${isLowStock ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-[hsl(var(--analytics-text))]">{productName}</span>
                          {isLowStock && <AlertTriangle className="h-4 w-4 text-red-600" />}
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span className={isLowStock ? 'text-red-600' : 'text-green-600'}>
                            Current: {stockData.Current_Stock}
                          </span>
                          <span className="text-gray-600">
                            Min: {stockData.Minimum_Stock}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {minimumStockNonGreen && (
            <Card className="bg-white border-[hsl(var(--analytics-border))]">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-[hsl(var(--analytics-text))] flex items-center gap-2">
                  <Package className="h-5 w-5 text-gray-600" />
                  Non-Green Products Stock Levels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {minimumStockNonGreen.response.map((item, index) => {
                    const [productName, stockData] = Object.entries(item)[0];
                    const isLowStock = stockData.Current_Stock < parseFloat(stockData.Minimum_Stock);
                    return (
                      <div key={index} className={`p-3 rounded-lg border ${isLowStock ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-[hsl(var(--analytics-text))]">{productName}</span>
                          {isLowStock && <AlertTriangle className="h-4 w-4 text-red-600" />}
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span className={isLowStock ? 'text-red-600' : 'text-gray-600'}>
                            Current: {stockData.Current_Stock}
                          </span>
                          <span className="text-gray-600">
                            Min: {stockData.Minimum_Stock}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}