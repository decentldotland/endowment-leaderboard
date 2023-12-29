<p align="center">
  <a href="https://mem.tech">
    <img src="https://mem-home.vercel.app/icons/mem/mem-logo-v2.svg" height="180">
  </a>
</p>


## About

This repository centers around a [MEM](https://mem.tech) function, ***Endowment leaderboard***, designed to log submitted Arweave TXIDs that contribute 0.25 AR or more to the Arweave's endowment. Following this, it organizes contributors into a descending leaderboard based on their contribution amounts.

The [MEM function](./mem-leaderboard) accept retroactive contributions, allowing the submission of TXIDs posted before the function's deployment.


## How and Why Send AR to the Endowment?

Sending AR to the endowment holds ***no financial benefit***. Consider it a contribution or donation aimed at fortifying the permanent storage of Arweave's dataset. By contributing to the endowment, individuals play a vital role in bolstering the integrity and longevity of Arweave's data infrastructure.

## Bootstrapping

This public good initiative has been launched, kickstarted by a [donation of 10 AR](https://viewblock.io/arweave/tx/B8uMF-6AE7Cr_QHH-3yLDPIu1nGDYrtA_xl3FqZu-fU) to the endowment from the [ANS protocol](https://ans.gg)

#### Endowment Leaderboard function id: [MJpJxe_2-EZW8mmw3faJ1-6aml5kl8kut2_GyIeMq8E](https://api.mem.tech/api/state/MJpJxe_2-EZW8mmw3faJ1-6aml5kl8kut2_GyIeMq8E)

## Contribution Guide

### 1- Contributing to the Endowment

Making a contribution to the endowment is straightforward. Simply set the desired AR amount as the transaction's reward. Here's an example using the `arweave` npm package:

```console
npm install --save arweave
```

#### Code snippet:

#### ⚠️ N.B: make sure to never upload your JWK file online ⚠️

```js
import Arweave from "arweave";

export const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
  timeout: 60000,
  logging: false,
});

const jwk = {}; // Arweave wallet's JWK (parsed)

async function contribute(arAmount) {
  try {
    let tx = await arweave.createTransaction(
      {
        data: Buffer.from("contributing to the Permaweb!", "utf8"),
        reward: arweave.ar.arToWinston(String(arAmount)),
      },
      jwk,
    );

    await arweave.transactions.sign(tx, jwk);
    const response = await arweave.transactions.post(tx);

    console.log(tx);
  } catch (error) {
    console.log(error);
  }
}

const amount = 1;

contribute(arAmount);

```

### 2- Logging the Contribution

Logging your contribution in the MEM's Endowment Leaderboard function is straightforward. We'll provide two examples: one using axios/fetch and another using curl. Additionally, app developers can seamlessly integrate this function as MEM is entirely RESTful.

#### Code Snippets:

#### Axios

```js

async function logContribution(txid) {
  try {
    const contribute = [
      {
        input: {
          function: "log_contribution",
          txid: txid
        },
      },
    ];

    const req = await axios.post(
      "https://api.mem.tech/api/transactions",
      {
        functionId: functionId,
        inputs: contribute,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    console.log(req?.data);
    return req?.data;
  } catch (error) {
    console.log(error);
  }
}

const contributionTxid = "B8uMF-6AE7Cr_QHH-3yLDPIu1nGDYrtA_xl3FqZu-fU";

logContribution(contributionTxid);

````

#### curl:

```bash
curl -X POST \
  https://api.mem.tech/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "functionId": "MJpJxe_2-EZW8mmw3faJ1-6aml5kl8kut2_GyIeMq8E",
    "inputs": [
      {
        "input": {
          "function": "log_contribution",
          "txid": "B8uMF-6AE7Cr_QHH-3yLDPIu1nGDYrtA_xl3FqZu-fU" 
        }
      }
    ]
  }'

```

## License
This repository is licensed under the [MIT License](./LICENSE).