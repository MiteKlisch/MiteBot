const { handleMessage, handlePostback } = require('./functions');


const messageWebhook = (req, res) => {
    const body = req.body

    if (body.object === 'page') {
        
        body.entry.forEach((entry) => {
            let webhook_event = entry.messaging[0];

            let sender_psid = webhook_event.sender.id;
            
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);

            } else if (webhook_event.postback) {
               handlePostback(sender_psid, webhook_event.postback)
            }
        });

        res.status(200).send('EVENT_RECEIVED')

    } else {
        res.sendStatus(404)
    }
}

module.exports = messageWebhook