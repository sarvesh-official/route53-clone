/**
 * Strip the trailing dot from a DNS FQDN for display purposes.
 * DNS stores names as fully-qualified (e.g. "example.com.") but
 * the UI should show them without the trailing dot (e.g. "example.com").
 */
export function displayDomain(name: string): string {
  return name.replace(/\.+$/, "");
}
