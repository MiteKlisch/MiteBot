const request = require('request');
const video = require('./multimedia/video')



const askTemplate = (text) => {
  return {
      "attachment":{
          "type":"template",
          "payload":{
              "template_type":"button",
              "text": text,
              "buttons":[
                  {
                      "type":"postback",
                      "title":"Rock",
                      "payload":"ROCK"
                  },
                  {
                      "type":"postback",
                      "title":"Pop",
                      "payload":"POP"
                  },
                  {
                    "type":"postback",
                    "title":"Classic",
                    "payload":"CLASSIC"
                  }
              ]
          }
      }
  }
};



const handleMessage = (sender_psid, received_message) => {
  let response;

  if (received_message.text) {
      response = {
          "text": `You sent the message: "${received_message.text}". Now send me an image!`
        }
     // response = askTemplate();
  } 

  callSendAPI(sender_psid, response); 
}

 const videoTemplate = (type, sender_id) => {
  return {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"button",
        "text":"Your music :)!",
        "buttons":[
          {
            "type":"web_url",
            "url": getVideo(type, sender_id),
            "title":"Link",
            "webview_height_ratio": "full"
          }
        ]
      }
    }
  }
 };

let users = {};
 
const getVideo = (type, sender_id) => {
    // если записи о пользователе пока нет - создадим её
    if(users[sender_id] === undefined){
        users = Object.assign({
            [sender_id] : {
                'rock_count' : 0,
                'pop_count' : 0,
                'classic_count' : 0
            }
        }, users);
    }
 
    let count = video[type].length, // общее количество изображений нужного типа
        user = users[sender_id], // пользователь, ожидающий ответа
        user_type_count = user[type+'_count'];
 
 
    // обновим сведения о пользователе до отправки ответа
    let updated_user = {
        [sender_id] : Object.assign(user, {
            [type+'_count'] : count === user_type_count + 1 ? 0 : user_type_count + 1
        })
    };
    // обновим список пользователей
    users = Object.assign(users, updated_user);
 
    console.log(users);
    return video[type][user_type_count];
}

const handlePostback = (sender_psid, recivedPostback) => {
    let response;
    const payload = recivedPostback.payload

    if (payload === 'ROCK') {
      response = videoTemplate('rock', sender_psid);
      callSendAPI(sender_psid, response, function(){
          callSendAPI(sender_psid, askTemplate('Show me more'));
      });
    } else if (payload === 'POP') {
      response = videoTemplate('pop', sender_psid);
      callSendAPI(sender_psid, response, function(){
          callSendAPI(sender_psid, askTemplate('Show me more'));
      });
    } else if (payload === 'CLASSIC') {
      response = videoTemplate('classic', sender_psid);
      callSendAPI(sender_psid, response, function(){
          callSendAPI(sender_psid, askTemplate('Show me more'));
      });
    }
    else if (payload === 'GET_STARTED') {
        response = askTemplate('What music do you want to listen to?');
        callSendAPI(sender_psid, response);
    }
    
}


const callSendAPI = (sender_psid, response) => {
    // Construct the message body
    let request_body = {
        "recipient": {
          "id": sender_psid
        },
        "message": response
      }

    // Send the HTTP request to the Messenger Platform
    request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 
}


module.exports = {
    handleMessage,
    handlePostback
}