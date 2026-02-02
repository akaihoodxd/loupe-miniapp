/**
 * Safely copy text to clipboard with fallback for restricted environments
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // Try modern Clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    // Clipboard API blocked or failed, try fallback
  }

  // Fallback: use temporary textarea
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-999999px";
    textarea.style.top = "-999999px";
    document.body.appendChild(textarea);
    
    textarea.focus();
    textarea.select();
    
    const successful = document.execCommand("copy");
    document.body.removeChild(textarea);
    
    return successful;
  } catch (err) {
    console.error("Failed to copy text:", err);
    return false;
  }
}
