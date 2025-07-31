'use strict';

var request = require('request');
var Promise = require('bluebird');
var plantuml = require('./plantuml');
var assign = require('object-assign');

hexo.config.tag_plantuml = assign({
    type:'static', // static | dynamic
    format: 'svg', // svg | png
    maxRetries: 5,
    retryDelay: 1000,
    timeout: 30000
}, hexo.config.tag_plantuml);

// 重試函數
function retryRequest(url, options, maxRetries, retryDelay) {
    return new Promise(function (resolve, reject) {
        let attempts = 0;

        function attempt() {
            attempts++;

            request(url, options, function (error, response, body) {
                if (!error && response && response.statusCode == 200 && body) {
                    resolve(body);
                } else if (attempts < maxRetries && (error || (response && (response.statusCode >= 500 || response.statusCode == 520)))) {
                    console.log(`PlantUML request failed (attempt ${attempts}/${maxRetries}), retrying in ${retryDelay}ms...`);
                    setTimeout(attempt, retryDelay);
                } else {
                    const errorMsg = error ? error.message :
                                   (response ? `HTTP ${response.statusCode}` : 'Unknown error');
                    reject(new Error(`Request failed after ${attempts} attempts: ${errorMsg}`));
                }
            });
        }

        attempt();
    });
}

hexo.extend.tag.register('plantuml', function(args, content){
    return new Promise(function (resolve, reject) {
        var plantumlSvgUrl = plantuml.compress(content);

        if(hexo.config.tag_plantuml.type==='static') {
            const options = {
                timeout: hexo.config.tag_plantuml.timeout,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; PlantUML-Hexo-Plugin)'
                }
            };

            retryRequest(
                plantumlSvgUrl,
                options,
                hexo.config.tag_plantuml.maxRetries,
                hexo.config.tag_plantuml.retryDelay
            ).then(function(body) {
                resolve('<img src="data:image/svg+xml;utf8,'+encodeURIComponent(body)+'">');
            }).catch(function(error) {
                console.error('PlantUML request failed:', error.message);
                // 如果所有重試都失敗，返回一個錯誤提示圖片
                resolve('<img src="data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect width="400" height="200" fill="#f0f0f0"/><text x="200" y="100" text-anchor="middle" fill="#666" font-family="Arial" font-size="14">PlantUML 服務暫時不可用</text></svg>')+'">');
            });
        } else {
            resolve('<img src="'+plantumlSvgUrl+'">');
        }
    }).then(function (data) {
            return data;
        });

},{ends: true, async:true});
