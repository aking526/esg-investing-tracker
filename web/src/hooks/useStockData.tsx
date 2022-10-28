import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ISA from "../types/ISA";
import { convertStockData, CPair } from "../classes/CPair";
import StockApi from "../api/StockApi";

export function useStockData(ticker: string, spcLen: string, from: number, to: number) {
	const [stockPrices, setStockPrices] = useState<CPair[]>([]);

	const queryClient = useQueryClient();

	const sp = useQuery([`${ticker}_stock_prices`, spcLen, from], async () => {
		if (ticker === "" || ticker === undefined || !ticker) return { message: "No Ticker" };

		const cachedStockData: ISA | undefined = queryClient.getQueryData([`${ticker}_stock_prices`, spcLen, from]);
		if (cachedStockData) {
			return cachedStockData;
		}

		return await StockApi.fetchStockInfo(ticker, "D", from, to);
	}, {
		onSuccess: (res) => {
			if (!res) return;
			setStockPrices(convertStockData(res, "c"));
		}
	});

	if (!ticker) {
		queryClient.removeQueries([`${ticker}_stock_prices`]);
	}

	return { prices: stockPrices, isLoading: sp.isLoading, isError: sp.isError, error: sp.error };
}