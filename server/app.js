"use strict";
const path = require("path");
const fs = require("fs");
const l = require("lodash");
const hfstospell = require("hfst-ospell-js");
const Promise = require("bluebird");

const H = require('./helpers');

// - - -

const langDirectory = process.env.CKOSPELL_LANG_PATH || path.resolve(process.cwd(), "etc");

const langFiles = fs.readdirSync(langDirectory)
  .filter((filename) => path.extname(filename) === ".zhfst");

const localeNameMap = {}
const spellers = {}

langFiles.forEach(file => {
  const fp = path.join(langDirectory, file)
  const speller = new hfstospell.SpellChecker(fp)
  const locale = speller.locale()

  localeNameMap[locale] = speller.localeName()
  spellers[locale] = speller
})

/**
 * Get Banner
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.RequestHandler} next
 */
module.exports.getBanner = function getBanner(req, res) {
  res.status(200).jsonp({
    "banner": false,
  });
}

/**
 * Get Lang List
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.RequestHandler} next
 */
module.exports.getLangList = function getLangList(req, res) {
  res.status(200).jsonp({
    "langList": {
      "ltr": l.extend({}, localeNameMap),
      "rtl": {},
    },
    "verLang": 6,
  });
}

/**
 * Check Spelling
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.RequestHandler} next
 */
module.exports.checkSpelling = function checkSpelling(req, res, next) {
  // Quick n dirty validation of query params
  const checks = [
    H.checkQueryParams("out_type", {
      status: 400, message: "`out_type` needs to be `words`",
    }, "words"),
    H.checkQueryParams("version", {
      status: 400, message: "No language code given",
    }),
    H.checkQueryParams("slang", {
      status: 400, message: "No language code given",
    }),
    H.checkQueryParams("text", {
      status: 400, message: "No text to check given",
    }),
  ];

  // Each check is actually a middleware that happens to return false if the
  // request wasn't valid.
  for (var i = 0; i < checks.length; i++) {
    const error = checks[i](req);
    if (error) {
      return next(error);
    }
  }

  const lang = req.query.slang;

  const spellchecker = spellers[lang];

  if (!spellchecker) {
    return next({
      status: 400, message: "I can't spellcheck `" + lang + "`, sorry.",
    });
  }

  const inputWords = req.query.text.split(",");

  Promise.map(inputWords, word => {
    return spellchecker.suggestions(word.trim())
      .then(res => {
        if (Array.isArray(res)) {
          res = res.slice(0, 10)
        }

        return { word, suggestions: res }
      })
  }).then(allCorrections => {
    const corrections = allCorrections
      .filter((item) => item.suggestions)
      .map((item) => {
        // ud stands for user dictionary and can be ignored.
        item.ud = false;
        return item;
      });

    res.status(200).jsonp(corrections);
  }).catch(next);
}
