import os
from flask import Flask, render_template

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET")

# Sample quotes since no quotes were provided in the prompt
quotes = [
    "The only way to do great work is to love what you do. — Steve Jobs",
    "Life is what happens when you're busy making other plans. — John Lennon",
    "The future belongs to those who believe in the beauty of their dreams. — Eleanor Roosevelt",
    "In the end, it's not the years in your life that count. It's the life in your years. — Abraham Lincoln",
    "The purpose of our lives is to be happy. — Dalai Lama",
    "Get busy living or get busy dying. — Stephen King",
    "You only live once, but if you do it right, once is enough. — Mae West",
    "Many of life's failures are people who did not realize how close they were to success when they gave up. — Thomas A. Edison",
    "If you want to live a happy life, tie it to a goal, not to people or things. — Albert Einstein",
    "Your time is limited, so don't waste it living someone else's life. — Steve Jobs",
    "The best time to plant a tree was 20 years ago. The second best time is now. — Chinese Proverb",
    "The journey of a thousand miles begins with one step. — Lao Tzu"
]

@app.route('/')
def index():
    return render_template('index.html', quotes=quotes)
