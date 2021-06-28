'use strict'
const jsdoc2md = require("jsdoc-to-markdown")
const fs = require('fs')
const path = require('path')

const outputDir = "./docs/"

function generateFiles(file) {
  const templateData = jsdoc2md.getTemplateDataSync({
    files: file,
    //configure: "./jsdoc.json"
  })

  let classNames = templateData.reduce( (classNames, identifier) => {
    if (identifier.kind == 'class') {
      classNames.push(identifier.name)
    }
    return classNames
  }, [])

  for (const className of classNames) {
    const template = `{{#class name="${className}"}}{{>docs}}{{/class}}`
    console.log(`rendering ${className}, template: ${template}`)

    const output = jsdoc2md.renderSync({
      data: templateData,
      template: template,
      partial: ["templates/partials/**/*.hbs"],
      "global-index-format": "none",
      "module-index-format": "none"
    })

    fs.writeFileSync(path.resolve(outputDir, `${className}.md`), output)
  }
}

generateFiles(["src/*.js"])
