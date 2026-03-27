const fs = require('fs');
const path = require('path');
// These dependencies are installed under `api/node_modules`.
// Resolve them explicitly so `email/*` can be run from repo root.
const resolveFromApi = (name) =>
  require(require.resolve(name, { paths: [path.resolve(__dirname, '../api')] }));

const Handlebars = resolveFromApi('handlebars');
const mjml2html = resolveFromApi('mjml');

function readTemplate(templateName) {
  const templatePath = path.resolve(__dirname, 'templates', templateName);
  return fs.readFileSync(templatePath, 'utf8');
}

/**
 * Render MJML (Handlebars) template to HTML.
 *
 * @param {object} params
 * @param {string} params.template - Template filename, e.g. "base.mjml.hbs"
 * @param {object} params.data - Variables for template
 * @returns {{ html: string, errors: any[] }}
 */
function renderEmail({ template, data }) {
  const mjmlSource = readTemplate(template);
  const compiled = Handlebars.compile(mjmlSource, { noEscape: true });
  const mjml = compiled(data);

  const { html, errors } = mjml2html(mjml, {
    validationLevel: 'soft'
  });

  return { html, errors: errors || [] };
}

module.exports = { renderEmail };

