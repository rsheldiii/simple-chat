class ChatController < ApplicationController
    CHAT_LIMIT = 3
    # set appropriate headers for CORS
    # specifically only localhost connections for now
    before_action :set_headers, only: [ :index ]
    def set_headers
        headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
        headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        headers["Access-Control-Allow-Headers"] = "Content-Type"
        headers["Access-Control-Allow-Credentials"] = "true"
    end

    def show_chat
    end

    def index
        # parse date from params
        created_at = DateTime.parse(params[:created_at])
        # no foreign key so we have to get crafty
        @chats = Chat.order(created_at: :desc).where("chats.created_at < ?", created_at).limit(CHAT_LIMIT).joins("INNER JOIN users ON chats.user_id = users.id").select("chats.*, users.name")
        respond_to do |format|
            format.json { render json: @chats.reverse }
        end
    end
end
