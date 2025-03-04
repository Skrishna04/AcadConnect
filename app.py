import os
from flask import Flask, Blueprint, render_template, request, redirect, url_for, flash, session, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
import csv
from bson import ObjectId
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
print("[ENV]", os.getenv("MONGO_CLUSTER_URL"))

# Configuration class
class Config:
    MONGO_URI = os.getenv("MONGO_CLUSTER_URL")
    print("[CONFIG]", MONGO_URI)
    SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Secret key for session management and flash messages
app.secret_key = 'your_secret_key'

# Database setup for SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///students.db'  # SQLite for simplicity
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)  # This is for SQLAlchemy

# Initialize extensions
CORS(app, resources={r"/*": {"origins": "*"}})
bcrypt = Bcrypt(app)

# Initialize MongoDB client with error handling
try:
    # Construct the MongoDB URI with the correct format
    mongo_uri = os.getenv("MONGO_CLUSTER_URL")
    
    print("Attempting to connect to MongoDB...")
    print(f"Using connection string (without password): {mongo_uri}")
    
    # Initialize the client with a longer timeout
    mongo_client = MongoClient(
        mongo_uri
    )
    
    # Test the connection
    mongo_client.admin.command('ping')
    
    # Get the database
    mongodb = mongo_client[os.getenv('MONGO_DB_NAME')]
    
    # Create collections if they don't exist
    if 'messages' not in mongodb.list_collection_names():
        mongodb.create_collection('messages')
    if 'users' not in mongodb.list_collection_names():
        mongodb.create_collection('users')
    
    print("Successfully connected to MongoDB Atlas")

except Exception as e:
    print(f"Failed to connect to MongoDB: {str(e)}")
    print("Please check your MongoDB Atlas settings:")
    print("1. Verify your username and password")
    print("2. Check if your IP address is whitelisted")
    print("3. Verify the cluster URL")
    print(f"Connection string used: {mongo_uri}")
    mongodb = None

def check_mongodb_connection():
    """Check if MongoDB connection is available"""
    if not mongodb:
        raise Exception("MongoDB connection is not available. Please check your connection settings.")
    try:
        # Test the connection with a ping
        mongodb.command('ping')
        return True
    except Exception as e:
        print(f"MongoDB connection error during check: {str(e)}")
        raise Exception(f"MongoDB connection error: {str(e)}")

# Database model for storing user data (SQLAlchemy)
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

# Create the database (only run once)
with app.app_context():
    db.create_all()

# Define models for messaging (MongoDB)
class Message:
    @staticmethod
    def get_messages_between_users(user1_id, user2_id):
        check_mongodb_connection()
        try:
            return mongodb.messages.find({
                "$or": [
                    {"sender_id": user1_id, "receiver_id": user2_id},
                    {"sender_id": user2_id, "receiver_id": user1_id}
                ]
            }).sort("timestamp")
        except Exception as e:
            print(f"Error getting messages: {str(e)}")
            return []

    @staticmethod
    def create_message(message_data):
        check_mongodb_connection()
        try:
            return mongodb.messages.insert_one(message_data)
        except Exception as e:
            print(f"Error creating message: {str(e)}")
            raise

# Define blueprint
main = Blueprint('main', __name__)

@main.route("/messages", methods=["GET"])
def get_messages():
    try:
        check_mongodb_connection()
        print("MongoDB connection successful")
        
        user1_id = request.args.get("user1_id")
        user2_id = request.args.get("user2_id")
        
        if not all([user1_id, user2_id]):
            return jsonify({"error": "Missing user IDs"}), 400
            
        messages = Message.get_messages_between_users(user1_id, user2_id)
        return jsonify([{
            "id": str(message["_id"]),
            "content": message["content"],
            "sender_id": message["sender_id"],
            "receiver_id": message["receiver_id"],
            "timestamp": message    ["timestamp"].isoformat()
        } for message in messages])
    except Exception as e:
        print(f"Error in get_messages route: {str(e)}")
        return jsonify({"error": str(e)}), 500

@main.route("/messages", methods=["POST"])
def send_message():
    data = request.get_json()
    message_data = {
        "sender_id": data["sender_id"],
        "receiver_id": data["receiver_id"],
        "content": data["content"],
        "timestamp": datetime.utcnow()
    }
    result = Message.create_message(message_data)
    return jsonify({"inserted_id": str(result.inserted_id)}), 201

@main.route("/users", methods=["POST"])
def create_user():
    data = request.get_json()
    hashed_password = bcrypt.generate_password_hash(data["password"]).decode('utf-8')
    user_data = {
        "username": data["username"],
        "email": data["email"],
        "password": hashed_password
    }
    result = mongodb.users.insert_one(user_data)  # Changed from db to mongodb
    return jsonify({"inserted_id": str(result.inserted_id)}), 201

@main.route("/users/login", methods=["POST"])
def login_user():
    data = request.get_json()
    user = mongodb.users.find_one({"email": data["email"]})  # Changed from db to mongodb
    if user and bcrypt.check_password_hash(user["password"], data["password"]):
        session["user_id"] = str(user["_id"])
        return jsonify({"message": "Login successful"}), 200
    return jsonify({"message": "Invalid credentials"}), 401

