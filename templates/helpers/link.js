const handlebars = require("handlebars")
const ddata = require("dmd/helpers/ddata")

exports.custom_link = custom_link
exports.escapedAnchor = escapedAnchor
exports.link_to = link_to

function custom_link(input, options) {
  return options.fn(_custom_link(input, options))
}

function _custom_link(input, options) {
  if (typeof input !== 'string') return null

  var linked, matches, namepath
  var output = {}

  if ((matches = input.match(/.*?<(.*?)>/))) {
    namepath = matches[1]
  } else {
    namepath = input
  }

  options.hash = {id: input}
  linked = ddata._identifier(options)
  if (!linked) {
    options.hash = {longname: namepath}
    linked = ddata._identifier(options)
  }
  if (!linked) {
    output = { name: input, url: null}
  } else {
    output.name = input.replace(namepath, linked.name)
  }

  if (namepath.includes("LightDM")) {
    output.url = namepath.replace("LightDM.", "")
  } else {
    output.url = null
  }

  return output
}


function link_to(input, options) {
  let output = ""

  output = input.replace("LightDM.", "")
  var methods = output.split("+")

  if (methods.length > 1) {
    var parent = methods[0]
    output = `${parent}#LightDM_${parent}-${methods[1]}`
  }

  return output
}

function escapedAnchor(anchor) {
  if (typeof anchor !== 'string') return null;
  var result = anchor.replace(/\./g, '_').replace(/\+/g, '-');
  return result
};
