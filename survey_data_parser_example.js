// Server-side example: How to parse survey_data and handle file keys
// This demonstrates how your backend should process the FormData from AddSurveyPage.tsx

// Example of what the survey_data JSON looks like when parsed
const exampleSurveyData = {
  "create_ticket": true,
  "category_name": 1,
  "category_type": 2,
  "snag_checklist": {
    "name": "Customer Satisfaction Survey",
    "snag_audit_category_id": null,
    "check_type": "survey",
    "project_id": 1,
    "snag_audit_sub_category_id": 1
  },
  "question": [
    {
      "descr": "How satisfied are you with our service?",
      "qtype": "multiple",
      "quest_mandatory": true,
      "image_mandatory": false,
      "quest_options": [
        { "option_name": "Very Satisfied", "option_type": "p" },
        { "option_name": "Satisfied", "option_type": "p" },
        { "option_name": "Dissatisfied", "option_type": "n" },
        { "option_name": "Very Dissatisfied", "option_type": "n" }
      ],
      "generic_tags": [
        {
          "category_name": "Improvement Suggestions",
          "category_type": "questions",
          "tag_type": "not generic",
          "active": true,
          "icons": [
            {
              "name": "feedback_form.pdf",
              "type": "application/pdf",
              "size": 245760,
              "file_key": "question_0_field_0_file_0", // <- This maps to FormData key
              "original_name": "feedback_form.pdf"
            },
            {
              "name": "requirements.docx",
              "type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              "size": 156890,
              "file_key": "question_0_field_0_file_1", // <- This maps to FormData key
              "original_name": "requirements.docx"
            }
          ]
        },
        {
          "category_name": "Photos",
          "category_type": "questions", 
          "tag_type": "not generic",
          "active": true,
          "icons": [
            {
              "name": "issue_photo.jpg",
              "type": "image/jpeg",
              "size": 425600,
              "file_key": "question_0_field_1_file_0", // <- This maps to FormData key
              "original_name": "issue_photo.jpg"
            }
          ]
        }
      ]
    },
    {
      "descr": "Rate our customer support",
      "qtype": "rating",
      "quest_mandatory": false,
      "image_mandatory": false,
      "rating": 4
    }
  ]
};

// Server-side processing example (Node.js/Express with multer or similar)
function processSurveySubmission(req, res) {
  try {
    // 1. Parse the survey_data JSON from FormData
    const surveyDataString = req.body.survey_data;
    const surveyData = JSON.parse(surveyDataString);
    
    // 2. Get total files count
    const totalFiles = parseInt(req.body.total_files) || 0;
    
    console.log('Survey Structure:', {
      title: surveyData.snag_checklist.name,
      checkType: surveyData.snag_checklist.check_type,
      questionsCount: surveyData.question.length,
      totalFiles: totalFiles
    });
    
    // 3. Process each question and its files
    surveyData.question.forEach((question, questionIndex) => {
      console.log(`\n--- Question ${questionIndex + 1} ---`);
      console.log('Text:', question.descr);
      console.log('Type:', question.qtype);
      console.log('Mandatory:', question.quest_mandatory);
      
      // Handle multiple choice options
      if (question.quest_options) {
        console.log('Options:');
        question.quest_options.forEach((option, i) => {
          console.log(`  ${i + 1}. ${option.option_name} (${option.option_type})`);
        });
      }
      
      // Handle rating
      if (question.rating) {
        console.log('Rating:', question.rating);
      }
      
      // 4. Process additional fields with files
      if (question.generic_tags) {
        question.generic_tags.forEach((tag, fieldIndex) => {
          console.log(`\n  Additional Field ${fieldIndex + 1}: ${tag.category_name}`);
          
          if (tag.icons && tag.icons.length > 0) {
            console.log('  Files:');
            tag.icons.forEach((fileInfo, fileIndex) => {
              // 5. Retrieve the actual file using the file_key
              const fileKey = fileInfo.file_key; // e.g., "question_0_field_0_file_0"
              const actualFile = req.files[fileKey]; // Access file from FormData
              
              console.log(`    - ${fileInfo.name}`);
              console.log(`      Key: ${fileKey}`);
              console.log(`      Type: ${fileInfo.type}`);
              console.log(`      Size: ${(fileInfo.size / 1024).toFixed(2)} KB`);
              
              if (actualFile) {
                console.log(`      Server Path: ${actualFile.path}`);
                console.log(`      Original Name: ${actualFile.originalname}`);
                
                // Here you would:
                // - Save the file to your storage (disk, S3, etc.)
                // - Store file metadata in database
                // - Associate file with question and field
                
                // Example database save:
                // await saveFileToDatabase({
                //   questionId: savedQuestion.id,
                //   fieldIndex: fieldIndex,
                //   fileName: fileInfo.name,
                //   filePath: actualFile.path,
                //   fileType: fileInfo.type,
                //   fileSize: fileInfo.size,
                //   originalName: fileInfo.original_name
                // });
                
              } else {
                console.log(`      ⚠️  File not found in FormData!`);
              }
            });
          }
        });
      }
    });
    
    // 6. Save survey structure to database
    // const savedSurvey = await saveSurveyToDatabase(surveyData);
    
    res.json({ 
      success: true, 
      message: 'Survey created successfully',
      // surveyId: savedSurvey.id 
    });
    
  } catch (error) {
    console.error('Error processing survey:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process survey',
      error: error.message 
    });
  }
}

// File key structure explanation
const fileKeyStructure = {
  pattern: "question_{questionIndex}_field_{fieldIndex}_file_{fileIndex}",
  examples: [
    {
      key: "question_0_field_0_file_0",
      meaning: "First file of first additional field in first question"
    },
    {
      key: "question_0_field_0_file_1", 
      meaning: "Second file of first additional field in first question"
    },
    {
      key: "question_0_field_1_file_0",
      meaning: "First file of second additional field in first question"
    },
    {
      key: "question_1_field_0_file_0",
      meaning: "First file of first additional field in second question"
    }
  ]
};

// Database schema example
const databaseSchema = {
  surveys: {
    id: "INTEGER PRIMARY KEY",
    name: "VARCHAR(255)",
    check_type: "VARCHAR(50)",
    project_id: "INTEGER",
    created_at: "TIMESTAMP"
  },
  survey_questions: {
    id: "INTEGER PRIMARY KEY", 
    survey_id: "INTEGER",
    question_text: "TEXT",
    question_type: "VARCHAR(50)",
    is_mandatory: "BOOLEAN",
    question_order: "INTEGER"
  },
  question_options: {
    id: "INTEGER PRIMARY KEY",
    question_id: "INTEGER",
    option_text: "VARCHAR(255)",
    option_type: "VARCHAR(10)" // 'p' or 'n'
  },
  additional_fields: {
    id: "INTEGER PRIMARY KEY",
    question_id: "INTEGER", 
    field_name: "VARCHAR(255)",
    field_order: "INTEGER"
  },
  field_files: {
    id: "INTEGER PRIMARY KEY",
    field_id: "INTEGER",
    file_name: "VARCHAR(255)",
    file_path: "VARCHAR(500)", 
    file_type: "VARCHAR(100)",
    file_size: "INTEGER",
    original_name: "VARCHAR(255)"
  }
};

console.log('Survey Data Structure:', JSON.stringify(exampleSurveyData, null, 2));
console.log('\nFile Key Structure:', fileKeyStructure);
console.log('\nDatabase Schema:', databaseSchema);

module.exports = {
  processSurveySubmission,
  exampleSurveyData,
  fileKeyStructure,
  databaseSchema
};
