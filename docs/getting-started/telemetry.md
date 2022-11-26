---
id: telemetry
title: Telemetry
parent: getting-started
order: 5

---

Getting feedback about the actual behavior is important for us in order to improve RestQA.

Then RestQA is collecting a few anonymous usage data. 

While the user initiates the project for the first time using the command, user will be ask if he allows RestQA to collect anonymous data.
Only if the user answer Yes, then data will be collected.

## How to update your consent on RestQA?

If you change your mind and do not want RestQA to collect anonymous data, you can run the command:

```bash
restqa telemetry off
```

Or you can use the environment variable `RESTQA_TELEMETRY` such as:

```bash
RESTQA_TELEMETRY=off restqa run
```

## What does RestQA tracks?

The information that we track are the following:

* Date
* Command name
* RestQA version
* Node version
* Operating system

Any personal information is track.

[Check on the source Code](https://github.com/restqa/restqa/blob/master/packages/cli/src/utils/telemetry/index.js)

## Where does RestQA stored the collected data?

As of now, we store the information in our Google Analytics.

## Any concern or query?

For any concern you might have about consent, feel free to contact us by [email](mailto:contact@restqa.io) or on [discord](https://restqa.io/chat)
