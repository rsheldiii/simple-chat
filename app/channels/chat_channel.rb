class ChatChannel < ApplicationCable::Channel
  def subscribed
    stream_from "chat_channel"
  end

  # def receive(data)
  #   puts "received message", data
  #   ActionCable.server.broadcast("chat_channel", message: data["content"])
  # end

  def send_message(data)
    sanitize_data(data)
    user = User.first_or_create(name: data["username"])
    Chat.create(user_id: user.id, content: data["content"])
    ActionCable.server.broadcast("chat_channel", data)
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
    stop_all_streams
  end

  def sanitize_data(data)
    data["content"] = ActionController::Base.helpers.sanitize(data["content"])
    data["username"] = ActionController::Base.helpers.sanitize(data["username"])
    data
  end
end
