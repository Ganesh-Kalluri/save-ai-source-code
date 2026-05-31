import os

root_dir = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main"

target_i18n = '"sidebar.historyTitle":{en:"History",zh:"\\u5386\\u53f2\\u8bb0\\u5f55",ja:"\\u5c65\\u6b74",ko:"\\uae30\\ub85d",zhTW:"\\u6b77\\u53f2\\u8a18\\u9304",de:"Verlauf",it:"Cronologia",pt:"Hist\\xf3rico",es:"Historial",fr:"Historique"}'
replacement_i18n = '"sidebar.historyTitle":{en:"History",zh:"\\u5386\\u53f2\\u8bb0\\u5f55",ja:"\\u5c65\\u6b74",ko:"\\uae30\\ub85d",zhTW:"\\u6b77\\u53f2\\u8a18\\u9304",de:"Verlauf",it:"Cronologia",pt:"Hist\\xf3rico",es:"Historial",fr:"Historique"},"sidebar.history":{en:"History",zh:"\\u5386\\u53f2\\u8bb0\\u5f55",ja:"\\u5c65\\u6b74",ko:"\\uae30\\ub85d",zhTW:"\\u6b77\\u53f2\\u8a18\\u9304",de:"Verlauf",it:"Cronologia",pt:"Hist\\xf3rico",es:"Historial",fr:"Historique"}'

# Let's search and replace in all JS files
for dirpath, _, filenames in os.walk(root_dir):
    for filename in filenames:
        if filename.endswith(".js") and not dirpath.endswith(".git") and "node_modules" not in dirpath:
            full_path = os.path.join(dirpath, filename)
            with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
            
            modified = False
            if target_i18n in content:
                content = content.replace(target_i18n, replacement_i18n)
                print(f"Replaced i18n in {os.path.relpath(full_path, root_dir)}")
                modified = True
            
            if filename == "background.js":
                target_vsnr = "var{sendMessage:ks,onMessage:nt}=Nr;vs(Nr);"
                replacement_vsnr = "var{sendMessage:ks,onMessage:nt}=Nr;vs(Nr);nt(\"tab-prev\",()=>{});"
                if target_vsnr in content:
                    content = content.replace(target_vsnr, replacement_vsnr)
                    print(f"Added tab-prev listener in background.js")
                    modified = True
            
            if modified:
                with open(full_path, "w", encoding="utf-8") as f:
                    f.write(content)

print("Replacement script finished!")
