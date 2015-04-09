'use strict';

var Metalsmith = require('metalsmith');
var templates = require('metalsmith-templates');
var assets = require('metalsmith-assets');
var markdown = require('metalsmith-markdownit');
var each = require('metalsmith-each');
var extname = require('path').extname;
var dirname = require('path').dirname;
var cheerio = require('cheerio');
var handlebars = require('handlebars');
var layouts = require('handlebars-layouts');
var registrar = require('handlebars-registrar');
var inspect = require('util').inspect;
var path = require('path');
var _ = require('lodash');
var clone = require('clone');

//向 handlebars 注册 partial 文件
registrar(handlebars, {
  cwd: './templates',
  partials: [
    './partials/*.hbs',
    './layout.hbs'
  ]
});

//注册 layouts 插件。让模板可以实现继承等更多功能
layouts(handlebars);


//Processing flow is There!!!
var metalsmith = Metalsmith(__dirname)
  .source('./contents')
  .destination('./_site')

  //将 README 文件重命名为 index ，也就是目录默认的 index 页面
  .use(each(function(file, filename){

    filename = filename.toLowerCase().replace(/[\\\/]+/g, '/');

    if(/readme/i.test(filename)) {
      filename = filename.replace(/readme/ig, 'index');
    }

    return filename;

  }))

  //为网站增加一个首页 index 页面
  .use(function(files, metalsmith, done){
    files['index.md'] = {
      contents: new Buffer(''),
      template: 'marketing.hbs'
    };
    done();
  })

  //Parsing Markdown...
  .use(markdown({html: true}))


  //提取每个文档页面的标题、简介等
  .use(each(function(file, filename){
    
    if(!/docs/.test(filename)) return;

    var contents = file.contents.toString();
    var $ = cheerio.load(contents, {decodeEntities: false});

    file['title'] = $('h1').first().text();
    file['description'] = $('h1').next('ul').first().text();
  }))


  //应用模板
  .use(templates({
    'engine': 'handlebars',
    'directory': './templates',
    'default': 'docs.hbs',
    'pattern': '**/*.html'
  }))
  

  // 将文件路径改为 `目录/index.html` 模式
  .use(each(function(file, filename){
    if(!is_html(filename)) return;
    if(/index\.html$/.test(filename)) return;  //index 页面无需修改

    filename = filename.replace(/\.html$/, '/index.html');

    return filename;
  }))

  //将文档中的绝对路径修改为相对路径
  .use(each(function(file, filename){
    setImmediate(function(){
      var contents = file.contents.toString();
      var $ = cheerio.load(contents, {decodeEntities: false});


      function relative(from, to) {
        var dir = dirname(from);

        if(/^\//.test(to)) {

          to = path.relative(path.join('/', dir), to);
          if(to === '') to = './';
        }

        return to.replace(/\\+/g, '/');
      }

      $('a[href], link[href]').each(function(i, ele){
        var href = $(this).attr('href');

        if(this.name === 'a' && /^https?:\/\//.test(href)) {
          $(this).attr('target', '_blank');
          return;
        }
        
        href = href.replace(/(readme)?\.md$/i, '').toLowerCase();
        href = relative(filename, href)

        if(this.name == 'a') {
          href = path.normalize(path.join(href, '/')).replace(/[\\\/]+/g, '/');
        }

        $(this).attr('href', href);
      });


      $('script[src], img[src]').each(function(i, ele){
        var src = $(this).attr('src');

        $(this).attr('src', relative(filename, src));
      });

      file.contents = new Buffer($.html());
    });
      
  }))

  //复制资源文件
  .use(assets({
    'source': './assets'
  }))

  .build(function(err){
    if(err) throw err;
  });


function is_html(file){
  return /(\.html|\.htm)$/.test(extname(file));
}

function is_markdown(file){
  return /(\.md|\.markdown)$/i.test(extname(file));
}