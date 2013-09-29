/**
 * BUILD
 * depend on clean-css and uglify-js
 * 1.npm install clean-css
 * 2.npm install uglify-js
 *
 * command
 * 1.node transfer.js(uncompress)
 * 2.node transfer.js -c (compress)
 */
var fs = require('fs');
var path = require('path');
var cleancss = require('clean-css');
var uglifyjs = require('uglify-js');

//选项
var cleancssOptions = {
    keepBreaks: true    //whether to keep line breaks
};
var uglifyjsOptions = {
    beautify: true,
    ascii_only: true
};
var isCompressMode = false;

process.argv.forEach(function(argv){
    argv = argv.toLowerCase();

    if('-c' === argv){  //压缩模式
        isCompressMode = true;
        cleancssOptions.keepBreaks = false;
        uglifyjsOptions.beautify = false;
    }
});

var SRC = __dirname + '/src';
var BUILD = __dirname + '/build';

//src目录不存在，即退出
if(!fs.existsSync(SRC)){
    console.log('src not exist');
    return;
}

//清理build目录
rmdir(BUILD);

//创建build目录
fs.mkdirSync(BUILD);

//排除掉的文件
var excludeCss = [];
var excludeJs = [];

[
    'seed.js',
    'init.js'
].forEach(function(name){
    excludeJs.push(toDir(SRC + '/' + name));
});

//复制及合并文件
var aioJs = '';

syncDir(SRC, BUILD);

//fs.writeFileSync(BUILD + '/aio.js', aioJs, {
//    encoding: 'utf8',
//    flag: 'w+'
//});

//样式合并，样式由于和优先级有关系，因此需要手动设定顺序
var aioCss = '';
['applet', 'input','list'].forEach(function(filename){
    aioCss += fs.readFileSync(BUILD + '/' + filename + '.css', {
        encoding: 'utf8'
    });
});

fs.writeFileSync(BUILD + '/form.css', aioCss, {
    encoding: 'utf8',
    flag: 'w+'
});

console.log('transfer success');

/**
 * 函数集
 */
//删除目录
function rmdir(dir){
    if(!fs.existsSync(dir)){
        return;
    }

    fs.readdirSync(dir).forEach(function(filename){
        filename = path.join(dir, filename);
        if('.' === filename || '..' === filename){
            return;
        }

        var stat = fs.statSync(filename);
        if(stat.isDirectory()){
            rmdir(filename);
        }else{
            fs.unlinkSync(filename);
        }
    });

    fs.rmdirSync(dir);
}

//复制目录
function syncDir(source, dest){
    if(!fs.existsSync(source) || !fs.existsSync(dest)){
        return;
    }

    fs.readdirSync(source).forEach(function(name){
        var filename = toDir(path.join(source, name));
        if('.' === filename.substr(1)){ //以.开头的皆跳过
            return;
        }

        var stat = fs.statSync(filename);
        var destname = path.join(dest, name);

        if(stat.isDirectory()){
            fs.mkdirSync(destname);
            syncDir(filename, destname);
        }else{
            var buffer = fs.readFileSync(filename);
            var ext = path.extname(filename).toLowerCase();

            //JS或CSS文件需要特别处理
            if('.js' === ext){
                var ast = uglifyjs.parse(buffer.toString('utf8'));

                if(isCompressMode){ //变量名混淆
                    ast.figure_out_scope();
                    ast.compute_char_frequency();
                    ast.mangle_names();
                }

                buffer = ast.print_to_string(uglifyjsOptions);

                //指定特别的文件，否则都处理
                if(-1 === excludeJs.indexOf(filename)){
                    aioJs += buffer;
                }
            }else if('.css' === ext){
                buffer = cleancss.process(buffer.toString('utf8'), cleancssOptions);
            }

            fs.writeFileSync(destname, buffer, {
                encoding: 'utf8',
                flag: 'w+'
            });
        }
    });
}
/**
 * 路径规范化
 */
function toDir(pathname){
    return pathname.replace(/\\+/g, '/');
}



/**
 * 路径规范化
 */
function toDir(pathname){
    return pathname.replace(/\\+/g, '/');
}


