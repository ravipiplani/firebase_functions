const functions = require("firebase-functions");

const admin = require('firebase-admin');
admin.initializeApp();

const Razorpay = require("razorpay");
var key_id = "rzp_test_PhIaEX1HiXG4cx";
var key_secret = "QCbLxD47KR0xDps6YyKncyeU";
const cors = require('cors')({origin: true});
var instance = new Razorpay({
    key_id: key_id,
    key_secret: key_secret
});

exports.createOrder = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        var options = {
            amount: req.body.amount,
            payment_capture: 1,
            currency: "INR",
            receipt: req.body.receipt
        };
        instance.orders.create(options, (err, order) => {
            order ? res.status(200).send(order) : res.status(500).send(err);
        });
    });
});

exports.createUser = functions.https.onRequest(async(req, res) => {
    return cors(req, res, async () => {
        try {
            const user = await admin.auth().createUser({
                phoneNumber: req.body.mobile
            });
            res.json({uid: user.uid});
        }
        catch (error){
            if (error.code === 'auth/phone-number-already-exists') {
                const user = await admin.auth().getUserByPhoneNumber(req.body.mobile);
                res.json({uid: user.uid});
            }
            else {
                res.status(404).json({uid: ''});
            }
        }
    });
});
