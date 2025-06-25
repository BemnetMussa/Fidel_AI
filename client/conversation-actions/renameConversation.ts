// renameConversationTitle.ts (or keep name if you prefer)
import { baseURL } from "@/lib/auth-client";
import axios from "axios";

export const renameConversationTitle = async (
  id: number,
  newTitle: string
): Promise<void> => {
  console.log("rename conversation title is called");
  console.log("newtitle", newTitle);
  console.log("id", id);
  try {
    const response = await axios.put(
      `${baseURL}/api/conversation/${id}`,
      { title: newTitle },
      { withCredentials: true }
    );

    if (!response) {
      console.log("error when updating chat message");
    }
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};
