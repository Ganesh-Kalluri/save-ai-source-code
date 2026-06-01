import os

root_dir = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main (1)\save-ai-source-code-main"
active_dir = r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main"

# Let's write a script to restore summaries to headings in:
# 1. src/utils/FileExportHelper.js
# 2. chunks/db-_VinwtYz.js
# 3. content-scripts/content.js
# and then copy chunks/db-_VinwtYz.js and content-scripts/content.js to the active extension directory

# Let's read src/utils/FileExportHelper.js
helper_path = os.path.join(root_dir, "src", "utils", "FileExportHelper.js")
if os.path.exists(helper_path):
    with open(helper_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # We want to change the heading in serializeMessagesToMarkdown to include summary
    target = """    messages.forEach((m, idx) => {
      const roleHeader = m.role === "user" ? "# you asked" : `# ${m.displayModel || m.model || "AI"} response`;
      lines.push(roleHeader);"""
      
    replacement = """    messages.forEach((m, idx) => {
      const summary = this.getMessageSummary(m, 10, enableThinkingContent);
      const roleHeader = m.role === "user" ? "# you asked" : `# ${m.displayModel || m.model || "AI"} response`;
      const fullHeader = summary ? `${roleHeader}: ${summary}` : roleHeader;
      lines.push(fullHeader);"""
      
    if target in content:
        content = content.replace(target, replacement)
        with open(helper_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Restored heading summary in src/utils/FileExportHelper.js")
    else:
        print("Target heading not found in src/utils/FileExportHelper.js")

# Modify chunks/db-_VinwtYz.js and content-scripts/content.js
# Let's define a python script to patch both compiled files in root_dir and copy them to active_dir

def patch_compiled_files():
    db_chunk_path = os.path.join(root_dir, "chunks", "db-_VinwtYz.js")
    content_js_path = os.path.join(root_dir, "content-scripts", "content.js")
    
    # Target in db-_VinwtYz.js:
    # A.forEach((i,s)=>{const a=i.role==="user"?"# you asked":`# ${i.model} response`;n.push(a),bg(i,t,n);
    # Replacement:
    # A.forEach((i,s)=>{const a=yb(i,10,e),o=i.role==="user"?"# you asked":`# ${i.model} response`,d=a?`${o}: ${a}`:o;n.push(d),bg(i,t,n);
    
    if os.path.exists(db_chunk_path):
        with open(db_chunk_path, "r", encoding="utf-8") as f:
            c = f.read()
        target_db = 'A.forEach((i,s)=>{const a=i.role==="user"?"# you asked":`# ${i.model} response`;n.push(a),bg(i,t,n);'
        replacement_db = 'A.forEach((i,s)=>{const a=yb(i,10,e),o=i.role==="user"?"# you asked":`# ${i.model} response`,d=a?`${o}: ${a}`:o;n.push(d),bg(i,t,n);'
        if target_db in c:
            c = c.replace(target_db, replacement_db)
            with open(db_chunk_path, "w", encoding="utf-8") as f:
                f.write(c)
            print("Patched chunks/db-_VinwtYz.js headings")
        else:
            print("Target not found in chunks/db-_VinwtYz.js")
            
    # Target in content-scripts/content.js:
    # t.forEach((o,u)=>{const l=o.role==="user"?"# you asked":`# ${o.model} response`;i.push(l),F9(o,r,i);
    # Replacement:
    # t.forEach((o,u)=>{const l=jQ(o,10,e),c=o.role==="user"?"# you asked":`# ${o.model} response`,f=l?`${c}: ${l}`:c;i.push(f),F9(o,r,i);
    
    if os.path.exists(content_js_path):
        with open(content_js_path, "r", encoding="utf-8") as f:
            c = f.read()
        target_content = 't.forEach((o,u)=>{const l=o.role==="user"?"# you asked":`# ${o.model} response`;i.push(l),F9(o,r,i);'
        replacement_content = 't.forEach((o,u)=>{const l=jQ(o,10,e),c=o.role==="user"?"# you asked":`# ${o.model} response`,f=l?`${c}: ${l}`:c;i.push(f),F9(o,r,i);'
        if target_content in c:
            c = c.replace(target_content, replacement_content)
            with open(content_js_path, "w", encoding="utf-8") as f:
                f.write(c)
            print("Patched content-scripts/content.js headings")
        else:
            print("Target not found in content-scripts/content.js")

patch_compiled_files()
