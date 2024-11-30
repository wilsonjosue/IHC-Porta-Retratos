from flask import Flask, render_template, request, redirect, url_for
import os

app = Flask(__name__)
UPLOAD_FOLDER = 'static/images'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'file-upload' not in request.files:
        return "No file part", 400
    file = request.files['file-upload']
    if file.filename == '':
        return "No selected file", 400
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(filepath)
    return redirect(url_for('gallery'))
    
@app.route('/')
def main_page():
    return render_template('main.html')

@app.route('/edit-image')
def edit_image():
    return render_template('edit_image.html')

@app.route('/news')
def news():
    return render_template('news.html')

@app.route('/activities')
def activities():
    return render_template('activities.html')

@app.route('/gallery')
def gallery():
    return render_template('gallery.html')

if __name__ == '__main__':
    app.run(debug=True)
