import os
from groq import Groq
from groq.types.chat import ChatCompletion

from dotenv import load_dotenv

# 1. Load environment variables from the .env file
# This must be called BEFORE trying to access the variables
load_dotenv()

# 1. Setup and Initialization
# The Groq client automatically looks for the GROQ_API_KEY environment variable.
# To make this code runnable without setting the environment variable first,
# you can temporarily hardcode your key here, but using environment variables
# is the recommended best practice for production/shared code.
#
# Replace "YOUR_GROQ_API_KEY" with your actual key if you are not
# setting GROQ_API_KEY as an environment variable.
#
# NOTE: In a real-world scenario, you should set this as an environment variable!
API_KEY = os.environ.get("GROQ_API_KEY", "YOUR_GROQ_API_KEY")

if API_KEY == "YOUR_GROQ_API_KEY":
    print("WARNING: Please replace 'YOUR_GROQ_API_KEY' or set the GROQ_API_KEY environment variable.")

try:
    client = Groq(api_key=API_KEY)
except Exception as e:
    print(f"Error initializing Groq client: {e}")
    exit()

# 2. Function to interact with the model
def get_groq_response(prompt: str, model_name: str = "llama3-70b-8192") -> str:
    """
    Generates a response from a specified Groq model.

    :param prompt: The user's query.
    :param model_name: The model ID to use (e.g., 'llama3-70b-8192', 'mixtral-8x7b-32768').
    :return: The generated text response.
    """
    print("-" * 50)
    print(f"Model: {model_name}")
    print(f"Prompt: {prompt}\n")

    try:
        # Call the chat completions endpoint
        chat_completion: ChatCompletion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            # Use a fast model like Llama 3 70B for general tasks
            model=model_name,
            temperature=0.7, # Controls randomness
        )

        # Extract the text and associated metadata
        content = chat_completion.choices[0].message.content
        prompt_time = chat_completion.usage.prompt_time / 1000 if chat_completion.usage else 'N/A'
        completion_time = chat_completion.usage.completion_time / 1000 if chat_completion.usage else 'N/A'
        total_time = chat_completion.usage.total_time / 1000 if chat_completion.usage else 'N/A'

        print("--- Response ---")
        print(content)
        print("\n--- Performance Metrics (Times in seconds) ---")
        print(f"Prompt Processing Time: {prompt_time}")
        print(f"Completion Generation Time: {completion_time}")
        print(f"Total Inference Time: {total_time}")
        print("-" * 50)
        return content

    except Exception as e:
        # Groq's free tier has rate limits (RPM/TPM). A 429 error means you hit a limit.
        print(f"An error occurred during API call: {e}")
        return f"Error: {e}"

# 3. Running the Examples
if __name__ == "__main__":
    # Example 1: Use the Llama 3 70B model
    get_groq_response(
        prompt="Explain the difference between Groq's LPU architecture and a standard GPU in one sentence."
    )

    # Example 2: Use a different fast model, like Mixtral 8x7B (requires specifying the model ID)
    # Note: Availability of models may change. Always check Groq docs for current IDs.
    get_groq_response(
        prompt="List three benefits of using MoE (Mixture of Experts) models like Mixtral.",
        model_name="mixtral-8x7b-32768"
    )

    print("\nScript finished.")
# To run this script, save it as a .py file and run 'python groq_example.py'
# Remember to first install the library: pip install groq
