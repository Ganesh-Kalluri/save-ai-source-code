import os

paths = [
    r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main",
    r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main (1)\save-ai-source-code-main",
    r"c:\Users\Kalluri Ganesh\Downloads"
]

for base_path in paths:
    if os.path.exists(base_path):
        for dirpath, _, filenames in os.walk(base_path):
            for filename in filenames:
                if "Gemini" in filename and filename.endswith(".md"):
                    print(f"Found file: {os.path.join(dirpath, filename)}")
