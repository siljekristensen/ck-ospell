"use strict";
const path = require("path");
const l = require("lodash");
const SpellChecker = require("divvunspell");
const Promise = require("bluebird");
const chokidar = require("chokidar")

const H = require('./helpers');

// - - -

const langDirectory = process.env.CKOSPELL_LANG_PATH || path.resolve(process.cwd(), "etc");

const filenameMap = {}
const localeNameMap = {}
const spellers = {}

const addFile = fp => {
  try {
    const speller = new SpellChecker(fp)
    const locale = speller.locale

    filenameMap[fp] = locale
    localeNameMap[locale] = speller.localeName
    spellers[locale] = speller
  } catch(error) {
    process.stdout.write(`Cannot load ${fp}\n`)
    process.stdout.write(`${error.message}\n`)
  }
}

const removeFile = fp => {
  const locale = filenameMap[fp]

  delete filenameMap[fp]
  delete localeNameMap[locale]
  delete spellers[locale]
}

chokidar.watch(langDirectory + '/*.zhfst', {awaitWriteFinish: true})
  .on('add', path => {
    process.stdout.write(`Add, ${path}\n`)
    addFile(path)
  })
  .on('change', path => {
    process.stdout.write(`Update, ${path}\n`)
    addFile(path)
  })
  .on('unlink', path => {
    process.stdout.write(`Remove, ${path}\n`)
    removeFile(path)
  });

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

  const quoteMarks = /[«»“”‘’]/g;
  const inputWords = req.query.text.replace(quoteMarks, '').split(",");

  Promise.map(inputWords, word => {
    return spellchecker.isCorrect(word.trim()).then(isCorrect => {
      if (isCorrect) {
        return { word, suggestions: null }
      } else {
        return spellchecker.suggest(word.trim())
          .then(res => {
            return { word, suggestions: res.slice(0, 10) }
          })
      }
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
