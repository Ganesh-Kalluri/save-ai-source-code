import os

root_dir = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main"

# We want to replace console.warn with console.log for "Unknown domain" and "Missing translation"
for dirpath, _, filenames in os.walk(root_dir):
    for filename in filenames:
        if filename.endswith(".js") and not dirpath.endswith(".git") and "node_modules" not in dirpath:
            full_path = os.path.join(dirpath, filename)
            with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
            
            modified = False
            
            # 1. Replace Unknown domain warning
            target1 = "console.warn(`Unknown domain:"
            replacement1 = "console.log(`Unknown domain:"
            if target1 in content:
                content = content.replace(target1, replacement1)
                print(f"Replaced Unknown domain warning in {os.path.relpath(full_path, root_dir)}")
                modified = True
                
            # Also handle single-quoted or double-quoted versions or variations
            target1_alt = "console.warn('[SaveAI] Unknown domain:"
            replacement1_alt = "console.log('[SaveAI] Unknown domain:"
            if target1_alt in content:
                content = content.replace(target1_alt, replacement1_alt)
                print(f"Replaced [SaveAI] Unknown domain warning in {os.path.relpath(full_path, root_dir)}")
                modified = True

            target1_alt2 = "console.warn(`[SaveAI] Unknown domain:"
            replacement1_alt2 = "console.log(`[SaveAI] Unknown domain:"
            if target1_alt2 in content:
                content = content.replace(target1_alt2, replacement1_alt2)
                print(f"Replaced [SaveAI] Unknown domain warning (backtick) in {os.path.relpath(full_path, root_dir)}")
                modified = True

            # 2. Replace Missing translation warning
            target2 = "console.warn(`Missing translation for key:"
            replacement2 = "console.log(`Missing translation for key:"
            if target2 in content:
                content = content.replace(target2, replacement2)
                print(f"Replaced Missing translation warning in {os.path.relpath(full_path, root_dir)}")
                modified = True

            target2_alt = "console.warn(`[SaveAI I18n] Missing translation for key:"
            replacement2_alt = "console.log(`[SaveAI I18n] Missing translation for key:"
            if target2_alt in content:
                content = content.replace(target2_alt, replacement2_alt)
                print(f"Replaced [SaveAI I18n] Missing translation warning in {os.path.relpath(full_path, root_dir)}")
                modified = True
            
            if modified:
                with open(full_path, "w", encoding="utf-8") as f:
                    f.write(content)

print("Warning silencing patch finished!")
