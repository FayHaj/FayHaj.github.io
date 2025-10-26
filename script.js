
// Global array to store selected files
let selectedFiles = [];
// Get DOM elements
const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('file-input');
const fileSelectBtn = document.getElementById('file-select-btn');
const fileListContainer = document.getElementById('file-list');
const convertBtn = document.getElementById('convert-btn');
const statusMessage = document.getElementById('status-message');
const formatSelect = document.getElementById('format-select');
// Helper function to check if a file is supported
function isFileSupported(file) {
const supportedExtensions = ['.png', '.jpg', '.jpeg', '.doc',
'.docx'];
const fileName = file.name.toLowerCase();return supportedExtensions.some(ext => fileName.endsWith(ext));
} /
/ Function to handle file additions (from drop or input)
function handleFiles(files) {
// Convert FileList to an array for easier manipulation
const filesArray = Array.from(files);
let newFilesAdded = false;
filesArray.forEach(file => {
if (isFileSupported(file)) {
// Check if the file is not already in the list (by name
and size)
const isDuplicate = selectedFiles.some(
f => f.name === file.name && f.size === file.size
);
if (!isDuplicate) {
selectedFiles.push(file);
newFilesAdded = true;
}
} else {
// Optional: Show an error for unsupported files
console.warn(`File ${file.name} is not supported.`);
}
});
if (newFilesAdded) {
renderFileList();
}
} /
/ Function to display the list of selected files
function renderFileList() {
fileListContainer.innerHTML = ''; // Clear current list
if (selectedFiles.length === 0) {
fileListContainer.style.display = 'none';
convertBtn.disabled = true;
convertBtn.textContent = 'Convert Now';
statusMessage.style.display = 'none';
return;
} f
ileListContainer.style.display = 'block';
convertBtn.disabled = false;
selectedFiles.forEach((file, index) => {const fileItem = document.createElement('div');
fileItem.className = 'file-item';
fileItem.innerHTML = `
<span class="file-name">${file.name}</span>
<span class="file-remove" data-index="${index}">×</span>
`;
fileListContainer.appendChild(fileItem);
});
} /
/ Event Listeners for File Selection
fileSelectBtn.addEventListener('click', () => {
fileInput.click(); // Trigger the hidden file input
});
fileInput.addEventListener('change', (e) => {
handleFiles(e.target.files);
e.target.value = ''; // Clear the input so the same file can be
selected again
});
// Event Listeners for Drag and Drop
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
});
dropArea.addEventListener('drop', (e) => {
const dt = e.dataTransfer;
const files = dt.files;
handleFiles(files);
}, false);
function preventDefaults(e) {
e.preventDefault();
e.stopPropagation();
} /
/ Event Listener for removing a file from the listfileListContainer.addEventListener('click', (e) => {
if (e.target.classList.contains('file-remove')) {
const index = parseInt(e.target.getAttribute('data-index'));
selectedFiles.splice(index, 1); // Remove file from the array
renderFileList(); // Re-render the list
}
});
// Event Listener for the Convert Button
convertBtn.addEventListener('click', () => {
if (selectedFiles.length === 0) return;
const selectedFormat = formatSelect.value;
const filesToConvert = selectedFiles.map(file =>
file.name).join(', ');
// --- IMPORTANT: FRONT-END LIMITATION MESSAGE ---
// This is the place where you would send the files to a
server-side script
// or an external API for the actual conversion.
// Display a placeholder message to the user
statusMessage.textContent = `Conversion simulated! Files:
${filesToConvert}.
Format selected: ${selectedFormat}. You need a server-side
script (e.g., Node.js, Python, PHP)
to perform the actual file conversion to PDF.`;
statusMessage.className = 'status-message success'; // Use success
style for the message
statusMessage.style.display = 'block';
// In a real application, you would handle the server response
here
// and then clear the files or provide a download link.
// Example: Clear files after simulated conversion
// setTimeout(() => {
// selectedFiles = [];
// renderFileList();
// }, 5000);
});
// Initial rendering call
renderFileList();