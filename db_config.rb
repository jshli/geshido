options = {
    adapter: 'postgresql',
    database: 'geshido'
  }
  
ActiveRecord::Base.establish_connection(options)