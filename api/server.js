const schedule_parser = require('./parse');
module.exports = (req, res)=>
{

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({'dva':'asd'}));
}