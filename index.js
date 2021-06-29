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
    if (identifier.kind == 'class' || identifier.kind == 'namespace') {
      selectedData.push(identifier)
    }
    return selectedData
  }, [])

  for (const identifier of selectedData) {
    let template = ""
    let name = identifier.name
    if (identifier.kind == 'class') {
      template = `{{#class name="${name}"}}{{>docs}}{{/class}}`
    } else {
      template = `{{#namespace name="${name}"}}{{>header~}}{{>body}}{{/namespace}}`
    }
    console.log(`rendering ${name}, template: ${template}`)

    const output = jsdoc2md.renderSync({
      data: templateData,
      template: template,
      partial: ["templates/partials/**/*.hbs"],
      "global-index-format": "none",
      "module-index-format": "none"
    })

    fs.writeFileSync(path.resolve(outputDir, `${name}.md`), output)
  }
}

generateFiles(["src/*.js"])
