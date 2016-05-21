const express = require("express");

const banner = require("./dummy/banner.json");
const langList = require("./dummy/langList.json");
const spelling = require("./dummy/spelling.json");

/**
 * Get Banner
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.RequestHandler} next
 */
module.exports.getBanner = function getBanner(req, res, next) {
  res.status(200).jsonp(banner);
}

/**
 * Get Lang List
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.RequestHandler} next
 */
module.exports.getLangList = function getLangList(req, res, next) {
  res.status(200).jsonp(langList);
}

/**
 * Check Spelling
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.RequestHandler} next
 */
module.exports.checkSpelling = function checkSpelling(req, res, next) {
  res.status(200).jsonp(spelling);
}
