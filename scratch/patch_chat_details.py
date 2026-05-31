import os
import re

root_dir = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main"

# Let's search and replace in all JS files
for dirpath, _, filenames in os.walk(root_dir):
    for filename in filenames:
        if filename.endswith(".js") and not dirpath.endswith(".git") and "node_modules" not in dirpath:
            full_path = os.path.join(dirpath, filename)
            with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
            
            # Find the exact pattern: "sidebar.viewDetails":{...}
            match = re.search(r'"sidebar\.viewDetails"\s*:\s*\{([^}]+)\}', content)
            if match:
                full_match = match.group(0) # "sidebar.viewDetails":{...}
                
                # Construct chatDetails replacement
                chat_details_entry = ',"sidebar.chatDetails":{en:"Chat Details",zh:"\\u4f1a\\u8bdd\\u8be6\\u60c5",ja:"\\u30c1\\u30e3\\u30c3\\u30c8\\u306e\\u8a73\\u7d30",ko:"\\ucc44\\ud305 \\uc0c1\u00c1\u00a1 \\uc815\\ubcf4",zhTW:"\\u6703\\u8a71\\u8a73\\u60c5",de:"Chat-Details",it:"Dettagli chat",pt:"Detalhes do chat",es:"Detalles del chat",fr:"D\\xe9tails du chat"}'
                
                # Wait, let's write strings in python strictly as ascii sequences
                chat_details_entry = ',"sidebar.chatDetails":{en:"Chat Details",zh:"\\u4f1a\\u8bdd\\u8be6\\u60c5",ja:"\\u30c1\\u30e3\\u30c3\\u30c8\\u306e\\u8a73\\u7d30",ko:"\\ucc44\\ud305 \\uc0c1\\uc138 \\uc815\\ubcf4",zhTW:"\\u6703\\u8a71\\u8a73\\u60c5",de:"Chat-Details",it:"Dettagli chat",pt:"Detalhes do chat",es:"Detalles del chat",fr:"D\\xe9tails du chat"}'
                
                replacement = full_match + chat_details_entry
                
                if "sidebar.chatDetails" not in content:
                    content = content.replace(full_match, replacement)
                    print(f"Successfully patched chatDetails in {os.path.relpath(full_path, root_dir)}")
                    with open(full_path, "w", encoding="utf-8") as f:
                        f.write(content)
                else:
                    print(f"Already patched chatDetails in {os.path.relpath(full_path, root_dir)}")

print("Regex chat details patch script finished!")
