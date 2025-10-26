
// Global array to store selected files (File objects)
let selectedFiles = [];
// Get DOM elements
const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('file-input');
const fileSelectBtn = document.getElementById('file-select-btn');
const fileListContainer = document.getElementById('file-list');
const convertBtn = document.getElementById('convert-btn');
const clearBtn = document.getElementById('clear-btn');
const statusMessage = document.getElementById('status-message');
const MAX_FILES = 10;
const API_ENDPOINT = 'api/convert.php'; // Change this to your actual
backend endpoint (e.g., /api/convert)
// --- Helper Functions ---
function isFileSupported(file) {
const supportedExtensions = [
'.png', '.jpg', '.jpeg', '.doc', '.docx'
];
const fileName = file.name.toLowerCase();
return supportedExtensions.some(ext => fileName.endsWith(ext));
} f
unction updateButtonsState() {
const hasFiles = selectedFiles.length > 0;
convertBtn.disabled = !hasFiles;
clearBtn.disabled = !hasFiles;
convertBtn.textContent = hasFiles ? `Convert
${selectedFiles.length} File(s)` : 'Start Conversion';
} f
unction displayStatus(message, type = 'info') {
statusMessage.textContent = message;
statusMessage.className = `status-message ${type}`;
statusMessage.style.display = 'block';
} f
unction getFileIconClass(fileName) {
const ext = fileName.split('.').pop().toLowerCase();
if (['png', 'jpg', 'jpeg'].includes(ext)) return 'fas fa-image';if (['doc', 'docx'].includes(ext)) return 'fas fa-file-word';
return 'fas fa-file';
} /
/ --- Main Logic Functions ---
function handleFiles(files) {
const filesArray = Array.from(files);
let filesToAdd = 0;
filesArray.forEach(file => {
if (selectedFiles.length >= MAX_FILES) {
return; // Stop adding if max limit reached
}i
f (isFileSupported(file)) {
// Simple check to prevent immediate duplicates
const isDuplicate = selectedFiles.some(f => f.name ===
file.name && f.size === file.size);
if (!isDuplicate) {
selectedFiles.push(file);
filesToAdd++;
}
}
});
if (filesToAdd > 0) {
renderFileList();
} i
f (selectedFiles.length >= MAX_FILES) {
displayStatus(`You have reached the maximum limit of
${MAX_FILES} files.`, 'error');
} else {
statusMessage.style.display = 'none';
}
} f
unction renderFileList() {
fileListContainer.innerHTML = '';
if (selectedFiles.length === 0) {
fileListContainer.style.border = 'none';
} else {
fileListContainer.style.border = '1px solid
var(--border-color)';
} s
electedFiles.forEach((file, index) => {const fileItem = document.createElement('div');
fileItem.className = 'file-item';
const iconClass = getFileIconClass(file.name);
fileItem.innerHTML = `
<i class="${iconClass}"></i>
<span class="file-name">${file.name}</span>
<span class="file-remove" data-index="${index}"><i
class="fas fa-times"></i></span>
`;
fileListContainer.appendChild(fileItem);
});
updateButtonsState();
} f
unction clearAllFiles() {
selectedFiles = [];
renderFileList();
displayStatus('All files cleared.', 'info');
} 

/
/ --- Event Listeners ---
// 1. File Input Trigger
fileSelectBtn.addEventListener('click', () => fileInput.click());
// 2. File Input Change
fileInput.addEventListener('change', (e) => {
handleFiles(e.target.files);
e.target.value = ''; // Reset input
});
// 3. Drag and Drop Handling
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
dropArea.addEventListener(eventName, preventDefaults, false);
});
['dragenter', 'dragover'].forEach(eventName => {
dropArea.addEventListener(eventName, () =>
dropArea.classList.add('highlight'), false);
});
['dragleave', 'drop'].forEach(eventName => {
dropArea.addEventListener(eventName, () =>
dropArea.classList.remove('highlight'), false);
});dropArea.addEventListener('drop', (e) => {
handleFiles(e.dataTransfer.files);
}, false);
function preventDefaults(e) {
e.preventDefault();
e.stopPropagation();
} /
/ 4. Remove File Button
fileListContainer.addEventListener('click', (e) => {
if (e.target.closest('.file-remove')) {
const index =
parseInt(e.target.closest('.file-remove').getAttribute('data-index'));
selectedFiles.splice(index, 1);
renderFileList();
displayStatus('File removed.', 'info');
}
});
// 5. Clear All Button
clearBtn.addEventListener('click', clearAllFiles);
// 6. Convert Button
convertBtn.addEventListener('click', async () => {
if (selectedFiles.length === 0) return;
displayStatus('Processing files... Please wait.', 'info');
convertBtn.disabled = true;
convertBtn.textContent = 'Converting...';
const formData = new FormData();
selectedFiles.forEach(file => {
formData.append('files[]', file); // Use 'files[]' for
multi-file upload
});
try {
// --- Core Fetch API for Backend Communication ---
const response = await fetch(API_ENDPOINT, {
method: 'POST',
body: formData,
// Headers like 'Content-Type' are automatically set by
the browser
// when using FormData, so we omit them.
});
const result = await response.json(); // Assuming the backendreturns JSON
if (response.ok && result.success) {
displayStatus(`Success! Converted ${result.fileCount}
files. Starting download...`, 'success');
// --- Simulate Download or provide a link ---
// In a real app, you would redirect to a download link
provided by the backend (result.downloadUrl)
console.log("Download link (simulated):",
result.downloadUrl);
// Clear files after successful conversion
setTimeout(() => {
clearAllFiles();
displayStatus('Conversion complete. Ready for new
files.', 'info');
}, 3000);
} else {
// Handle server-side errors (e.g., file conversion
failed)
const errorMessage = result.message || `Conversion failed:
Server status ${response.status}.`;
displayStatus(errorMessage, 'error');
}
} catch (error) {
// Handle network or other errors (e.g., API_ENDPOINT not
found)
console.error('Conversion Error:', error);
displayStatus(`An unexpected error occurred. Please check the
backend setup.`, 'error');
} finally {
// Reset button state
updateButtonsState();
}
});
// Initial state setup
renderFileList();
