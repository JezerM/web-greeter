'use strict'
const jsdoc2md = require("jsdoc-to-markdown")
const fs = require('fs')
const path = require('path')

const outputDir = "./mds/api/"

function generateFiles(file) {
  const templateData = jsdoc2md.getTemplateDataSync({
    files: file,
    //configure: "./jsdoc.json"
  })

  let selectedData = templateData.reduce( (selectedData, identifier) => {
    if (identifier.kind == 'class' || identifier.name == 'window' || identifier.kind == 'namespace') {
      selectedData.push(identifier)
    }
    return selectedData
  }, [])

  for (const identifier of selectedData) {
    let template = ""
    let name = identifier.name
    if (identifier.kind == 'class') {
      template = `{{#class name="${name}"}}{{>docs}}{{/class}}`
    } else if (identifier.name == 'window') {
      template = `{{#namespace name="${name}"}}{{>docs}}{{/namespace}}`
    } else {
      template = `{{#namespace name="${name}"}}{{>header~}}{{>body}}{{>member-index~}}{{/namespace}}`
    }
    console.log(`rendering ${name}, template: ${template}`)

    const output = jsdoc2md.renderSync({
      data: templateData,
      template: template,
      "no-gfm": true,
      partial: ["templates/partials/**/*.hbs"],
      helper: ["templates/helpers/**/*.js"],
      "global-index-format": "dl",
      "module-index-format": "dl",
      "member-index-format": "list"
    })

    fs.writeFileSync(path.resolve(outputDir, `${name}.md`), output)
  }
}

generateFiles(["src/*.js"])
