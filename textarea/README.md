# React textareas

This small React app was motivated by a need develop a frontend to an ancient
system that wants its textual input to be split to lines of  certain maximum 
length. User gets some pre-determined text that can be edited. The text will
be printed in the end, so the textarea should emulate "paper" to some extent.

This Textarea component helps user in maintaining the proper line lengths
as the text is being edited.

The requirements were as follows:
* User can freely edit text
* The text word-wraps when line length exceeds a preset length
* The text de-word-wraps if lines decrease in length enough to fit the next word
* The user needs to be able to add empty paragraphs to help avoiding orphan lines
* Textarea should expand (add rows) and shrink (decrease rows) as needed

The application contains three textarea fields, each with the same input to start with:
* The topmost uses the word-wrapping function on each keystroke (onChange)
* The middle one uses word-wrapping function when user exits textarea (onBlur)
* The lowest one is plain textarea, with no word-wrapping (or manual word-wrapping)

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.
