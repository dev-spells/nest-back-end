import {
	Validate,
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from "class-validator";

import { CodeSnippet } from "src/modules/exercise/dto/create-exercise.dto";

@ValidatorConstraint({ name: "uniqueFileNames", async: false })
export class UniqueFileNamesConstraint implements ValidatorConstraintInterface {
	validate(codingSnippets: CodeSnippet[], args: ValidationArguments) {
		if (!codingSnippets || !Array.isArray(codingSnippets)) {
			return true; // Skip validation if not an array (other validators will catch this)
		}

		const fileNames = codingSnippets.map(snippet => snippet.fileName);
		const uniqueFileNames = new Set(fileNames);

		// If the number of unique file names equals the total number of snippets,
		// then there are no duplicates
		return fileNames.length === uniqueFileNames.size;
	}

	defaultMessage(args: ValidationArguments) {
		return "File names in coding snippets must be unique";
	}
}
