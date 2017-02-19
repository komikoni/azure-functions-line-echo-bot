
var https = require("https");
var url   = require("url");

function post_line(event){
  var message;
  switch (event.type) {
    case 'message':
      switch (event.message.type) {
        case 'text':
        case 'location':
        case 'sticker':
          message = event.message;
          message.text = message.text+' 好きだよ '+message.text
          break;
        default:
          message = {
            'type': 'text',
            'text': 'テキスト、場所、スタンプ 以外対応していません'
          };
      }
      break;
    case 'beacon':
      message = {
        'type': 'text',
        'text': 'ビーコンイベントです' + JSON.stringify(event,null,4)
      };
      break;
    default:
      message = {
        'type': 'text',
        'text': 'メッセージとビーコンイベント以外対応していません'
      };
  }
    var post_data = JSON.stringify({
        "replyToken" : event.replyToken,
        "messages"   : [ message ]
    });
    var parse_url = url.parse("https://api.line.me/v2/bot/message/reply");
    var post_options = {
        host: parse_url.host,
        path: parse_url.path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer {' + process.env.LINE_CHANNEL_ACCESS_TOKEN + '}',
            'Content-Length': Buffer.byteLength(post_data)
        }
    };
    var post_req = https.request(post_options);
    post_req.write(post_data);
    post_req.end();
}

module.exports = function (context, myQueueItem) {
    context.log('Node.js queue trigger function processed work item', myQueueItem);
    myQueueItem.events.forEach(event => post_line(event));
    context.done();
};
