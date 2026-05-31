import os

root_dir = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main"
target = '"sidebar.historyTitle":{en:"History",zh:"\\u5386\u53f2\u8bb0\u5f55",ja:"\\u5c65\u6b74",ko:"\\uae30\u8503\\ub85d",zhTW:"\\u6b77\u53f2\u8a18\u9304",de:"Verlauf",it:"Cronologia",pt:"Hist\\xf3rico",es:"Historial",fr:"Historique"}'
# Let's search by index and print exact matches
for dirpath, _, filenames in os.walk(root_dir):
    for filename in filenames:
        if filename.endswith(".js") and not dirpath.endswith(".git") and "node_modules" not in dirpath:
            full_path = os.path.join(dirpath, filename)
            with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
            if '"sidebar.historyTitle"' in content:
                print(f"FOUND IN: {os.path.relpath(full_path, root_dir)}")
