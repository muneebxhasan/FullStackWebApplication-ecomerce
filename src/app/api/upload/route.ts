// app/api/upload/route.ts
import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabaseClient";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    const sanitizedFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabase.storage
      .from("myBucket")
      .upload(sanitizedFileName, buffer, {
        contentType: file.type,
      });

    if (error) {
      console.error("Error uploading to Supabase:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { publicUrl } = supabase.storage
      .from("your_bucket_name")
      .getPublicUrl(sanitizedFileName);

    return NextResponse.json({ url: publicUrl }, { status: 200 });
  } catch (err) {
    console.error("Error in file upload API:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
