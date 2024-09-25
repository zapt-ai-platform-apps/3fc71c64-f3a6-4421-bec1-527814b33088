import { createSignal, onMount, createEffect, Show } from 'solid-js';
import { supabase, createEvent } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-solid';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import * as mammoth from 'mammoth';

function App() {
  const [user, setUser] = createSignal(null);
  const [currentPage, setCurrentPage] = createSignal('login');
  const [selectedFile, setSelectedFile] = createSignal(null);
  const [summary, setSummary] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [errorMessage, setErrorMessage] = createSignal('');

  const checkUserSignedIn = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      setCurrentPage('homePage');
    }
  };

  onMount(checkUserSignedIn);

  createEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user);
        setCurrentPage('homePage');
      } else {
        setUser(null);
        setCurrentPage('login');
      }
    });

    return () => {
      authListener.unsubscribe();
    };
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage('login');
  };

  const handleFileChange = (e) => {
    setErrorMessage('');
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleSummarize = async () => {
    if (!selectedFile()) {
      setErrorMessage('Please select a file to upload.');
      return;
    }

    setLoading(true);
    setSummary('');
    setErrorMessage('');

    try {
      const file = selectedFile();
      const fileExtension = file.name.split('.').pop().toLowerCase();

      if (fileExtension === 'txt' || fileExtension === 'md') {
        const reader = new FileReader();
        reader.onload = async () => {
          const content = reader.result;
          await processContent(content);
        };
        reader.onerror = () => {
          setErrorMessage('Error reading file.');
          setLoading(false);
        };
        reader.readAsText(file);
      } else if (fileExtension === 'docx') {
        const arrayBuffer = await file.arrayBuffer();
        mammoth.extractRawText({ arrayBuffer })
          .then(async (result) => {
            const content = result.value;
            await processContent(content);
          })
          .catch((error) => {
            console.error('Error extracting text from Word document:', error);
            setErrorMessage('Error processing Word document.');
            setLoading(false);
          });
      } else {
        setErrorMessage('Unsupported file type.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error summarizing document:', error);
      setErrorMessage('An error occurred while summarizing the document.');
      setLoading(false);
    }
  };

  const processContent = async (content) => {
    const prompt = `Please provide a concise summary of the following document:\n\n${content}`;

    const result = await createEvent('chatgpt_request', {
      prompt,
      response_type: 'text',
    });

    if (result) {
      setSummary(result);
    } else {
      setErrorMessage('Failed to get summary from the AI.');
    }
    setLoading(false);
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 text-gray-800">
      <Show
        when={currentPage() === 'homePage'}
        fallback={
          <div class="flex items-center justify-center h-full">
            <div class="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
              <h2 class="text-3xl font-bold mb-6 text-center text-purple-600">Sign in with ZAPT</h2>
              <a
                href="https://www.zapt.ai"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-500 hover:underline mb-6 block text-center"
              >
                Learn more about ZAPT
              </a>
              <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={['google', 'facebook', 'apple']}
                magicLink={true}
              />
            </div>
          </div>
        }
      >
        <div class="max-w-3xl mx-auto h-full">
          <div class="flex justify-between items-center mb-8">
            <h1 class="text-4xl font-bold text-purple-600">Document Summarizer</h1>
            <button
              class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 h-full">
            <h2 class="text-2xl font-bold mb-4 text-purple-600">Upload Document</h2>
            <p class="mb-4 text-gray-600">Supported file types: .txt, .md, .docx</p>
            <div class="space-y-4">
              <input
                type="file"
                accept=".txt, .md, .docx"
                onChange={handleFileChange}
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border cursor-pointer"
              />
              <Show when={selectedFile()}>
                <p class="text-gray-700">Selected file: {selectedFile().name}</p>
              </Show>
              <button
                onClick={handleSummarize}
                class={`w-full px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
                  loading() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={loading()}
              >
                <Show when={!loading()} fallback={<span>Summarizing...</span>}>
                  Summarize Document
                </Show>
              </button>
              <Show when={errorMessage()}>
                <p class="text-red-500">{errorMessage()}</p>
              </Show>
            </div>
          </div>

          <Show when={summary()}>
            <div class="mt-8 bg-white p-6 rounded-lg shadow-md">
              <h2 class="text-2xl font-bold mb-4 text-purple-600">Summary</h2>
              <p class="text-gray-700 whitespace-pre-wrap">{summary()}</p>
            </div>
          </Show>
        </div>
      </Show>
    </div>
  );
}

export default App;