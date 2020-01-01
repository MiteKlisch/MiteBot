
const verifyWebhooks = (req, res) => {
    //let VERIFY_TOKEN = 'jetpack';

    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    if (mode && token) {
      
        if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');

            res.status(200).send(challenge);
        } else {
            res.sendStatus(403)
        }
    } 
}

module.exports = verifyWebhooks;