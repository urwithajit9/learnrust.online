/**
 * Generate a URL-friendly slug from a topic string
 */
export function generateSlug(topic: string): string {
  return topic
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Extract the main topic title from curriculum topic string
 * (e.g., "Setup: Install Rust..." -> "setup-install-rust")
 */
export function extractTopicSlug(topic: string): string {
  // Take first part before colon if it exists, or use full topic
  const mainPart = topic.split(':')[0].trim();
  return generateSlug(mainPart);
}
