class Task < ActiveRecord::Base
    has_many :timers
    belongs_to :project
end