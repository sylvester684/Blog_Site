"use server";

import { imageDeleteSchema } from "@/lib/validation/image";
import { Database } from "@/types/supabase";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import * as z from "zod";

export async function DeleteCoverImage(
  context: z.infer<typeof imageDeleteSchema>,
) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  try {
    const { userId, postId, fileName } = imageDeleteSchema.parse(context);
    const bucketName =
      process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_COVER_IMAGE ||
      "cover-image";

    const { data, error } = await supabase.storage
      .from(bucketName)
      .remove([`${userId}/${postId}/${fileName}`]);

    if (error) {
      console.log(error);
    }
    if (data?.length && data?.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error);
      return false;
    }
    return false;
  }
}
