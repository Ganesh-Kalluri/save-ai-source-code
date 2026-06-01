with open(r"c:\Users\Kalluri Ganesh\Downloads\save-ai-source-code-main (1)\save-ai-source-code-main\chunks\db-_VinwtYz.js", "r", encoding="utf-8") as f:
    content = f.read()

# Let's find the export statement. It is usually at the bottom of the file
print(content[-1500:])
