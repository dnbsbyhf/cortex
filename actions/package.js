var ActionFactory = require("./action-factory");
var config = require("../config");
var main = require("../main");
var path = require("path");

var Package = ActionFactory.create("Package");

Package.AVAILIABLE_OPTIONS = {
    filters:{
        alias: ["-f", "--filter"],
        length:1,
        description: "指定打包所使用的过滤器。可选过滤器包括：update, publish-imitate, css, js, yui-compressor, closure, md5, md5-diff。"
    },
    
    branch: {
        alias: ["-b", "--branch"],
        length: 1,
        description: "指定项目分支。该参数仅在 Git 项目生效。"
    },
    
    cwd: {
        alias: ["-c", "--cwd"],
        length: 1,
        description: "指定需要打包的项目的目录。" 
    },
    
    remote: {
        alias: ["-r", "--remote"],
        length: 1,
        description: "指定项目的远程地址。该参数仅对 Git 项目生效。"
    }
};


Package.prototype.run = function() {
    var opts = this.options,
        mods = this.modules,
        root = mods[0];
        
    // always generate an absolute dir
    if(root){
        // if is relative directory
        if(root.indexOf('..') === 0 || root.indexOf('.') === 0){
            root = path.join(process.cwd(), root);
        }
    
    // if no root specified, use current working directory
    }else{
        root = process.cwd();
    }

    main(root, opts);
};


Package.MESSAGE = {
    USAGE: "usage: ctx package <root> [options]\n例:usage: ctx package -f update,publish-imitate,css,js",
    DESCRIBE: "从指定目录打包静态文件"
};


module.exports = Package;