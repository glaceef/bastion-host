require 'active_support'
require 'active_support/core_ext'
require 'redis'
require 'csv'

class RedisSadd
  # 初期化
  # @param redis_host [String] Redisホスト名
  # @param redis_key [String] 値をSADDするキー
  # @param data_csv_path [String] 値が記述されているCSVファイルのパス
  #
  def initialize(redis_host, redis_key, data_csv_path)
    @redis_host = redis_host
    @redis_key = redis_key
    @data_csv_path = data_csv_path
  end

  # 実行
  def execute
    redis = Redis.new(host: @redis_host)
    add_set_data(redis, @data_csv_path)
  end

  private

  # CSVファイルを読み込んでRedisのセットに値を登録する
  # @param redis [Redis] Redis
  # @param data_csv_path [String] 値が記述されているCSVファイルのパス
  #
  def add_set_data(redis, data_csv_path)
    CSV.open(data_csv_path, 'rt:BOM|utf-8') do |csv|
      csv.each do |row|
        puts row[0]
        redis.sadd(@redis_key, row[0])
      end
    end
  end
end

app = RedisSadd.new(ARGV[0], ARGV[1], ARGV[2])
app.execute
