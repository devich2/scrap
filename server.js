const http = require('https');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const group = "іс-73";
const request_url = "https://rozklad.org.ua/timetable/group/" + group;

function get_shedule(table_row, week)
{
    console.log(week);
    const result = {'Понеділок' : [],'Вівторок' : [], 'Середа' : [], 'Четвер' : [], 'П’ятниця' : [], 'Субота' : [], }
    const tbody = table_row.querySelector('tbody');
    const rows = tbody.getElementsByTagName('tr');
   for (let i = 0;i < rows.length; i++)
   {
       let keys = Object.keys(result);
       let subjects = rows[i].getElementsByTagName('td');
       for (let j = 1; j < subjects.length; j++)
       {
          let element = subjects[j];
          let child_div = element.querySelector('div');
                   if (child_div.hasChildNodes())
                   {
                       let name_day = element.getAttribute('data-title');
                       let lesson = {};
                       lesson[i+1] = child_div.textContent;
                       result[keys[j-1]].push(lesson)
                   }

       }
       console.log("----------------------")
   }
 return result;

}
function parse_shedule (html)
{
    const dom = new JSDOM(html);
    const table_rows = dom.window.document.getElementsByClassName('table-primary');
    console.log(table_rows.length)
    get_shedule(table_rows[0], '1 week');
    get_shedule(table_rows[1], '2 week');

}
function get_html ()
{
    http.get(request_url, function (res) {
        let data = '';
        res.on('data',(chunk)=>
        {
            data+= chunk;
        })
        res.on('end',()=>
        {
            console.log(data)
            parse_shedule(data);
        })
    });
}
module.exports = (req, res)=>
{

    res.end('END');
}