import os
from supabase import create_client, Client
from lesson_data import LESSONS
#from lessons_6_12 import LESSONS
#from lessons_13_20 import LESSONS 
#from lessons_21_30 import LESSONS

from dotenv import load_dotenv


load_dotenv()  # loads .env from current directory



SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")  # Only for backend scripting
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")  # Only for backend scripting

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def upload_lessons():
    for lesson in LESSONS:
        day = lesson["day_index"]

        # Check if exists (prevent duplicates)
        existing = supabase.table("lessons") \
            .select("id") \
            .eq("day_index", day) \
            .execute()

        if len(existing.data) > 0:
            print(f"Day {day} already exists — skipping.")
            continue

        # Insert lesson
        response = supabase.table("lessons").insert(lesson).execute()
        print(f"Uploaded Day {day}: {lesson['title']}")

if __name__ == "__main__":
    upload_lessons()
