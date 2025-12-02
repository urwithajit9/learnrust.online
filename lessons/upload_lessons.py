import os
from supabase import create_client, Client
from lesson_data import LESSONS
# from lessons_6_12 import LESSONS
# from lessons_13_20 import LESSONS
# from lessons_21_30 import LESSONS
from resources import RESOURCES

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


def upload_resources():
    for res in RESOURCES:
        day_index = res["lesson_day_index"]

        # Find lesson id for this day
        lesson_resp = (
            supabase.table("lessons").select("id").eq("day_index", day_index).execute()
        )

        if len(lesson_resp.data) == 0:
            print(
                f"No lesson found for day {day_index} — skipping resource '{res['title']}'."
            )
            continue

        lesson_id = lesson_resp.data[0]["id"]

        # Prepare resource data
        resource_data = {
            "lesson_id": lesson_id,
            "title": res["title"],
            "url": res["url"],
            "image_url": res.get("image_url", ""),
        }

        # Check if resource already exists
        existing = (
            supabase.table("lesson_resources")
            .select("id")
            .eq("lesson_id", lesson_id)
            .eq("title", res["title"])
            .execute()
        )

        if len(existing.data) > 0:
            print(
                f"Resource '{res['title']}' already exists for lesson {day_index} — skipping."
            )
            continue

        # Insert resource
        supabase.table("lesson_resources").insert(resource_data).execute()
        print(f"Uploaded resource '{res['title']}' for lesson {day_index}")






if __name__ == "__main__":
    #upload_lessons()
    upload_resources()
