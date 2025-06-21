class UserController < ApplicationController
    def index
        render json: { name: current_user.name }
    end
end
