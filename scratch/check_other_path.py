import os

path_without_1 = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main"
path_with_1 = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main (1)\save-ai-source-code-main"

print(f"Path without (1) exists: {os.path.exists(path_without_1)}")
if os.path.exists(path_without_1):
    print(f"Contents of path without (1): {os.listdir(path_without_1)[:10]}")

print(f"Path with (1) exists: {os.path.exists(path_with_1)}")
