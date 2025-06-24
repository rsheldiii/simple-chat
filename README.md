# SimpleChat, a Websocket-based chat application

A (very) simple, real-time chat application built with Ruby on Rails, ActionCable WebSockets, and React. Features GitHub OAuth authentication and containerized deployment. For development purposes only - for now.

## 🏗️ Architecture

- **Backend**: RoR with ActionCable for real-time WebSocket communication
- **Frontend**: React / TypeScript / styled-components / Vite (vite-rails)
- **Authentication**: Devise / OmniAuth
- **Database**: Postgres 
- **Deployment**: Docker Compose with multi-stage builds

## ✨ Features

- **Real-time messaging** via WebSocket connections
- **GitHub OAuth authentication** - sign in with your GitHub account
- **Message persistence** with chat history
- **Containerized deployment** with Docker Composee

## 🛠️ Prerequisites

- Docker and Docker Compose
- GitHub account for OAuth app creation
- Rails for credential encryption

## 🔐 GitHub OAuth Setup

### 1. Create GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
   - **Application name**: Your Chat App Name
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/users/auth/github/callback`
4. Click "Register application"
5. Note down your **Client ID** and **Client Secret**

### 2: Configure credentials


1. **Clone and navigate to the project:**
   ```bash
   git clone https://github.com/rsheldiii/simple-chat.git
   cd simple-chat
   ```
2. **Install Rails**
    ```bash
       gem install rails
    ```
    This is just so we can get `rails credentials:edit` working

3. **Edit the encrypted credentials**:
   ```bash
   rm config/credentials.yml.enc
   rails credentials:edit
   ```

3. **Add your GitHub OAuth credentials in YAML format**:
   ```yaml
   github:
     client_id: your_github_client_id_here
     client_secret: your_github_client_secret_here
   ```

4. **Export master key**
    ```bash
    export RAILS_MASTER_KEY=$(cat ./config/master.key)
    ```

## 🚀 Running the Application

### Docker Compose Deployment

3. **Start the application:**
   ```bash
   docker compose up --build
   ```

    The container is intentionally run in production mode; SSL has been disabled for testing purposes.

4. **Access the application:**
   - Open your browser to [http://localhost:3000](http://localhost:3000)
   - Click "Sign in with GitHub" to authenticate
   - Start chatting!
   - Only localhost is supported for now

### Development Setup (Alternative)

If you prefer to run locally without Docker:

1. **Install dependencies:**
   ```bash
   bundle install
   npm install
   ```

2. **Setup database:**
   ```bash
   rails db:create db:migrate
   ```

3. **Start Redis:**
   ```bash
   redis-server &
   ```

4. **Start the development servers:**
   ```bash
   bin/dev
   ```

   This starts both the Rails server and Vite dev server via the Procfile. If running in production, you may need to tweak your REDIS_URL.

### Amazon ECS Deployment

Simple-chat supports provisional deployment via ECS.

#### Prerequisites

- AWS CLI and `aws configure`
- ECS CLI and `ecs-cli configure`
- An ECS cluster with at least one t2.small

#### Considerations

1. The docker compose file for ECS (compose.prod.yml) is currently wired up to my docker image. if you wish to modify simple-chat, you should update the reference to your own image.
2. For production use, consider restricting the allowed hosts in `config/environments/production.rb` to your specific domain instead of the current list

#### Deploy

   ```bash
   # Export your Rails master key
   export RAILS_MASTER_KEY=$(cat ./config/master.key)
   
   # Deploy using the production compose file
   ecs-cli compose --file compose.prod.yml up --cluster-config your-config-name --ecs-profile your-profile-name
   ```

## Next steps:

While this chat server is a great proof-of-concept, there are plenty of edges to sand. 

In the more immediate future, I'd love to allow:

1. Setting usernames
2. Supporting Google auth
3. Content filtering
4. multiple channels

Longer term, it'd be nice to either:

1. Allow for horizontal scaling
2. Allow for deployment via home NAS

### Horizontal Scaling

the architecture as it stands is a monolith, in the sense that the only external services required are data stores. Since this chat app currently serves 0 traffic, horizontal scaling is mostly for fun.

Horizontal scaling is accomplished by adding more nodes. Currently, each node serves all three parts of the application:

1. The web app
2. The producer websocket
3. The consumer websocket (they're the same socket)

The problem then becomes synchronizing service state between nodes.

#### Web App

synchronizing the web app is accomplished via deploy process. Spinning up a new node pool and waiting for health checks before swapping allows for immediate and synchronized version control. 

Alternatively, assets could be served via a CDN instead. Socket connections would need to be made to a known address.

#### Consumer websocket

Synchronization of the consumer websocket is done by connecting to a remote database; atomic inserts then automatically arbitrate chat state.

#### Producer websocket

Producer synchronization can _technically_ be achieved by high-frequency polling of the database or a read replica, but pub/sub would be a better option. Similar to the database, redis would be extracted into a remote, single-instance connection; nodes would publish to redis after inserting into the database, which fans out to the nodes, which finally fans out to clients via websockets.

Postgres has `LISTEN / NOTIFY` which could be used directly in place of redis - each node would `LISTEN` to the postgres database, and row inserts on the chat table would `NOTIFY`. Nodes would then fan out to clients; `async` could be used as the adapter, since synchronization has already been achieved. It's worth nothing that postgres has a limit of ~8kb per message.

Once every so often the server should still fetch the latest chats from the database, in case there are any ordering issues. If ordering and delivery are critically important, a message broker like Kafka should be used instead of pub/sub.
