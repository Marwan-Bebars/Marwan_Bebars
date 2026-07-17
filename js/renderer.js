/**
 * SVG icon definitions for project link types.
 * Centralised here so they're easy to update in one place.
 */
const LINK_ICONS = {
  github: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>`,

  kaggle: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.281.18.046.149.021.243-.07.281l-7.181 6.954 7.59 8.005c.095.104.117.192.07.281z"/>
  </svg>`,

  demo: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>`,
};

/**
 * Configuration map for each link type a project can have.
 * To support a new link type, add an entry here — no other code changes needed.
 */
const LINK_CONFIG = [
  { key: 'github', label: 'GitHub', ariaLabel: 'View source code on GitHub' },
  { key: 'kaggle', label: 'Kaggle', ariaLabel: 'View notebook on Kaggle' },
  { key: 'demo',   label: 'Live Demo', ariaLabel: 'View live demo' },
];

/**
 * Checks whether a link value is valid (non-empty, non-placeholder).
 * @param {string|undefined} url
 * @returns {boolean}
 */
const isValidLink = (url) =>
  typeof url === 'string' && url.trim() !== '' && url.trim() !== '#';

/**
 * Builds the HTML for a single project link button.
 * @param {string} url
 * @param {object} config - { key, label, ariaLabel }
 * @param {string} projectTitle - Used for a descriptive aria-label.
 * @returns {string} HTML string
 */
const buildLinkHTML = (url, { key, label, ariaLabel }, projectTitle) => `
  <a href="${url}"
     class="project-link"
     target="_blank"
     rel="noopener noreferrer"
     aria-label="${ariaLabel} for ${projectTitle}">
    ${LINK_ICONS[key]}
    ${label}
  </a>`;

/**
 * Renders all valid links for a single project.
 * Returns an empty string if no links are valid (hides the container entirely).
 * @param {object} project
 * @returns {string}
 */
const renderProjectLinks = (project) => {
  const links = LINK_CONFIG
    .filter(({ key }) => isValidLink(project[key]))
    .map((config) => buildLinkHTML(project[config.key], config, project.title));

  return links.length
    ? `<div class="project-links">${links.join('')}</div>`
    : '';
};

/**
 * Renders a single project card.
 * @param {object} project
 * @returns {string}
 */
const renderCard = (project) => `
  <div class="project-card" data-category="${project.category}" id="project-${project.id}">
    <div class="project-header">
      <h3>${project.title}</h3>
    </div>
    <p class="project-description">${project.description}</p>
    <div class="project-tech">
      ${project.tech.map((t) => `<span>${t}</span>`).join('')}
    </div>
    <div class="project-footer">
      <button class="btn-details" data-id="${project.id}" aria-label="View details for ${project.title}">
        View Details
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </button>
      ${renderProjectLinks(project)}
    </div>
  </div>`;

/**
 * Builds the HTML content for the project details modal.
 * @param {object} project - The project object.
 * @returns {string} HTML string.
 */
export function renderModalContent(project) {
  // Prepare external links
  const links = [];
  if (isValidLink(project.github)) {
    links.push(`<a href="${project.github}" class="modal-link btn-primary-link" target="_blank" rel="noopener noreferrer">${LINK_ICONS.github} GitHub</a>`);
  }
  if (isValidLink(project.kaggle)) {
    links.push(`<a href="${project.kaggle}" class="modal-link btn-primary-link" target="_blank" rel="noopener noreferrer">${LINK_ICONS.kaggle} Kaggle</a>`);
  }
  if (isValidLink(project.demo)) {
    links.push(`<a href="${project.demo}" class="modal-link btn-primary-link" target="_blank" rel="noopener noreferrer">${LINK_ICONS.demo} Live Demo</a>`);
  }

  const linksHTML = links.length 
    ? `<div class="modal-links-container">
        <h4>Project Links</h4>
        <div class="modal-links">${links.join('')}</div>
      </div>`
    : '';

  // Prepare gallery slides
  const images = project.gallery || [];
  let galleryHTML = '';
  if (images.length > 0) {
    const slides = images.map((img, idx) => `
      <div class="slide ${idx === 0 ? 'active' : ''}" data-index="${idx}">
        <img src="${img}" alt="${project.title} screenshot ${idx + 1}" loading="lazy">
      </div>
    `).join('');

    const controls = images.length > 1 ? `
      <button class="slider-btn prev" aria-label="Previous image" id="sliderPrevBtn">&#10094;</button>
      <button class="slider-btn next" aria-label="Next image" id="sliderNextBtn">&#10095;</button>
      <div class="slider-dots">
        ${images.map((_, idx) => `
          <span class="slider-dot ${idx === 0 ? 'active' : ''}" data-index="${idx}"></span>
        `).join('')}
      </div>
    ` : '';

    galleryHTML = `
      <div class="modal-gallery">
        <div class="slider-container">
          <div class="slider-slides">${slides}</div>
          ${controls}
        </div>
      </div>
    `;
  }

  return `
    <div class="modal-grid">
      <div class="modal-info">
        <span class="modal-category">${project.category.replace('-', ' ').toUpperCase()}</span>
        <h3>${project.title}</h3>
        
        <div class="modal-body-content">
          <h4>Overview</h4>
          <p class="modal-description">${project.longDescription || project.description}</p>
          
          <div class="modal-tech-container">
            <h4>Technologies Used</h4>
            <div class="project-tech">
              ${project.tech.map((t) => `<span>${t}</span>`).join('')}
            </div>
          </div>

          ${linksHTML}
        </div>
      </div>
      ${galleryHTML}
    </div>
  `;
}

/**
 * Renders project cards into the DOM.
 * @param {Array} projects - Array of project objects.
 * @param {string} containerSelector - CSS selector for the container.
 */
export function renderProjects(projects, containerSelector = '.projects-grid') {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  container.innerHTML = projects.map(renderCard).join('');
}
