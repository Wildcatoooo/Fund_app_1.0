import https from 'https';

https.get('https://fundgz.1234567.com.cn/js/161130.js?rt=123', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(data);
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
