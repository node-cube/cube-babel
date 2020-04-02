'use strict';
const path = require('path');
const babelCore = require('@babel/core');
const _ = require('lodash');

function genRule(rule) {
  if (rule.indexOf('/') === 0) {
    rule = '^' + rule;
  }
  return new RegExp(rule.replace(/\./g, '\\.').replace(/\*/g, '.*'));
}

function importPlugin(nameString) {
  let plugin = null;
  if (/^\//.test(nameString)) {
    // absolute import
    const pluginPath = nameString.slice(1);
    plugin = require(__dirname, '../..', pluginPath);
  } else if (/^(\.\/|\.\.\/)/.test(nameString)) {
    // relative import
    plugin = require(__dirname, '../..', nameString);
  } else if (/^(babel-plugin-|@\w+\/babel-plugin-)/.test(nameString)) {
    // full-name or with scope
    plugin = require(nameString);
  } else {
    // shorthand
    plugin = require('babel-plugin-' + nameString)
  }
  // 部分插件导出 { default: [Function] } 形式
  return plugin.default ? plugin.default : plugin;
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
    if (data.noAstParse) {
      return callback(null, data);
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
        } else if (typeof v === 'string') {
          a[i] = require('babel-preset-' + v);
        }
      });
      config.plugins && config.plugins.forEach((v, i, a) => {
        if (Array.isArray(v) && typeof v[0] === 'string') {
          v[0] = importPlugin(v[0]);
        } else if (typeof v === 'string')  {
          a[i] = importPlugin(v);
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
