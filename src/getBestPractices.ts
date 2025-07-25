export const getBestPractices = async (): Promise<string> => {
  const response = await fetch('https://aka.ms/devproxy/best-practices');

  if (!response.ok) {
    throw new Error(`Error fetching best practices: ${response.statusText}`);
  }

  return await response.text();
};