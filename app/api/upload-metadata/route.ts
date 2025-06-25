import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const metadata = await req.json();
  console.log(metadata);

  try {
    console.log("enter here");
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      JSON.stringify(metadata),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
      }
    );
    console.log("enter here");

    console.log(response.data);

    if (!response) {
      return NextResponse.json({ success: false });
    }

    return NextResponse.json({
      success: true,
      data: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
    });
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    return NextResponse.json(
      {
        success: false,
        msg: "failed to upload json to ipfs",
      },
      { status: 409 }
    );
  }
}
