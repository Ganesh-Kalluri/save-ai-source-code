file_path = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main\content-scripts\content.js"
with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

line_857 = lines[856] # 0-indexed is 856 for line 857
print(f"Line 857 length: {len(line_857)}")

# Let's print sections of line 857 that look interesting
# Let's search for "Unknown domain" in line 857
import re
for match in re.finditer(r'Unknown domain', line_857):
    print(f"Found 'Unknown domain' at char index {match.start()} in line 857")
    print(line_857[max(0, match.start()-100):min(len(line_857), match.end()+200)])
