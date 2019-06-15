'use strict';
const http = require('http');
const url = require('url');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const querystring = require('querystring');
const hostname = 'rozklad.kpi.ua';

function finalparse (info)
{
    const table_rows = info.getElementsByTagName('tr');
    const result = [[], [], [], [], [], []];
    for (let r = 1; r <= 5; r++){
        const row = table_rows[r].getElementsByTagName('td');
        for (let d = 1; d <= 6; d++){
            if ((row[d]).textContent)
            {
                result[d-1][r-1] = (row[d]).textContent;
            }
        }
    }
    return result;
}
function parseShedule (URL, f)
{
    const request =  http.request(URL, (res) => {
        let body = '';
        res.on('data', (chunk) => {
            body += chunk;
        })
        res.on('end', () => {
            const dom = new JSDOM(body);
            const doc= dom.window.document;
            let week_1= finalparse(doc.getElementById('ctl00_MainContent_FirstScheduleTable'));
            const week_2 = finalparse(doc.getElementById('ctl00_MainContent_SecondScheduleTable'))
            f(week_1, week_2);
        })
    })
    request.end();
}
function getSheduleUrl(hidden, group, f)
{
    hidden.ctl00$MainContent$ctl00$txtboxGroup = group;
    hidden.ctl00$MainContent$ctl00$btnShowSchedule = "Розклад занять";
    const postData = querystring.stringify(hidden);
    const options = {
        hostname: hostname,
        path: '/Schedules/ScheduleGroupSelection.aspx',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
        }
    };
    const req = http.request(options, (res) => {
        if (res.headers.location) {
            const newurl = url.parse(res.headers.location);
            newurl.hostname = hostname;
            f(newurl);
        }

    })
    req.write(postData);
    req.end();
}
function getShedule(f) {
    const options = {
        hostname: hostname,
        path: '/Schedules/ScheduleGroupSelection.aspx',
        method: 'GET'
    };
    http.get(options, (res) => {
        let body = '';
        res.on('data', (chunk) => {
            body += chunk;
        })
        res.on('end', () => {
            let dom = new JSDOM(body);
            const doc = dom.window.document;
            const formElement = doc.getElementById('aspnetForm');
            const __VIEWSTATE = doc.getElementById('__VIEWSTATE');
            const __EVENTVALIDATION = doc.getElementById('__EVENTVALIDATION');
            if (__VIEWSTATE && __EVENTVALIDATION) {
                const hidden_values = {
                    '__VIEWSTATE': __VIEWSTATE.getAttribute('value'),
                    '__EVENTVALIDATION': __EVENTVALIDATION.getAttribute('value')
                };
                f(hidden_values);
            }
        })

    })
}



module.exports = (group, f)=>
{
    getShedule((hidden)=>
    {
        getSheduleUrl(hidden, group, (newurl)=>
        {
            if(newurl) parseShedule(newurl, (first, second)=>
            {
                f(first, second);
            })
        })
    })
}
