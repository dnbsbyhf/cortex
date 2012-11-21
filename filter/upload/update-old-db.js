"use strict";
var
async = require("async"),
fs = require("fs"),
DB = require("../../util/db"),
path = require('path'),
fsmore = require('../../util/fs-more');


function UpdateDB(options){
    this.options = options;
};


UpdateDB.prototype = {
    setup:function(done){
        this.env.updatelist = [];
        done();
    },
    run: function(done){
        var self = this,
            db = new DB(this.options),
            tasks = [];
console.log("run db");
        self._getFileList();

        tasks = [function(done){
            db.connect(self.options.lion_olddb,function(err,conn,dbconfig){
                console.log("已连接数据库",dbconfig);
                done();
            });
        }];

        for(var key in this.filelist){
            (function(key){
                tasks.push(function(done) {
                    self._updateVersion(db,key,function(){
                        done();
                    });
                });
            })(key);
        }

        async.series(tasks,function(err){
            if(err){throw err;}else{
                console.log("更新完成");
                db.end();
                done(null);
            }
        });
    },

    _fileTypeByPath: function(p){
        return ['lib/1.0/','s/j/app/','b/js/lib/','b/js/app/','t/jsnew/app/'].some(function(prefix){
            return p.indexOf(prefix) == 1 && path.extname(p) == ".js";
        }) ? 1 : 0;
    },
    _getFileList: function(){
        var filelist_path = fsmore.stdPath( path.join(this.env.local_dir, ".cortex", "filelist.json") );
        
        if(!fs.existsSync(filelist_path)){
            throw new Error("未包含 .cortex/filelist.json");
        }
        
        this.filelist = require(filelist_path);
    },
    
    _updateVersion: function(db, key,done){
        var self = this,
            table = this.options.dbversion,
            where = {URL:key},
            qs = db.sqlMaker("select",table,{},where);

        db.query(qs, function(err, rows) {
            if(err) throw err;
            var row = rows[0],
                new_version = row?(row.Version+1):1,
                pair = {URL:key,Version:new_version,FileType:self._fileTypeByPath(key)},
                query = row
                    ? db.sqlMaker("update",table,pair,where)
                    : db.sqlMaker("insert",table,pair);

            db.query(query,function(err){
                if(err)throw err;
                console.log((row?"更新":"插入") + " " + JSON.stringify(pair));
                self.env.updatelist.push(pair);
                done();
            });
        });
    }
};


exports.create = function(options){
    return new UpdateDB(options);
};