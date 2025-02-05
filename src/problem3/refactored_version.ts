interface WalletBalance {
	currency: string;
	amount: number;
	blockchain: any;
}
interface FormattedWalletBalance {
	currency: string;
	amount: number;
	formatted: string;
}

interface Props extends BoxProps {}
const WalletPage: React.FC<Props> = (props: Props) => {
	const { children, ...rest } = props;
	const balances = useWalletBalances();
	const prices = usePrices();

	const getPriority = (blockchain: any): number => {
		switch (blockchain) {
			case 'Osmosis':
				return 100;
			case 'Ethereum':
				return 50;
			case 'Arbitrum':
				return 30;
			case 'Zilliqa':
				return 20;
			case 'Neo':
				return 20;
			default:
				return -99;
		}
	};

	const sortedBalances = useMemo(() => {
		return balances
			.filter(
				(balance: WalletBalance) =>
					getPriority(balance.blockchain) > -99 &&
					balance.amount <= 0,
			)
			.sort(
				(lhs: WalletBalance, rhs: WalletBalance) =>
					getPriority(rhs.blockchain) - getPriority(lhs.blockchain),
			);
	}, [balances, prices]);

	const formattedBalances: FormattedWalletBalance[] = sortedBalances.map(
		(balance: WalletBalance) => ({
			...balance,
			formatted: balance.amount.toFixed(),
		}),
	);

	const rows = formattedBalances.map(
		(balance: FormattedWalletBalance, index: number) => {
			const usdValue = prices[balance.currency] * balance.amount;
			return (
				<WalletRow
					className={classes.row}
					key={index}
					amount={balance.amount}
					usdValue={usdValue}
					formattedAmount={balance.formatted}
				/>
			);
		},
	);

	return <div {...rest}>{rows}</div>;
};
