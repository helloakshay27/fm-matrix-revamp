# Mobile Survey Components

This directory contains modular, reusable components for the mobile survey flow.

## Component Structure

### Core Components

#### `SurveyHeader.tsx`

- **Purpose**: Renders the logo header for the survey
- **Props**:
  - `showBackButton?: boolean` - Whether to show the back button
  - `onBack?: () => void` - Callback when back button is clicked
- **Usage**: Universal header across all survey pages

#### `ProgressBar.tsx`

- **Purpose**: Displays the survey progress indicator
- **Props**:
  - `currentQuestionIndex: number` - Current question index (0-based)
  - `totalQuestions: number` - Total number of questions
- **Usage**: Shows visual progress through the survey

### Question Components

#### `MultipleChoiceQuestion.tsx`

- **Purpose**: Renders multiple choice question options
- **Props**:
  - `options: SurveyOption[]` - Array of choice options
  - `selectedOptions: SurveyOption[]` - Currently selected options
  - `onOptionSelect: (option: SurveyOption) => void` - Selection handler
- **Features**:
  - Auto-selection with visual feedback
  - Checkmark indicator for selected option

#### `StarRatingQuestion.tsx`

- **Purpose**: Renders star rating selector
- **Props**:
  - `ratingOptions: number[]` - Array of rating values (e.g., [1,2,3,4,5])
  - `selectedRating: number | null` - Currently selected rating
  - `onRatingSelect: (rating: number) => void` - Selection handler
- **Features**:
  - Interactive star icons
  - Shows selected rating text

#### `EmojiRatingQuestion.tsx`

- **Purpose**: Renders emoji/smiley rating selector
- **Props**:
  - `emojiOptions: EmojiOption[]` - Array of emoji options with ratings
  - `selectedRating: number | null` - Currently selected rating
  - `onEmojiSelect: (rating, emoji, label) => void` - Selection handler
- **Features**:
  - Visual emoji feedback
  - Label display for each emoji
  - Responsive grid layout

#### `TextInputQuestion.tsx`

- **Purpose**: Renders text input fields (input, text, description)
- **Props**:
  - `questionType: "input" | "text" | "description"` - Type of text input
  - `value: string` - Current input value
  - `onChange: (value: string) => void` - Change handler
  - `onSubmit: () => void` - Submit handler
  - `isValid: boolean` - Whether input is valid
  - `isSingleQuestion: boolean` - Whether this is a single-question survey
- **Features**:
  - Adapts between input and textarea based on type
  - Validation support

### Supporting Components

#### `GenericTagsSelector.tsx`

- **Purpose**: Renders selectable tags for negative responses
- **Props**:
  - `tags: GenericTag[]` - Available tags
  - `selectedTags: GenericTag[]` - Selected tags
  - `onTagClick: (tag: GenericTag) => void` - Tag selection handler
  - `comments: string` - Comment text
  - `onCommentsChange: (value: string) => void` - Comment handler
  - `onSubmit: () => void` - Submit handler
  - Plus various state props
- **Features**:
  - 2x2 grid layout with pagination
  - Icon display for each tag
  - Optional comments field
  - Dynamic button text based on context

#### `FinalCommentsStep.tsx`

- **Purpose**: Renders the final comments page for multi-question surveys
- **Props**:
  - `finalDescription: string` - Comment text
  - `onDescriptionChange: (value: string) => void` - Change handler
  - `onSubmit: () => void` - Submit handler
  - `isSubmitting: boolean` - Loading state
- **Features**:
  - Large textarea for final feedback
  - Loading state during submission

#### `InactiveSurveyView.tsx`

- **Purpose**: Shows message when survey is inactive
- **Props**:
  - `surveyData: SurveyMapping` - Survey data
  - `getFormattedLocation: () => string` - Function to format location
- **Features**:
  - Warning icon and message
  - Location display
  - Professional error state

## Type Definitions

### `types.ts`

Contains all TypeScript interfaces and types:

- `SurveyMapping` - Main survey data structure
- `SurveyQuestion` - Individual question structure
- `SurveyOption` - Question option structure
- `GenericTag` - Tag structure
- `SurveyAnswers` - Answer storage structure
- `SurveyAnswerData` - Individual answer structure
- Plus helper types for state management

## Utility Functions

### `surveyUtils.ts`

Contains helper functions for survey logic:

- `getEmojiOptions(question)` - Maps API options to emoji display
- `getRatingOptions(question)` - Gets rating options from API
- `getRatingLabel(question, rating)` - Gets dynamic label for rating
- `isNegativeOption(option)` - Checks if option is negative
- `mapRatingToOptionIndex(question, rating)` - Maps rating to option (emoji)
- `mapStarRatingToOption(question, rating)` - Maps rating to option (stars)

## Usage Example

```tsx
import {
  SurveyHeader,
  ProgressBar,
  MultipleChoiceQuestion,
  StarRatingQuestion,
  EmojiRatingQuestion,
  TextInputQuestion,
  GenericTagsSelector,
  FinalCommentsStep,
  InactiveSurveyView,
} from "@/components/mobile/survey";

import { getEmojiOptions, getRatingOptions } from "@/components/mobile/survey/surveyUtils";

// In your component
<SurveyHeader showBackButton={true} onBack={handleBack} />
<ProgressBar currentQuestionIndex={0} totalQuestions={5} />
<MultipleChoiceQuestion
  options={question.snag_quest_options}
  selectedOptions={selectedOptions}
  onOptionSelect={handleSelect}
/>
```

## Design Principles

1. **Single Responsibility**: Each component handles one specific aspect of the survey
2. **Reusability**: Components can be used across different survey types
3. **Type Safety**: Full TypeScript support with comprehensive interfaces
4. **Maintainability**: Clear separation of concerns makes debugging easier
5. **Testability**: Small, focused components are easier to test
6. **Scalability**: Easy to add new question types or features

## Future Enhancements

- [ ] Add unit tests for each component
- [ ] Add Storybook stories for visual testing
- [ ] Add accessibility features (ARIA labels, keyboard navigation)
- [ ] Add animation transitions between questions
- [ ] Add image upload component for questions
- [ ] Add validation component for form inputs
- [ ] Add error boundary components
