import { SurveyQuestion, SurveyOption } from "./types";

/**
 * Get emoji options from API response
 */
export const getEmojiOptions = (question: SurveyQuestion) => {
    if (
        !question.snag_quest_options ||
        question.snag_quest_options.length === 0
    ) {
        // Fallback to static options if no API options
        return [
            { rating: 5, emoji: "😄", label: "Amazing", optionId: 5 },
            { rating: 4, emoji: "😊", label: "Good", optionId: 4 },
            { rating: 3, emoji: "😐", label: "Okay", optionId: 3 },
            { rating: 2, emoji: "😟", label: "Bad", optionId: 2 },
            { rating: 1, emoji: "😞", label: "Terrible", optionId: 1 },
        ];
    }

    // Map API options to emoji display
    const emojiMapping = [
        { emoji: "😄", label: "Amazing" },
        { emoji: "😊", label: "Good" },
        { emoji: "😐", label: "Okay" },
        { emoji: "😟", label: "Bad" },
        { emoji: "😞", label: "Terrible" },
    ];

    // Use default order so that the first API option is the highest rating, last is lowest
    return question.snag_quest_options.map((option, index) => ({
        rating: question.snag_quest_options.length - index, // First option = highest rating
        emoji: emojiMapping[index]?.emoji || "😐",
        label: option.qname,
        optionId: option.id,
        option: option,
    }));
};

/**
 * Get rating options from API response
 */
export const getRatingOptions = (question: SurveyQuestion) => {
    if (
        !question.snag_quest_options ||
        question.snag_quest_options.length === 0
    ) {
        // Fallback to 5 stars if no API options
        return [1, 2, 3, 4, 5];
    }

    // Return array of rating numbers based on API options count
    return Array.from(
        { length: question.snag_quest_options.length },
        (_, index) => index + 1
    );
};

/**
 * Get dynamic label for a rating from API options
 */
export const getRatingLabel = (
    question: SurveyQuestion | null,
    rating?: number | null
): string | undefined => {
    if (
        !question ||
        !rating ||
        !question.snag_quest_options ||
        question.snag_quest_options.length === 0
    )
        return undefined;
    const mapping = Array.from(
        { length: question.snag_quest_options.length },
        (_, index) => ({
            rating: index + 1,
            optionIndex: index,
        })
    );
    const selected = mapping.find((m) => m.rating === rating);
    if (selected && question.snag_quest_options[selected.optionIndex]) {
        return question.snag_quest_options[selected.optionIndex].qname;
    }
    return undefined;
};

/**
 * Check if an option is negative (option_type === 'n')
 */
export const isNegativeOption = (option: SurveyOption): boolean => {
    return option.option_type === "n";
};

/**
 * Map rating to option index for emoji/smiley questions
 */
export const mapRatingToOptionIndex = (
    question: SurveyQuestion,
    rating: number
): SurveyOption | undefined => {
    if (!question.snag_quest_options || question.snag_quest_options.length === 0)
        return undefined;

    const ratingToOptionIndex = Array.from(
        { length: question.snag_quest_options.length },
        (_, index) => ({
            rating: question.snag_quest_options.length - index, // Highest rating first
            optionIndex: index,
        })
    );

    const selectedOptionMapping = ratingToOptionIndex.find(
        (opt) => opt.rating === rating
    );

    return selectedOptionMapping
        ? question.snag_quest_options[selectedOptionMapping.optionIndex]
        : undefined;
};

/**
 * Map rating to option for star rating questions
 */
export const mapStarRatingToOption = (
    question: SurveyQuestion,
    rating: number
): SurveyOption | undefined => {
    if (!question.snag_quest_options || question.snag_quest_options.length === 0)
        return undefined;

    // For star ratings, map 1-5 directly to option index
    const ratingToOptionMapping = [
        { rating: 1, optionIndex: 0 }, // 1 star (first option)
        { rating: 2, optionIndex: 1 }, // 2 stars
        { rating: 3, optionIndex: 2 }, // 3 stars
        { rating: 4, optionIndex: 3 }, // 4 stars
        { rating: 5, optionIndex: 4 }, // 5 stars (last option)
    ];

    const mapping = ratingToOptionMapping.find((opt) => opt.rating === rating);
    return mapping ? question.snag_quest_options[mapping.optionIndex] : undefined;
};
