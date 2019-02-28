options = {
    adapter: 'postgresql',
    database: 'geshido'
  }
  
  ActiveRecord::Base.establish_connection( ENV['DATABASE_URL'] || options)