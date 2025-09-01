# Survey Data Structure and File Key Mapping

## Overview
The `AddSurveyPage.tsx` sends data as `FormData` with a specific structure that allows the server to understand both the survey structure and associate files with their correct locations.

## FormData Structure

### 1. JSON Data
- **Key**: `survey_data`
- **Type**: String (JSON)
- **Contains**: Complete survey structure with file metadata

### 2. File Count
- **Key**: `total_files`  
- **Type**: String (number)
- **Contains**: Total number of files uploaded

### 3. Individual Files
- **Key Pattern**: `question_{questionIndex}_field_{fieldIndex}_file_{fileIndex}`
- **Type**: File blob
- **Contains**: The actual file data

## File Key Mapping Examples

### Scenario 1: Single Question with Multiple Fields and Files

```json
{
  "survey_data": {
    "question": [
      {
        "descr": "What issues did you encounter?",
        "qtype": "multiple",
        "generic_tags": [
          {
            "category_name": "Documentation",
            "icons": [
              {
                "name": "report.pdf",
                "file_key": "question_0_field_0_file_0"
              },
              {
                "name": "screenshot.png", 
                "file_key": "question_0_field_0_file_1"
              }
            ]
          },
          {
            "category_name": "Photos",
            "icons": [
              {
                "name": "photo1.jpg",
                "file_key": "question_0_field_1_file_0"
              }
            ]
          }
        ]
      }
    ]
  }
}
```

**FormData Keys Created:**
- `question_0_field_0_file_0` → report.pdf
- `question_0_field_0_file_1` → screenshot.png  
- `question_0_field_1_file_0` → photo1.jpg

### Scenario 2: Multiple Questions with Files

```json
{
  "survey_data": {
    "question": [
      {
        "descr": "Rate our service",
        "qtype": "rating",
        "generic_tags": [
          {
            "category_name": "Feedback",
            "icons": [
              {
                "name": "feedback.docx",
                "file_key": "question_0_field_0_file_0"
              }
            ]
          }
        ]
      },
      {
        "descr": "Any suggestions?",
        "qtype": "input",
        "generic_tags": [
          {
            "category_name": "Suggestions", 
            "icons": [
              {
                "name": "suggestion1.pdf",
                "file_key": "question_1_field_0_file_0"
              },
              {
                "name": "suggestion2.pdf", 
                "file_key": "question_1_field_0_file_1"
              }
            ]
          },
          {
            "category_name": "References",
            "icons": [
              {
                "name": "reference.xlsx",
                "file_key": "question_1_field_1_file_0"
              }
            ]
          }
        ]
      }
    ]
  }
}
```

**FormData Keys Created:**
- `question_0_field_0_file_0` → feedback.docx
- `question_1_field_0_file_0` → suggestion1.pdf
- `question_1_field_0_file_1` → suggestion2.pdf
- `question_1_field_1_file_0` → reference.xlsx

## Server-Side Processing Steps

### Step 1: Parse JSON Data
```javascript
const surveyData = JSON.parse(req.body.survey_data);
```

### Step 2: Iterate Through Questions
```javascript
surveyData.question.forEach((question, questionIndex) => {
  // Process question data
  console.log(`Question ${questionIndex}: ${question.descr}`);
  
  // Handle additional fields with files
  if (question.generic_tags) {
    question.generic_tags.forEach((field, fieldIndex) => {
      console.log(`Field ${fieldIndex}: ${field.category_name}`);
      
      // Process files in this field
      if (field.icons) {
        field.icons.forEach((fileInfo, fileIndex) => {
          // Get the actual file using the key
          const file = req.files[fileInfo.file_key];
          console.log(`File: ${fileInfo.name} -> Key: ${fileInfo.file_key}`);
        });
      }
    });
  }
});
```

### Step 3: File Retrieval and Storage
```javascript
// For each file_key in the icons array:
const fileKey = fileInfo.file_key; // e.g., "question_0_field_1_file_0"
const actualFile = req.files[fileKey]; // Get file from FormData

if (actualFile) {
  // Save file to storage
  const savedPath = await saveFile(actualFile);
  
  // Store file reference in database
  await saveFileReference({
    questionIndex,
    fieldIndex, 
    fileIndex,
    fileName: fileInfo.name,
    filePath: savedPath,
    fileType: fileInfo.type,
    fileSize: fileInfo.size
  });
}
```

## Key Benefits of This Structure

1. **Unique Identification**: Each file has a unique key that maps to its exact location in the survey structure

2. **Hierarchical Organization**: Files are organized by:
   - Question (questionIndex)
   - Additional Field (fieldIndex) 
   - File position (fileIndex)

3. **Metadata Preservation**: File information (name, type, size) is stored in JSON while actual file data is in FormData

4. **Server Flexibility**: Server can process files and metadata separately, then associate them using the file_key

5. **Scalable**: Works with any number of questions, fields, and files per field

## File Key Decoding

Given a file key like `question_2_field_1_file_3`, you can decode:
- **Question Index**: 2 (3rd question, 0-based)
- **Field Index**: 1 (2nd additional field in that question, 0-based)  
- **File Index**: 3 (4th file in that field, 0-based)

This allows the server to precisely place each file in the correct context within the survey structure.
