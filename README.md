# Document Summarizer App

This app allows users to upload a document and get a summarized version using ChatGPT. The app provides a simple and intuitive interface for users to easily obtain summaries of their documents.

## User Journey

1. **Access the App**

   - The user navigates to the app's URL.
   - If not signed in, the user is prompted to sign in with ZAPT.

2. **Sign In with ZAPT**

   - The user clicks on the "Sign in with ZAPT" option.
   - The user is redirected to the authentication page.
   - The user can sign in using email, Google, Facebook, or Apple.
   - Upon successful authentication, the user is redirected back to the app.

3. **Upload a Document**

   - The user is presented with the main interface.
   - The user clicks on the "Choose File" button to select a document.
   - The user selects a text document (e.g., .txt, .md) from their device.
   - The selected file name is displayed next to the upload button.

4. **Summarize the Document**

   - The user clicks on the "Summarize Document" button.
   - The app displays a loading indicator while processing.
   - The app sends the document content to ChatGPT for summarization.
   - Upon completion, the summarized text is displayed on the screen.

5. **View the Summary**

   - The summarized text appears in a readable format.
   - The user can scroll through the summary.
   - The user can choose to upload another document or sign out.

6. **Sign Out**

   - The user clicks on the "Sign Out" button.
   - The user is signed out and redirected to the sign-in page.

## Features

- **User Authentication**: Secure sign-in with email or social providers (Google, Facebook, Apple).
- **Document Upload**: Allows users to upload documents from their device.
- **ChatGPT Integration**: Utilizes ChatGPT to generate summaries of uploaded documents.
- **Responsive Design**: User-friendly interface that adapts to different screen sizes.
- **Loading Indicators**: Provides visual feedback during processing.
- **Error Handling**: Displays error messages if issues occur during upload or summarization.

## Supported File Types

- Plain text files (`.txt`)
- Markdown files (`.md`)

*Note: Currently, only plain text and markdown files are supported. Other file types may not work as expected.*