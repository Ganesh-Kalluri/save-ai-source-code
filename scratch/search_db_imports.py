with open(r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main (1)\save-ai-source-code-main\chunks\sidepanel-8b8dlfXQ.js", "r", encoding="utf-8") as f:
    content = f.read()

# Let's search for imports from "db-_VinwtYz.js"
# The import statement usually looks like: import { ... } from "./db-_VinwtYz.js"
# Let's find "db-_VinwtYz.js" and print 500 characters around it
idx = content.find("db-_VinwtYz.js")
if idx != -1:
    print(content[max(0, idx-500):idx+500])
