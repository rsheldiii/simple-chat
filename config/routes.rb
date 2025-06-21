Rails.application.routes.draw do
  devise_for :users, controllers: { omniauth_callbacks: "users/omniauth_callbacks" }, skip: [ :sessions, :registrations, :passwords, :confirmations, :unlocks ]

  devise_scope :user do
      get "sign_in", to: "session#new", as: :new_user_session
    get "sign_out", to: "devise/sessions#destroy", as: :destroy_user_session
  end

  resources :session, only: [ :new ]
  resources :user, only: [ :index ]
  resources :chat, only: [ :index ]
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check


  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  # root "posts#index"
  mount ActionCable.server => "/cable"
  root "chat#show_chat"
end
