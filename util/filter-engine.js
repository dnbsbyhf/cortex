var async = require("async");


// Filters驱动器
function FilterEngine(){
    this.filter_setup = [];
    this.filter_run = [];
    this.filter_tearDown = [];
    this.data = {}
}
FilterEngine.prototype = {
    assign : function(name,config){
        var Filter = require("../filters/"+name);

        var filter = Filter.create ? Filter.create(config) : Filter;

        filter.env = this.data;

        var mod = {name:name,filter:filter};


        this.filter_setup.push(mod);
        this.filter_run.push(mod);
        this.filter_tearDown.push(mod);
    },
    run:function(){
        var self = this;
        var tasks = [];
        console.log("aaa");
        for(var i = 0 ; i < this.filter_setup.length;i++){

            ["setup","run","tearDown"].forEach(function(step){
                (function(j){
                    tasks.push(function(done){
                        var mod = self["filter_" + step][j],
                            filter = mod.filter,
                            name = mod.name;

                        console.log(name + " " + step + " start");
                        filter[step] ? filter[step](function(){
                            console.log(name + " " + step + " done");
                            done()
                        }) : done();
                    });
                })(i);
            });
        }

        async.series(tasks,function(){
            self.allDown();
        });
    },
    allDown:function(){
        console.log("所有全部处理完毕");
        process.exit();
    }
}   


module.exports = new FilterEngine;
