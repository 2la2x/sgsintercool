from flask import Flask, render_template, request, url_for, redirect, send_from_directory, jsonify, session
from flask_babel import Babel
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
import logging
from dotenv import load_dotenv
from sqlalchemy.exc import IntegrityError
import re
from werkzeug.utils import secure_filename

load_dotenv()

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app = Flask(__name__, 
            static_folder='static',
            static_url_path='/static',
            template_folder='templates')
app.secret_key = os.getenv('SECRET_KEY', 'your-secret-key-123')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "https://yourwebsite.com"]}})

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI', 'sqlite:///database.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

app.config['BABEL_DEFAULT_LOCALE'] = 'ar'
app.config['LANGUAGES'] = {'ar': 'Arabic', 'en': 'English'}
babel = Babel(app)

@app.before_request
def before_request():
    if 'lang' not in session:
        session['lang'] = 'ar' 
    
    lang_param = request.args.get('lang')
    if lang_param in ['ar', 'en']:
        session['lang'] = lang_param

def get_locale():
    if 'lang' in session and session['lang'] in ['ar', 'en']:
        return session['lang']
    
    lang = request.args.get('lang')
    if lang in ['ar', 'en']:
        return lang
    
    browser_lang = request.headers.get('Accept-Language', 'en').split(',')[0].lower()
    

    return 'ar' if not browser_lang.startswith('en') else 'en'

babel.init_app(app, locale_selector=get_locale)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    language = db.Column(db.String(2), default='ar')

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat(),
            'language': self.language
        }

ERROR_MESSAGES = {
    'en': {
        'missing_fields': 'Missing required fields: username and email',
        'user_not_found': 'User not found',
        'username_exists': 'Username already exists',
        'email_exists': 'Email already exists',
        'invalid_email': 'Invalid email format',
        'server_error': 'An unexpected error occurred'
    },
    'ar': {
        'missing_fields': 'الحقول المطلوبة مفقودة: اسم المستخدم والبريد الإلكتروني',
        'user_not_found': 'المستخدم غير موجود',
        'username_exists': 'اسم المستخدم موجود بالفعل',
        'email_exists': 'البريد الإلكتروني موجود بالفعل',
        'invalid_email': 'صيغة البريد الإلكتروني غير صالحة',
        'server_error': 'حدث خطأ غير متوقع'
    }
}

def is_valid_email(email):
    email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    return re.match(email_regex, email) is not None

@app.route('/')
@app.route('/<lang>')
def index(lang=None):
    lang = lang if lang in ['ar', 'en'] else session.get('lang', 'ar')
    return render_template(f'index_{lang}.html', 
                         current_page='index', 
                         lang=lang,
                         url_for=url_for)

@app.route('/about')
def about_redirect():
    return redirect(url_for('about', lang=session.get('lang', 'ar')))

@app.route('/<lang>/about')
def about(lang=None):
    lang = lang if lang in ['ar', 'en'] else session.get('lang', 'ar')
    return render_template(f'about_{lang}.html', 
                         current_page='about', 
                         lang=lang,
                         url_for=url_for)

@app.route('/services')
def services_redirect():
    return redirect(url_for('services', lang=session.get('lang', 'ar')))

@app.route('/<lang>/services')
def services(lang=None):
    lang = lang if lang in ['ar', 'en'] else session.get('lang', 'ar')
    return render_template(f'services_{lang}.html', 
                         current_page='services', 
                         lang=lang,
                         url_for=url_for)

@app.route('/products')
def products_redirect():
    return redirect(url_for('products', lang=session.get('lang', 'ar')))

@app.route('/<lang>/products')
def products(lang=None):
    lang = lang if lang in ['ar', 'en'] else session.get('lang', 'ar')
    return render_template(f'products_{lang}.html', 
                         current_page='products', 
                         lang=lang,
                         url_for=url_for)

@app.route('/media')
def media_redirect():
    return redirect(url_for('media', lang=session.get('lang', 'ar')))

@app.route('/<lang>/media')
def media(lang=None):
    lang = lang if lang in ['ar', 'en'] else session.get('lang', 'ar')
    return render_template(f'media_{lang}.html', 
                         current_page='media', 
                         lang=lang,
                         url_for=url_for)

@app.route('/career')
def career_redirect():
    return redirect(url_for('career', lang=session.get('lang', 'ar')))

@app.route('/<lang>/career')
def career(lang=None):
    lang = lang if lang in ['ar', 'en'] else session.get('lang', 'ar')
    return render_template(f'career_{lang}.html', 
                         current_page='career', 
                         lang=lang,
                         url_for=url_for)

@app.route('/contact')
def contact_redirect():
    return redirect(url_for('contact', lang=session.get('lang', 'ar')))

@app.route('/<lang>/contact')
def contact(lang=None):
    lang = lang if lang in ['ar', 'en'] else session.get('lang', 'ar')
    return render_template(f'contact_{lang}.html', 
                         current_page='contact', 
                         lang=lang,
                         url_for=url_for)


@app.route('/switch_lang/<lang>')
def switch_lang(lang):
    if lang not in ['ar', 'en']:
        lang = 'ar'
    
    session['lang'] = lang
    
    referrer = request.referrer or url_for('index', lang=lang)
    
    try:
        from urllib.parse import urlparse
        parsed = urlparse(referrer)
        path = parsed.path.strip('/')
        
        if not path or path in ['ar', 'en']:
            return redirect(url_for('index', lang=lang))
        
        path_parts = path.split('/')
        
        if path_parts[0] in ['ar', 'en']:
            if len(path_parts) > 1:
                route_name = path_parts[1]
            else:
                return redirect(url_for('index', lang=lang))
        else:
            route_name = path_parts[0]
        
        known_routes = ['about', 'services', 'products', 'media', 'career', 'contact']
        if route_name in known_routes:
            return redirect(url_for(route_name, lang=lang))
        
    except Exception as e:
        logger.error(f"Error parsing referrer URL: {str(e)}")
    
    return redirect(url_for('index', lang=lang))


@app.route('/static/<path:filename>')
def serve_static(filename):
    if app.static_folder is None:
        return "Static folder not configured", 404
    return send_from_directory(app.static_folder, filename)

@app.route('/test-language-switcher')
def test_language_switcher():
    return send_from_directory('.', 'test_language_switcher.html')

@app.route('/submit_application', methods=['POST'])
def submit_application():
    if request.method == 'POST':
        try:
            name = request.form.get('name')
            email = request.form.get('email')
            phone = request.form.get('phone')
            position = request.form.get('position')
            experience = request.form.get('experience')
            message = request.form.get('message')
            
            cv = request.files.get('cv')
            if cv and cv.filename:
                filename = secure_filename(cv.filename)
                cv.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            
            return jsonify({'message': 'Application submitted successfully'}), 200
            
        except Exception as e:
            logger.error(f"Error processing application: {str(e)}")
            return jsonify({'error': 'Failed to process application'}), 500
    
    return jsonify({'error': 'Method not allowed'}), 405

@app.errorhandler(404)
def page_not_found(e):
    lang = get_locale()
    return render_template(f'404_{lang}.html', lang=lang), 404

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)