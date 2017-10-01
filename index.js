'use strict';
const babelCore = require('babel-core');
const _ = require('lodash');

function genRule(rule) {
  if (rule.indexOf('/') === 0) {
    rule = '^' + rule;
  }
  return new RegExp(rule.replace(/\./g, '\\.').replace(/\*/g, '.*'));
}

class BabelProcessor {
  constructor(cube, config) {
    this.cube = cube;
    this.config = this.prepareConfig(config);
    let ignore = this.config.ignore;
    let ignoreRules = [];
    ignore && ignore.forEach((rule) => {
      ignoreRules.push(genRule(rule));
    });
    this.ignoreRules = ignoreRules;
  }
  process(data, callback) {
    let code = data.code;
    let res;
    let ignore = this.ignoreRules;
    for (let i = 0, len = ignore.length; i < len; i++) {
      if (ignore[i].test(data.queryPath)) {
        return callback(null, data);
      }
    }
    try {
      let config = {
        ast: true,
        code: true,
        filename: data.realPath,
        sourceRoot: this.cube.config.root,
        comments: false,
      };
      res = babelCore.transform(code, _.merge(config, this.config));
    } catch (e) {
      e.message = 'babel processor error: ' + e.message;
      return callback(e);
    }
    data.code = res.code;
    callback(null, data);
  }
  prepareConfig(config) {
    try {
      config.presets && config.presets.forEach((v, i, a) => {
        if (Array.isArray(v) && typeof v[0] === 'string') {
          v[0] = require('babel-preset-' + v[0]);
        } else {
          a[i] = require('babel-preset-' + v);
        }
      });
      config.plugins && config.plugins.forEach((v, i, a) => {
        if (Array.isArray(v) && typeof v[0] === 'string') {
          v[0] = require('babel-plugin-transform-' + v[0]);
        } else {
          a[i] = require('babel-plugin-transform-' + v);
        }
      });
    } catch (e) {
      e.message  = 'cube-babel config error:' + e.message;
      throw e;
    }
    return config;
  }
}

BabelProcessor.ext = '.js';
BabelProcessor.type = 'script';

module.exports = BabelProcessor;
