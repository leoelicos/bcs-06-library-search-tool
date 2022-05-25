const searchTextEl = document.getElementById('search-text');
const searchFormatEl = document.getElementById('search-format');
const submitBtnEl = document.getElementById('submit-button');
const backBtnEl = document.getElementById('back-button');

const formSubmitHandler = (e) => {
	e.preventDefault();
	const searchText = searchTextEl.value.trim();
	if (!searchText) {
		alert('Please enter something to search');
		return;
	}
	const searchFormat = searchFormatEl.value;
	const url = `/public/pages/results.html?q=${searchText}&format=${searchFormat}`;
	location.replace(url);
};

submitBtnEl.addEventListener('click', formSubmitHandler);

const backHandler = (e) => {
	e.preventDefault();
	const url = `/index.html`;
	location.replace(url);
};

backBtnEl.addEventListener('click', backHandler);

const getQuery = () => {
	const params = new Proxy(new URLSearchParams(window.location.search), {
		get: (searchParams, prop) => searchParams.get(prop)
	});
	const searchText = params.q;
	const searchFormat = params.format;

	return { searchText, searchFormat };
};

const locSearch = async (searchText) => {
	const query = `https://loc.gov/search/?q=${searchText}&fo=json`;
	const res = await fetch(query);
	return res.json();
};

const locSearchFormat = async (searchText, searchFormat) => {
	const query = `https://loc.gov/${searchFormat}/?q=${searchText}&fo=json`;
	const resObject = await fetch(query);
	return resObject.json();
};

// map title, date, subjects, description, and a link to read more
const mapData = (results) =>
	results.map((result) => {
		return {
			title: result.title,
			url: result.url,
			date: result.date,
			subjects: result.subject,
			description: result.description
		};
	});

const resultsContainer = document.getElementById('search-results');

// helper function to create elements
const textElement = (type, text) => {
	const el = document.createElement(type);
	el.textContent = text;
	return el;
};

const renderResults = (data) => {
	if (!data.length) {
		resultsContainer.append(textElement('p', 'Unfortunately, no results were found'));
		return;
	}

	const list = document.createElement('ul');
	data.forEach((book) => {
		const listItem = document.createElement('li');

		listItem.append(textElement('h2', book.title));

		if (book.date) {
			const bookDate = textElement('p', book.date);
			const bookDateLabel = textElement('strong', 'Date: ');
			bookDate.prepend(bookDateLabel);
			listItem.append(bookDate);
		}

		if (book.subjects) {
			const bookSubjects = textElement('p', book.subjects.join(', '));
			const bookSubjectsLabel = textElement('strong', 'Subjects: ');
			bookSubjects.prepend(bookSubjectsLabel);
			listItem.append(bookSubjects);
		}

		if (book.description) {
			const bookDescription = textElement('p', book.description);
			const bookDescriptionLabel = textElement('strong', 'Description: ');
			bookDescription.prepend(bookDescriptionLabel);
			listItem.append(bookDescription);
		}

		const readMoreButton = textElement('a', 'Read more');
		readMoreButton.classList.add('read-more-button');
		readMoreButton.setAttribute('href', book.url);
		readMoreButton.setAttribute('target', '_blank');

		listItem.append(readMoreButton);

		list.append(listItem);
	});
	resultsContainer.append(list);
};

const titleLabel = document.getElementById('search-query');

const init = async () => {
	// extract text and format from the URL
	const queryObject = getQuery();
	const { searchText, searchFormat } = queryObject;

	// call LOC Search API if no format is specified, else call LOC Search By Format API
	let response;
	if (searchFormat === 'default') {
		response = await locSearch(searchText);
	} else {
		response = await locSearchFormat(searchText, searchFormat);
	}

	titleLabel.innerText = 'Showing results for ' + searchText;

	// destructure results from LOC response
	const { results } = await response;

	// map the results with only the data we want
	const data = await mapData(results);

	renderResults(data);
};

init();
