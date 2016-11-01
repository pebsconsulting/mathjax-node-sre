#! /usr/bin/env node
/************************************************************************
 *  Copyright (c) 2016 The MathJax Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

var mjpage = require('../lib/main.js').mjpage;
var fs = require('fs');
var jsdom = require('jsdom').jsdom;

var argv = require("yargs")
  .strict()
  .usage("Usage: mjsre.js [options] '<INPUT>'",{
    speech: {
      boolean: true,
      describe: "include speech text"
    },
    speechrules: {
      default: "mathspeak",
      describe: "ruleset to use for speech text (chromevox or mathspeak)"
    },
    speechstyle: {
      default: "default",
      describe: "style to use for speech text (default, brief, sbrief)"
    },
    linebreaks: {
      boolean: true,
      describe: "perform automatic line-breaking"
    },
    format: {
      default: "AsciiMath,TeX,MathML",
      describe: "input format(s) to look for"
    },
    output: {
      default: "SVG",
      describe: "output format (SVG, CommonHTML, or MML)"
    },
    ex: {
      default: 6,
      describe: "ex-size in pixels"
    },
    width: {
      default: 100,
      describe: "width of equation container in ex (for line-breaking)"
    },
    extensions: {
      default: "",
      describe: "extra MathJax extensions e.g. 'Safe,TeX/noUndefined'"
    },
    fontURL: {
      default: "https://cdn.mathjax.org/mathjax/latest/fonts/HTML-CSS",
      describe: "the URL to use for web fonts"
    }
  })
  .argv;

argv.format = argv.format.split(/ *, */);
var mjglobal =  {extensions: argv.extensions, fontURL: argv.fontURL};
var mjlocal = {
  format: argv.format,
  svg: (argv.output === 'SVG'),
  html: (argv.output === 'CommonHTML'),
  mml: (argv.output === 'MML'),
  speakText: argv.speech,
  speakRuleset: argv.speechrules.replace(/^chromevox$/i,"default"),
  speakStyle: argv.speechstyle,
  ex: argv.ex,
  width: argv.width,
  linebreaks: argv.linebreaks
}

//
//  Read the input file and collect the file contents
//  When done, process the HTML.
//
var html = [];
process.stdin.on("readable",function (block) {
  var chunk = process.stdin.read();
  if (chunk) html.push(chunk.toString('utf8'));
});
process.stdin.on("end",function () {
  mjpage(html.join(""),mjglobal,mjlocal,function(result){
    process.stdout.write(result);
  });
});
