from flask import Flask, request, jsonify
from flask_cors import CORS
from matcher import get_match_score

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ML service running"})

@app.route('/match', methods=['POST'])
def match():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No data provided"}), 400

        resume_text = data.get('resume_text', '')
        job_description = data.get('job_description', '')

        if not resume_text or not job_description:
            return jsonify({"error": "resume_text and job_description required"}), 400

        score = get_match_score(resume_text, job_description)

        return jsonify({
            "score": score,
            "message": "Match score calculated successfully"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)