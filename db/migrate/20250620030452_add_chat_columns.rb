class AddChatColumns < ActiveRecord::Migration[8.0]
  def change
    add_column :chats, :user_id, :integer, null: false
    add_column :chats, :content, :string, null: false
  end
end
