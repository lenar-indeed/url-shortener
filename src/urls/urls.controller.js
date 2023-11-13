const urls = require("../data/urls-data");
const uses = require("../data/uses-data");

function create(req, res) {
    const { data: { href } = {} } = req.body;
    const newUrl = {
      id: urls.length + 1,
      href,
    };
    urls.push(newUrl);
    res.status(201).json({ data: newUrl });
  }

  function list(req, res) {
    res.json({ data: urls });
  }

  function read(req, res) {
    const urlId = Number(req.params.urlId);
    const foundUrl = urls.find((url) => url.id == urlId);
    uses.push({id: uses.length + 1, urlId: urlId, time: Date.now()});
    res.json({data: foundUrl});
  }

  function update(req, res) {
    const urlId = Number(req.params.urlId);
    const foundUrl = urls.find((url) => url.id === urlId);

    const {href} = req.body.data;
  
    foundUrl.href = href;
  
    res.json({ data: foundUrl });
  }

  function urlExists(req, res, next) {
    const urlId = Number(req.params.urlId);
    const foundUrl = urls.find((url) => url.id === urlId);
    if (foundUrl) {
      return next();
    }
    next({
      status: 404,
      message: `Url id not found: ${req.params.urlId}`,
    });
  }

  function hasHref(req, res, next) {
    const { href } = req.body.data;
  
    if (href) {
      return next();
    }
    next({ status: 400, message: "A 'href' property is required." });
  }

  module.exports = {
    create: [hasHref, create,],
    list,
    read: [urlExists, read],
    update: [urlExists, update],
    urlExists
  };