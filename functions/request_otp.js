const admin = require('firebase-admin');
const twilio = require('./twilio');

module.exports = function(req, res) {

    if (!req.body.phone) {
        return res.status(422).send({ error: 'Phone Required' });
    }
    
    const phone = String(req.body.phone).replace(/[^\d]/g, '');

    admin.auth().getUser(phone)
                .then(userRecord => {

                    const code = Math.floor(Math.random() * 8999 + 1000);

                    twilio.message.send({
                        body: 'Your OTP is ' + code,
                        to: phone,
                        from: '+14342265878'
                    }, (err) => {
                        
                        if (err) { return res.status(422).send({ error: err }); }

                        admin.database().ref('users/' + phone)
                                        .update({
                                            code: code,
                                            isCodeValid: true
                                        }, () => {
                                            res.status(200).send({ success: true });
                                        })

                    });

                }).catch(err => {
                    res.status(422).send({ error: err });
                });

}
