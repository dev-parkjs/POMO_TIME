from flask import Blueprint, jsonify
from models.log import PomodoroLog
from datetime import datetime
from sqlalchemy import func

stats_bp = Blueprint('stats', __name__)

@stats_bp.route('/stats/today', methods=['GET'])
def today_stats():
    today = datetime.utcnow().date()

    logs = PomodoroLog.query.filter(
        func.date(PomodoroLog.created_at) == today,
        PomodoroLog.mode == 'Work'
    ).all()

    total_minutes = sum(log.duration for log in logs)

    return jsonify({
        'date': today.isoformat(),
        'total_focus_minutes': total_minutes,
        'session_count': len(logs)
    })