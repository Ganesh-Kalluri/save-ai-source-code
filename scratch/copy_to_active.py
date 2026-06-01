import os
import shutil

src_root = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main (1)\save-ai-source-code-main"
dst_root = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main"

files_to_copy = [
    os.path.join("chunks", "db-_VinwtYz.js"),
    os.path.join("content-scripts", "content.js")
]

for rel_path in files_to_copy:
    src_file = os.path.join(src_root, rel_path)
    dst_file = os.path.join(dst_root, rel_path)
    
    if os.path.exists(src_file):
        try:
            # ensure destination folder exists
            os.makedirs(os.path.dirname(dst_file), exist_ok=True)
            shutil.copy2(src_file, dst_file)
            print(f"Successfully copied {rel_path} to {dst_file}")
        except Exception as e:
            print(f"Error copying {rel_path}: {e}")
    else:
        print(f"Source file {src_file} does not exist!")
