import os
from google.genai import Client
from dotenv import load_dotenv

load_dotenv()

class CodeClarifyAgent:
    def __init__(self):

        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise ValueError("GEMINI_API_KEY not found")

        self.client = Client(api_key=api_key)
        self.model_id = "gemini-2.5-flash"

    def perception_layer(self, source_code):

        if "def " in source_code or "import " in source_code:
            language = "Python"

        elif "function " in source_code or "const " in source_code:
            language = "JavaScript"

        elif "int main()" in source_code or "#include" in source_code:
            language = "C++"

        else:
            language = "Unknown"

        return {
            "code": source_code,
            "language": language
        }

    def reasoning_engine(self, perception_data, user_instruction="Explain this code"):

        code = perception_data["code"]
        lang = perception_data["language"]

        prompt = f"""
        You are CodeClarify, an AI-powered code explanation assistant.

        Analyze this {lang} code and provide:

        1. Overview
        2. Step-by-Step Explanation
        3. Key Concepts
        4. Potential Issues
        5. Suggestions

        Source Code:
        {code}

        Instruction:
        {user_instruction}
        """

        response = self.client.models.generate_content(
            model=self.model_id,
            contents=prompt
        )

        return response.text

    def process_query(self, source_code, instruction=""):

        perception_data = self.perception_layer(source_code)

        explanation = self.reasoning_engine(
            perception_data,
            instruction
        )

        return explanation