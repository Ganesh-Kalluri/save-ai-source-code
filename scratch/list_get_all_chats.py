import re
import sys

# Force stdout to use utf-8
sys.stdout.reconfigure(encoding='utf-8')

path = r'c:\Users\Kalluri Ganesh\Downloads\Telegram Desktop\save-ai-source-code-main\content-scripts\content.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

matches = list(re.finditer(r'getAllChatsForTopic', content))
print(f"Total matches: {len(matches)}")
for i, m in enumerate(matches):
    start = max(0, m.start() - 100)
    end = min(len(content), m.end() + 1000)
    # print using surrogateescape or ignore/replace to be absolutely safe
    chunk = content[start:end]
    print(f"Match {i+1} at position {m.start()}:")
    print(chunk.encode('utf-8', errors='replace').decode('utf-8'))
    print("=" * 80)
