A simple battleship API
=======================

## Installation

```bash
# Install Yarn
brew update
brew install yarn

# Clone the repo
git clone https://github.com/eakl/battleship
cd battleship

# Install dependencies
yarn

# Run tests
yarn test

# Start the server
yarn start
```

## Usage

Once the server has started, you can use this simple API with [cURL](https://curl.haxx.se/docs/httpscripting.html) or [Postman](https://www.getpostman.com/)

## Attack

To attack, just make a request to the `attack` endpoint with the query `coord=X_Y`. Where X and Y are your coordinates.

```bash
curl -X POST http://localhost:8080/attack?coord=X_Y
```

#### Example

Let's say the generated battlefield looks like the following:

```bash
[0,0,0,0,0,0,1,1,0,1]
[0,0,0,0,0,0,0,0,0,0]
[0,0,0,0,0,0,0,0,1,0]
[1,0,0,0,0,0,0,0,0,0]
[1,0,0,1,1,0,0,1,0,0]
[1,0,0,0,0,0,0,0,0,0]
[0,0,1,0,0,0,0,1,0,0]
[0,0,1,0,0,1,0,1,0,0]
[0,0,0,0,0,0,0,1,0,0]
[0,1,1,1,0,0,0,1,0,0]
```

By making the following requests:

```bash
curl -X POST http://localhost:8080/attack?coord=3_7
# Hit

curl -X POST http://localhost:8080/attack?coord=3_8
# You just sank the destroyer
```

You'll sink the destroyer and the battlefield will look like this:

```bash
[0,0,0,0,0,0,1,1,0,1]
[0,0,0,0,0,0,0,0,0,0]
[0,0,0,0,0,0,0,0,1,0]
[1,0,0,0,0,0,0,0,0,0]
[1,0,0,1,1,0,0,1,0,0]
[1,0,0,0,0,0,0,0,0,0]
[0,0,2,0,0,0,0,1,0,0]
[0,0,2,0,0,1,0,1,0,0]
[0,0,0,0,0,0,0,1,0,0]
[0,1,1,1,0,0,0,1,0,0]
```

The coordinates you hit are replaces by the **2**'s

## Restart the game

```bash
curl -X GET http://localhost:8080/restart
```
