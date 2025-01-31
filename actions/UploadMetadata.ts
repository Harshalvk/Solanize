"use server"

export async function uploadMetadata(metadata: any): Promise<string> {
  const response = await fetch(
    "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer token`,
      },
      body: JSON.stringify(metadata),
    }
  );

  const result = await response.json();
  return `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
}
