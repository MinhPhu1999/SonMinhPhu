interface WalletBalance {
	currency: string;
	amount: number;
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
		return (
			balances
				.filter((balance: WalletBalance) => {
					const balancePriority = getPriority(balance.blockchain);
					// Issue: The variable lhsPriority is undefined in the scope, making this code incorrect.
					if (lhsPriority > -99) {
						if (balance.amount <= 0) {
							return true;
						}
					}
					return false;
				})
				// Issue: the type WalletBalance does not contains blockchain
				.sort((lhs: WalletBalance, rhs: WalletBalance) => {
					const leftPriority = getPriority(lhs.blockchain);
					const rightPriority = getPriority(rhs.blockchain);

					// Issue: The sorting function does not return 0 for equal values, which can cause inconsistent sorting behavior.
					if (leftPriority > rightPriority) {
						return -1;
					} else if (rightPriority > leftPriority) {
						return 1;
					}
				})
		);
		// Issue: The useMemo hook is used to compute sortedBalances, but it depends on prices, even though prices is not used within the computation.
	}, [balances, prices]);

	// Issue: formattedBalances is defined but not used
	const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
		return {
			...balance,
			formatted: balance.amount.toFixed(),
		};
	});

	// Issue: The type FormattedWalletBalance is not yet assigned to sortedBalances.
	const rows = sortedBalances.map(
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
