import json
from os import path, makedirs
from scripts.label_image import predictFromFile
from flask import Flask, render_template, request
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}

# set the project root directory as the static folder, you can set others.
app = Flask(__name__, template_folder='')
app.config['UPLOAD_FOLDER'] = path.dirname(__file__) + "/uploads"  # todo: fix it, please


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/')
def root():
    return render_template('index.html')


@app.route('/classify', methods=['POST'])
def classify():
    if 'file' not in request.files:
        raise FileNotFoundError("No file part")
    file = request.files['file']
    if file.filename == '':
        raise Exception('No selected file')
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = path.join(app.config['UPLOAD_FOLDER'], filename)
        makedirs(path.dirname(file_path), exist_ok=True)
        file.save(file_path)
        return json.dumps(predictFromFile(file_path), ensure_ascii=False, separators=(',', ':'))


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=9100, debug=True)
