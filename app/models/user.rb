class User < ApplicationRecord
  devise :omniauthable, omniauth_providers: [ :github ]

  has_many :chats

  validates :name, presence: true, uniqueness: true

  after_create :log_user_creation

  def log_user_creation
    puts "User #{name} has joined the party"
  end

  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email
      user.name  = auth.info.name
    end
  end
end
