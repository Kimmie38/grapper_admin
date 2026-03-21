import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";

export async function GET(req) {
  // Support both cookie-based sessions (web) and Bearer JWTs (mobile)
  const session = await getSession(req);
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = parseInt(session.user.id);

  try {
    // Get all conversations for the user, including the other participant's info and the last message
    const conversations = await sql`
      SELECT 
        c.id, 
        c.updated_at,
        u.name as other_user_name,
        u.image as other_user_avatar,
        u.id as other_user_id,
        m.content as last_message_content,
        m.created_at as last_message_time,
        (SELECT COUNT(*) FROM messages m2 
         WHERE m2.conversation_id = c.id 
         AND m2.created_at > cp.last_read_at) as unread_count
      FROM conversations c
      JOIN conversation_participants cp ON c.id = cp.conversation_id
      JOIN conversation_participants cp2 ON c.id = cp2.conversation_id AND cp2.user_id != ${userId}
      JOIN auth_users u ON cp2.user_id = u.id
      LEFT JOIN LATERAL (
        SELECT content, created_at
        FROM messages 
        WHERE conversation_id = c.id
        ORDER BY created_at DESC
        LIMIT 1
      ) m ON true
      WHERE cp.user_id = ${userId}
      ORDER BY c.updated_at DESC
    `;

    return Response.json(conversations);
  } catch (error) {
    console.error("Error fetching chats:", error);
    return Response.json({ error: "Failed to fetch chats" }, { status: 500 });
  }
}

export async function POST(req) {
  // Support both cookie-based sessions (web) and Bearer JWTs (mobile)
  const session = await getSession(req);
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = parseInt(session.user.id);
  const { recipientId } = await req.json();
  const targetUserId = parseInt(recipientId);

  if (!targetUserId) {
    return Response.json({ error: "Invalid recipient" }, { status: 400 });
  }

  try {
    // Check if conversation already exists
    // We are looking for a conversation_id that is in the set of conversation_ids for userId AND targetUserId
    const existing = await sql`
      SELECT c.id 
      FROM conversations c
      JOIN conversation_participants cp1 ON c.id = cp1.conversation_id
      JOIN conversation_participants cp2 ON c.id = cp2.conversation_id
      WHERE cp1.user_id = ${userId} AND cp2.user_id = ${targetUserId}
      LIMIT 1
    `;

    if (existing.length > 0) {
      return Response.json({ id: existing[0].id });
    }

    // Create new conversation
    const [newConv] = await sql`
      INSERT INTO conversations (created_at, updated_at) VALUES (NOW(), NOW()) RETURNING id
    `;

    // Add participants
    await sql`
      INSERT INTO conversation_participants (conversation_id, user_id) 
      VALUES (${newConv.id}, ${userId}), (${newConv.id}, ${targetUserId})
    `;

    return Response.json({ id: newConv.id });
  } catch (error) {
    console.error("Error creating chat:", error);
    return Response.json({ error: "Failed to create chat" }, { status: 500 });
  }
}
