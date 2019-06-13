const http = require('https');
const group = "is-73";
const request_url = "https://rozklad.org.ua/timetable/group/" + group;
const cheerio = require('cheerio')
function get_shedule(table_row, week, $)
{

    const result = {'Понеділок' : [],'Вівторок' : [], 'Середа' : [], 'Четвер' : [], 'П’ятниця' : [], 'Субота' : [], }
    const tbody = $("tbody", table_row);
    const rows = $("tr", tbody);
    for (let i = 0;i < rows.length; i++)
    {
        let keys = Object.keys(result);
        let subjects = $("td",rows[i]);

        for (let j = 1; j < subjects.length; j++)
        {
            let element = subjects[j];
            let child_div = $("div", element);
            if (child_div.children.length)
            {
                let name_day = $("[data-title]", element);
                let lesson = {};
                lesson[i+1] = child_div.text();
               // console.log(child_div.text());
                result[keys[j-1]].push(lesson)
            }

        }
        console.log("----------------------")
    }

    return result;


}
function parse_shedule (html)
{
    const $ = cheerio.load(html);
    const table_rows = $('.table-primary');
    console.log(table_rows.length)
    return [get_shedule(table_rows[0], '1 week', $),get_shedule(table_rows[1], '2 week', $)];

}
function get_html (f)
{
    console.log(request_url);
    http.get(request_url, function (ress, error) {
        if (error) console.log(error);
        let data = '';
        ress.on('data',(chunk)=>
        {
            data+= chunk;
        })
        ress.on('end',()=>
        {
            console.log(data);
             f(parse_shedule(data));
            //console.log(data)
        })
    });

}
// get_html((table)=>
// {
//     console.log(JSON.stringify(table));
// })
module.exports = (f)=>
{
    get_html(f);
}