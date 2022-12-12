# @restqa/specification

> Package generating API specification from the RestQA testing API traffic.

## Usage/Examples

```javascript
const options = {
  info: {
    version: "1.0.0",
    description: "My description 1",
    title: "My fixture 1"
  }
};

const instance = new Specification(options);

const api = {
  request: Request("http://localhost"),
  response: Response({
    statusCode: "200",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      hello: "world"
    })
  }),
  scenario: {
    name: "Successfull hello world"
  }
};

instance.add(api);

const result = instance.format();
```
