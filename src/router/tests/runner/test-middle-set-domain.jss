module.exports=function(req,res){
    res.render('runner',{
        component:'router-domain-error',
        tests:['domain-error']
    });
};