# FormData Payload Structure - Matching cURL Example

## Your cURL Example Structure:
```bash
curl -X POST "https://your.host/pms/admin/snag_checklists" \
  -H "Authorization: Bearer <token>" \
  -F "snag_checklist[name]=Site Safety Checklist" \
  -F "create_ticket=true" \
  -F "category_name=Safety" \
  -F "category_type=1" \
  -F "tag_type=high" \
  -F "questions[0][descr]=Is PPE available?" \
  -F "questions[0][qtype]=multiple" \
  -F "questions[0][quest_mandatory]=true" \
  -F "questions[0][quest_options][0][option_name]=Yes" \
  -F "questions[0][quest_options][0][option_type]=ok" \
  -F "questions[0][generic_tags][0][category_name]=PPE" \
  -F "questions[0][generic_tags][0][category_type]=2" \
  -F "questions[0][generic_tags][0][tag_type]=protective" \
  -F "questions[0][generic_tags][0][icons][]=@/path/to/icon1.png" \
  -F "questions[0][generic_tags][0][icons][]=@/path/to/icon2.png"
```

## Updated AddSurveyPage.tsx FormData Structure:

### Survey Basic Fields:
```javascript
formData.append('snag_checklist[name]', 'Site Safety Checklist');
formData.append('snag_checklist[check_type]', 'survey');
formData.append('snag_checklist[project_id]', '1');
formData.append('snag_checklist[snag_audit_sub_category_id]', '1');
```

### Ticket Creation (if enabled):
```javascript
formData.append('create_ticket', 'true');
formData.append('category_name', 'Safety');
formData.append('category_type', '1');
```

### Questions Structure:
```javascript
// Question 0 - Basic fields
formData.append('questions[0][descr]', 'Is PPE available?');
formData.append('questions[0][qtype]', 'multiple');
formData.append('questions[0][quest_mandatory]', 'true');
formData.append('questions[0][image_mandatory]', 'false');

// Question 0 - Multiple choice options
formData.append('questions[0][quest_options][0][option_name]', 'Yes');
formData.append('questions[0][quest_options][0][option_type]', 'p');
formData.append('questions[0][quest_options][1][option_name]', 'No');
formData.append('questions[0][quest_options][1][option_type]', 'n');

// Question 0 - Generic tags (additional fields)
formData.append('questions[0][generic_tags][0][category_name]', 'PPE Documentation');
formData.append('questions[0][generic_tags][0][category_type]', 'questions');
formData.append('questions[0][generic_tags][0][tag_type]', 'not generic');
formData.append('questions[0][generic_tags][0][active]', 'true');

// Question 0 - Files (as icons array)
formData.append('questions[0][generic_tags][0][icons][]', fileObject1);
formData.append('questions[0][generic_tags][0][icons][]', fileObject2);
```

## Example Complete FormData for Multi-Question Survey:

```javascript
// Basic survey info
snag_checklist[name]: "Safety Inspection Checklist"
snag_checklist[check_type]: "survey"
snag_checklist[project_id]: "1"
snag_checklist[snag_audit_sub_category_id]: "1"
create_ticket: "true"
category_name: "5"
category_type: "10"

// Question 1
questions[0][descr]: "Are safety helmets available?"
questions[0][qtype]: "multiple"
questions[0][quest_mandatory]: "true"
questions[0][image_mandatory]: "false"
questions[0][quest_options][0][option_name]: "Yes, all sizes"
questions[0][quest_options][0][option_type]: "p"
questions[0][quest_options][1][option_name]: "No"
questions[0][quest_options][1][option_type]: "n"
questions[0][generic_tags][0][category_name]: "Helmet Documentation"
questions[0][generic_tags][0][category_type]: "questions"
questions[0][generic_tags][0][tag_type]: "not generic"
questions[0][generic_tags][0][active]: "true"
questions[0][generic_tags][0][icons][]: [File: helmet_specs.pdf]
questions[0][generic_tags][0][icons][]: [File: helmet_photo.jpg]

// Question 2
questions[1][descr]: "Rate the overall safety conditions"
questions[1][qtype]: "rating"
questions[1][quest_mandatory]: "false"
questions[1][image_mandatory]: "false"
questions[1][rating]: "4"

// Question 3
questions[2][descr]: "Additional safety concerns"
questions[2][qtype]: "input"
questions[2][quest_mandatory]: "false"
questions[2][image_mandatory]: "false"
questions[2][generic_tags][0][category_name]: "Safety Reports"
questions[2][generic_tags][0][category_type]: "questions"
questions[2][generic_tags][0][tag_type]: "not generic"
questions[2][generic_tags][0][active]: "true"
questions[2][generic_tags][0][icons][]: [File: safety_report.docx]

// Metadata
total_files: "3"
```

## Key Changes Made to AddSurveyPage.tsx:

1. **Removed JSON structure** - No more `survey_data` JSON field
2. **Individual FormData fields** - Each field is added separately matching your cURL structure
3. **Array notation for files** - Uses `[icons][]` for file arrays
4. **Proper nesting** - Follows exact bracket notation from cURL
5. **String values** - All values are strings as expected by FormData

## Server-Side Processing:

Your server will receive the data exactly as shown in your cURL example:

```php
// PHP example
$_POST['snag_checklist']['name'] // "Safety Inspection Checklist"
$_POST['create_ticket']          // "true"
$_POST['questions'][0]['descr']  // "Are safety helmets available?"
$_FILES['questions'][0]['generic_tags'][0]['icons'] // Array of uploaded files
```

The structure now perfectly matches your cURL example, with files properly attached as multipart form data using the `[icons][]` array notation.