@main.route("/users/logout", methods=["POST"])
def logout_user():
    session.pop("user_id", None)
    return jsonify({"message": "Logout successful"}), 200

# Register blueprints
app.register_blueprint(main)

@app.route('/')
def start():
    return render_template('start.html') 

# Home route for login page
@app.route('/index')
def index():
    return render_template('index.html')  # This will render the login form

# Handle login submission
@app.route('/login', methods=['POST'])
def login():
    email = request.form.get('email')
    password = request.form.get('password')

    # Check if user exists
    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password, password):
        # Successful login
        flash('Login successful!', 'success')
        session['user_id'] = user.id  # Store user id in session
        session['email'] = user.email
        return redirect(url_for('dashboard'))
    else:
        # Invalid login
        flash('Invalid email or password. Please try again.', 'danger')
        return redirect(url_for('index'))

# Signup page (optional in the provided HTML)
@app.route('/signup')
def signup():
    return render_template('signup.html')  # A page for user signup

# Handle account creation (signup form)
@app.route('/create_account', methods=['POST'])
def create_account():
    email = request.form.get('email')
    password = request.form.get('password')
    name = request.form.get('name')

    # Check if the email already exists
    if User.query.filter_by(email=email).first():
        flash('Email already registered. Please log in.', 'warning')
        return redirect(url_for('index'))

    # Hash the password before storing it
    hashed_password = generate_password_hash(password)

    # Create a new user record in the database
    new_user = User(email=email, password=hashed_password, name=name)
    db.session.add(new_user)
    db.session.commit()

    flash('Account created successfully! Please log in.', 'success')
    resp = make_response(redirect(url_for('index')))
    resp.set_cookie('email', email, expires=datetime.now() + timedelta(days=30))
    return resp

# Dashboard page after successful login
@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        flash('You must be logged in to view the dashboard.', 'danger')
        return redirect(url_for('index'))
    return render_template('dashboard.html')  # Placeholder dashboard page

# Handle student interests form submission
@app.route('/interest1', methods=['GET', 'POST'])
def interest():
    if request.method == 'POST':
        # Get selected branches from the form
        branches = request.form.getlist('branches')
        
        # Initialize a dictionary to store branch-specific interests
        interests = {}
        
        # Collect selected interests based on the selected branches
        if 'CSE' in branches:
            interests['CSE'] = request.form.getlist('CSE-interests')
        if 'ECE' in branches:
            interests['ECE'] = request.form.getlist('ECE-interests')
        if 'EEE' in branches:
            interests['EEE'] = request.form.getlist('EEE-interests')
        if 'ME' in branches:
            interests['ME'] = request.form.getlist('ME-interests')
        if 'CE' in branches:
            interests['CE'] = request.form.getlist('CE-interests')
        if 'IT' in branches:
            interests['IT'] = request.form.getlist('IT-interests')

        # You can process the interests here or store them in a database

        # Returning the selected data (interest.html should display the results)
        user = {"name": request.cookies.get('email')}
        return redirect(url_for('home'))
    
    return render_template('interest1.html')  # This will render the form to collect student interests

# Handle student data upload (college ID and student info)
@app.route('/submit', methods=['POST'])
def submit():
    if 'user_id' not in session:
        flash('You must be logged in to submit data.', 'danger')
        return redirect(url_for('index'))  # Redirect to login page if user is not logged in
    
    # Retrieve user_id from the session
    user_id = session['user_id']
    
    # Get the data from the form
    name = request.form['name']
    roll_number = request.form['rollNumber']
    course = request.form['course']
    year = request.form['year']
    branch = request.form['branch']
    dob = request.form['dob']
    college_id = request.files['collegeId']

    # Process the uploaded college ID file (if any)
    if college_id and allowed_file(college_id.filename):
        filename = secure_filename(college_id.filename)
        college_id_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        college_id.save(college_id_path)

        # Save the data to a CSV (or a database if needed)
        with open('student_data.csv', mode='a', newline='') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow([user_id, name, roll_number, course, year, branch, dob, college_id_path])  # Save user_id along with other data

        flash(f"Successfully submitted: {name}, {roll_number}, {course}, {year}, {branch}, {dob}", 'success')
        return redirect(url_for('interest'))  # Redirect after successful submission
    else:
        flash("Invalid file format. Only JPG, JPEG, and PNG are allowed.", 'danger')
        return redirect(url_for('dashboard'))  # Redirect to the dashboard in case of error

# Helper function to check allowed file types (for uploading college ID)
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'jpg', 'jpeg', 'png'}

# Upload folder configuration for student file upload
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Ensure the upload folder exists
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

# Route for the home page
@app.route('/home')
def home():
    # Check if the user is logged in
    if 'user_id' not in session:
        flash('You must be logged in to view the dashboard.', 'danger')
        return redirect(url_for('index'))

    # Retrieve the user's name from the session
    user_id = session['user_id']
    user = User.query.get(user_id)  # Get the user object from the database

    if user:
        user_name = user.email.split('@')[0]  # Extract username from email (or use another field if available)
        session['user_name'] = user_name  # Store the username in the session
    else:
        flash('User not found. Please log in again.', 'danger')
        return redirect(url_for('index'))

    # Pass the user's name to the template
    return render_template('home.html', user=user)

