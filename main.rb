require 'sinatra'
require 'sinatra/reloader'
require 'pry'
require 'active_record'
require 'pg'
require "httparty"
require 'time_difference'
require_relative 'db_config'
require_relative 'models/task'
require_relative 'models/timer'
require_relative 'models/project'
require_relative 'models/user'

enable :sessions


helpers do 

  def current_user
  User.find_by(id: session[:user_id])
  end

  def logged_in?
      if current_user
          true
      else  
          false
      end
  end

  def current_project
    Project.find_by(id: params[:id])
  end 

end


set :allow_origin, '*'

def timer_currently_running?(task_id)
    return true if (Timer.where(task_id: task_id).where(end_time: nil)).length != 0
    false
end

def get_current_timer(task_id)
  Timer.where(task_id: task_id).where(end_time: nil)[0][:start_time]
end

def time_conversion(minutes)
  hours = minutes / 60
  rest = minutes % 60
  "#{hours}:#{rest}" 
end

get '/' do
  erb :index
end

get '/tasks' do
  @tasks = Task.all
  @tasks.order(created_at: :desc)
  @timers = Timer.all
  @current_time = Time.new
  erb :tasks
end


post '/tasks' do
  @task = Task.new
  @task.task_name = params[:task_name]
  @task.created_at = Time.new
  @task.project_id = params[:project_id]
  @task.save
  redirect '/tasks'
end

delete '/tasks/:id' do
  @task = Task.find(params[:id])
  @task.destroy
  redirect '/tasks'
end

put '/task/:id/edit' do
  task = Task.find(params[:id])
  task.task_name = params[:name]
  task.due_date = params[:due_date]
  if params[:priority]
    task.priority = true
  end
  task.save
  redirect '/tasks'
end

put '/task/:id/complete' do
  @task = Task.find(params[:id])
  @task.completed = true
  @task.save
  @timer = Timer.where(task_id: @task[:id]).where(end_time: nil)
  if @timer.length > 0
    @timer[0].end_time = Time.new
    @timer[0].total_time = (TimeDifference.between(@timer[0].start_time, @timer[0].end_time).in_minutes).round
    @timer[0].save
  end
end

put '/task/:id/uncomplete' do
  @task = Task.find(params[:id])
  @task.completed = false
  @task.save
  redirect '/tasks'
end

post '/:id/start-timer' do
  # if statement here
  @task = Task.find(params[:id])
  @timer = Timer.new
  @timer.start_time = Time.new
  @timer.task_id = params[:id]
  @timer.save
  redirect '/tasks'
end

put '/:id/stop-timer' do
  @timer = Timer.where(task_id: params[:id]).where(end_time: nil)
  @timer[0].end_time = Time.new
  @timer[0].total_time = (TimeDifference.between(@timer[0].start_time, @timer[0].end_time).in_minutes).round
  @timer[0].save
  redirect '/tasks'
end

get '/projects' do
  @project = Project.all
  @tasks = Task.all
  # @tasks = Project.join(:tasks)
  erb :projects
end

get '/project/new' do
  
  erb :new_project
end

post '/project/new' do
  project = Project.new
  project.name = params[:name]
  project.max_hours = params[:max_hours]
  project.save
  redirect '/projects'
end 

get '/project/:name' do
  @project = Project.find_by(name: params[:name])
  @name = @project.name
  erb :project_page
end


get '/signup' do
  erb :signup
end 

post '/signup' do 
  user = User.new
  user.first_name = params[:first_name]
  user.last_name = params[:last_name]
  user.email = params[:email]
  user.password = params[:password]
  user.save

redirect '/login'
end 

get '/login' do
  erb :login
end

post '/session' do
  user = User.find_by(email: params[:email])
    if user && user.authenticate(params[:password])
      session[:user_id] = user.id
      redirect "/tasks"
    else 
      erb :login
    end 
end

get '/calendar' do 

  erb :calendar
end 



get '/api/tasks' do
  tasks = Task.all
  content_type "application/json"
  tasks.to_json
  # res["currently"].to_json
end

post '/api/tasks' do
  @task = Task.new
  @task.task_name = params[:task_name]
  @task.created_at = Time.new
  @task.save
  @task.to_json
end

get '/api/timers' do 
  timers = Timer.all
  content_type "application/json"
  timers.to_json
end

get '/api/projects' do
  projects = Project.all
  content_type "application/json"
  projects.to_json
end

get '/api/project/:name/tasks' do
  @project = Project.find_by(name: params[:name])
  tasks = Task.where(project_id: @project.id)
  content_type "application/json"
  tasks.to_json
end 










