import os
import re
from google.genai import Client, types  # <-- Make sure to import types
from dotenv import load_dotenv
from pygments.lexers import guess_lexer
from pygments.util import ClassNotFound

load_dotenv()

class CodeClarifyAgent:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found")

        self.client = Client(api_key=api_key)
        self.model_id = "gemini-2.5-flash"

    def perception_layer(self, source_code):
        stripped = source_code.strip()

        if re.search(r'import\s+\w+\s+from\s+[\'"]', stripped) or \
           re.search(r'export\s+default', stripped) or \
           re.search(r'<[A-Z][a-zA-Z]+', stripped):  # JSX component tags
            language = "JavaScript/JSX"
        elif "def " in stripped and ("return" in stripped or "print(" in stripped):
            language = "Python"
        elif "function " in stripped or "const " in stripped or "=>" in stripped:
            language = "JavaScript"
        elif "#include" in stripped or "std::" in stripped:
            language = "C/C++"
        elif "public class " in stripped:
            language = "Java"
        else:
            try:
                lexer = guess_lexer(source_code)
                language = lexer.name
                if language in ["Tera Term Macro", "TTL", "Batchfile"]:
                    language = "Unknown"
            except ClassNotFound:
                language = "Unknown"

        return {"code": source_code, "language": language}

    def reasoning_engine(self, perception_data, user_instruction="Explain this code"):
        code = perception_data["code"]
        lang = perception_data["language"]

        prompt = """
        You are CodeClarify, an expert code explanation assistant.
        Analyze the following {language} code.

        User instruction: {instruction}

        Source code:
        ```{language}
        {code}
        ```
        """.format(language=lang, code=code, instruction=user_instruction)

        # Correct config mapping according to modern google-genai SDK
        config = types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=types.Schema(
                type="OBJECT",
                properties={
                    "overview": types.Schema(type="STRING"),
                    "steps": types.Schema(type="ARRAY", items=types.Schema(type="STRING")),
                    "concepts": types.Schema(type="ARRAY", items=types.Schema(type="STRING")),
                    "issues": types.Schema(type="ARRAY", items=types.Schema(type="STRING")),
                    "suggestions": types.Schema(type="ARRAY", items=types.Schema(type="STRING")),
                },
                required=["overview", "steps", "concepts", "issues", "suggestions"]
            )
        )

        response = self.client.models.generate_content(
            model=self.model_id,
            contents=prompt,
            config=config
        )
        return response.text

    def process_query(self, source_code, instruction=""):
        perception_data = self.perception_layer(source_code)
        explanation = self.reasoning_engine(perception_data, instruction)
        return explanation