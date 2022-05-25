const searchTextEl = document.getElementById('search-text');
const searchFormatEl = document.getElementById('search-format');
const submitBtnEl = document.getElementById('submit-button');
const formSubmitHandler = (e) => {
	e.preventDefault();

	const searchText = searchTextEl.value.trim();

	if (!searchText) {
		alert('Please enter something to search');
		return;
	}

	const searchFormat = searchFormatEl.value;

	const url = `public/pages/results.html?q=${searchText}&format=${searchFormat}`;

	location.replace(url);
};
submitBtnEl.addEventListener('click', formSubmitHandler);
