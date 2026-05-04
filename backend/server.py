import os
from google import genai
# OR 
from google.genai import Client
from dotenv import load_dotenv

# Load environment variables (GEMINI_API_KEY)
load_dotenv()

class CodeClarifyAgent:
    def __init__(self):
        """
        Initializes the agent using the modern google.genai client.
        """
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in .env file.")
        
        # Initialize the modern Client
        self.client = Client(api_key=api_key)
        self.model_id = "gemini-2.5-flash" # Using the latest stable version
        
        # Memory / Context Store
        self.context_store = []

    def perception_layer(self, source_code):
        """
        Step 2: Code Analysis (Perception Layer)
        Detects programming language and extracts features.
        """
        if "def " in source_code or "import " in source_code:
            language = "Python"
        elif "function " in source_code or "const " in source_code:
            language = "JavaScript"
        elif "int main()" in source_code or "#include" in source_code:
            language = "C++"
        else:
            language = "Unknown"
        
        return {"code": source_code, "language": language}

    def reasoning_engine(self, perception_data, user_instruction="Explain this code"):
        """
        Step 4: LLM Reasoning (LLM-Based Brain)
        Uses the new google.genai SDK for semantic interpretation[cite: 1].
        """
        code = perception_data["code"]
        lang = perception_data["language"]
        
        # Structured Prompt based on Fig 3.2 requirements[cite: 1]
        prompt = f"""
        System: You are CodeClarify, an AI-powered code explanation assistant[cite: 1].
        
        Analyze this {lang} code and provide:
        1. Overview: High-level summary of program functionality[cite: 1].
        2. Step-by-Step Explanation: Logic flow in natural language[cite: 1].
        3. Key Concepts: Identified algorithms and techniques[cite: 1].
        4. Potential Issues: Detect bugs or inefficiencies[cite: 1].
        5. Suggestions: Recommend optimizations and best practices[cite: 1].

        Source Code:
        {code}

        Instruction: {user_instruction}
        """

        # Using the new generate method
        response = self.client.models.generate_content(
            model=self.model_id,
            contents=prompt
        )
        return response.text

    def action_layer(self, raw_explanation):
        """
        Step 5 & 6: Response Structuring & Output Delivery[cite: 1].
        """
        print("\n" + "="*60)
        print("🚀 CODECLARIFY MODERNIZED ANALYSIS")
        print("="*60)
        print(raw_explanation)
        print("="*60 + "\n")

    def process_query(self, source_code, instruction=""):
        """
        Executes the full agent processing pipeline[cite: 1].
        """
        # 1. Perception Layer[cite: 1]
        perception_data = self.perception_layer(source_code)
        
        # 2. Reasoning Engine[cite: 1]
        explanation = self.reasoning_engine(perception_data, instruction)
        
        # 3. Action Layer[cite: 1]
        self.action_layer(explanation)

# --- Main Entry Point ---
if __name__ == "__main__":
    agent = CodeClarifyAgent()

    sample_code = """
    def factorial(n):
        if n == 0:
            return 1
        return n * factorial(n-1)
    """

    agent.process_query(sample_code, "Explain the recursion logic.")