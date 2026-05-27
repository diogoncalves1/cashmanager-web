export interface ConversionResult {
  result: number;
  rate: number;
  from: string;
  to: string;
  amount: number;
  timestamp: Date;
}

export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
}
