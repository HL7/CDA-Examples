const fs = require('fs');
const path = require('path');

const igPath = path.resolve(__dirname, '../input/hl7.cda.examples.json');
const menuPath = path.resolve(__dirname, '../input/includes/menu.xml');

// Contents of each grouping's main page (mostly just set a variable and call another template)
const groupFile = (group) => `
{% assign groupingId = '${group.id}' %}
{% include groupingList.html %}
`;

const ig = JSON.parse(fs.readFileSync(igPath, 'utf8'));
let menu = fs.readFileSync(menuPath, 'utf8').split('\n');

// Poor-man's XML manipulation to reduce dependencies
const examplesByCategoryUlStart = menu.findIndex(line => line.includes('<ul') && line.includes('id="examples-by-category"'));
const examplesByCategoryUlEnd = menu.findIndex((line, index) => line.includes('</ul>') && index > examplesByCategoryUlStart);
const examplesByCategoryLis = menu.slice(examplesByCategoryUlStart + 1, examplesByCategoryUlEnd);
console.log(`Found examples by category menu at lines ${examplesByCategoryUlStart + 1} to ${examplesByCategoryUlEnd - 1}`);
let menuModified = false;

const groupings = ig.definition.grouping.sort((a, b) => {
  if (!a.name) return 1;
  if (!b.name) return -1;
  return a.name.localeCompare(b.name);
});
const examplesByPage = ig.definition.page.page.find(p => p.name === 'examples-by-category.html');
let sdModified = false;

for (const group of groupings) {
  // Create the example html page
  const pageContentPath = path.resolve(__dirname, `../input/pagecontent/examples-${group.id}.md`);
  if (!fs.existsSync(pageContentPath)) {
    fs.writeFileSync(pageContentPath, groupFile(group), 'utf8');
    console.log(`Created: ${pageContentPath}`);
  }

  // Add it to the IG under the page
  const existingPage = examplesByPage.page.find(p => p.name === `examples-${group.id}.html`);
  if (!existingPage) {
    examplesByPage.page.push({
      sourceUrl: `examples-${group.id}.html`,
      name: `examples-${group.id}.html`,
      title: `${group.name} Examples`,
      generation: 'markdown',
    });
    console.log(`Added page for group: ${group.name}`);
    sdModified = true;
  }

  const menuEntry = `<li><a href="examples-${group.id}.html">${group.name}</a></li>`;
  if (!examplesByCategoryLis.find(li => li.includes(menuEntry))) {
    examplesByCategoryLis.push(`      ${menuEntry}`);
    menuModified = true;
    }
}

// TODO - check if menu or IG has pages that DON'T correspond to groupings

if (sdModified) {
  examplesByPage.page.sort((a, b) => a.name.localeCompare(b.name));
  fs.writeFileSync(igPath, JSON.stringify(ig, null, 2), 'utf8');
  console.log(`Updated: ${igPath}`);
}
if (menuModified) {
  examplesByCategoryLis.sort((a, b) => a.localeCompare(b));
  menu.splice(examplesByCategoryUlStart + 1, examplesByCategoryUlEnd - examplesByCategoryUlStart - 1, ...examplesByCategoryLis);
  fs.writeFileSync(menuPath, menu.join('\n'), 'utf8');
  console.log(`Updated: ${menuPath}`);
}



