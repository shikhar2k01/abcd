# Objective
To simplify and prepare HTML content for a machine learning model to understand user intent. This involves extracting essential information and removing unnecessary elements.

# Steps Taken

- Fetching Content:

  - Retrieved HTML content from a specified URL.

- Metadata Extraction:
  - Captured key metadata such as title, keywords, description, author, and charset from the HTML `<head>` section.
- Body Text Extraction:
  - Extracted meaningful text from headings and paragraphs, condensing it into a single string.

- Uninteresting Elements Removal:
  - Removed irrelevant attributes (class, id, style) and excluded specific elements (input, textarea) that don't contribute to content analysis.

- Data Saving:
  - Saved the preprocessed data, including metadata and body text, in a structured JSON format.
  
# Run Guide
```bash
npm i
node assignment.js
```
- Then open `output.json` :)
