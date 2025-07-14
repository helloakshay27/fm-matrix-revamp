export interface ColumnConfig {
  key: string;
  label: string;
  sortable?: boolean;
}

export interface EnhancedTableProps<T = any> {
  data: T[];
  columns: ColumnConfig[];
  renderCell?: (item: T, columnKey: string) => React.ReactNode;
  [key: string]: any;
}