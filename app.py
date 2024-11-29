from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def main_page():
    return render_template('main.html')

@app.route('/edit-image')
def edit_image():
    return render_template('edit_image.html')

if __name__ == '__main__':
    app.run(debug=True)