# Route for the profile page
@app.route('/profile')
def profile():
    # Check if the user is logged in
    if 'user_id' not in session:
        flash('You must be logged in to view your profile.', 'danger')
        return redirect(url_for('index'))

    # Retrieve the user's name from the session
    user_id = session['user_id']
    user = User.query.get(user_id)  # Get the user object from the database

    # Initialize a dictionary to store the user's profile details
    profile_details = {
        'name': user.name,
        'email': user.email,
        'roll_number': '',
        'course': '',
        'year': '',
        'branch': '',
        'dob': ''
    }

    # Read user details from the CSV file
    with open('student_data.csv', mode='r') as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            if int(row[0]) == user_id:
                profile_details['roll_number'] = row[2]
                profile_details['course'] = row[3]
                profile_details['year'] = row[4]
                profile_details['branch'] = row[5]
                profile_details['dob'] = row[6]
                break

    return render_template('profile.html', user=profile_details)

# Route for searching users
@app.route('/search')
def search():
    query = request.args.get('q')
    if not query:
        return jsonify([])

    users = User.query.filter(User.name.contains(query)).all()
    results = [{'name': user.name, 'email': user.email} for user in users]

    return jsonify(results)

# Route for getting friend requests
@app.route('/requests')
def get_requests():
    # Fetch friend requests from the database or any data source
    requests = [
        {"name": "John Doe"},
        {"name": "Jane Smith"},
        {"name": "Alice Johnson"}
    ]
    return jsonify(requests)

# Route for getting friend suggestions
@app.route('/suggestions')
def get_suggestions():
    # Fetch friend suggestions from the database or any data source
    suggestions = [
        {"name": "Bob Brown"},
        {"name": "Charlie Davis"},
        {"name": "Eve White"}
    ]
    return jsonify(suggestions)

@app.route('/messages')
def messages():
    if 'user_id' not in session:
        flash('Please login first', 'error')
        return redirect(url_for('login'))
    
    # Get current user's info
    user = User.query.get(session['user_id'])
    if not user:
        flash('User not found', 'error')
        return redirect(url_for('login'))
    
    return render_template('messages.html', current_user=user)

@app.route('/api/get_users')
def get_users():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    try:
        current_user_id = session['user_id']
        
        # Debug print
        print(f"Current user ID: {current_user_id}")
        
        # Get all users except current user
        users = User.query.filter(User.id != current_user_id).all()
        
        # Debug print
        print(f"Found {len(users)} other users")
        
        users_list = [{
            'id': user.id,
            'name': user.name,
            'email': user.email
        } for user in users]
        
        return jsonify(users_list)
    except Exception as e:
        print(f"Error in get_users: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/get_messages/<recipient_id>')
def get_chat_messages(recipient_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    sender_id = session['user_id']
    
    # Convert IDs to integers for comparison
    sender_id = int(sender_id)
    recipient_id = int(recipient_id)
    
    # Get messages between these users from MongoDB
    messages = mongodb.messages.find({  # Changed from db to mongodb
        '$or': [
            {'sender_id': sender_id, 'recipient_id': recipient_id},
            {'sender_id': recipient_id, 'recipient_id': sender_id}
        ]
    }).sort('timestamp', 1)
    
    # Format messages for the frontend
    messages_list = []
    for msg in messages:
        messages_list.append({
            'id': str(msg['_id']),
            'content': msg['content'],
            'timestamp': msg['timestamp'].isoformat(),
            'sent': msg['sender_id'] == sender_id
        })
    
    return jsonify(messages_list)

@app.route('/api/send_message', methods=['POST'])
def send_message():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    data = request.get_json()
    sender_id = session['user_id']
    recipient_id = data.get('recipient_id')
    content = data.get('content')
    
    if not all([recipient_id, content]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Create new message in MongoDB
    message = {
        'sender_id': int(sender_id),
        'recipient_id': int(recipient_id),
        'content': content,
        'timestamp': datetime.utcnow(),
        'read': False
    }
    
    result = mongodb.messages.insert_one(message)  # Changed from db to mongodb
    
    return jsonify({
        'id': str(result.inserted_id),
        'timestamp': message['timestamp'].isoformat()
    }), 201

@app.route('/test_connection')
def test_connection():
    try:
        # Test MongoDB connection
        check_mongodb_connection()
        
        # Get database info
        db_stats = mongodb.command("dbstats")
        
        return jsonify({
            "status": "success",
            "message": "Connected to MongoDB",
            "database_name": os.getenv('MONGO_DB_NAME'),
            "collections": mongodb.list_collection_names(),
            "stats": db_stats
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e),
            "connection_string": f"mongodb+srv://{os.getenv('MONGO_USERNAME')}:****@{os.getenv('MONGO_CLUSTER_URL')}"
        }), 500

if __name__ == '__main__':
    app.run(debug=True)