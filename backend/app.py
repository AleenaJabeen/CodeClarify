from flask import Flask, request, jsonify
from flask_cors import CORS

from agent import CodeClarifyAgent

app = Flask(__name__)

CORS(app)

agent = CodeClarifyAgent()

@app.route("/")
def home():
    return "CodeClarify Backend Running"


@app.route("/summarize", methods=["POST"])
def summarize_code():

    try:

        data = request.get_json()

        source_code = data.get("code")
        instruction = data.get("instruction", "")

        if not source_code:
            return jsonify({
                "success": False,
                "message": "Code is required"
            }), 400

        result = agent.process_query(
            source_code,
            instruction
        )

        return jsonify({
            "success": True,
            "summary": result
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
@app.route("/detect-language", methods=["POST"])
def detect_language():
    data = request.get_json()
    perception = agent.perception_layer(data.get("code", ""))
    return jsonify({"language": perception["language"]})

if __name__ == "__main__":
    app.run(debug=True)