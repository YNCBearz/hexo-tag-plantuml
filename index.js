'use strict';

const axios = require('axios');
const plantuml = require('./plantuml');
const assign = require('object-assign');

hexo.config.tag_plantuml = assign({
    type:'static', // static | dynamic
    format: 'svg' // svn | png
}, hexo.config.tag_plantuml);

hexo.extend.tag.register('plantuml', function(args, content){
    return new Promise(function (resolve, reject) {
        var plantumlSvgUrl = plantuml.compress(content);
        if(hexo.config.tag_plantuml.type==='static') {
            axios.get(plantumlSvgUrl)
                .then(function (response) {
                    if (response.status === 200) {
                        resolve('<img src="data:image/svg+xml;utf8,'+encodeURIComponent(response.data)+'">');
                    } else {
                        reject(new Error('Failed to fetch PlantUML image'));
                    }
                })
                .catch(function (error) {
                    reject(error);
                });
        } else {
            resolve('<img src="'+plantumlSvgUrl+'">');
        }
    }).then(function (data) {
            return data;
        });

},{ends: true, async:true});
