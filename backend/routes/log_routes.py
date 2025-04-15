# routes/log_routes.py
from flask import Blueprint, request, jsonify
from models.log import PomodoroLog, db

log_bp = Blueprint('log', __name__)

@log_bp.route('/log', methods=['POST'])
def log_session():
    data = request.json
    mode = data.get('mode', 'Work')
    duration = data.get('duration', 25)
    time_str = data.get('time', '00:00')

    log = PomodoroLog(mode=mode, duration=duration, time=time_str)
    db.session.add(log)
    db.session.commit()

    return jsonify({'result': 'saved'})