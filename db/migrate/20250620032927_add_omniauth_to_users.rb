class AddOmniauthToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :provider, :string, null: false, default: 'github'
    add_column :users, :uid,      :string, null: false
    # allow password fields to be null
    change_column_null :users, :encrypted_password, true
  end
end
