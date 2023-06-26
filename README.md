# arthur-campos-capstone

## Installation

1. Instal [Node.JS](https://nodejs.org/en/download/package-manager/) latest version
2. Clone this repo
3. Install dependencies, just run in project folder: `npm i` or `yarn`
## Usage

1. run `npm start` to start server

## Server Configuration 

You can use `.env` file, to configure project like this:

```
PORT=8080
HOST=127.0.0.1
CORS_ORIGIN=http://localhost:3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=capstone
DB_USER=root
DB_PASSWORD=rootroot
JWT_SECRET= <someCustomkey>
```

you can just copy `.example-env`

Run the commnad to set the db
```
npm run migrate
npm run seed
```


## Server-Side Implementation

### End-Point Descriptions

**REST Endpoints:**

- HTTP Method: POST
  - Endpoint: /api/rooms/create
  - Parameters:
    - `username` (string): The username of the player.
    - `avatar` (string): The avatar of the player.
  - Response:
    - `token` (string): The JWT token.
- HTTP Method: POST
  - Endpoint: /api/rooms/login
  - Parameters:
    - `room_uuid` (string): The UUID of the room.
    - `username` (string): The username of the player.
    - `avatar` (string): The avatar of the player.
  - Response:
    - `token` (string): The JWT token.

**Socket.IO Event Handlers:**

- Get Players in a Room

  - Event: getPlayers
  - Handler: getPlayersHandler
  - Parameters:
    - `room_uuid` (string): The UUID of the room.

- Join a Room

  - Event: join
  - Handler: joinHandler
  - Parameters:
    - `room_uuid` (string): The UUID of the room.
    - `username` (string): The username of the player.
    - `avatar` (string): The avatar of the player.

- Play a Card

  - Event: playCard
  - Handler: playCardHandler
  - Parameters:
    - `card` (object): The card object containing card information.

- Start the Game
  - Event: start
  - Handler: startGameHandler
  - Parameters: None

### 3.2 External APIs that will be consumed

None.

### 3.3 Database Structure

**Rooms Table**
Columns:

- `id` (integer, primary key)
- `uuid` (string, not nullable)
- `max_players` (integer, not nullable)

**Players Table**
Columns:

- `id` (integer, primary key)
- `room_id` (integer, unsigned, foreign key referencing `id` column of `rooms` table)
- `username` (string, not nullable)
- `uuid` (string, not nullable)
- `avatar` (string, not nullable)
- `online` (boolean, not nullable, default to false)

**Cards Table**
Columns:

- `id` (integer, primary key)
- `type` (string, not nullable)
- `action` (string, not nullable)
- `comment` (string, not nullable)

**RoomCards Table**
Columns:

- `id` (integer, primary key)
- `room_id` (integer, unsigned, foreign key referencing `id` column of `rooms` table)
- `card_id` (integer, unsigned, foreign key referencing `id` column of `cards` table)
- `player_id` (integer, unsigned, foreign key referencing `id` column of `players` table)

### 3.4 Authentication/Authorization and Security

- User authentication using JWT
- Authorization enforced for accessing game rooms and performing game actions.
