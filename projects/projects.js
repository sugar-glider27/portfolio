import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');

renderProjects(projects, projectsContainer, 'h2');

const projectTitle = document.querySelector('.projects-title');

projectTitle.textContent = `${projects.length} Projects`;


// pie chart
let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

// let rolledData = d3.rollups(
//   projects,
//   (v) => v.length,
//   (d) => d.year,
// );

// let data = rolledData.map(([year, count]) => {
//   return { value: count, label: year };
// });
let colors = d3.scaleOrdinal(d3.schemeTableau10);
// let sliceGenerator = d3.pie().value((d) => d.value);
// let arcData = sliceGenerator(data);
// let arcs = arcData.map((d) => arcGenerator(d));

// arcs.forEach((arc, idx) => {
//   d3.select('svg').append('path').attr('d', arc).attr('fill', colors(idx));
// });

// let legend = d3.select('.legend');
// data.forEach((d, idx) => {
//   legend
//     .append('li')
//     .attr('style', `--color:${colors(idx)}`)
//     .attr('class', 'legend-item')
//     .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
// });


// add a search

let query = '';

let searchInput = document.querySelector('.searchBar');

// searchInput.addEventListener('change', (event) => {
//   query = event.target.value.toLowerCase();
//   let filteredProjects = projects.filter((project) => {
//     let values = Object.values(project).join('\n').toLowerCase();
//     return values.includes(query.toLowerCase());
//   });
//   renderProjects(filteredProjects, projectsContainer, 'h2');
// });


let selectedIndex = -1;
let selectedYear = null; // new


function renderPieChart(projectsGiven) {
  let newRolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
  );
  let newData = newRolledData.map(([year, count]) => {
    return { value: count, label: year };
  });
  // new
  selectedIndex = newData.findIndex((d) => d.label === selectedYear);

  let newSliceGenerator = d3.pie().value((d) => d.value);
  let newArcData = newSliceGenerator(newData);
  let newArcs = newArcData.map((d) => arcGenerator(d));
  
  let svg = d3.select('svg');
  svg.selectAll('path').remove();
  let legend = d3.select('.legend');
  legend.selectAll('li').remove();

  newArcs.forEach((arc, i) => {
    svg
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(i))
      .attr('class', i === selectedIndex ? 'selected' : '') // new
      .on('click', () => {
        selectedIndex = selectedIndex === i ? -1 : i;
        // new
        selectedYear = selectedIndex === -1 ? null : newData[selectedIndex].label;

        svg
          .selectAll('path')
          .attr('class', (_, idx) => (
            idx === selectedIndex ? 'selected' : ''
          ));

        legend
          .selectAll('li')
          .attr('class', (_, idx) => (
            idx === selectedIndex ? 'legend-item selected' : 'legend-item'
          ));

        // new
        let filteredProjects = getFilteredProjects();
        renderProjects(filteredProjects, projectsContainer, 'h2');
      });
  });

  newData.forEach((d, idx) => {
    legend
      .append('li')
      .attr('style', `--color:${colors(idx)}`)
      .attr('class', 
        idx === selectedIndex ? 'legend-item selected' : 'legend-item')
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });
}

renderPieChart(projects);

searchInput.addEventListener('input', (event) => {
//   let filteredProjects = setQuery(event.target.value); what is setQuery
  query = event.target.value.toLowerCase();
  // new
  let searchResults = getFilteredSearch();
  let filteredProjects = getFilteredProjects();

  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(searchResults);
});


// new
function getFilteredSearch() {
    return projects.filter((project) => {
      let values = Object.values(project).join('\n').toLowerCase();
      return values.includes(query);
  });
}
// new
function getFilteredProjects() {
    let searchResults = getFilteredSearch();

    if (selectedYear === null) { return searchResults }
    
    return searchResults.filter((project) => {
      return project.year === selectedYear;
  });
}