file_path = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main\content-scripts\content.js"
with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

for i in range(850, 865):
    if i < len(lines):
        line = lines[i]
        clean_line = line.encode('ascii', 'ignore').decode('ascii')
        print(f"Line {i+1}: {clean_line}", end="")
