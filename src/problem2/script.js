let prices = [];

async function fetchPrices() {
	try {
		const response = await fetch(
			'https://interview.switcheo.com/prices.json',
		);
		prices = await response.json();
		populateDropdowns();
	} catch (error) {
		console.error('Error fetching prices:', error);
	}
}

function populateDropdowns() {
	const fromDropdown = document.getElementById('fromCurrency');
	const toDropdown = document.getElementById('toCurrency');
	fromDropdown.innerHTML = '';
	toDropdown.innerHTML = '';

	prices.forEach(price => {
		fromDropdown.innerHTML += `<option value="${price.price}">${price.currency}</option>`;
		toDropdown.innerHTML += `<option value="${price.price}">${price.currency}</option>`;
	});
}

function convertCurrency(inputId, outputId) {
	const fromCurrency = document.getElementById('fromCurrency').value;
	const toCurrency = document.getElementById('toCurrency').value;
	const amount = parseFloat(document.getElementById(inputId).value);
	const convertedAmountElement = document.getElementById(outputId);

	if (fromCurrency && toCurrency) {
		const rate = fromCurrency / toCurrency;
		const convertedAmount = (amount * rate).toFixed(6);
		convertedAmountElement.value = convertedAmount;
	} else {
		convertedAmountElement.value = 'Conversion error';
	}
}

function onConfirmSwap() {
	const fromCurrency = document.getElementById('fromCurrency');
	const toCurrency = document.getElementById('toCurrency');

	const fromCurrencyValue = fromCurrency.value;
	const toCurrencyValue = toCurrency.value;

	fromCurrency.value = toCurrencyValue;
	toCurrency.value = fromCurrencyValue;

	convertCurrency(`input-amount`, `output-amount`);
}

fetchPrices();
