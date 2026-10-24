console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// let navLinks = $$("nav a");

// let currentLink = navLinks.find(
//   (a) => a.host === location.host && a.pathname === location.pathname,
// );

// currentLink?.classList.add('current');


let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'resume/', title: 'Resume' },
  { url: 'contact/', title: 'Contact' },
  { url: 'https://github.com/sugar-glider27', title: 'GitHub' }
];

let nav = document.createElement('nav');
document.body.prepend(nav);

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"                  // Local server
  : "/portfolio/";         // GitHub Pages repo name, replace with sugar-glider27.github.io??

for (let p of pages) {
  let url = p.url;
  let title = p.title;
  // create link and add it to nav
  url = !url.startsWith('http') ? BASE_PATH + url : url;
  // nav.insertAdjacentHTML('beforeend', `<a href="${url}">${title}</a>`);
  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;
  nav.append(a);

  if (a.host === location.host && a.pathname === location.pathname) {
    a.classList.add('current');
  }

  if (a.host !== location.host) {
   a.target = '_blank';
  }
}


document.body.insertAdjacentHTML(
  'afterbegin',
  `
	<label class="color-scheme">
		Theme:
		<select>
			<option value="light dark">Auto🌓</option>
      <option value="light">Light🌕</option>
      <option value="dark">Dark🌑</option>
		</select>
	</label>`,
);

let select = document.querySelector('select');

if ("colorScheme" in localStorage) {
  document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);
  select.value = localStorage.colorScheme;
}

select.addEventListener('input', function (event) {
  console.log('color scheme changed to', event.target.value);

  document.documentElement.style.setProperty('color-scheme', event.target.value);

  localStorage.colorScheme = event.target.value;
});


let form = document.querySelector('form');
form?.addEventListener('submit', function (event) {
  event.preventDefault();

  let url = form.action + "?";

  let data = new FormData(form);

  for (let [name, value] of data) {
    console.log(name, encodeURIComponent(value));
    url += name + "=" + encodeURIComponent(value) + "&";
  }

  location.href = url;
});


// Projects page (lab04)

export async function fetchJSON(url) {
  try {
    // Fetch the JSON file from the given URL
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
    return [];
  }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  if (!containerElement) {
    console.error('Invalid container');
    return;
  }
  
  containerElement.innerHTML = '';

  if (projects.length === 0) {
    containerElement.innerHTML = '<p>No projects found.</p>';
    return;
  }

  const validHead = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

  if (!validHead.includes(headingLevel)) {
    headingLevel = 'h2';
  }

  for (const proj of projects) {
    const article = document.createElement('article');
    
    article.innerHTML = `
      <${headingLevel}>${proj.title}</${headingLevel}>
      <p class="project-year">${proj.year}</p>
      <img src="${proj.image}" alt="${proj.title}">
      <p>${proj.description}</p>
    `;

    containerElement.appendChild(article);
  }
}



// API stuff

export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}