declare global {
  interface String {
    /**
     * Extension function to convert string to title case.
     *
     * @example
     * const name = 'john doe';
     * console.log(name.toTitleCase()); // John Doe
     *
     * @returns { string } Title case.
     */
    toTitleCase(): string;

    /**
     * Extension function to capitalize first word of string.
     *
     * @example
     * const name = 'john doe';
     * console.log(name.capitalizeFirstWord()); // John doe
     *
     * @returns { string } Capitalized first word.
     */
    capitalizeFirstWord(): string;
  }
}

export {};
