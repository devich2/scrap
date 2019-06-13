const schedule_parser = require('./parse');
module.exports = (req, res)=>
{
    schedule_parser((table)=>
   {
       res.setHeader('Content-Type', 'application/json');
       res.write(JSON.stringify(table));
       res.end();
   })
}