const https = require('https');
https.get('https://api.codetabs.com/v1/proxy?quest=https%3A%2F%2Ffundmobapi.eastmoney.com%2FFundMNewApi%2FFundMNHisNetList%3FpageIndex%3D1%26pageSize%3D30%26plat%3DAndroid%26appType%3Dttjj%26product%3DEFund%26Version%3D1%26deviceid%3D1%26FCODE%3D005827', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => { console.log(data.substring(0, 500)); });
});
