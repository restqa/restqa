# @restqa/screenshot

> The Screenshot tool for RestQA report.


It's a tool that meant to be use as a cli through the command:

```
npx @restqa/screenshot
```

with options

```
npx @restqa/screenshot -r restqa/index.html -ex screenshot.png
```

## Options

```
Usage: index [options]

Options:
  -r,--report <report>    The filename of the local restqa report (default: "restqa/index.html")
  -ex,--export <export>   Filename of the screenshot export (default: "screenshot-restqa.png")
  -h,--hash <hash>        Change hash location of the page (default: "#/features")
  -e,--element <element>  The element selector that needs to be screenshoted (default: "#dashboard-analytics")
  -w,--waitfor <waitFor>  The selector element that triggering the readiness of the page (default: ".logo")
  -p,--pause <pause>      after the hash change pause waiting time (ms) (default: 2000)
  --help                  display help for command
```
