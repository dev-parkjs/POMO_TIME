from flask import Flask, render_template
from models.log import db
from routes.log_routes import log_bp
from routes.stats_routes import stats_bp
import config

app = Flask(__name__,
            static_folder='../static',
            template_folder='../templates')

app.config.from_object(config)
db.init_app(app)

app.register_blueprint(log_bp)
app.register_blueprint(stats_bp)

with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)