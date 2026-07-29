import { mkdir, writeFile } from "node:fs/promises";

const accountId = "grand-mountain-5rej5rk";
const apiBase = "https://api.unstoppabledomains.com/api/public/storefront";
const pageSize = 50;

function buildUrl(page) {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    sortBy: "listedAt",
    sortDirection: "DESC"
  });
  return `${apiBase}/${encodeURIComponent(accountId)}?${params}`;
}

async function fetchJson(page) {
  const response = await fetch(buildUrl(page), {
    headers: {
      "accept": "application/json",
      "user-agent": "BraveOwner scraper"
    }
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Storefront API returned ${response.status} on page ${page}: ${body}`);
  }
  return response.json();
}

const firstPage = await fetchJson(1);
const listings = [...(firstPage.listings || [])];
const total = firstPage.total || listings.length;
const totalPages = Math.ceil(total / pageSize);

for (let page = 2; page <= totalPages; page += 1) {
  const data = await fetchJson(page);
  listings.push(...(data.listings || []));
}

const snapshot = {
  accountId,
  source: `${apiBase}/${accountId}`,
  snapshotAt: new Date().toISOString(),
  total,
  listings
};

await mkdir("data", { recursive: true });
await writeFile("data/storefront-snapshot.json", `${JSON.stringify(snapshot, null, 2)}\n`);

console.log(`Saved ${listings.length} listings to data/storefront-snapshot.json`);
