import { JungleBusClient, ControlMessageStatusCode } from "@gorillapool/js-junglebus";
import * as dotenv from 'dotenv'
dotenv.config()
import nimble from '@runonbitcoin/nimble'

const client = new JungleBusClient("junglebus.gorillapool.io", {
    useSSL: true,
    onConnected(ctx) {
        console.log("CONNECTED", ctx);
    },
    onConnecting(ctx) {
        console.log("CONNECTING", ctx);
    },
    onDisconnected(ctx) {
        console.log("DISCONNECTED", ctx);
    },
    onError(ctx) {
        console.error(ctx);
    },
});

const onPublish = function(tx) {
  console.log("TRANSACTION", tx);

  var transaction = nimble.Transaction.fromHex(tx.transaction);
  // could be more than 1 though
  var o1 = transaction.outputs[0]
  var x = nimble.Script.fromBuffer(o1.script.buffer)
};
const onStatus = function(message) {
    if (message.statusCode === ControlMessageStatusCode.BLOCK_DONE) {
        console.log("BLOCK DONE", message.block);
    } else if (message.statusCode === ControlMessageStatusCode.WAITING) {
        console.log("WAITING FOR NEW BLOCK...", message);
    } else if (message.statusCode === ControlMessageStatusCode.REORG) {
        console.log("REORG TRIGGERED", message);
    } else if (message.statusCode === ControlMessageStatusCode.ERROR) {
        console.error(message);
    }
};
const onError = function(err) {
    console.error(err);
};
const onMempool = function(tx) {
    console.log("TRANSACTION", tx);
};

(async () => {
    await client.Subscribe(process.env.JUNGLE_BUS_SUBSCRIPTION_ID, 787397, onPublish, onStatus, onError, onMempool);
})();