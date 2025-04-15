from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta

db = SQLAlchemy()

# 한국 시간으로 포맷팅된 현재 시간 반환 함수
def get_korean_time():
    # UTC → KST (UTC+9)
    kst = datetime.utcnow() + timedelta(hours=9)
    return kst.strftime("%Y년 %m월 %d일 %H시 %M분 %S초")

class PomodoroLog(db.Model):
    __tablename__ = 'pomodoro_logs'

    id = db.Column(db.Integer, primary_key=True)
    mode = db.Column(db.String(10))          # 'Work' or 'Rest'
    duration = db.Column(db.Integer)         # 분 단위
    time = db.Column(db.String(10))          # 'MM:SS' 포맷
    created_at = db.Column(db.String(30), default=get_korean_time)  # 한국식 날짜/시간